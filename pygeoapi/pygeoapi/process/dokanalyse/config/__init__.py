import os
from pathlib import Path
from typing import List
import yaml

__dir_path = os.path.dirname(os.path.realpath(__file__))


def __load_dataset_config() -> dict:
    with open(os.path.join(__dir_path, 'datasets.yml'), 'r') as file:
        return yaml.safe_load(file)


def __load_quality_indicators_config() -> List[dict]:
    path = os.path.join(__dir_path, 'quality_indicators')
    glob = Path(path).glob('**/*.yml')
    files = [path for path in glob if path.is_file()]
    config = []

    for path in files:
        with open(path, 'r') as file:
            dataset_config = yaml.safe_load(file)
            dataset = dataset_config.get('dataset')

            if dataset:
                config.append(dataset)

    return config


__dataset_config = __load_dataset_config()
__quality_indicators_config = __load_quality_indicators_config()


def get_config() -> dict:
    return __dataset_config


def get_dataset_config(dataset) -> dict:
    config: dict = __dataset_config.get(dataset)

    if not config:
        return None

    config['dataset_name'] = dataset

    return config


def get_quality_indicators_config(dataset_id: str) -> List[dict]:
    indicators: List[dict] = []

    for dataset in __quality_indicators_config:
        id: str = dataset.get('dataset_id')

        if not id or id == dataset_id:
            indicators.extend(dataset.get('quality_indicators', []))

    return indicators
