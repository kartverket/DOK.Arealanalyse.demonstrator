from os import path
import json
from typing import List
import aiohttp
from async_lru import alru_cache
from ..services.legend import create_legend


__LOCAL_GEOLETT_IDS = [
    '0c5dc043-e5b3-4349-8587-9b464d013aaa'
]


def get_raster_result(wms_url: str, wms_layers: List[str]) -> str:
    layers = ','.join(wms_layers)

    return f'{wms_url}?layers={layers}'


async def get_cartography_url(wms_url: str, wms_layers: List[str]) -> str:
    urls = []

    for wms_layer in wms_layers:
        url = f'{wms_url}?service=WMS&version=1.3.0&request=GetLegendGraphic&sld_version=1.1.0&layer={wms_layer.strip()}&format=image/png'
        urls.append(url)

    if len(urls) == 1:
        return urls[0]

    data_url = await create_legend(urls)

    return data_url


async def get_geolett_data(id: str) -> dict:
    if id is None:
        return None

    if id in __LOCAL_GEOLETT_IDS:
        geolett = __fetch_local_geolett_data()
    else:
        geolett = await __fetch_geolett_data()

    result = list(filter(lambda item: item['id'] == id, geolett))

    return result[0] if len(result) > 0 else None


@alru_cache(maxsize=32, ttl=86400*7)
async def __fetch_geolett_data() -> dict:
    try:
        url = 'https://register.geonorge.no/geolett/api/'

        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status != 200:
                    return None

                return await response.json()
    except:
        return None


def __fetch_local_geolett_data() -> dict:
    dir_path = path.dirname(path.realpath(__file__))

    file_path = path.join(
        path.dirname(dir_path), 'resources/geolett.local.json')

    with open(file_path, 'r') as file:
        return json.load(file)
