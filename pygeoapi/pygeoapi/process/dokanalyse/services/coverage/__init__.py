from os import path
from io import BytesIO
from typing import List
from lxml import etree as ET
from osgeo import ogr
import aiohttp
from ...helpers.common import parse_string, xpath_select_one
from ...helpers.geometry import geometry_from_gml

_DIR_PATH = path.dirname(path.realpath(__file__))


async def get_values_from_wfs(wfs_config: dict, geometry: ogr.Geometry, epsg: int) -> tuple[List[str | int | float | bool], float]:
    gml = geometry.ExportToGML(['FORMAT=GML3'])
    request_xml = __create_wfs_request_xml(
        wfs_config['layer'], wfs_config['geom_field'], gml, epsg)

    response = await __query_wfs(wfs_config['url'], request_xml)

    if response is None:
        return [], 0

    source = BytesIO(response.encode('utf-8'))
    context = ET.iterparse(source, huge_tree=True)
    propname = wfs_config['property']
    geom_field = wfs_config['geom_field']

    prop_path = f'.//*[local-name() = "{propname}"]/text()'
    geom_path = f'.//*[local-name() = "{geom_field}"]/*'
    values: List[str] = []
    feature_geoms: List[ogr.Geometry] = []
    hit_area_percent = 0

    for _, elem in context:
        localname = ET.QName(elem).localname

        if localname == 'member':
            value_str = xpath_select_one(elem, prop_path)
            value = parse_string(value_str)
            values.append(value)

            if value == 'ikkeKartlagt':
                geom_element = xpath_select_one(elem, geom_path)
                gml_str = ET.tostring(geom_element, encoding='unicode')
                feature_geom = geometry_from_gml(gml_str)

                if feature_geom:
                    feature_geoms.append(feature_geom)

    if len(feature_geoms) > 0:
        hit_area_percent = __get_hit_area_percent(geometry, feature_geoms)

    return values, hit_area_percent


async def __query_wfs(url, xml):
    try:
        headers = {'Content-Type': 'application/xml'}

        async with aiohttp.ClientSession() as session:
            async with session.post(url, data=xml, headers=headers) as response:
                if response.status != 200:
                    return None

                return await response.text()
    except:
        return None


def __create_wfs_request_xml(layer, geom_field, geometry, epsg) -> str:
    file_path = path.join(_DIR_PATH, 'wfs_request.xml.txt')

    with open(file_path, 'r') as file:
        file_text = file.read()

    return file_text.format(layer=layer, geom_field=geom_field, geometry=geometry, epsg=epsg).encode('utf-8')


def __get_hit_area_percent(geometry: ogr.Geometry, feature_geometries: List[ogr.Geometry]) -> float:
    geom_area: float = geometry.GetArea()
    hit_area: float = 0

    for geom in feature_geometries:
        intersection: ogr.Geometry = geom.Intersection(geometry)

        if intersection is None:
            continue

        area: float = intersection.GetArea()
        hit_area += area

    percent = (hit_area / geom_area) * 100

    return round(percent, 2)
