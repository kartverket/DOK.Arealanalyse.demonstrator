from ..config import CONFIG
from ..services.kartgrunnlag import get_kartgrunnlag


def get_dataset_type(dataset):
    if 'wfs' in CONFIG[dataset]:
        return 'wfs'
    elif 'arcgis' in CONFIG[dataset]:
        return 'arcgis'
    elif 'ogc_api' in CONFIG[dataset]:
        return 'ogc_api'

    return None


async def get_dataset_names(data, geom, epsg):
    kartgrunnlag = await get_kartgrunnlag(geom, epsg)
    datasets = get_datasets_by_theme(data.get('theme'))
    dataset_names = {}

    for dataset in datasets:
        analyze = dataset['id'] is None or dataset['id'] in kartgrunnlag
        dataset_names[dataset['name']] = analyze

    return dataset_names


def get_datasets_by_theme(theme):
    datasets = []

    for key, value in CONFIG.items():
        if theme is None or theme in value['themes']:
            datasets.append({
                'id': value.get('dataset_id'),
                'name': key
            })

    return datasets
