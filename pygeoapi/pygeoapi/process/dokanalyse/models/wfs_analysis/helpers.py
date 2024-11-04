from os import path
import xml.etree.ElementTree as ET
from osgeo import ogr

DIR_PATH = path.dirname(path.realpath(__file__))


def create_request_xml(layer_name, epsg, geom_field, gml):
    file_path = path.join(DIR_PATH, 'wfs_request.xml.txt')

    with open(file_path, 'r') as file:
        file_text = file.read()

    return file_text.format(layerName=layer_name, epsg=epsg, geomField=geom_field, geometry=gml).encode('utf-8')


def parse_response(config, wfs_response, layer):
    data = {
        'properties': [],
        'geometries': []
    }

    ns = get_namespaces(config)
    root = ET.fromstring(wfs_response)
    members = root.findall('.//wfs:member/*', namespaces=ns)

    for member in members:
        if filter_member(member, layer, ns):
            data['properties'].append(map_properties(
                member, config['properties'], ns))
            data['geometries'].append(
                get_geometry_from_response(member, config, ns))

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


def get_namespaces(config):
    return {'wfs': 'http://www.opengis.net/wfs/2.0', 'app': config['namespace']}
