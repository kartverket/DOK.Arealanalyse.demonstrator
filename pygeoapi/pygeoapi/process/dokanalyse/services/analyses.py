import time
import logging
import traceback
from typing import List
import asyncio
from socketio import SimpleClient
from osgeo import ogr
from ..config import get_dataset_config
from .dataset import get_dataset_names, get_dataset_type
from .fact_sheet import create_fact_sheet
from .municipality import get_municipality
from ..utils.helpers.geometry import create_input_geometry, get_epsg
from ..models.analysis import Analysis
from ..models.arcgis_analysis import ArcGisAnalysis
from ..models.empty_analysis import EmptyAnalysis
from ..models.ogc_api_analysis import OgcApiAnalysis
from ..models.wfs_analysis import WfsAnalysis
from ..models.analysis_response import AnalysisResponse
from ..models.result_status import ResultStatus
from ..utils.constants import DEFAULT_EPSG
from ....middleware.correlation_id_middleware import get_correlation_id

__LOGGER = logging.getLogger(__name__)


async def run(data: dict, sio_client: SimpleClient) -> AnalysisResponse:
    geo_json = data.get('inputGeometry')
    geometry = create_input_geometry(geo_json)
    orig_epsg = get_epsg(geo_json)
    buffer = data.get('requestedBuffer', 0)
    context = data.get('context')
    include_guidance = data.get('includeGuidance', False)
    include_quality_measurement = data.get('includeQualityMeasurement', False)
    municipality_number, municipality_name = await get_municipality(geometry, DEFAULT_EPSG)

    datasets = {'naturtyper_ku_verdi': True}
    #datasets = await get_dataset_names(data, municipality_number)
    correlation_id = get_correlation_id()

    if correlation_id and sio_client:
        to_analyze = {key: value for (
            key, value) in datasets.items() if value == True}
        sio_client.emit('datasets_counted_api', {'count': len(
            to_analyze), 'recipient': correlation_id})

    tasks: List[asyncio.Task] = []

    async with asyncio.TaskGroup() as tg:
        for dataset, should_analyze in datasets.items():
            task = tg.create_task(run_analysis(
                dataset, should_analyze, geometry, DEFAULT_EPSG, orig_epsg, buffer,
                context, include_guidance, include_quality_measurement, sio_client))
            tasks.append(task)

    fact_sheet = await create_fact_sheet(geometry, orig_epsg, buffer)

    response = AnalysisResponse.create(
        geo_json, geometry, DEFAULT_EPSG, orig_epsg, buffer, fact_sheet, municipality_number, municipality_name)

    for task in tasks:
        response.result_list.append(task.result())

    return response.to_dict()


async def run_analysis(dataset: str, should_analyze: bool, geometry: ogr.Geometry, epsg: int, orig_epsg: int, buffer: int,
                       context: str, include_guidance: bool, include_quality_measurement: bool, sio_client: SimpleClient) -> Analysis:
    config = get_dataset_config(dataset)

    if config is None:
        return None

    if not should_analyze:
        analysis = EmptyAnalysis(config, ResultStatus.NOT_RELEVANT)
        await analysis.run()
        return analysis

    start = time.time()
    correlation_id = get_correlation_id()

    analysis = create_analysis(
        dataset, config, geometry, epsg, orig_epsg, buffer)

    try:
        await analysis.run(context, include_guidance, include_quality_measurement)
    except Exception:
        __LOGGER.error(traceback.format_exc())
        await analysis.set_default_data()
        analysis.result_status = ResultStatus.ERROR

    end = time.time()
    print(f'"{dataset}": {round(end - start, 2)} sek.')

    if correlation_id and sio_client:
        sio_client.emit('dataset_analyzed_api', {
            'dataset': dataset, 'recipient': correlation_id})

    return analysis


def create_analysis(dataset: str, config: dict, geometry: ogr.Geometry, epsg: int, orig_epsg: int, buffer: int) -> Analysis:
    dataset_type = get_dataset_type(dataset)
    dataset_id = config.get('dataset_id')
    
    match dataset_type:
        case 'arcgis':
            return ArcGisAnalysis(dataset_id, config, geometry, epsg, orig_epsg, buffer)
        case 'ogc_api':
            return OgcApiAnalysis(dataset_id, config, geometry, epsg, orig_epsg, buffer)
        case 'wfs':
            return WfsAnalysis(dataset_id, config, geometry, epsg, orig_epsg, buffer)
        case _:
            return None
