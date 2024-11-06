import os
from pathlib import Path
import yaml

_DIR_PATH = os.path.dirname(os.path.realpath(__file__))

with open(os.path.join(_DIR_PATH, 'datasets.yml'), 'r') as file:
    DATASET_CONFIG = yaml.safe_load(file)

glob = Path(os.path.join(_DIR_PATH, 'quality_measurement')).glob('**/*.yml')
files = [path for path in glob if path.is_file()]
config = {}

for path in files:
    with open(path, 'r') as file:
        name = os.path.splitext(path.name)[0]
        dataset_config = yaml.safe_load(file)
        config[name] = dataset_config


def get_dataset_config(dataset):
    config = DATASET_CONFIG.get(dataset)

    if not config:
        return None

    config['dataset_name'] = dataset

    return config


# def get_quality_measurement_config(dataset):
#     with open(path.join(_DIR_PATH, f'quality_measurement/{dataset}.yml'), 'r') as file:
#         config = yaml.safe_load(file)

#     if not config:
#         return None

#     config['dataset_name'] = dataset

#     return config
