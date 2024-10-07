import logging
import json
import time
from osgeo import ogr
import asyncio
from pygeoapi.process.base import BaseProcessor, ProcessorExecuteError
from .services import common
from .services import wfs
from .services import arcgis
from .services import ogc_api

LOGGER = logging.getLogger(__name__)

PROCESS_METADATA = {
    'version': '0.1.0',
    'id': 'dokanalyse',
    'title': {
        'no': 'DOK-analyse'
    },
    'description': {
        'no': 'Tjeneste som utfører en en standardisert DOK-arealanalyse for enhetlig DOK-analyse på tvers av kommuner og systemleverandørerviser.',
    },
    'keywords': [
        'dokanalyse',
        'DOK'
    ],
    'links': [],
    'inputs': {
        'inputGeometry': {
            'title': 'Område',
            'description': 'Området en ønsker å analysere mot. Kan f.eks. være en eiendom eller et planområde.',
            'schema': {
                'type': 'object',
                'contentMediaType': 'application/json'
            },
            'minOccurs': 1,
            'maxOccurs': 1
        },
        'requestedBuffer': {
            'title': 'Ønsket buffer',
            'description': 'Antall meter som legges på inputGeometry som buffer i analysen. Kan utelates og avgjøres av analysen hva som er fornuftig buffer.',
            'schema': {
                'type': 'string'
            },
            'minOccurs': 0,
            'maxOccurs': 1
        },
        'context': {
            'title': 'Kontekst',
            'description': 'Hint om hva analysen skal brukes til.',
            'schema': {
                'type': 'string'
            },
            'minOccurs': 0,
            'maxOccurs': 1
        },
        'theme': {
            'title': 'Tema',
            'description': 'DOK-tema kan angis for å begrense analysen til aktuelle tema.',
            'schema': {
                'type': 'string'
            },
            'minOccurs': 0,
            'maxOccurs': 1
        },
        'includeGuidance': {
            'title': 'Inkluder veiledning',
            'description': 'Velg om veiledningstekster skal inkluderes i resultat om det finnes i Geolett-registeret. Kan være avhengig av å styres med context for å få riktige tekster.',
            'schema': {
                'type': 'boolean'
            },
            'minOccurs': 0,
            'maxOccurs': 1
        },
        'includeQualityMeasurement': {
            'title': 'Inkluder kvalitetsinformasjon',
            'description': 'Velg om kvalitetsinformasjon skal tas med i resultatet der det er mulig, slik som dekningskart, egnethet, nøyaktighet, osv.',
            'schema': {
                'type': 'boolean'
            },
            'minOccurs': 0,
            'maxOccurs': 1
        }
    },
    'outputs': {
        'resultList': {
            'title': 'Resultatliste',
            'description': 'Strukturert resultat på analysen',
            'schema': {
                'type': 'Result',
            },
            'minOccurs': 0
        },
        'report': {
            'title': 'Rapport',
            'description': 'Rapporten levert som PDF',
            'schema': {
                'type': 'binary',
            },
            'minOccurs': 0,
            'maxOccurs': 1
        },
        'inputGeometry': {
            'title': 'Område',
            'description': 'Valgt område for analyse',
            'schema': {
                'type': 'object',
                'contentMediaType': 'application/json'
            },
            'minOccurs': 0,
            'maxOccurs': 1
        }
    },
    'example': {
        'inputs': {
            'inputGeometry': {
                'type': 'Polygon',
                'coordinates': [
                    [
                        [
                            504132.67,
                            6585575.94
                        ],
                        [
                            504137.07,
                            6585483.64
                        ],
                        [
                            504286.5,
                            6585488.04
                        ],
                        [
                            504273.32,
                            6585575.94
                        ],
                        [
                            504132.67,
                            6585575.94
                        ]
                    ]
                ],
                'crs': {
                    'type': 'name',
                    'properties': {
                        'name': 'urn:ogc:def:crs:EPSG::25832'
                    }
                }
            },
            'requestedBuffer': 50,
            'context': 'ROS',
            'theme': 'Plan',
            'includeGuidance': True,
            'includeQualityMeasurement': True
        }
    }
}


class DokanalyseProcessor(BaseProcessor):
    def __init__(self, processor_def):
        super().__init__(processor_def, PROCESS_METADATA)

    async def query_dataset(self, dataset, epsg, geom, buffer, include_guidance, include_quality_measurement, context):
        start = time.time()

        data_output = {
            'runAlgorithm': ['set input_geometry'],
            'resultStatus': 'NO-HIT-GREEN'
        }

        dataset_type = common.get_dataset_type(dataset)

        if dataset_type == 'wfs':
            gml = wfs.get_input_geometry(
                geom, epsg, buffer, data_output)
            await wfs.run_queries(dataset, gml, epsg, data_output)

        elif dataset_type == 'arcgis':
            arcgis_geom = arcgis.get_input_geometry(
                geom, epsg, buffer, data_output)
            await arcgis.run_queries(dataset, arcgis_geom, epsg, data_output)

        elif dataset_type == 'ogc_api':
            wkt_geom = ogc_api.get_input_geometry(
                geom, epsg, buffer, data_output)
            await ogc_api.run_queries(dataset, wkt_geom, epsg, data_output)

        common.set_geometry_areas(data_output)

        distance_to_object = 0

        if data_output['resultStatus'] == 'NO-HIT-GREEN':
            if dataset_type == 'wfs':
                distance_to_object = await wfs.get_shortest_distance(
                    dataset, geom, epsg, data_output)
            elif dataset_type == 'arcgis':
                distance_to_object = await arcgis.get_shortest_distance(
                    dataset, geom, epsg, data_output)
            elif dataset_type == 'ogc_api':
                distance_to_object = await ogc_api.get_shortest_distance(
                    dataset, geom, epsg, data_output)                

        data_output['runAlgorithm'].append('deliver result')

        coord_precision = 6 if epsg == 4326 else 2

        run_on_input_geometry = json.loads(
            data_output['runOnInputGeometry'].ExportToJson([f'COORDINATE_PRECISION={coord_precision}']))

        common.add_geojson_crs(run_on_input_geometry, epsg)

        result = {
            'runAlgorithm': data_output['runAlgorithm'],
            'buffer': buffer,
            'runOnInputGeometry': run_on_input_geometry,
            'inputGeometryArea': data_output.get('inputGeometryArea'),
            'hitArea': data_output.get('hitArea'),
            'resultStatus': data_output['resultStatus'],
            'distanceToObject': distance_to_object,
            'rasterResult': data_output.get('rasterResult'),
            'cartography': data_output.get('cartography'),
            'data': data_output.get('data'),
            'themes': common.get_dataset_themes(dataset)
        }

        if data_output['geolett'] is not None:
            url_metadata = data_output['geolett']['datasett']['urlMetadata']
            metadata_id = url_metadata.rsplit('/', 1)[-1]
            dataset_info = await common.get_kartkatalog_metadata(metadata_id)
            result['runOnDataset'] = dataset_info

        if distance_to_object >= 20000 and context != 'byggesak':
            result['resultStatus'] = 'NO-HIT-YELLOW'

        result['title'] = common.get_dataset_title(data_output, dataset)

        if include_guidance and data_output['geolett'] is not None:
            common.set_guidance_data(data_output['geolett'], result)

        if include_quality_measurement:
            common.set_quality_measurement(result)

        end = time.time()

        print(f'"{dataset}": {round(end - start, 2)} sek.')

        return result

    async def query(self, data, datasets):
        geo_json = data.get('inputGeometry')
        geom = ogr.CreateGeometryFromJson(str(geo_json))
        epsg = common.get_epsg(geo_json)

        context = data.get('context', None)

        buffer = data.get('requestedBuffer', 0)
        include_guidance = data.get('includeGuidance', False)
        include_quality_measurement = data.get(
            'includeQualityMeasurement', False)

        input_geometry = geo_json
        common.add_geojson_crs(input_geometry, epsg)

        response = {
            'inputGeometry': input_geometry,
            'report': None,
            'resultList': [],
        }

        tasks = []

        async with asyncio.TaskGroup() as tg:
            for dataset in datasets:
                tasks.append(tg.create_task(self.query_dataset(
                    dataset, epsg, geom, buffer, include_guidance, include_quality_measurement, context)))

        for task in tasks:
            response['resultList'].append(task.result())

        return response

    async def execute(self, data):
        mimetype = 'application/json'

        if not common.request_is_valid(data):
            raise ProcessorExecuteError('Invalid payload')

        dataset_names = common.get_dataset_names_by_theme(data.get('theme'))

        outputs = await self.query(data, dataset_names)

        return mimetype, outputs

    def __repr__(self):
        return '<DokanalyseProcessor> {}'.format(self.name)
