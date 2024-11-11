from os import path
from pathlib import Path
import json
from datetime import datetime, timezone
from typing import List
import aiohttp
import xml.etree.ElementTree as ET
from osgeo import ogr
from ...config import get_config, get_dataset_config


_DIR_PATH = path.dirname(path.realpath(__file__))
_CACHE_DAYS = 7


def get_dataset_type(dataset) -> str:
    config = get_dataset_config(dataset)

    if 'wfs' in config:
        return 'wfs'
    elif 'arcgis' in config:
        return 'arcgis'
    elif 'ogc_api' in config:
        return 'ogc_api'

    return None


async def get_dataset_names(data, geometry, epsg):
    municipality_dok_data = data.get('municipalityDokData', True)

    if municipality_dok_data:
        kartgrunnlag = await get_kartgrunnlag(geometry, epsg)
    else:
        kartgrunnlag = []

    datasets = get_datasets_by_theme(data.get('theme'))
    dataset_names = {}

    for dataset in datasets:
        analyze = len(
            kartgrunnlag) == 0 or dataset['id'] is None or dataset['id'] in kartgrunnlag
        dataset_names[dataset['name']] = analyze

    return dataset_names


def get_datasets_by_theme(theme):
    datasets = []

    for key, value in get_config().items():
        if theme is None or theme in value['themes']:
            datasets.append({
                'id': value.get('dataset_id'),
                'name': key
            })

    return datasets


async def get_kartgrunnlag(geometry: ogr.Geometry, epsg: int) -> List[str]:
    # kommunenummer = await get_kommunenummer(geometry, epsg)
    kommunenummer = await get_kommunenummer_from_wfs(geometry, epsg)

    if kommunenummer is None:
        return []

    file_path = Path(path.join(
        Path.home(), 'pygeoapi/dokanalyse/kartgrunnlag', f'{kommunenummer}.json'))

    if not file_path.exists() or should_refresh_cache(file_path):
        file_path.parent.mkdir(parents=True, exist_ok=True)
        dataset_ids = await fetch_dataset_ids(kommunenummer)
        json_object = json.dumps(dataset_ids)

        with file_path.open('w', encoding='utf-8') as file:
            file.write(json_object)

        return dataset_ids
    else:
        with file_path.open(encoding='utf-8') as file:
            dataset_ids = json.load(file)

        return dataset_ids


async def get_kommunenummer_from_wfs(geometry: ogr.Geometry, epsg: int) -> str:
    centroid = geometry.Centroid()
    spatial_ref = geometry.GetSpatialReference()
    centroid.AssignSpatialReference(spatial_ref)
    gml = centroid.ExportToGML(['FORMAT=GML3'])

    request_xml = create_wfs_request_xml(gml, epsg)
    response = await query_wfs(request_xml)

    if response is None:
        return None

    ns = {'wfs': 'http://www.opengis.net/wfs/2.0',
          'app': 'https://skjema.geonorge.no/SOSI/produktspesifikasjon/AdmEnheter/20240101'}

    root = ET.fromstring(response)
    kommunenummer = root.findtext(
        './/wfs:member/app:kommunenummer', namespaces=ns)

    return kommunenummer


async def get_kommunenummer(geometry: ogr.Geometry, epsg: int) -> str:
    centroid = geometry.Centroid()
    point = centroid.GetPoint(0)

    return await fetch_kommunenummer(point[0], point[1], epsg)


async def fetch_dataset_ids(kommunenummer):
    response = await fetch_kartgrunnlag(kommunenummer)

    if response is None:
        return []

    contained_items = response.get('containeditems', [])
    datasets = []

    for dataset in contained_items:
        if dataset.get('ConfirmedDok') == 'JA' and dataset.get('dokStatus') == 'Godkjent':
            metadata_url = dataset.get('MetadataUrl')
            splitted = metadata_url.split('/')
            datasets.append(splitted[-1])

    return datasets


async def fetch_kartgrunnlag(kommunenummer):
    try:
        url = f'https://register.geonorge.no/api/det-offentlige-kartgrunnlaget-kommunalt.json?municipality={kommunenummer}'

        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status != 200:
                    return None

                return await response.json()
    except:
        return None


async def fetch_kommunenummer(x, y, epsg) -> str:
    try:
        url = f'https://api.kartverket.no/kommuneinfo/v1/punkt?nord={y}&ost={x}&koordsys={epsg}&filtrer=kommunenummer'

        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status != 200:
                    return None

                json = await response.json()

                return json.get('kommunenummer', None)
    except:
        return None


async def query_wfs(xml):
    try:
        url = 'https://wfs.geonorge.no/skwms1/wfs.administrative_enheter?service=WFS&version=2.0.0'
        headers = {'Content-Type': 'application/xml'}

        async with aiohttp.ClientSession() as session:
            async with session.post(url, data=xml, headers=headers) as response:
                if response.status != 200:
                    return None

                return await response.text()
    except:
        return None


def create_wfs_request_xml(geometry, epsg):
    file_path = path.join(_DIR_PATH, 'wfs_request.xml.txt')

    with open(file_path, 'r') as file:
        file_text = file.read()

    return file_text.format(geometry=geometry, epsg=epsg).encode('utf-8')


def should_refresh_cache(file_path):
    timestamp = file_path.stat().st_mtime
    modified = datetime.fromtimestamp(timestamp, tz=timezone.utc)
    diff = datetime.now(tz=timezone.utc) - modified

    return diff.days > _CACHE_DAYS
