from os import path
import aiohttp
from osgeo import ogr

__DIR_PATH = path.dirname(path.realpath(__file__))


async def query_wfs(url: str, layer: str, geometry: ogr.Geometry, epsg: int, geom_field: str) -> str:
    gml_str = geometry.ExportToGML(['FORMAT=GML3'])
    request_xml = __create_wfs_request_xml(layer, gml_str, epsg, geom_field)
    response = await __query_wfs(url, request_xml)

    return response


def __create_wfs_request_xml(layer: str, gml_str: str, epsg: int, geom_field: str) -> str:
    file_path = path.join(__DIR_PATH, 'wfs_request.xml.txt')

    with open(file_path, 'r') as file:
        file_text = file.read()

    return file_text.format(layer=layer, geometry=gml_str, epsg=epsg, geom_field=geom_field).encode('utf-8')


async def __query_wfs(url: str, xml_body: str) -> str:
    url = f'{url}?service=WFS&version=2.0.0'
    headers = {'Content-Type': 'application/xml'}

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, data=xml_body, headers=headers) as response:
                if response.status != 200:
                    return None

                return await response.text()
    except:
        return None
