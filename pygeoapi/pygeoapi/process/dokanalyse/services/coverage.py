from io import BytesIO
from typing import List
from lxml import etree as ET
from osgeo import ogr
from ..http_clients.wfs import query_wfs
from ..helpers.common import parse_string, xpath_select_one
from ..helpers.geometry import geometry_from_gml


async def get_values_from_wfs(wfs_config: dict, geometry: ogr.Geometry, epsg: int) -> tuple[List[str | int | float | bool], float]:
    response = await query_wfs(wfs_config['url'], wfs_config['layer'], wfs_config['geom_field'], geometry, epsg)

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
