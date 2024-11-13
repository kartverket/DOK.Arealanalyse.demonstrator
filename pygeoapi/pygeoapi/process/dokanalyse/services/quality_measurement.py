from typing import List
from .dok_status import get_dok_status_for_dataset
from .codelist import get_codelist
from ..models.quality_measurement import QualityMeasurement

__SORT_ORDER = [
    'fullstendighet_dekning',
    'egnethet_reguleringsplan',
    'egnethet_kommuneplan',
    'egnethet_byggesak',
]


async def get_quality_measurements(dataset_id: str, coverage_status: str) -> List[QualityMeasurement]:
    if dataset_id is None:
        return []

    quality_measurements: List[QualityMeasurement] = []

    if coverage_status:
        await __add_quality_measurement_for_coverage(
            coverage_status, quality_measurements)

    dok_status = await get_dok_status_for_dataset(dataset_id)

    if dok_status:
        __add_quality_measurement_for_dok_status(
            dok_status, quality_measurements)

    return __sort_quality_measurements(quality_measurements)


async def __add_quality_measurement_for_coverage(coverage_status: str, quality_measurements: List[QualityMeasurement]) -> None:
    codelist = await get_codelist('fullstendighet_dekning')

    if codelist is None or len(codelist) == 0:
        return

    result = next(
        (entry for entry in codelist if entry['value'] == coverage_status), None)

    if not result:
        return

    value = 'Nei' if coverage_status in [
        'ikkeKartlagt', 'ikkeRelevant'] else 'Ja'

    qm = QualityMeasurement('fullstendighet_dekning',
                            'Fullstendighetsdekning', value, result['label'])

    quality_measurements.append(qm)


def __add_quality_measurement_for_dok_status(dok_status: dict, quality_measurements: List[QualityMeasurement]) -> None:
    qms = list(map(lambda item: QualityMeasurement(item['qualityDimensionId'],
                   item['qualityDimensionName'], item['value'], item['comment']), dok_status['suitability']))

    quality_measurements.extend(qms)


def __sort_quality_measurements(quality_measurements: List[QualityMeasurement]) -> List[QualityMeasurement]:
    qms: List[QualityMeasurement] = []

    for id in __SORT_ORDER:
        result = next(
            (qm for qm in quality_measurements if qm.quality_dimension_id == id), None)

        if result:
            qms.append(result)

    return qms
