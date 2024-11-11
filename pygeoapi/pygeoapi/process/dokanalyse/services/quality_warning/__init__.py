import re
from os import path
from typing import List
import xml.etree.ElementTree as ET
from osgeo import ogr
import aiohttp
from ...models.quality_measurement import QualityMeasurement
from ...helpers.common import parse_string

_DIR_PATH = path.dirname(path.realpath(__file__))


def get_dataset_quality_warnings(config: List[dict], quality_measurements: List[QualityMeasurement], **kwargs) -> List[str]:
    quality_indicators: List[dict] = [
        entry for entry in config if entry['type'] == 'dataset']

    warnings: List[str] = []

    for qi in quality_indicators:
        quality_dimension_id = qi['quality_dimension_id']
        input_filter = qi.get('input_filter')

        if input_filter:
            result = __evaluate_condition(input_filter, kwargs)

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


async def get_coverage_quality_warnings(quality_indicators: List[dict], geometry: ogr.Geometry, epsg: int) -> List[str]:
    warnings: List[str] = []

    for qi in quality_indicators:
        wfs = qi['wfs']

        if not wfs:
            continue

        values = await __get_values_from_wfs(wfs, geometry, epsg)
        threshold_values = __get_threshold_values(qi)

        should_warn = any(value for value in values if any(
            t_value for t_value in threshold_values if t_value == value))

        if should_warn:
            warnings.append(qi['quality_warning_text'])

    return warnings


async def __get_values_from_wfs(wfs_config: dict, geometry: ogr.Geometry, epsg: int) -> List[str | int | float | bool]:
    gml = geometry.ExportToGML(['FORMAT=GML3'])
    request_xml = __create_wfs_request_xml(
        wfs_config['namespace'], wfs_config['layer'], wfs_config['property'], wfs_config['geom_field'], gml, epsg)

    response = await __query_wfs(wfs_config['url'], request_xml)

    if response is None:
        return None

    ns = {'wfs': 'http://www.opengis.net/wfs/2.0',
          'app': wfs_config['namespace']}

    root = ET.fromstring(response)

    elements = root.findall(
        f'.//wfs:member/{wfs_config["property"]}', namespaces=ns)

    values = list(map(lambda element: parse_string(element.text), elements))

    return values


def __get_threshold_values(quality_indicator: dict) -> List[str]:
    threshold: str = quality_indicator['warning_threshold']
    values = [value.strip() for value in threshold.split('OR')]
    result = list(map(lambda value: parse_string(value), values))

    return result


def __evaluate_condition(condition: str, data: dict[str, any]) -> bool:
    parsed_condition = __parse_condition(condition)
    result = eval(parsed_condition, data)

    if isinstance(result, (bool)):
        return result

    raise Exception


def __parse_condition(condition: str) -> str:
    regex = r'(?<!=|>|<)\s*=\s*(?!=)'
    condition = re.sub(regex, ' == ', condition, 0, re.MULTILINE)

    return __replace_all(
        condition, {' AND ': ' and ', ' OR ': ' or ', ' IN ': ' in ', ' NOT ': ' not '})


def __replace_all(text: str, replacements: dict) -> str:
    for i, j in replacements.items():
        text = text.replace(i, j)
    return text


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


def __create_wfs_request_xml(namespace, layer, property, geom_field, geometry, epsg) -> str:
    file_path = path.join(_DIR_PATH, 'wfs_request.xml.txt')

    with open(file_path, 'r') as file:
        file_text = file.read()

    return file_text.format(namespace=namespace, layer=layer, property=property, geom_field=geom_field, geometry=geometry, epsg=epsg).encode('utf-8')
