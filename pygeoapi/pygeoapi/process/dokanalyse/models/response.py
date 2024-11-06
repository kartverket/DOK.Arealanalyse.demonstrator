from typing import List
from .analysis import Analysis
from ..helpers.geometry import add_geojson_crs

class Response():
    result_list: List[Analysis]
    
    def __init__(self, input_geometry, epsg: int):
        add_geojson_crs(input_geometry, epsg)
        self.input_geometry = input_geometry
        self.result_list = []
        self.report = None
        
    def to_json(self):
        result_list = list(map(lambda analysis: analysis.to_json(), self.result_list))
        
        return {
            'inputGeometry': self.input_geometry,
            'resultList': result_list,
            'report': self.report
        }
    