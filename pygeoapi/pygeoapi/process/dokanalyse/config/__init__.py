from os import path
import yaml

DIR_PATH = path.dirname(path.realpath(__file__))

with open(path.join(DIR_PATH, 'config.yml'), 'r') as file:
    CONFIG = yaml.safe_load(file)
