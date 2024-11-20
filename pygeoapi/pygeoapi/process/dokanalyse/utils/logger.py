import logging
from os import path
from logging.handlers import TimedRotatingFileHandler
from .constants import FILE_SHARE_BASE_DIR


def setup_logger() -> None:
    filename = path.join(FILE_SHARE_BASE_DIR, 'logs/dokanalyse.log')

    handler = TimedRotatingFileHandler(
        filename, when='midnight', backupCount=30)
    
    log_format = \
        '[%(asctime)s] {%(pathname)s:%(lineno)d} %(levelname)s - %(message)s'
    
    handler.setFormatter(logging.Formatter(log_format))
    handler.namer = lambda name: name.replace('.log', '') + '.log'
    handler.setLevel(logging.WARNING)

    logging.root.addHandler(handler)
