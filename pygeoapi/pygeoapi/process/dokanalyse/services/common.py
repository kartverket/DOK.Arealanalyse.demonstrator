import re
import json
from jsonschema import validate
from osgeo import ogr, osr
from os import path
import math
import json
from .api import fetch_geolett_data, fetch_kartkatalog_metadata
from ..config import CONFIG

EARTH_RADIUS = 6371008.8
DIR_PATH = path.dirname(path.realpath(__file__))


def request_is_valid(data):
    file_path = path.join(
        path.dirname(DIR_PATH), 'resources/no.geonorge.dokanalyse.analysisinput.v0.1.schema.json')

    with open(file_path, 'r') as file:
        schema = json.load(file)

    try:
        validate(instance=data, schema=schema)
        return True
    except Exception as e:
        print(f'An exception occurred: {str(e)}')
        return False


def get_dataset_type(dataset):
    if 'wfs' in CONFIG[dataset]:
        return 'wfs'
    elif 'arcgis' in CONFIG[dataset]:
        return 'arcgis'

    return None


def get_dataset_names_by_theme(theme):
    if theme is None:
        return list(CONFIG.keys())

    dataset_names = []

    for key, value in CONFIG.items():
        if theme in value['themes']:
            dataset_names.append(key)

    return dataset_names


def get_epsg(geo_json):
    crs = geo_json.get('crs', {}).get('properties', {}).get('name')

    if crs is None:
        return None

    regex = r'^(http:\/\/www\.opengis\.net\/def\/crs\/EPSG\/0\/|^urn:ogc:def:crs:EPSG::|^EPSG:)(?P<epsg>\d+)$'
    matches = re.search(regex, crs)

    if matches:
        return int(matches.group('epsg'))

    return None


def transform_geometry(geom, src_epsg, dest_epsg):
    source = osr.SpatialReference()
    source.ImportFromEPSG(src_epsg)
    source.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)

    target = osr.SpatialReference()
    target.ImportFromEPSG(dest_epsg)

    transform = osr.CoordinateTransformation(source, target)
    geom.Transform(transform)


def length_to_degrees(distance):
    radians = distance / EARTH_RADIUS
    degrees = radians % (2 * math.pi)

    return degrees * 180 / math.pi


def get_buffered_geometry(geom, distance, epsg):
    computed_buffer = length_to_degrees(
        distance) if epsg is None or epsg == 4326 else distance

    return geom.Buffer(computed_buffer, 10)


def get_cartography_url(wms_url, layer):
    return f'{wms_url}service=WMS&version=1.3.0&request=GetLegendGraphic&sld_version=1.1.0&layer={layer}&format=image/png&STYLE=default'


def add_geojson_crs(geojson, epsg):
    if epsg is None or epsg == 4326:
        return

    geojson['crs'] = {
        'type': 'name',
        'properties': {
            'name': 'urn:ogc:def:crs:EPSG::' + str(epsg)
        }
    }


def set_geometry_areas(data_output):
    data_output['inputGeometryArea'] = round(
        data_output['runOnInputGeometry'].GetArea(), 2)

    if len(data_output.get('geometries', [])) == 0:
        return

    geom_collection = ogr.Geometry(ogr.wkbGeometryCollection)

    for geometry in data_output['geometries']:
        geom_collection.AddGeometry(geometry)

    intersection = data_output['runOnInputGeometry'].Intersection(
        geom_collection)

    if intersection is not None:
        data_output['hitArea'] = round(intersection.GetArea(), 2)


async def get_geolett_data(id):
    geolett = await fetch_geolett_data()
    result = list(filter(lambda item: item['id'] == id, geolett))

    return result[0] if len(result) > 0 else None


async def get_kartkatalog_metadata(id):
    metadata = await fetch_kartkatalog_metadata(id)

    if metadata is None:
        return None

    updated = metadata.get('DateUpdated', metadata.get('DateMetadataUpdated', None))

    return {
        'datasetId': id,
        'title': metadata['NorwegianTitle'],
        'description': metadata['Abstract'],
        'datasetDescriptionUri': 'https://kartkatalog.geonorge.no/metadata/' + id,
        'updated': updated
    }


def set_guidance_data(geolett, result):
    if result['resultStatus'] != 'NO-HIT-GREEN':
        result['description'] = geolett['forklarendeTekst']
        result['guidanceText'] = geolett['dialogtekst']

    result['guidanceUri'] = []
    result['possibleActions'] = []

    for link in geolett['lenker']:
        result['guidanceUri'].append({
            'href': link['href'],
            'title': link['tittel']
        })

    for line in geolett['muligeTiltak'].splitlines():
        result['possibleActions'].append(line.lstrip('- '))


def set_quality_measurement(result):
    result['qualityMeasurement'] = [
        {
            'qualityDimension': 'fullstendighet_dekningskart',
            'value': 'Ja',
            'comment': 'Området har dekning'
        },
        {
            'qualityDimension': 'egnethet_reguleringsplan',
            'value': '5',
            'comment': 'Svært godt egnet'
        },
        {
            'qualityDimension': 'egnethet_byggesak',
            'value': '5',
            'comment': 'Svært godt egnet'
        },
        {
            'qualityDimension': 'egnethet_ros_reguleringsplan',
            'value': '4',
            'comment': 'Godt egnet'
        }
    ]
