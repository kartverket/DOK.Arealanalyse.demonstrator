from re import sub
from ..services.api import fetch_geolett_data, fetch_local_geolett_data, fetch_kartkatalog_metadata
from ..services.legend import create_legend

LOCAL_GEOLETT_IDS = [
    '0c5dc043-e5b3-4349-8587-9b464d013aaa'
]


def get_raster_result(wms_url, wms_layers):
    layers = ','.join(wms_layers)

    return f'{wms_url}?layers={layers}'


async def get_cartography_url(wms_url, wms_layers):
    urls = []

    for wms_layer in wms_layers:
        url = f'{wms_url}?service=WMS&version=1.3.0&request=GetLegendGraphic&sld_version=1.1.0&layer={wms_layer.strip()}&format=image/png'
        urls.append(url)

    if len(urls) == 1:
        return urls[0]

    data_url = await create_legend(urls)

    return data_url


async def get_geolett_data(id):
    if id is None:
        return None

    if id in LOCAL_GEOLETT_IDS:
        geolett = fetch_local_geolett_data()
    else:
        geolett = await fetch_geolett_data()

    result = list(filter(lambda item: item['id'] == id, geolett))

    return result[0] if len(result) > 0 else None


async def get_kartkatalog_metadata(config):
    dataset_id = config.get('dataset_id')

    if dataset_id is None:
        return None

    metadata = await fetch_kartkatalog_metadata(dataset_id)

    if metadata is None:
        return None

    updated = metadata.get(
        'DateUpdated', metadata.get('DateMetadataUpdated', None))

    return {
        'datasetId': dataset_id,
        'title': metadata['NorwegianTitle'],
        'description': metadata['Abstract'],
        'datasetDescriptionUri': 'https://kartkatalog.geonorge.no/metadata/' + dataset_id,
        'updated': updated
    }


def get_quality_measurement():
    return [
    ]
