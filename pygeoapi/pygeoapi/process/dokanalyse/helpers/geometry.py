import json
from osgeo import ogr, osr
from math import pi
from re import search
from shapely import wkt
from shapely.wkt import dumps

EARTH_RADIUS = 6371008.8


def create_input_geometry(geo_json):
    epsg = get_epsg(geo_json)
    geom = ogr.CreateGeometryFromJson(str(geo_json))

    if epsg == 4326:
        transd = transform_geometry(geom, 4326, 25833)
        return transd, 25833

    return geom, epsg


def get_buffered_geometry(geom, distance, epsg):
    computed_buffer = length_to_degrees(
        distance) if epsg is None or epsg == 4326 else distance

    return geom.Buffer(computed_buffer, 10)


def transform_geometry(geom, src_epsg, dest_epsg):
    source = osr.SpatialReference()
    source.ImportFromEPSG(src_epsg)
    source.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)

    target = osr.SpatialReference()
    target.ImportFromEPSG(dest_epsg)

    transform = osr.CoordinateTransformation(source, target)
    clone = geom.Clone()
    clone.Transform(transform)

    return clone


def length_to_degrees(distance):
    radians = distance / EARTH_RADIUS
    degrees = radians % (2 * pi)

    return degrees * 180 / pi


def geometry_to_wkt(geometry, epsg):
    wkt_str = geometry.ExportToWkt()
    geometry = wkt.loads(wkt_str)
    coord_precision = 6 if epsg == 4326 else 2

    return dumps(geometry, trim=True, rounding_precision=coord_precision)


def geometry_to_arcgis_geom(geometry, epsg):
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


def create_run_on_input_geometry_json(geom, epsg, orig_epsg):
    geometry = geom

    if epsg != orig_epsg:
        geometry = transform_geometry(geom, epsg, orig_epsg)

    coord_precision = 6 if orig_epsg == 4326 else 2
    geo_json = json.loads(geometry.ExportToJson(
        [f'COORDINATE_PRECISION={coord_precision}']))
    add_geojson_crs(geo_json, epsg)

    return geo_json


def get_epsg(geo_json):
    crs = geo_json.get('crs', {}).get('properties', {}).get('name')

    if crs is None:
        return 4326

    regex = r'^(http:\/\/www\.opengis\.net\/def\/crs\/EPSG\/0\/|^urn:ogc:def:crs:EPSG::|^EPSG:)(?P<epsg>\d+)$'
    matches = search(regex, crs)

    if matches:
        return int(matches.group('epsg'))

    return 4326


def add_geojson_crs(geojson, epsg):
    if epsg is None or epsg == 4326:
        return

    geojson['crs'] = {
        'type': 'name',
        'properties': {
            'name': 'urn:ogc:def:crs:EPSG::' + str(epsg)
        }
    }
