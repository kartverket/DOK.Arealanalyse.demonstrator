from typing import List
from osgeo import ogr
from .analysis import Analysis
from ..helpers.geometry import add_geojson_crs, get_buffered_geometry


class Response():
    result_list: List[Analysis]

    def __init__(self, input_geometry: dict, input_geometry_area: float, municipality_number: str, municipality_name: str):
        self.input_geometry = input_geometry
        self.input_geometry_area = input_geometry_area
        self.municipality_number = municipality_number
        self.municipality_name = municipality_name
        self.result_list = []
        self.report = None

    def to_json(self):
        result_list = list(
            map(lambda analysis: analysis.to_json(), self.result_list))

        return {
            'inputGeometry': self.input_geometry,
            'inputGeometryArea': self.input_geometry_area,
            'municipalityNumber': self.municipality_number,
            'municipalityName': self.municipality_name,
            'resultList': result_list,
            'report': self.report
        }

    @classmethod
    def create(cls, geo_json: dict, geometry: ogr.Geometry, epsg: int, orig_epsg: int, buffer: int, municipality_number: str, municipality_name: str):
        add_geojson_crs(geo_json, orig_epsg)

        if buffer > 0:
            buffered_geom = get_buffered_geometry(geometry, buffer, epsg)
            geometry_area = round(buffered_geom.GetArea(), 2)
        else:
            geometry_area = round(geometry.GetArea(), 2)

        return Response(geo_json, geometry_area, municipality_number, municipality_name)
