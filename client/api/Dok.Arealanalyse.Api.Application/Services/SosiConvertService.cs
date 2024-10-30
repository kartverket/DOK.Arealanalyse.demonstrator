using GeoJSON.Text.Feature;
using GeoJSON.Text.Geometry;
using OSGeo.OGR;
using Dok.Arealanalyse.Api.Application.Models;
using Dok.Arealanalyse.Api.Application.Utils;
using System.Text.Json;
using Feature = GeoJSON.Text.Feature.Feature;
using Dok.Arealanalyse.Api.Application.Models.Api;

namespace Dok.Arealanalyse.Api.Application.Services;

public class SosiConvertService : ISosiConvertService
{
    public async Task<FeatureCollection> GetFeatureCollectionAsync(Payload payload)
    {
        var sosiObjects = await SosiHelpers.ReadSosiFileAsync(payload.File);
        var hode = SosiHelpers.GetHode(sosiObjects);
        var kurver = SosiHelpers.GetKurver(sosiObjects, hode.DecimalPlaces);
        var buer = SosiHelpers.GetBuer(sosiObjects, hode.DecimalPlaces);
        var flater = SosiHelpers.GetFlater(sosiObjects);

        var kurveObjects = new List<IKurve>();
        kurveObjects.AddRange(kurver);
        kurveObjects.AddRange(buer);

        var features = new List<Feature>();

        foreach (var kurve in kurver)
        {
            var geometry = kurve.ToGeoJson(hode.EPSG, payload.DestEpsg);
            var feature = new Feature(geometry);

            features.Add(feature);
        }

        foreach (var bue in buer)
        {
            var geometry = bue.ToGeoJson(hode.EPSG, payload.DestEpsg);
            var feature = new Feature(geometry);

            features.Add(feature);
        }

        foreach (var flate in flater)
        {
            var geometry = flate.ToGeoJson(kurveObjects, hode.EPSG, payload.DestEpsg);
            var feature = new Feature(geometry);

            features.Add(feature);
        }

        var featureCollection = new FeatureCollection(features);

        if (!payload.DestEpsg.HasValue)
            GeoJsonHelpers.SetCrsName(featureCollection, hode.EPSG);

        return featureCollection;
    }

    public async Task<IGeometryObject> GetOutlineAsync(Payload payload)
    {
        var sosiObjects = await SosiHelpers.ReadSosiFileAsync(payload.File);
        var hode = SosiHelpers.GetHode(sosiObjects);
        var kurver = SosiHelpers.GetKurver(sosiObjects, hode.DecimalPlaces);
        var buer = SosiHelpers.GetBuer(sosiObjects, hode.DecimalPlaces);
        var flater = SosiHelpers.GetFlater(sosiObjects);

        var kurveObjects = new List<IKurve>();
        kurveObjects.AddRange(kurver);
        kurveObjects.AddRange(buer);

        using var multiPolygon = new Geometry(wkbGeometryType.wkbMultiPolygon);

        foreach (var flate in flater)
        {
            using var geometry = flate.GetGeometry(kurveObjects, hode.EPSG, payload.DestEpsg);
            using var linearGeometry = geometry.GetLinearGeometry(0, []);

            multiPolygon.AddGeometry(linearGeometry);
        }

        using var union = multiPolygon.UnionCascaded();
        var outEpsg = payload.DestEpsg ?? hode.EPSG;
        var coordPrecision = GeoJsonHelpers.GetCoordinatePrecision(outEpsg);
        var json = union.ExportToJson([$"COORDINATE_PRECISION={coordPrecision}"]);
        var geometryType = union.GetGeometryType();
        var updatedJson = GeoJsonHelpers.RemoveDuplicatePoints(json, geometryType);

        if (outEpsg != 4326)
        {
            if (geometryType == wkbGeometryType.wkbPolygon)
            {
                var geoJson = JsonSerializer.Deserialize<Polygon>(updatedJson);
                GeoJsonHelpers.SetCrsName(geoJson, outEpsg);

                return geoJson;
            }
            else if (geometryType == wkbGeometryType.wkbMultiPolygon)
            {
                var geoJson = JsonSerializer.Deserialize<MultiPolygon>(updatedJson);
                GeoJsonHelpers.SetCrsName(geoJson, outEpsg);

                return geoJson;
            }
        }

        return JsonSerializer.Deserialize<IGeometryObject>(updatedJson);
    }
}
