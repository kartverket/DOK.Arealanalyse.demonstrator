from os import path
# import json
import yaml

DIR_PATH = path.dirname(path.realpath(__file__))

# with open(path.join(DIR_PATH, 'resources/config.json'), 'r') as file:
#     CONFIG = json.load(file)
    
with open(path.join(DIR_PATH, 'resources/config.yml'), 'r') as file:
    CONFIG = yaml.safe_load(file)
