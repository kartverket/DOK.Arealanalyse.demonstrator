using GeoJSON.Text;
using GeoJSON.Text.CoordinateReferenceSystem;
using OSGeo.OGR;
using System.Text.Json.Nodes;

namespace Dok.Arealanalyse.Api.Application.Utils;

public class GeoJsonHelpers
{
    public static string RemoveDuplicatePoints(string json, wkbGeometryType geometryType)
    {
        if (geometryType != wkbGeometryType.wkbPolygon && geometryType != wkbGeometryType.wkbMultiPolygon)
            return json;

        var jsonNode = JsonNode.Parse(json);
        var coordinates = jsonNode["coordinates"];

        if (geometryType == wkbGeometryType.wkbPolygon)
            RemoveDuplicatePointsFromPolygon(coordinates);
        else if (geometryType == wkbGeometryType.wkbMultiPolygon)
            RemoveDuplicatePointsFromMultiPolygon(coordinates);

        return jsonNode.ToJsonString();
    }

    public static int GetCoordinatePrecision(int epsg)
    {
        return epsg == 4326 ? 6 : 2;
    }

    public static void SetCrsName(GeoJSONObject geoJson, int epsg)
    {
        geoJson.CRS = new NamedCRS($"urn:ogc:def:crs:EPSG::{epsg}");
    }

    private static void RemoveDuplicatePointsFromPolygon(JsonNode polygon)
    {
        foreach (var ring in polygon.AsArray())
        {
            var coordinates = ring.AsArray();
            var toRemove = new List<JsonNode>();

            for (int i = 1; i < coordinates.Count; i++)
            {
                var pointA = coordinates[i - 1].AsArray();
                var xA = pointA[0].GetValue<double>();
                var yA = pointA[1].GetValue<double>();

                var pointB = coordinates[i].AsArray();
                var xB = pointB[0].GetValue<double>();
                var yB = pointB[1].GetValue<double>();

                if (xA == xB && yA == yB)
                    toRemove.Add(coordinates[i]);
            }

            foreach (var jsonNode in toRemove)
                coordinates.Remove(jsonNode);
        }
    }

    private static void RemoveDuplicatePointsFromMultiPolygon(JsonNode multiPolygon)
    {
        foreach (var polygon in multiPolygon.AsArray())
            RemoveDuplicatePointsFromPolygon(polygon);
    }
}
