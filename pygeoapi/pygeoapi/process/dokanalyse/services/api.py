import aiohttp
from async_lru import alru_cache
from ..config import CONFIG


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
