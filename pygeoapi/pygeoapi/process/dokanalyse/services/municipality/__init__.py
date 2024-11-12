from os import path
import aiohttp
import xml.etree.ElementTree as ET
from osgeo import ogr


__DIR_PATH = path.dirname(path.realpath(__file__))


async def get_municipality(geometry: ogr.Geometry, epsg: int) -> tuple[str, str]:
    return await __get_municipality_from_wfs(geometry, epsg)


async def __get_municipality_from_rest_api(geometry: ogr.Geometry, epsg: int) -> tuple[str, str]:
    centroid = geometry.Centroid()
    point = centroid.GetPoint(0)

    return await __fetch_municipality(point[0], point[1], epsg)


async def __get_municipality_from_wfs(geometry: ogr.Geometry, epsg: int) -> tuple[str, str]:
    centroid = geometry.Centroid()
    spatial_ref = geometry.GetSpatialReference()
    centroid.AssignSpatialReference(spatial_ref)
    gml = centroid.ExportToGML(['FORMAT=GML3'])

    request_xml = __create_wfs_request_xml(gml, epsg)
    response = await __query_wfs(request_xml)
    
    if response is None:
        return None

    ns = {'wfs': 'http://www.opengis.net/wfs/2.0',
          'app': 'https://skjema.geonorge.no/SOSI/produktspesifikasjon/AdmEnheter/20240101'}

    root = ET.fromstring(response)
    municipality_number = root.findtext(
        './/wfs:member/*/app:kommunenummer', namespaces=ns)
    municipality_name = root.findtext(
        './/wfs:member/*/app:kommunenavn', namespaces=ns)

    return municipality_number, municipality_name


async def __fetch_municipality(x: float, y: float, epsg: int) -> tuple[str, str]:
    try:
        url = f'https://api.kartverket.no/kommuneinfo/v1/punkt?nord={y}&ost={x}&koordsys={epsg}&filtrer=kommunenummer,kommunenavn'

        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status != 200:
                    return None

                json = await response.json()

                municipality_number = json.get('kommunenummer', None)
                municipality_name = json.get('kommunenavn', None)

                return municipality_number, municipality_name
    except:
        return None


async def __query_wfs(xml: str) -> str:
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


def __create_wfs_request_xml(geometry: str, epsg: int) -> str:
    file_path = path.join(__DIR_PATH, 'wfs_request.xml.txt')

    with open(file_path, 'r') as file:
        file_text = file.read()

    return file_text.format(geometry=geometry, epsg=epsg).encode('utf-8')
