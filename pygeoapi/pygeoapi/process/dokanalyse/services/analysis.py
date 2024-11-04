import asyncio
from ..config import CONFIG
from ..helpers import get_dataset_names
from ..helpers.geometry import create_input_geometry, get_epsg, add_geojson_crs
from .... import socket_io
from ..models import Response, WfsAnalysis

async def query(data, correlation_id):
    geo_json = data.get('inputGeometry')
    geom, epsg = create_input_geometry(geo_json)
    orig_epsg = get_epsg(geo_json)

    context = data.get('context', None)
    buffer = data.get('requestedBuffer', 0)
    include_guidance = data.get('includeGuidance', False)
    include_quality_measurement = data.get('includeQualityMeasurement', False)

    input_geometry = geo_json
    add_geojson_crs(input_geometry, orig_epsg)

    datasets = await get_dataset_names(data, geom, epsg)
    # datasets = {'jord_flomskred_aktsomhets_omr': True}
    
    response = Response(input_geometry)

    if correlation_id:
        to_analyze = {key: value for (
            key, value) in datasets.items() if value == True}
        await socket_io.sio.emit('dataset_count', len(to_analyze), correlation_id)

    tasks = []

    async with asyncio.TaskGroup() as tg:
        for dataset, analyze in datasets.items():
            tasks.append(tg.create_task(query_dataset(
                dataset, analyze, epsg, orig_epsg, geom, buffer, include_guidance, include_quality_measurement, context, correlation_id)))

    for task in tasks:
        response.result_list.append(task.result())

    return response


async def query_dataset(dataset, analyze, epsg, orig_epsg, geom, buffer, include_guidance, include_quality_measurement, context, correlation_id):
    pass
