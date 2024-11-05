from os import path
import json
from jsonschema import validate

_DIR_PATH = path.dirname(path.realpath(__file__))


def request_is_valid(data):
    file_path = path.join(
        path.dirname(_DIR_PATH), 'resources/no.geonorge.dokanalyse.analysisinput.v0.1.schema.json')

    with open(file_path, 'r') as file:
        schema = json.load(file)

    try:
        validate(instance=data, schema=schema)
        return True
    except Exception as e:
        print(f'An exception occurred: {str(e)}')
        return False
