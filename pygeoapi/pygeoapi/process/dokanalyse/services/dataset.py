from os import path
from pathlib import Path
import json
from typing import List
import aiohttp
from ..config import get_config, get_dataset_config
from ..helpers.common import should_refresh_cache

__CACHE_DAYS = 7


def get_dataset_type(dataset: str) -> str:
    config = get_dataset_config(dataset)

    if 'wfs' in config:
        return 'wfs'
    elif 'arcgis' in config:
        return 'arcgis'
    elif 'ogc_api' in config:
        return 'ogc_api'

    return None


async def get_dataset_names(data: dict, municipality_number: str) -> dict:
    include_chosen_dok = data.get('includeFilterChosenDOK', True)

    if include_chosen_dok:
        kartgrunnlag = await __get_kartgrunnlag(municipality_number)
    else:
        kartgrunnlag = []

    datasets = get_datasets_by_theme(data.get('theme'))
    dataset_names = {}
    
    for dataset in datasets:
        analyze = len(
            kartgrunnlag) == 0 or dataset['id'] is None or dataset['id'] in kartgrunnlag
        dataset_names[dataset['name']] = analyze
    
    return dataset_names


def get_datasets_by_theme(theme: str) -> List[dict]:
    datasets = []

    for key, value in get_config().items():
        if theme is None or theme in value['themes']:
            datasets.append({
                'id': value.get('dataset_id'),
                'name': key
            })

    return datasets


async def __get_kartgrunnlag(municipality_number: str) -> List[str]:
    if municipality_number is None:
        return []

    file_path = Path(path.join(
        Path.home(), 'pygeoapi/dokanalyse/kartgrunnlag', f'{municipality_number}.json'))

    if not file_path.exists() or should_refresh_cache(file_path, __CACHE_DAYS):
        file_path.parent.mkdir(parents=True, exist_ok=True)
        dataset_ids = await __fetch_dataset_ids(municipality_number)
        json_object = json.dumps(dataset_ids)

        with file_path.open('w', encoding='utf-8') as file:
            file.write(json_object)

        return dataset_ids
    else:
        with file_path.open(encoding='utf-8') as file:
            dataset_ids = json.load(file)

        return dataset_ids


async def __fetch_dataset_ids(municipality_number: str) -> List[str]:
    response = await __fetch_kartgrunnlag(municipality_number)

    if response is None:
        return []

    contained_items = response.get('containeditems', [])
    datasets = []

    for dataset in contained_items:
        if dataset.get('ConfirmedDok') == 'JA' and dataset.get('dokStatus') == 'Godkjent':
            metadata_url = dataset.get('MetadataUrl')
            splitted = metadata_url.split('/')
            datasets.append(splitted[-1])

    return datasets


async def __fetch_kartgrunnlag(municipality_number: str) -> dict:
    try:
        url = f'https://register.geonorge.no/api/det-offentlige-kartgrunnlaget-kommunalt.json?municipality={municipality_number}'

        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status != 200:
                    return None

                return await response.json()
    except:
        return None
