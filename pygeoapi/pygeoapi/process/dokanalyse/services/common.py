from re import sub, search
import json
from jsonschema import validate
from osgeo import ogr, osr
from os import path
import math
import json
from .api import fetch_geolett_data, fetch_local_geolett_data, fetch_kartkatalog_metadata
from .legend import create_legend
from .kartgrunnlag import get_kartgrunnlag
from ..config import CONFIG

EARTH_RADIUS = 6371008.8
DIR_PATH = path.dirname(path.realpath(__file__))
LOCAL_GEOLETT_IDS = ['0c5dc043-e5b3-4349-8587-9b464d013aaa']


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
    elif 'ogc_api' in CONFIG[dataset]:
        return 'ogc_api'

    return None


async def get_dataset_names(data, geom, epsg):
    kartgrunnlag = await get_kartgrunnlag(geom, epsg)
    datasets = get_datasets_by_theme(data.get('theme'))
    dataset_names = {}

    for dataset in datasets:
        analyze = dataset['id'] is None or dataset['id'] in kartgrunnlag
        dataset_names[dataset['name']] = analyze

    return dataset_names


def get_datasets_by_theme(theme):
    datasets = []

    for key, value in CONFIG.items():
        if theme is None or theme in value['themes']:
            datasets.append({
                'id': value.get('dataset_id'),
                'name': key
            })

    return datasets


def get_epsg(geo_json):
    crs = geo_json.get('crs', {}).get('properties', {}).get('name')

    if crs is None:
        return 4326

    regex = r'^(http:\/\/www\.opengis\.net\/def\/crs\/EPSG\/0\/|^urn:ogc:def:crs:EPSG::|^EPSG:)(?P<epsg>\d+)$'
    matches = search(regex, crs)

    if matches:
        return int(matches.group('epsg'))

    return 4326


def create_input_geometry(geo_json):
    epsg = get_epsg(geo_json)
    geom = ogr.CreateGeometryFromJson(str(geo_json))

    if epsg == 4326:
        transd = transform_geometry(geom, 4326, 25833)
        return transd, 25833

    return geom, epsg


def create_run_on_input_geometry(geom, epsg, orig_epsg):
    geometry = geom

    if epsg != orig_epsg:
        geometry = transform_geometry(geom, epsg, orig_epsg)

    coord_precision = 6 if orig_epsg == 4326 else 2
    geo_json = json.loads(geometry.ExportToJson(
        [f'COORDINATE_PRECISION={coord_precision}']))
    add_geojson_crs(geo_json, epsg)

    return geo_json


def transform_geometry(geom, src_epsg, dest_epsg):
    source = osr.SpatialReference()
    source.ImportFromEPSG(src_epsg)
    source.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)

    target = osr.SpatialReference()
    target.ImportFromEPSG(dest_epsg)

    transform = osr.CoordinateTransformation(source, target)
    clone = geom.Clone()
    clone.Transform(transform)

    return clone


def length_to_degrees(distance):
    radians = distance / EARTH_RADIUS
    degrees = radians % (2 * math.pi)

    return degrees * 180 / math.pi


def get_buffered_geometry(geom, distance, epsg):
    computed_buffer = length_to_degrees(
        distance) if epsg is None or epsg == 4326 else distance

    return geom.Buffer(computed_buffer, 10)


def get_raster_result(wms_url, wms_layers):
    layers = ','.join(wms_layers)

    return f'{wms_url}&layers={layers}'


async def get_cartography_url(wms_url, wms_layers):
    urls = []

    for wms_layer in wms_layers:
        url = f'{wms_url}service=WMS&version=1.3.0&request=GetLegendGraphic&sld_version=1.1.0&layer={wms_layer.strip()}&format=image/png'
        urls.append(url)

    if len(urls) == 1:
        return urls[0]

    data_url = await create_legend(urls)

    return data_url


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

    if intersection is None:
        return

    geom_type = intersection.GetGeometryType()

    if geom_type == ogr.wkbPolygon or geom_type == ogr.wkbMultiPolygon:
        data_output['hitArea'] = round(intersection.GetArea(), 2)


def camel_case(string):
    string = sub(r'(_|-)+', ' ', string).title().replace(' ', '')

    return ''.join([string[0].lower(), string[1:]])


async def get_geolett_data(id):
    if id is None:
        return None

    if id in LOCAL_GEOLETT_IDS:
        geolett = fetch_local_geolett_data()
    else:
        geolett = await fetch_geolett_data()

    result = list(filter(lambda item: item['id'] == id, geolett))

    return result[0] if len(result) > 0 else None


async def get_kartkatalog_metadata(dataset):
    dataset_id = CONFIG[dataset].get('dataset_id')

    if dataset_id is None:
        return None

    metadata = await fetch_kartkatalog_metadata(dataset_id)

    if metadata is None:
        return None

    updated = metadata.get(
        'DateUpdated', metadata.get('DateMetadataUpdated', None))

    return {
        'datasetId': dataset_id,
        'title': metadata['NorwegianTitle'],
        'description': metadata['Abstract'],
        'datasetDescriptionUri': 'https://kartkatalog.geonorge.no/metadata/' + dataset_id,
        'updated': updated
    }


def get_dataset_title(data_output, dataset):
    config = CONFIG[dataset]

    if data_output['geolett'] is not None:
        return data_output['geolett']['tittel']

    return config.get('title', '<Mangler tittel>')


def get_dataset_themes(dataset):
    config = CONFIG[dataset]

    return config.get('themes', [])


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
