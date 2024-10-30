from sys import maxsize
from pydash import get
from osgeo import ogr
from shapely import wkt
from shapely.wkt import dumps
import json
from .api import query_ogc_api
from .common import get_geolett_data, get_buffered_geometry, get_raster_result, get_cartography_url
from ..config import CONFIG


def get_input_geometry(geom, epsg, buffer, data_output):
    if buffer > 0:
        buffered_geom = get_buffered_geometry(geom, buffer, epsg)
        data_output['runAlgorithm'].append('add buffer')
        data_output['runOnInputGeometry'] = buffered_geom

        return get_wkt_geometry(buffered_geom, epsg)
    else:
        data_output['runOnInputGeometry'] = geom

        return get_wkt_geometry(geom, epsg)


async def run_queries(dataset, wkt_geom, epsg, data_output):
    first_layer = CONFIG[dataset]['layers'][0]
    geolett_data = await get_geolett_data(first_layer.get('geolett_id', None))

    for layer in CONFIG[dataset]['layers']:
        layer_id = layer['ogc_api']
        ogc_api_response = await query_ogc_api(dataset, layer_id, wkt_geom, epsg)
        data_output['runAlgorithm'].append(f'intersect layer {layer_id}')

        if ogc_api_response is not None:
            response = parse_response(dataset, ogc_api_response, layer)

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
    wkt_geom = get_wkt_geometry(buffered_geom, epsg)
    layer_id = CONFIG[dataset]['layers'][0]['ogc_api']

    response = await query_ogc_api(dataset, layer_id, wkt_geom, epsg)

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


def parse_response(dataset, ogc_api_response, layer):
    data = {
        'properties': [],
        'geometries': []
    }

    for feature in ogc_api_response['features']:
        data['properties'].append(map_properties(
            feature, CONFIG[dataset]['properties']))
        data['geometries'].append(get_geometry_from_response(feature))

    return data


def map_properties(feature, mappings):
    properties = {}

    for mapping in mappings:
        key = mapping.split('.')[-1]
        value = get(feature['properties'], mapping, None)
        properties[key] = value

    return properties


def get_geometry_from_response(feature):
    try:
        geojson = json.dumps(feature['geometry'])
        return ogr.CreateGeometryFromJson(geojson)
    except:
        return None


def get_wkt_geometry(geom, epsg):
    wkt_str = geom.ExportToWkt()
    geometry = wkt.loads(wkt_str)
    coord_precision = 6 if epsg == 4326 else 2

    return dumps(geometry, trim=True, rounding_precision=coord_precision)
