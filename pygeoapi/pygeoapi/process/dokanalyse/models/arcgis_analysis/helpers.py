from osgeo import ogr
import json
from ...helpers import camel_case

def parse_response(config, arcgis_response, layer):
    data = {
        'properties': [],
        'geometries': []
    }

    for feature in arcgis_response['features']:
        data['properties'].append(
            map_properties(feature, config['properties']))
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
