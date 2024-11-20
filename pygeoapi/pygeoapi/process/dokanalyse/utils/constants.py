import os
from pathlib import Path

DEFAULT_EPSG = 25833
EARTH_RADIUS = 6371008.8
WGS84_EPSG = 4326
FILE_SHARE_BASE_DIR = os.environ.get('FILE_SHARE_BASE_DIR', os.path.join(Path.home(), 'dokanalyse'))
AR5_DB_PATH = os.environ.get('AR5_DB_PATH', '/mnt/dokanalyse/filegdb/ar5.gdb')


