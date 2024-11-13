import json
from sys import maxsize
from typing import List
from pydash import get
from osgeo import ogr
from .analysis import Analysis
from .result_status import ResultStatus
from ..helpers.analysis import get_geolett_data, get_raster_result, get_cartography_url
from ..helpers.geometry import get_buffered_geometry, geometry_to_wkt
from ..services.api import query_ogc_api


class OgcApiAnalysis(Analysis):
    def __init__(self, config, geometry, epsg, orig_epsg, buffer):
        super().__init__(config, geometry, epsg, orig_epsg, buffer)

    def get_input_geometry(self) -> str:
        return geometry_to_wkt(self.run_on_input_geometry, self.epsg)

    async def run_queries(self) -> None:
        first_layer = self.config['layers'][0]
        geolett_data = await get_geolett_data(first_layer.get('geolett_id', None))
        wkt_geom = self.get_input_geometry()

        for layer in self.config['layers']:
            layer_id = layer['ogc_api']
            status_code, ogc_api_response = await query_ogc_api(self.config, layer_id, wkt_geom, self.epsg)
            
            if status_code == 408:
                self.result_status = ResultStatus.TIMEOUT
                break
            elif status_code != 200:
                self.result_status = ResultStatus.ERROR
                break
                        
            self.add_run_algorithm(f'intersect layer {layer_id}')

            if ogc_api_response is not None:
                response = self.__parse_response(ogc_api_response)

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
        buffered_geom = get_buffered_geometry(self.geometry, 20000, self.epsg)
        wkt_geom = geometry_to_wkt(buffered_geom, self.epsg)
        layer_id = self.config['layers'][0]['ogc_api']

        _, response = await query_ogc_api(self.config, layer_id, wkt_geom, self.epsg)

        if response is None:
            self.distance_to_object = maxsize
            return

        distances = []

        for feature in response['features']:
            feature_geom = self.__get_geometry_from_response(feature)

            if feature_geom is not None:
                distance = round(self.geometry.Distance(feature_geom))
                distances.append(distance)

        distances.sort()
        self.add_run_algorithm('get distance')

        if len(distances) == 0:
            self.distance_to_object = maxsize
        else:
            self.distance_to_object = distances[0]

    def __parse_response(self, ogc_api_response) -> dict[str, List]:
        data = {
            'properties': [],
            'geometries': []
        }

        for feature in ogc_api_response['features']:
            data['properties'].append(self.__map_properties(
                feature, self.config['properties']))
            data['geometries'].append(
                self.__get_geometry_from_response(feature))

        return data

    def __map_properties(self, feature, mappings) -> dict:
        properties = {}

        for mapping in mappings:
            key = mapping.split('.')[-1]
            value = get(feature['properties'], mapping, None)
            properties[key] = value

        return properties

    def __get_geometry_from_response(self, feature) -> ogr.Geometry:
        try:
            geojson = json.dumps(feature['geometry'])
            return ogr.CreateGeometryFromJson(geojson)
        except:
            return None
