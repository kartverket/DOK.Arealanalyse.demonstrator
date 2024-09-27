from os import path
import json
import aiohttp
from async_lru import alru_cache
from ..config import CONFIG

DIR_PATH = path.dirname(path.realpath(__file__))


async def query_wfs(dataset, xml):
    try:
        url = CONFIG[dataset]['wfs']
        headers = {'Content-Type': 'application/xml'}

        async with aiohttp.ClientSession() as session:
            async with session.post(url, data=xml, headers=headers) as response:
                if response.status != 200:
                    return None

                return await response.text()
    except:
        return None


async def query_arcgis(dataset, layer_id, type_filter, geometry, epsg):
    try:
        url = f'{CONFIG[dataset]["arcgis"]}/{layer_id}/query'

        data = {
            'geometry': geometry,
            'geometryType': 'esriGeometryPolygon',
            'spatialRel': 'esriSpatialRelIntersects',
            'where': type_filter if type_filter is not None else '1=1',
            'inSR': epsg,
            'outSR': epsg,
            'units': 'esriSRUnit_Meter',
            'outFields': '*',
            'returnGeometry': True,
            'f': 'geojson'
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(url, data=data) as response:
                if response.status != 200:
                    return None

                json = await response.json()

                if 'error' in json:
                    return None

                return json
    except:
        return None


async def query_ogc_api(dataset, layer_id, wkt_geom, epsg):
    try:
        base_url = CONFIG[dataset]['ogc_api']
        geom_element_name = CONFIG[dataset]['geom_element_name']
        filter_crs = f'&filter-crs=http://www.opengis.net/def/crs/EPSG/0/{epsg}' if epsg is not 4326 else ''                   
        url = f'{base_url}/{layer_id}/items?filter-lang=cql2-text{filter_crs}&filter=S_INTERSECTS({geom_element_name},{wkt_geom})'

        async with aiohttp.ClientSession() as session:            
            async with session.get(url) as response:
                if response.status != 200:
                    return None

                return await response.json()
    except:
        return None


@alru_cache(maxsize=32, ttl=86400*7)
async def fetch_geolett_data():
    try:
        url = 'https://register.geonorge.no/geolett/api/'

        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status != 200:
                    return None

                return await response.json()
    except:
        return None


def fetch_local_geolett_data():
    file_path = path.join(
        path.dirname(DIR_PATH), 'resources/geolett.local.json')

    with open(file_path, 'r') as file:
        return json.load(file)


@alru_cache(maxsize=32, ttl=86400*7)
async def fetch_kartkatalog_metadata(id):
    try:
        url = 'https://kartkatalog.geonorge.no/api/getdata/' + id

        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status != 200:
                    return None

                return await response.json()
    except:
        return None
