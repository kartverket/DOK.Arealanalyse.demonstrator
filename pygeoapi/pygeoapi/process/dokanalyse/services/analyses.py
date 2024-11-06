import time
import asyncio
from ..config import get_dataset_config
from .dataset import get_dataset_names, get_dataset_type
from ..helpers.geometry import create_input_geometry, get_epsg
from ..models import Analysis, ArcGisAnalysis, EmptyAnalysis, OgcApiAnalysis, WfsAnalysis, Response, ResultStatus
from .... import socket_io
from ....middleware.correlation_id_middleware import get_correlation_id


async def run(data) -> Response:
    geo_json = data.get('inputGeometry')
    geometry, epsg = create_input_geometry(geo_json)
    orig_epsg = get_epsg(geo_json)
    buffer = data.get('requestedBuffer', 0)
    context = data.get('context')
    include_guidance = data.get('includeGuidance', False)
    include_quality_measurement = data.get('includeQualityMeasurement', False)

    #datasets = await get_dataset_names(data, geometry, epsg)
    datasets = {'naturtyper_utvalgte_slåttemark': True}
    correlation_id = get_correlation_id()

    if correlation_id:
        to_analyze = {key: value for (
            key, value) in datasets.items() if value == True}
        await socket_io.sio.emit('dataset_count', len(to_analyze), correlation_id)

    tasks = []

    async with asyncio.TaskGroup() as tg:
        for dataset, should_analyze in datasets.items():
            task = tg.create_task(run_analysis(
                dataset, should_analyze, geometry, epsg, orig_epsg, buffer, context, include_guidance, include_quality_measurement))
            tasks.append(task)

    response = Response(geo_json, orig_epsg)

    for task in tasks:
        response.result_list.append(task.result())

    return response.to_json()


async def run_analysis(dataset, should_analyze, geometry, epsg, orig_epsg, buffer, context, include_guidance, include_quality_measurement) -> Analysis:
    config = get_dataset_config(dataset)
    
    if config is None:
        return None

    if not should_analyze:
        analysis = EmptyAnalysis(config, ResultStatus.NOT_RELEVANT)
        await analysis.run()
        return analysis

    start = time.time()
    correlation_id = get_correlation_id()

    analysis = get_analysis(dataset, config, geometry, epsg, orig_epsg, buffer)
    await analysis.run(context, include_guidance, include_quality_measurement)
    
    end = time.time()
    print(f'"{dataset}": {round(end - start, 2)} sek.')

    if correlation_id:
        await socket_io.sio.emit('dataset_analyzed', dataset, correlation_id)

    return analysis


def get_analysis(dataset, config, geometry, epsg, orig_epsg, buffer) -> Analysis:
    dataset_type = get_dataset_type(dataset)

    match dataset_type:
        case 'arcgis':
            return ArcGisAnalysis(config, geometry, epsg, orig_epsg, buffer)
        case 'ogc_api':
            return OgcApiAnalysis(config, geometry, epsg, orig_epsg, buffer)
        case 'wfs':
            return WfsAnalysis(config, geometry, epsg, orig_epsg, buffer)
        case _:
            return None
