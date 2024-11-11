from typing import List
from .dok_status import get_dok_status_for_dataset
from ..models.quality_measurement import QualityMeasurement


async def get_quality_measurements(dataset_id: str) -> List[QualityMeasurement]:
    if dataset_id is None:
        return []

    quality_measurements: List[QualityMeasurement] = []
    dok_status = await get_dok_status_for_dataset(dataset_id)

    if dok_status:
        qms = list(map(lambda item: QualityMeasurement(item['qualityDimensionId'],
                   item['qualityDimensionName'], item['value'], item['comment']), dok_status['suitability']))
        quality_measurements.extend(qms)

    return quality_measurements
