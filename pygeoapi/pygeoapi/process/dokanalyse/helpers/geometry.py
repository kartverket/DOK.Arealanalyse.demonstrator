import json
from osgeo import ogr, osr
from math import pi
from re import search
from shapely import wkt
from shapely.wkt import dumps

_EARTH_RADIUS = 6371008.8


def create_input_geometry(geo_json: dict) -> tuple[ogr.Geometry, int]:
    epsg = get_epsg(geo_json)
    geometry = ogr.CreateGeometryFromJson(str(geo_json))

    if epsg == 4326:
        transd = transform_geometry(geometry, 4326, 25833)
        return transd, 25833

    return geometry, epsg


def get_buffered_geometry(geometry, distance, epsg) -> ogr.Geometry:
    computed_buffer = length_to_degrees(
        distance) if epsg is None or epsg == 4326 else distance

    return geometry.Buffer(computed_buffer, 10)


def transform_geometry(geometry: ogr.Geometry, src_epsg: int, dest_epsg: int) -> ogr.Geometry:
    source = osr.SpatialReference()
    source.ImportFromEPSG(src_epsg)
    source.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)

    target = osr.SpatialReference()
    target.ImportFromEPSG(dest_epsg)

    transform = osr.CoordinateTransformation(source, target)
    clone = geometry.Clone()
    clone.Transform(transform)

    return clone


def length_to_degrees(distance: float) -> float:
    radians = distance / _EARTH_RADIUS
    degrees = radians % (2 * pi)

    return degrees * 180 / pi


def geometry_to_wkt(geometry: ogr.Geometry, epsg: int) -> str:
    wkt_str = geometry.ExportToWkt()
    geometry = wkt.loads(wkt_str)
    coord_precision = 6 if epsg == 4326 else 2

    return dumps(geometry, trim=True, rounding_precision=coord_precision)


def geometry_to_arcgis_geom(geometry: ogr.Geometry, epsg: int) -> str:
    if geometry.GetGeometryType() == ogr.wkbMultiPolygon:
        out_geom = ogr.ForceToPolygon(geometry)
    else:
        out_geom = geometry

    coord_precision = 6 if epsg == 4326 else 2
    geojson = out_geom.ExportToJson(
        [f'COORDINATE_PRECISION={coord_precision}'])
    obj = json.loads(geojson)

    arcgis_geom = {
        'rings': obj['coordinates'],
        'spatialReference': {
            'wkid': epsg
        }
    }

    return json.dumps(arcgis_geom)


def create_run_on_input_geometry_json(geometry: ogr.Geometry, epsg: int, orig_epsg: int) -> dict:
    geom = geometry

    if epsg != orig_epsg:
        geom = transform_geometry(geometry, epsg, orig_epsg)

    coord_precision = 6 if orig_epsg == 4326 else 2
    geo_json = json.loads(geom.ExportToJson(
        [f'COORDINATE_PRECISION={coord_precision}']))
    add_geojson_crs(geo_json, epsg)

    return geo_json


def get_epsg(geo_json: dict) -> int:
    crs = geo_json.get('crs', {}).get('properties', {}).get('name')

    if crs is None:
        return 4326

    regex = r'^(http:\/\/www\.opengis\.net\/def\/crs\/EPSG\/0\/|^urn:ogc:def:crs:EPSG::|^EPSG:)(?P<epsg>\d+)$'
    matches = search(regex, crs)

    if matches:
        return int(matches.group('epsg'))

    return 4326


def add_geojson_crs(geojson: dict, epsg: int) -> None:
    if epsg is None or epsg == 4326:
        return

    geojson['crs'] = {
        'type': 'name',
        'properties': {
            'name': 'urn:ogc:def:crs:EPSG::' + str(epsg)
        }
    }
