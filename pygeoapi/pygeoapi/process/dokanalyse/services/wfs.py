from os import path
from sys import maxsize
from osgeo import ogr
import xml.etree.ElementTree as ET
from .common import get_geolett_data, get_buffered_geometry, get_cartography_url
from .api import query_wfs
from ..config import CONFIG

DIR_PATH = path.dirname(path.realpath(__file__))


def get_input_geometry(geom, epsg, buffer, data_output):
    if buffer > 0:
        buffered_geom = get_buffered_geometry(geom, buffer, epsg)
        data_output['runAlgorithm'].append('add buffer')
        data_output['runOnInputGeometry'] = buffered_geom

        return buffered_geom.ExportToGML(['FORMAT=GML3'])

    data_output['runOnInputGeometry'] = geom

    return geom.ExportToGML(['FORMAT=GML3'])


async def run_queries(dataset, gml, epsg, data_output):
    first_layer = CONFIG[dataset]['layers'][0]
    geom_element_name = CONFIG[dataset]['geom_element_name']
    geolett_data = await get_geolett_data(first_layer['geolett_id'])

    for layer in CONFIG[dataset]['layers']:
        layer_name = layer['wfs']
        request_xml = create_request_xml(
            layer_name, epsg, geom_element_name, gml)
        
        wfs_response = await query_wfs(dataset, request_xml)

        data_output['runAlgorithm'].append(f'intersect {layer_name}')

        if wfs_response is not None:
            response = parse_response(dataset, wfs_response, layer)

            if len(response['properties']) > 0:
                geolett_data = await get_geolett_data(layer['geolett_id'])
                data_output['data'] = response['properties']
                data_output['geometries'] = response['geometries']
                data_output['rasterResult'] = f'{CONFIG[dataset]["wms"]}&layers={layer["wms"]}'
                data_output['cartography'] = get_cartography_url(
                    CONFIG[dataset]['wms'], layer['wms'])
                data_output['resultStatus'] = layer['result_status']
                break

    data_output['geolett'] = geolett_data


async def get_shortest_distance(dataset, geom, epsg, data_output):
    buffered_geom = get_buffered_geometry(geom, 20000, epsg)
    gml = buffered_geom.ExportToGML(['FORMAT=GML3'])
    layer = CONFIG[dataset]['layers'][0]
    request_xml = create_request_xml(
        layer['wfs'], epsg, CONFIG[dataset]['geom_element_name'], gml)
    
    response = await query_wfs(dataset, request_xml)

    if response is None:
        return maxsize

    ns = get_namespaces(dataset)
    root = ET.fromstring(response)
    members = root.findall('.//wfs:member/*', namespaces=ns)
    distances = []

    for member in members:
        geom_el = member.find(
            f'./{CONFIG[dataset]["geom_element_name"]}/*', namespaces=ns)
        gml_str = ET.tostring(geom_el, encoding='unicode')
        feature_geom = ogr.CreateGeometryFromGML(gml_str)
        distance = round(geom.Distance(feature_geom))
        distances.append(distance)

    distances.sort()
    data_output['runAlgorithm'].append('get distance')

    if len(distances) == 0:
        return maxsize

    return distances[0]


def parse_response(dataset, wfs_response, layer):
    data = {
        'properties': [],
        'geometries': []
    }

    ns = get_namespaces(dataset)
    root = ET.fromstring(wfs_response)
    members = root.findall('.//wfs:member/*', namespaces=ns)

    for member in members:
        if filter_member(member, layer, ns):
            data['properties'].append(map_properties(
                member, CONFIG[dataset]['properties'], ns))
            data['geometries'].append(
                get_geometry_from_response(member, CONFIG[dataset], ns))

    return data


def filter_member(member, layer, ns):
    if 'type_filter' not in layer:
        return True

    attr_element = member.find(
        './/' + layer['type_filter']['attribute'], namespaces=ns)

    if attr_element is None:
        return False

    return attr_element.text == layer['type_filter']['value']


def map_properties(member, mappings, ns):
    properties = {}

    for mapping in mappings:
        element = member.find('.//' + mapping, namespaces=ns)

        if element is not None:
            prop_name = mapping.split(':')[-1]
            properties[prop_name] = element.text

    return properties


def get_geometry_from_response(member, dataset, ns):
    selector = './' + dataset['geom_element_name'] + '/*'
    geom_el = member.find(selector, namespaces=ns)
    gml_str = ET.tostring(geom_el, encoding='unicode')

    try:
        return ogr.CreateGeometryFromGML(gml_str)
    except:
        return None


def create_request_xml(layer_name, epsg, geom_field, gml):
    file_path = path.join(path.dirname(DIR_PATH), 'resources/wfs_request.xml.txt')

    with open(file_path, 'r') as file:
        file_text = file.read()

    return file_text.format(layerName=layer_name, epsg=epsg, geomField=geom_field, geometry=gml).encode('utf-8')


def get_namespaces(dataset):
    return {'wfs': 'http://www.opengis.net/wfs/2.0', 'app': CONFIG[dataset]['namespace']}
