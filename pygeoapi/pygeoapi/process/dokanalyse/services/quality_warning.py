from os import path
from typing import List
from osgeo import ogr
from .coverage import get_values_from_wfs
from ..models.quality_measurement import QualityMeasurement
from ..helpers.common import parse_string, evaluate_condition


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


async def get_coverage_quality(quality_indicator: dict, geometry: ogr.Geometry, epsg: int) -> tuple[List[str], str | None]:
    wfs = quality_indicator.get('wfs')

    if not wfs:
        return

    values, hit_area_percent = await get_values_from_wfs(wfs, geometry, epsg)

    if len(values) == 0:
        return

    threshold_values = __get_threshold_values(quality_indicator)

    should_warn = any(value for value in values if any(
        t_value for t_value in threshold_values if t_value == value))

    warning_text: str = quality_indicator['quality_warning_text']

    if hit_area_percent > 0 and hit_area_percent < 100:
        hit_area = str(hit_area_percent).replace('.', ',')
        warning_text = f'{hit_area} % av {warning_text.lower()}'

    warning = warning_text if should_warn else None

    return values, warning


def __get_threshold_values(quality_indicator: dict) -> List[str]:
    threshold: str = quality_indicator['warning_threshold']
    values = [value.strip() for value in threshold.split('OR')]
    result = list(map(lambda value: parse_string(value), values))

    return result
