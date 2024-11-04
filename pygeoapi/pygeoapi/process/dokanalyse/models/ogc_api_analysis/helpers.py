from pydash import get
from osgeo import ogr
import json


def parse_response(config, ogc_api_response, layer):
    data = {
        'properties': [],
        'geometries': []
    }

    for feature in ogc_api_response['features']:
        data['properties'].append(map_properties(
            feature, config['properties']))
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
