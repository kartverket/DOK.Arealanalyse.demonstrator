from .analysis import Analysis
from .result_status import ResultStatus
from ..services.kartkatalog import get_kartkatalog_metadata


class EmptyAnalysis(Analysis):
    def __init__(self, dataset_id: str, config: dict, result_status: ResultStatus):
        super().__init__(dataset_id, config, None, None, None, 0)
        self.result_status = result_status

    async def run(self):
        self.title = self.geolett['tittel'] if self.geolett else self.config.get(
            'title')
        self.themes = self.config.get('themes', [])
        self.run_on_dataset = await get_kartkatalog_metadata(self.dataset_id)

    def add_run_algorithm(self):
        raise NotImplementedError

    def run_queries(self):
        return NotImplementedError

    def set_distance_to_object(self):
        return NotImplementedError
