class Response():
    def __init__(self, input_geometry):
        self.input_geometry = input_geometry
        self.result_list = []
        self.report = None
        
    def to_json(self):
        return {
            'inputGeometry': self.input_geometry,
            'resultList': self.result_list,
            'report': self.report
        }
    