import time
import asyncio
from socketio import SimpleClient
from ..config import get_dataset_config
from .dataset import get_dataset_names, get_dataset_type
from .municipality import get_municipality
from ..helpers.geometry import create_input_geometry, get_epsg
from ..models import Analysis, ArcGisAnalysis, EmptyAnalysis, OgcApiAnalysis, WfsAnalysis, Response, ResultStatus
from ....middleware.correlation_id_middleware import get_correlation_id


async def run(data: dict, sio_client: SimpleClient) -> Response:
    geo_json = data.get('inputGeometry')
    geometry, epsg = create_input_geometry(geo_json)
    orig_epsg = get_epsg(geo_json)
    buffer = data.get('requestedBuffer', 0)
    context = data.get('context')
    include_guidance = data.get('includeGuidance', False)
    include_quality_measurement = data.get('includeQualityMeasurement', False)
    municipality_number, municipality_name = await get_municipality(geometry, epsg)
    
    datasets = await get_dataset_names(data, municipality_number)
    correlation_id = get_correlation_id()

    if correlation_id and sio_client:
        to_analyze = {key: value for (
            key, value) in datasets.items() if value == True}
        sio_client.emit('datasets_counted_api', {'count': len(
            to_analyze), 'recipient': correlation_id})

    tasks = []

    async with asyncio.TaskGroup() as tg:
        for dataset, should_analyze in datasets.items():
            task = tg.create_task(run_analysis(
                dataset, should_analyze, geometry, epsg, orig_epsg, buffer, context, include_guidance, include_quality_measurement, sio_client))
            tasks.append(task)

    response = Response.create(
        geo_json, geometry, epsg, orig_epsg, buffer, municipality_number, municipality_name)

    for task in tasks:
        response.result_list.append(task.result())

    return response.to_dict()


async def run_analysis(dataset, should_analyze, geometry, epsg, orig_epsg, buffer, context, include_guidance, include_quality_measurement, sio_client) -> Analysis:
    config = get_dataset_config(dataset)

    if config is None:
        return None

    if not should_analyze:
        analysis = EmptyAnalysis(config, ResultStatus.NOT_RELEVANT)
        await analysis.run()
        return analysis

    start = time.time()
    correlation_id = get_correlation_id()

    analysis = create_analysis(dataset, config, geometry, epsg, orig_epsg, buffer)
    await analysis.run(context, include_guidance, include_quality_measurement)

    end = time.time()
    print(f'"{dataset}": {round(end - start, 2)} sek.')

    if correlation_id and sio_client:
        sio_client.emit('dataset_analyzed_api', {
            'dataset': dataset, 'recipient': correlation_id})

    return analysis


def create_analysis(dataset, config, geometry, epsg, orig_epsg, buffer) -> Analysis:
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
