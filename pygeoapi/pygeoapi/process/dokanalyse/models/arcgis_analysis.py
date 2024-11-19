from sys import maxsize
import json
from typing import List
from osgeo import ogr
from .analysis import Analysis
from .result_status import ResultStatus
from ..helpers.analysis import get_geolett_data, get_raster_result, get_cartography_url
from ..helpers.geometry import create_buffered_geometry, geometry_from_json
from ..http_clients.arcgis import query_arcgis


class ArcGisAnalysis(Analysis):
    def __init__(self, config, geometry, epsg, orig_epsg, buffer):
        super().__init__(config, geometry, epsg, orig_epsg, buffer)

    async def run_queries(self) -> None:
        first_layer = self.config['layers'][0]
        geolett_data = await get_geolett_data(first_layer.get('geolett_id', None))

        for layer in self.config['layers']:
            layer_name = layer['arcgis']
            filter = layer.get('filter', None)

            if filter is not None:
                self.add_run_algorithm(f'query {filter}')

            status_code, api_response = await query_arcgis(
                self.config['arcgis'], layer_name, filter, self.run_on_input_geometry, self.epsg)

            if status_code == 408:
                self.result_status = ResultStatus.TIMEOUT
                break
            elif status_code != 200:
                self.result_status = ResultStatus.ERROR
                break

            self.add_run_algorithm(f'intersect layer {layer_name}')

            if api_response is not None:
                response = self.__parse_response(api_response)

                if len(response['properties']) > 0:
                    geolett_data = await get_geolett_data(layer.get('geolett_id', None))
                    self.data = response['properties']
                    self.geometries = response['geometries']
                    self.raster_result = get_raster_result(
                        self.config['wms'], layer['wms'])
                    self.cartography = await get_cartography_url(
                        self.config['wms'], layer['wms'])
                    self.result_status = layer['result_status']
                    break

        self.geolett = geolett_data

    async def set_distance_to_object(self) -> None:
        buffered_geom = create_buffered_geometry(self.geometry, 20000, self.epsg)
        layer_name = self.config['layers'][0]['arcgis']
        filter = self.config['layers'][0].get('filter', None)

        _, response = await query_arcgis(self.config['arcgis'], layer_name, filter, buffered_geom, self.epsg)

        if response is None:
            self.distance_to_object = maxsize
            return

        distances = []

        for feature in response['features']:
            feature_geom = self.__get_geometry_from_response(feature)

            if feature_geom is not None:
                distance = round(self.run_on_input_geometry.Distance(feature_geom))
                distances.append(distance)

        distances.sort()
        self.add_run_algorithm('get distance')

        if len(distances) == 0:
            self.distance_to_object = maxsize
        else:
            self.distance_to_object = distances[0]

    def __parse_response(self, arcgis_response: dict) -> dict[str, List]:
        data = {
            'properties': [],
            'geometries': []
        }

        features: List[dict] = arcgis_response.get('features', [])

        for feature in features:
            data['properties'].append(
                self.__map_properties(feature, self.config['properties']))
            data['geometries'].append(
                self.__get_geometry_from_response(feature))

        return data

    def __map_properties(self, feature: dict, mappings: List[str]) -> dict:
        props = {}
        feature_props: dict = feature['properties']

        for mapping in mappings:
            props[mapping] = feature_props.get(mapping)

        return props

    def __get_geometry_from_response(self, feature) -> ogr.Geometry:
        json_str = json.dumps(feature['geometry'])

        return geometry_from_json(json_str)
