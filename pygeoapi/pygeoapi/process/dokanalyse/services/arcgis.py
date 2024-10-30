from sys import maxsize
from osgeo import ogr
import json
from .api import query_arcgis
from .common import get_geolett_data, get_buffered_geometry, get_raster_result, get_cartography_url, camel_case
from ..config import CONFIG


def get_input_geometry(geom, epsg, buffer, data_output):
    if buffer > 0:
        buffered_geom = get_buffered_geometry(geom, buffer, epsg)
        data_output['runAlgorithm'].append('add buffer')
        data_output['runOnInputGeometry'] = buffered_geom

        return geojson_to_arcgis_geom(buffered_geom, epsg)
    else:
        data_output['runOnInputGeometry'] = geom

        return geojson_to_arcgis_geom(geom, epsg)


async def run_queries(dataset, arcgis_geom, epsg, data_output):
    first_layer = CONFIG[dataset]['layers'][0]
    geolett_data = await get_geolett_data(first_layer.get('geolett_id', None))

    for layer in CONFIG[dataset]['layers']:
        layer_id = layer['arcgis']
        type_filter = layer.get('type_filter', None)

        if type_filter is not None:
            data_output['runAlgorithm'].append(f'query {type_filter}')

        arcgis_response = await query_arcgis(dataset, layer_id, type_filter, arcgis_geom, epsg)
        data_output['runAlgorithm'].append(f'intersect layer {layer_id}')

        if arcgis_response is not None:
            response = parse_response(dataset, arcgis_response, layer)

            if len(response['properties']) > 0:
                geolett_data = await get_geolett_data(layer.get('geolett_id', None))
                data_output['data'] = response['properties']
                data_output['geometries'] = response['geometries']
                data_output['rasterResult'] = get_raster_result(
                    CONFIG[dataset]['wms'], layer['wms'])
                data_output['cartography'] = await get_cartography_url(
                    CONFIG[dataset]['wms'], layer['wms'])
                data_output['resultStatus'] = layer['result_status']
                break

    data_output['geolett'] = geolett_data


async def get_shortest_distance(dataset, geom, epsg, data_output):
    buffered_geom = get_buffered_geometry(geom, 20000, epsg)
    arcgis_geom = geojson_to_arcgis_geom(buffered_geom, epsg)
    layer_id = CONFIG[dataset]['layers'][0]['arcgis']
    type_filter = CONFIG[dataset]['layers'][0].get('type_filter', None)

    response = await query_arcgis(dataset, layer_id, type_filter, arcgis_geom, epsg)

    if response is None:
        return maxsize

    distances = []

    for feature in response['features']:
        feature_geom = get_geometry_from_response(feature)

        if feature_geom is not None:
            distance = round(geom.Distance(feature_geom))
            distances.append(distance)

    distances.sort()
    data_output['runAlgorithm'].append('get distance')

    if len(distances) == 0:
        return maxsize

    return distances[0]


def parse_response(dataset, arcgis_response, layer):
    data = {
        'properties': [],
        'geometries': []
    }

    for feature in arcgis_response['features']:
        data['properties'].append(map_properties(
            feature, CONFIG[dataset]['properties']))
        data['geometries'].append(get_geometry_from_response(feature))

    return data


def map_properties(feature, mappings):
    properties = {}

    for mapping in mappings:
        properties[camel_case(mapping)] = feature['properties'].get(
            mapping, None)

    return properties


def get_geometry_from_response(feature):
    try:
        geojson = json.dumps(feature['geometry'])
        return ogr.CreateGeometryFromJson(geojson)
    except:
        return None


def geojson_to_arcgis_geom(geom, epsg):
    if geom.GetGeometryType() == ogr.wkbMultiPolygon:
        out_geom = ogr.ForceToPolygon(geom)
    else:
        out_geom = geom

    coord_precision = 6 if epsg == 4326 else 2
    geojson = out_geom.ExportToJson(
        [f'COORDINATE_PRECISION={coord_precision}'])
    obj = json.loads(geojson)

    arcgis_geom = {
        'rings': obj['coordinates'],
        'spatialReference': {
            'wkid': epsg
        }
    }

    return json.dumps(arcgis_geom)
