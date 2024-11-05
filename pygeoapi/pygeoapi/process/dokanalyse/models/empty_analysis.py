from .analysis import Analysis
from ..helpers.analysis import get_kartkatalog_metadata


class EmptyAnalysis(Analysis):
    def __init__(self, config, result_status):
        super().__init__(config, None, None, None, 0)
        self.result_status = result_status

    async def _init(self):
        self.set_dataset_title()
        self.themes = self.config.get('themes', [])
        self.run_on_dataset = await get_kartkatalog_metadata(self.config)

    async def run(self):
        raise NotImplementedError

    def add_run_algorithm(self):
        raise NotImplementedError

    def get_input_geometry(self):
        raise NotImplementedError

    def run_queries(self):
        return NotImplementedError

    def set_distance_to_object(self):
        return NotImplementedError
