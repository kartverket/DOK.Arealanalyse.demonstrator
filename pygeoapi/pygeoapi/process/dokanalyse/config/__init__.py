import os
from pathlib import Path
import yaml

__dir_path = os.path.dirname(os.path.realpath(__file__))


def __load_dataset_config() -> dict:
    with open(os.path.join(__dir_path, 'datasets.yml'), 'r') as file:
        return yaml.safe_load(file)


def __load_quality_measurement_config() -> dict:
    path = os.path.join(__dir_path, 'quality_measurement')
    glob = Path(path).glob('**/*.yml')
    files = [path for path in glob if path.is_file()]
    config = {}

    for path in files:
        with open(path, 'r') as file:
            name = os.path.splitext(path.name)[0]
            dataset_config = yaml.safe_load(file)
            config[name] = dataset_config

    return config


__dataset_config = __load_dataset_config()
__quality_measurement_config = __load_quality_measurement_config()


def get_config():
    return __dataset_config


def get_dataset_config(dataset):
    config = __dataset_config.get(dataset)

    if not config:
        return None

    config['dataset_name'] = dataset

    return config


def get_quality_measurement_config(dataset) -> dict:
    config = __quality_measurement_config.get(dataset)

    if not config:
        return None

    return config
