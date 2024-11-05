from abc import ABC, abstractmethod
from osgeo import ogr
from .result_status import ResultStatus
from ..helpers.analysis import get_kartkatalog_metadata, get_quality_measurement
from ..helpers.geometry import get_buffered_geometry, create_run_on_input_geometry_json

class Analysis(ABC):
    def __init__(self, config, geometry, epsg, orig_epsg, buffer, client):
        self.config = config
        self.geometry = geometry
        self.run_on_input_geometry = None
        self.epsg = epsg
        self.orig_epsg = orig_epsg
        self.geometries = []
        self.geolett = None
        self.title = None
        self.description = None
        self.guidance_text = None
        self.guidance_uri = []
        self.possible_actions = []
        self.quality_measurement = []
        self.buffer = buffer or 0
        self.input_geometry_area = None
        self.run_on_input_geometry_json = None
        self.hit_area = None
        self.distance_to_object = 0
        self.raster_result = None
        self.cartography = None
        self.data = None
        self.themes = None
        self.run_on_dataset = None
        self.run_algorithm = []
        self.result_status = ResultStatus.NO_HIT_GREEN
        self.client = client

    async def run(self, context, include_guidance, include_quality_measurement):
        self.__set_input_geometry()
        await self.run_queries()
        
        if self.result_status == ResultStatus.TIMEOUT or self.result_status == ResultStatus.ERROR:
            return
        
        self.__set_geometry_areas()

        if self.result_status == ResultStatus.NO_HIT_GREEN:
            await self.set_distance_to_object()

        self.add_run_algorithm('deliver result')

        self.run_on_input_geometry_json = create_run_on_input_geometry_json(
            self.run_on_input_geometry, self.epsg, self.orig_epsg)

        self.themes = self.config.get('themes', [])
        self.set_dataset_title()

        dataset_info = await get_kartkatalog_metadata(self.config)
        self.run_on_dataset = dataset_info

        if self.distance_to_object >= 20000 and context != 'byggesak':
            self.result_status = ResultStatus.NO_HIT_YELLOW

        if include_guidance and self.geolett is not None:
            self.__set_guidance_data()

        if include_quality_measurement:
            self.quality_measurement = get_quality_measurement()

    def add_run_algorithm(self, algorithm):
        self.run_algorithm.append(algorithm)

    def set_dataset_title(self):
        if self.geolett:
            self.title = self.geolett['tittel']
        else:
            self.title = self.config.get('title', '<Mangler tittel>')

    def __set_input_geometry(self):
        self.add_run_algorithm('set input_geometry')

        if self.buffer > 0:
            buffered_geom = get_buffered_geometry(
                self.geometry, self.buffer, self.epsg)
            self.add_run_algorithm('add buffer')
            self.run_on_input_geometry = buffered_geom
        else:
            self.run_on_input_geometry = self.geometry.Clone()

    def __set_geometry_areas(self):
        self.input_geometry_area = round(
            self.run_on_input_geometry.GetArea(), 2)

        if len(self.geometries) == 0:
            return

        geom_collection = ogr.Geometry(ogr.wkbGeometryCollection)

        for geometry in self.geometries:
            geom_collection.AddGeometry(geometry)

        intersection = self.run_on_input_geometry.Intersection(geom_collection)

        if intersection is None:
            return

        geom_type = intersection.GetGeometryType()

        if geom_type == ogr.wkbPolygon or geom_type == ogr.wkbMultiPolygon:
            self.hit_area = round(intersection.GetArea(), 2)

    def __set_guidance_data(self):
        if self.result_status != ResultStatus.NO_HIT_GREEN:
            self.description = self.geolett['forklarendeTekst']
            self.guidance_text = self.geolett['dialogtekst']

        for link in self.geolett['lenker']:
            self.guidance_uri.append({
                'href': link['href'],
                'title': link['tittel']
            })

        for line in self.geolett['muligeTiltak'].splitlines():
            self.possible_actions.append(line.lstrip('- '))

    def to_json(self):
        return {
            'title': self.title,
            'runOnInputGeometry': self.run_on_input_geometry_json,
            'buffer': self.buffer,
            'runAlgorithm': self.run_algorithm,
            'inputGeometryArea': self.input_geometry_area,
            'hitArea': self.hit_area,
            'resultStatus': self.result_status,
            'distanceToObject': self.distance_to_object,
            'rasterResult': self.raster_result,
            'cartography': self.cartography,
            'data': self.data,
            'themes': self.themes,
            'runOnDataset': self.run_on_dataset,
            'description': self.description,
            'guidanceText': self.guidance_text,
            'guidanceUri': self.guidance_uri,
            'possibleActions': self.possible_actions,
            'qualityMeasurements': self.quality_measurement
        }

    @abstractmethod
    def get_input_geometry(self):
        pass

    @abstractmethod
    async def run_queries(self):
        pass

    @abstractmethod
    def set_distance_to_object(self):
        pass
