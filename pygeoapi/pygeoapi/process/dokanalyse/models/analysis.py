from abc import ABC, abstractmethod
from typing import List
from osgeo import ogr
from .quality_measurement import QualityMeasurement
from .exceptions import DokAnalysisException
from .result_status import ResultStatus
from ..helpers.analysis import get_kartkatalog_metadata
from ..helpers.geometry import get_buffered_geometry, create_run_on_input_geometry_json
from ..config import get_quality_indicators_config
from ..services.quality_warning import get_dataset_quality_warnings, get_object_quality_warnings, get_coverage_quality
from ..services.quality_measurement import get_quality_measurements


class Analysis(ABC):
    def __init__(self, config: dict, geometry: ogr.Geometry, epsg: int, orig_epsg: int, buffer: int):
        self.config: dict = config
        self.geometry: ogr.Geometry = geometry
        self.run_on_input_geometry: ogr.Geometry = None
        self.epsg: int = epsg
        self.orig_epsg: int = orig_epsg
        self.geometries: List[ogr.Geometry] = []
        self.geolett: dict = None
        self.title: str = None
        self.description: str = None
        self.guidance_text: str = None
        self.guidance_uri: List[dict] = []
        self.possible_actions: List[str] = []
        self.quality_measurement: List[QualityMeasurement] = []
        self.quality_warning: List[str] = []
        self.buffer: int = buffer or 0
        self.input_geometry_area: ogr.Geometry = None
        self.run_on_input_geometry_json: dict = None
        self.hit_area: float = None
        self.distance_to_object: int = 0
        self.raster_result: str = None
        self.cartography: str = None
        self.data: List[dict] = None
        self.themes: List[str] = None
        self.run_on_dataset = None
        self.run_algorithm: List[str] = []
        self.result_status: ResultStatus = ResultStatus.NO_HIT_GREEN
        self.coverage_status: str = None
        self.has_coverage: bool = True

    async def run(self, context, include_guidance, include_quality_measurement) -> None:
        self.__set_input_geometry()

        await self.__run_coverage_analysis()

        if self.has_coverage:
            await self.run_queries()

            if self.result_status == ResultStatus.TIMEOUT or self.result_status == ResultStatus.ERROR:
                await self.__set_default_data()
                return

            self.__set_geometry_areas()
        else:
            self.result_status = ResultStatus.NO_HIT_YELLOW

        if self.result_status in [ResultStatus.NO_HIT_GREEN, ResultStatus.NO_HIT_YELLOW]:
            await self.set_distance_to_object()

        self.add_run_algorithm('deliver result')

        self.run_on_input_geometry_json = create_run_on_input_geometry_json(
            self.run_on_input_geometry, self.epsg, self.orig_epsg)

        await self.__set_default_data()

        if include_guidance and self.geolett is not None:
            self.__set_guidance_data()

        if include_quality_measurement:
            await self.__set_quality_measurement()

        self.__set_quality_warnings(context)

    def add_run_algorithm(self, algorithm) -> None:
        self.run_algorithm.append(algorithm)

    async def __run_coverage_analysis(self) -> None:
        config = get_quality_indicators_config(self.config['dataset_id'])

        if config is None:
            return

        quality_indicators: List[dict] = [
            entry for entry in config if entry['type'] == 'coverage']

        if len(quality_indicators) == 0:
            return
        elif len(quality_indicators) > 1:
            raise DokAnalysisException(
                'A dataset can only have one coverage quality indicator')

        self.add_run_algorithm('check coverage')
        value, warning = await get_coverage_quality(quality_indicators[0], self.run_on_input_geometry, self.epsg)

        self.coverage_status = value
        self.has_coverage = warning == None

        if warning != None:
            self.quality_warning.append(warning)

    def __set_input_geometry(self) -> None:
        self.add_run_algorithm('set input_geometry')

        if self.buffer > 0:
            buffered_geom = get_buffered_geometry(
                self.geometry, self.buffer, self.epsg)
            self.add_run_algorithm('add buffer')
            self.run_on_input_geometry = buffered_geom
        else:
            self.run_on_input_geometry = self.geometry.Clone()

    def __set_geometry_areas(self) -> None:
        self.input_geometry_area = round(
            self.run_on_input_geometry.GetArea(), 2)

        if len(self.geometries) == 0:
            return

        hit_area: float = 0

        for geometry in self.geometries:
            if geometry is None:
                continue
            
            intersection: ogr.Geometry = self.run_on_input_geometry.Intersection(
                geometry)

            if intersection is None:
                continue

            geom_type = intersection.GetGeometryType()

            if geom_type == ogr.wkbPolygon or geom_type == ogr.wkbMultiPolygon:
                hit_area += intersection.GetArea()

        self.hit_area = hit_area

    async def __set_default_data(self) -> None:
        self.title = self.geolett['tittel'] if self.geolett else self.config.get(
            'title')
        self.themes = self.config.get('themes', [])
        self.run_on_dataset = await get_kartkatalog_metadata(self.config)

    def __set_guidance_data(self) -> None:
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

    async def __set_quality_measurement(self) -> None:
        dataset_id = self.config.get('dataset_id')
        self.quality_measurement = await get_quality_measurements(dataset_id, self.coverage_status)

    def __set_quality_warnings(self, context) -> None:
        config = get_quality_indicators_config(self.config['dataset_id'])

        if config is None:
            return

        warnings = []
        warnings.extend(get_object_quality_warnings(config, self.data))
        warnings.extend(get_dataset_quality_warnings(
            config, self.quality_measurement, context=context, themes=self.themes))

        self.quality_warning.extend(warnings)

    def to_json(self) -> dict:
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
            'qualityMeasurement': list(map(lambda item: item.to_json(), self.quality_measurement)),
            'qualityWarning': self.quality_warning
        }

    @abstractmethod
    def get_input_geometry(self) -> str:
        pass

    @abstractmethod
    async def run_queries(self) -> None:
        pass

    @abstractmethod
    def set_distance_to_object(self) -> None:
        pass
