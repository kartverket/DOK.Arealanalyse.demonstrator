from sys import maxsize
import json
from osgeo import ogr
from .analysis import Analysis
from .result_status import ResultStatus
from ..helpers.analysis import get_geolett_data, get_raster_result, get_cartography_url, camel_case
from ..helpers.geometry import get_buffered_geometry, geometry_to_arcgis_geom
from ..services.api import query_arcgis


class ArcGisAnalysis(Analysis):
    def __init__(self, config, geometry, epsg, orig_epsg, buffer, client):
        super().__init__(config, geometry, epsg, orig_epsg, buffer, client)

    def get_input_geometry(self):
        return geometry_to_arcgis_geom(self.run_on_input_geometry, self.epsg)

    async def run_queries(self):
        first_layer = self.config['layers'][0]
        geolett_data = await get_geolett_data(first_layer.get('geolett_id', None))
        arcgis_geom = self.get_input_geometry()

        for layer in self.config['layers']:
            layer_id = layer['arcgis']
            type_filter = layer.get('type_filter', None)

            if type_filter is not None:
                self.add_run_algorithm(f'query {type_filter}')

            status_code, arcgis_response = await query_arcgis(self.config, layer_id, type_filter, arcgis_geom, self.epsg, self.client)
            
            if status_code == 408:
                self.result_status = ResultStatus.TIMEOUT
                break
            elif status_code != 200:
                self.result_status = ResultStatus.ERROR
                break
            
            self.add_run_algorithm(f'intersect layer {layer_id}')

            if arcgis_response is not None:
                response = self.__parse_response(arcgis_response)

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

    async def set_distance_to_object(self):
        buffered_geom = get_buffered_geometry(self.geometry, 20000, self.epsg)
        arcgis_geom = geometry_to_arcgis_geom(buffered_geom, self.epsg)
        layer_id = self.config['layers'][0]['arcgis']
        type_filter = self.config['layers'][0].get('type_filter', None)

        _, response = await query_arcgis(self.config, layer_id, type_filter, arcgis_geom, self.epsg, self.client)

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

    def __parse_response(self, arcgis_response):
        data = {
            'properties': [],
            'geometries': []
        }

        for feature in arcgis_response['features']:
            data['properties'].append(
                self.__map_properties(feature, self.config['properties']))
            data['geometries'].append(
                self.__get_geometry_from_response(feature))

        return data

    def __map_properties(self, feature, mappings):
        properties = {}

        for mapping in mappings:
            properties[camel_case(mapping)] = feature['properties'].get(
                mapping, None)

        return properties

    def __get_geometry_from_response(self, feature):
        try:
            geojson = json.dumps(feature['geometry'])
            return ogr.CreateGeometryFromJson(geojson)
        except:
            return None
