from sys import maxsize
import xml.etree.ElementTree as ET
from osgeo import ogr
from ..analysis import Analysis
from .helpers import create_request_xml, parse_response, get_namespaces
from ...helpers.analysis import get_geolett_data, get_raster_result, get_cartography_url
from ...helpers.geometry import get_buffered_geometry
from ...services.api import query_wfs


class WfsAnalysis(Analysis):
    def __init__(self, config, geometry, epsg, orig_epsg, buffer):
        super().__init__(config, geometry, epsg, orig_epsg, buffer)

    def get_input_geometry(self):
        return self.run_on_input_geometry.ExportToGML(['FORMAT=GML3'])

    async def run_queries(self):
        first_layer = self.config['layers'][0]
        geom_element_name = self.config['geom_element_name']
        gml = self.get_input_geometry()
        geolett_data = await get_geolett_data(first_layer.get('geolett_id', None))

        for layer in self.config['layers']:
            layer_name = layer['wfs']
            request_xml = create_request_xml(
                layer_name, self.epsg, geom_element_name, gml)

            wfs_response = await query_wfs(self.config, request_xml)

            self.add_run_algorithm(f'intersect {layer_name}')

            if wfs_response is not None:
                response = parse_response(self.config, wfs_response, layer)

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

    async def set_distance_to_object(self):
        buffered_geom = get_buffered_geometry(self.geometry, 20000, self.epsg)
        gml = buffered_geom.ExportToGML(['FORMAT=GML3'])
        layer = self.config['layers'][0]
        request_xml = create_request_xml(
            layer['wfs'], self.epsg, self.config['geom_element_name'], gml)

        response = await query_wfs(self.config, request_xml)

        if response is None:
            self.distance_to_object = maxsize
            return

        ns = get_namespaces(self.config)
        root = ET.fromstring(response)
        members = root.findall('.//wfs:member/*', namespaces=ns)
        distances = []

        for member in members:
            geom_el = member.find(
                f'./{self.config["geom_element_name"]}/*', namespaces=ns)
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
