from os import path
import json
import asyncio
import aiohttp
from async_lru import alru_cache

_DIR_PATH = path.dirname(path.realpath(__file__))
_TIMEOUT_SECS = 15


async def query_wfs(config, xml):
    try:
        url = f'{config["wfs"]}?service=WFS&version=2.0.0'
        headers = {'Content-Type': 'application/xml'}

        async with aiohttp.ClientSession() as session:
            async with session.post(url, data=xml, headers=headers, timeout=_TIMEOUT_SECS) as response:
                if response.status != 200:
                    return response.status, None

                return 200, await response.text()
    except asyncio.TimeoutError:
        return 408, None    
    except:
        return 500, None


async def query_arcgis(config, layer_id, type_filter, geometry, epsg):
    try:
        url = f'{config["arcgis"]}/{layer_id}/query'

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
            async with session.post(url, data=data, timeout=_TIMEOUT_SECS) as response:
                if response.status != 200:
                    return response.status, None

                json = await response.json()

                if 'error' in json:
                    return 400, None

                return 200, json
    except asyncio.TimeoutError:
        return 408, None        
    except:
        return 500, None


async def query_ogc_api(config, layer_id, wkt_geom, epsg):
    try:
        base_url = config['ogc_api']
        geom_field = config['geom_field']
        filter_crs = f'&filter-crs=http://www.opengis.net/def/crs/EPSG/0/{epsg}' if epsg != 4326 else ''
        url = f'{base_url}/{layer_id}/items?filter-lang=cql2-text{filter_crs}&filter=S_INTERSECTS({geom_field},{wkt_geom})'

        async with aiohttp.ClientSession() as session:
            async with session.get(url, timeout=_TIMEOUT_SECS) as response:
                if response.status != 200:
                    return response.status, None

                return 200, await response.json()
    except asyncio.TimeoutError:
        return 408, None        
    except:
        return 500, None


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
        path.dirname(_DIR_PATH), 'resources/geolett.local.json')

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
