import re
from os import path
from io import BytesIO
from typing import List
from lxml import etree as ET
from osgeo import ogr
import aiohttp
from ...models.quality_measurement import QualityMeasurement
from ...helpers.common import parse_string, evaluate_condition

_DIR_PATH = path.dirname(path.realpath(__file__))


def get_dataset_quality_warnings(config: List[dict], quality_measurements: List[QualityMeasurement], **kwargs) -> List[str]:
    quality_indicators: List[dict] = [
        entry for entry in config if entry['type'] == 'dataset']

    warnings: List[str] = []

    for qi in quality_indicators:
        quality_dimension_id = qi['quality_dimension_id']
        input_filter = qi.get('input_filter')

        if input_filter:
            result = evaluate_condition(input_filter, kwargs)

            if not result:
                continue

        qm = next(
            (qm for qm in quality_measurements if qm.quality_dimension_id == quality_dimension_id), None)

        if qm is None:
            continue

        threshold_values = __get_threshold_values(qi)
        should_warn = qm.value in threshold_values

        if should_warn:
            warnings.append(qi.get('quality_warning_text'))

    return warnings


def get_object_quality_warnings(config: dict, data: List[dict]) -> List[str]:
    if data is None or len(data) == 0:
        return []

    quality_indicators: List[dict] = [
        entry for entry in config if entry['type'] == 'object']

    warnings: List[str] = []

    for qi in quality_indicators:
        prop = qi['property']
        threshold_values = __get_threshold_values(qi)

        should_warn = any(entry[prop] for entry in data if any(
            value for value in threshold_values if value == entry[prop]))

        if should_warn:
            warnings.append(qi['quality_warning_text'])

    return warnings


async def get_coverage_quality(quality_indicator: dict, geometry: ogr.Geometry, epsg: int) -> tuple[str, str | None]:
    wfs = quality_indicator.get('wfs')

    if not wfs:
        return

    values = await __get_values_from_wfs(wfs, geometry, epsg)

    if not values:
        return

    threshold_values = __get_threshold_values(quality_indicator)

    should_warn = any(value for value in values if any(
        t_value for t_value in threshold_values if t_value == value))

    print(values)
    warning = quality_indicator['quality_warning_text'] if should_warn else None
    value = 'ikkeKartlagt' if 'ikkeKartlagt' in values else values[0]

    return value, warning


async def __get_values_from_wfs(wfs_config: dict, geometry: ogr.Geometry, epsg: int) -> List[str | int | float | bool]:
    gml = geometry.ExportToGML(['FORMAT=GML3'])
    request_xml = __create_wfs_request_xml(
        wfs_config['layer'], wfs_config['geom_field'], gml, epsg)

    response = await __query_wfs(wfs_config['url'], request_xml)

    if response is None:
        return None

    # ns = {'wfs': 'http://www.opengis.net/wfs/2.0',
    #       'app': wfs_config['namespace']}

    source = BytesIO(response.encode('utf-8'))
    context = ET.iterparse(source, huge_tree=True)
    propname = wfs_config['property']
    geom_field = wfs_config['geom_field']

    prop_path = f'.//*[local-name() = "{propname}"]'
    geom_path = f'.//*[local-name() = "{geom_field}"]/*'
    values = []
    geometries: List[ogr.Geometry] = []

    for _, elem in context:
        localname = ET.QName(elem).localname

        if localname == 'member':
            value_elem = elem.xpath(prop_path)

            if len(value_elem) != 1:
                continue
            
            value = parse_string(value_elem[0].text)
            values.append(value)

            if value == 'ikkeKartlagt':
                geom_element = elem.xpath(geom_path)
                
                if len(geom_element) != 1:
                    continue
                
                geom_str = ET.tostring(geom_element[0], encoding='unicode')

                try:
                    geom = ogr.CreateGeometryFromGML(geom_str)
                    geometries.append(geom)
                except:
                    pass

    if len(geometries) > 0:
        geom_area = geometry.GetArea()
        hit_area: float = 0
        
        for geom in geometries:
            intersection = geom.Intersection(geometry)
            
            if intersection is None:
                continue
            
            area = intersection.GetArea()
            hit_area += area
            
        percent = hit_area / geom_area
        print(percent)
        

    # root = ET.fromstring(response)

    # elements = root.findall(
    #     f'.//wfs:member/{wfs_config["property"]}', namespaces=ns)
    # geom_elements = root.findall(
    #     f'.//wfs:member/*/app:område/*', namespaces=ns)

    # print(geom_elements)

    # values = list(map(lambda element: parse_string(element.text), elements))

    return values


def __get_threshold_values(quality_indicator: dict) -> List[str]:
    threshold: str = quality_indicator['warning_threshold']
    values = [value.strip() for value in threshold.split('OR')]
    result = list(map(lambda value: parse_string(value), values))

    return result


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
