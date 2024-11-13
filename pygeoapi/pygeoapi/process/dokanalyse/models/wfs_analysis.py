from os import path
from sys import maxsize
from typing import List
import xml.etree.ElementTree as ET
from osgeo import ogr
from .analysis import Analysis
from .result_status import ResultStatus
from ..helpers.analysis import get_geolett_data, get_raster_result, get_cartography_url
from ..helpers.geometry import get_buffered_geometry
from ..services.api import query_wfs

__DIR_PATH = path.dirname(path.realpath(__file__))


class WfsAnalysis(Analysis):
    def __init__(self, config, geometry, epsg, orig_epsg, buffer):
        super().__init__(config, geometry, epsg, orig_epsg, buffer)

    def get_input_geometry(self) -> str:
        return self.run_on_input_geometry.ExportToGML(['FORMAT=GML3'])

    async def run_queries(self) -> None:
        first_layer = self.config['layers'][0]
        gml = self.get_input_geometry()
        geolett_data = await get_geolett_data(first_layer.get('geolett_id', None))

        for layer in self.config['layers']:
            layer_name = layer['wfs']
            request_xml = self.__create_request_xml(layer_name, gml)
            status_code, wfs_response = await query_wfs(self.config, request_xml)
            
            if status_code == 408:
                self.result_status = ResultStatus.TIMEOUT
                break
            elif status_code != 200:
                self.result_status = ResultStatus.ERROR
                break

            self.add_run_algorithm(f'intersect {layer_name}')

            if wfs_response is not None:
                response = self.__parse_response(wfs_response, layer)

                if len(response['properties']) > 0:
                    geolett_data = await get_geolett_data(layer.get('geolett_id', None))

                    self.geometries = response['geometries']
                    self.data = response['properties']
                    self.raster_result = get_raster_result(
                        self.config['wms'], layer['wms'])
                    self.cartography = await get_cartography_url(
                        self.config['wms'], layer['wms'])
                    self.result_status = layer['result_status']
                    break

        self.geolett = geolett_data

    async def set_distance_to_object(self) -> None:
        buffered_geom = get_buffered_geometry(self.geometry, 20000, self.epsg)
        gml = buffered_geom.ExportToGML(['FORMAT=GML3'])
        layer = self.config['layers'][0]
        request_xml = self.__create_request_xml(layer['wfs'], gml)

        _, response = await query_wfs(self.config, request_xml)

        if response is None:
            self.distance_to_object = maxsize
            return

        ns = self.__get_namespaces()
        root = ET.fromstring(response)
        members = root.findall('.//wfs:member/*', namespaces=ns)
        distances = []

        for member in members:
            geom_el = member.find(
                f'./{self.config["geom_field"]}/*', namespaces=ns)
            gml_str = ET.tostring(geom_el, encoding='unicode')
            feature_geom = ogr.CreateGeometryFromGML(gml_str)
            distance = round(self.geometry.Distance(feature_geom))
            distances.append(distance)

        distances.sort()
        self.add_run_algorithm('get distance')

        if len(distances) == 0:
            self.distance_to_object = maxsize
        else:
            self.distance_to_object = distances[0]

    def __create_request_xml(self, layer_name, gml) -> str:
        file_path = path.join(__DIR_PATH, 'wfs_request.xml.txt')

        with open(file_path, 'r') as file:
            file_text = file.read()

        return file_text.format(layerName=layer_name, epsg=self.epsg, geomField=self.config['geom_field'], geometry=gml).encode('utf-8')

    def __parse_response(self, wfs_response, layer) -> dict[str, List]:
        data = {
            'properties': [],
            'geometries': []
        }

        ns = self.__get_namespaces()
        root = ET.fromstring(wfs_response)
        members = root.findall('.//wfs:member/*', namespaces=ns)

        for member in members:
            if self.__filter_member(member, layer, ns):
                data['properties'].append(self.__map_properties(member, ns))
                data['geometries'].append(
                    self.__get_geometry_from_response(member, ns))

        return data

    def __filter_member(self, member, layer, ns) -> bool:
        if 'type_filter' not in layer:
            return True

        attr_element = member.find(
            './/' + layer['type_filter']['attribute'], namespaces=ns)

        if attr_element is None:
            return False

        return attr_element.text == layer['type_filter']['value']

    def __map_properties(self, member, ns) -> dict:
        properties = {}

        for mapping in self.config['properties']:
            element = member.find('.//' + mapping, namespaces=ns)

            if element is not None:
                prop_name = mapping.split(':')[-1]
                properties[prop_name] = element.text

        return properties

    def __get_geometry_from_response(self, member, ns) -> ogr.Geometry:
        selector = './' + self.config['geom_field'] + '/*'
        geom_el = member.find(selector, namespaces=ns)
        gml_str = ET.tostring(geom_el, encoding='unicode')

        try:
            return ogr.CreateGeometryFromGML(gml_str)
        except:
            return None

    def __get_namespaces(self) -> dict:
        return {'wfs': 'http://www.opengis.net/wfs/2.0', 'app': self.config['namespace']}
