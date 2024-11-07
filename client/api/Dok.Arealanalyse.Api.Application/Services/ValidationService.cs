using OSGeo.OGR;

namespace Dok.Arealanalyse.Api.Application.Services;

public class ValidationService : IValidationService
{
    public async Task<bool> ValidateAsync(MemoryStream memoryStream)
    {
        try
		{
            using var reader = new StreamReader(memoryStream);
            var jsonString = await reader.ReadToEndAsync();
            using var geometry = Ogr.CreateGeometryFromJson(jsonString);

            if (geometry == null || !geometry.IsValid())
                return false;

            var geometryType = geometry.GetGeometryType();

            if (geometryType != wkbGeometryType.wkbPolygon && geometryType != wkbGeometryType.wkbMultiPolygon)
                return false;

            var epsg = GetEpsgCode(geometry);

            if (epsg != 4326)
                return true;

            return HasValidPoints(geometry);
        }
		catch
		{
            return false;
		}
    }

    private static int GetEpsgCode(Geometry geometry)
    {
        using var spatialReference = geometry.GetSpatialReference();
        var epsgStr = spatialReference.GetAuthorityCode(null);

        return int.TryParse(epsgStr, out var epsg) ? epsg : 4326;
    }

    private static bool HasValidPoints(Geometry geometry)
    {
        var geometryType = geometry.GetGeometryType();
        List<double[]> points = null;

        if (geometryType == wkbGeometryType.wkbPolygon)
            points = GetPointsFromPolygon(geometry);
        else if (geometryType == wkbGeometryType.wkbMultiPolygon)
            points = GetPointsFromMultiPolygon(geometry);

        if (points == null)
            return false;

        return points
            .All(point => point[0] >= -180 && point[0] <= 180 && point[1] >= -90 && point[1] <= 90);
    }

    private static List<double[]> GetPointsFromPolygon(Geometry polygon)
    {
        var points = new List<double[]>();

        for (var i = 0; i < polygon.GetGeometryCount(); i++)
        {
            using var ring = polygon.GetGeometryRef(i);

            for (int j = 0; j < ring.GetPointCount(); j++)
            {
                var point = new double[2];

                ring.GetPoint_2D(j, point);
                points.Add(point);
            }            
        }

        return points;
    }

    private static List<double[]> GetPointsFromMultiPolygon(Geometry multiPolygon)
    {
        var points = new List<double[]>();

        for (var i = 0; i < multiPolygon.GetGeometryCount(); i++)
        {
            using var polygon = multiPolygon.GetGeometryRef(i);
            var polygonPoints = GetPointsFromPolygon(polygon);

            points.AddRange(polygonPoints);
        }

        return points;
    }
}
