from uvicorn.workers import UvicornWorker

class PygeoapiWorker(UvicornWorker):
    CONFIG_KWARGS = {'loop': 'asyncio'}