from os import path
from typing import List
from osgeo import ogr
from .coverage import get_values_from_wfs
from ..models.quality_measurement import QualityMeasurement
from ..utils.helpers.common import parse_string, evaluate_condition
from .dok_status import get_dok_status_for_dataset


async def get_dataset_quality(dataset_id, config: List[dict], **kwargs) -> List[dict]:
    quality_measurements = await __get_dataset_quality_measurements(dataset_id)

    quality_indicators: List[dict] = [
        entry for entry in config if entry['type'] == 'dataset']

    measurements: List[dict] = []

    for qm in quality_measurements:
        quality_dimension_id = qm['quality_dimension_id']
        value = qm['value']

        measurement = {
            'id': quality_dimension_id,
            'values': [{
                'value': value,
                'comment': qm['comment']
            }],
            'warning_text': None
        }

        qi = next(
            (qi for qi in quality_indicators if qi['quality_dimension_id'] == quality_dimension_id), None)

        if qi is None:
            measurements.append(measurement)
            continue

        input_filter = qi.get('input_filter')

        if input_filter:
            result = evaluate_condition(input_filter, kwargs)

            if not result:
                continue

        threshold_values = __get_threshold_values(qi)
        should_warn = value in threshold_values

        if should_warn:
            measurement['warning_text'] = qi.get('quality_warning_text')

        measurements.append(measurement)

    return measurements


def get_object_quality(config: dict, data: List[dict]) -> List[dict]:
    if data is None or len(data) == 0:
        return []

    quality_indicators: List[dict] = [
        entry for entry in config if entry['type'] == 'object']

    measurements: List[dict] = []

    for qi in quality_indicators:
        prop = qi['property']
        threshold_values = __get_threshold_values(qi)
        values: List[dict] = []

        for entry in data:
            values.append({
                'value': entry[prop],
                'comment': None
            })

        distinct = list({value['value']: value for value in values}.values())

        should_warn = any(value['value'] for value in distinct if any(
            t_value for t_value in threshold_values if t_value == value['value']))

        measurements.append({
            'id': qi['quality_dimension_id'],
            'values': distinct,
            'warning_text': qi['quality_warning_text'] if should_warn else None
        })

    return measurements


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


async def __get_dataset_quality_measurements(dataset_id: str) -> List[dict]:
    qms: List[dict] = []

    dok_status = await get_dok_status_for_dataset(dataset_id)

    if dok_status is not None:
        qms.extend(dok_status.get('suitability'))

    return qms


def __get_threshold_values(quality_indicator: dict) -> List[str]:
    threshold: str = quality_indicator['warning_threshold']
    values = [value.strip() for value in threshold.split('OR')]
    result = list(map(lambda value: parse_string(value), values))

    return result
