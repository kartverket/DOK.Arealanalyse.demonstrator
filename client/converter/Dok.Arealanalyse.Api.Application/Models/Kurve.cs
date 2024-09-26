using GeoJSON.Text.Geometry;
using OSGeo.OGR;
using Dok.Arealanalyse.Api.Application.Utils;
using System.Text.Json;

namespace Dok.Arealanalyse.Api.Application.Models;

public class Kurve : IKurve
{
    private Kurve(int sequenceNumber, List<SosiPoint> points)
    {
        SequenceNumber = sequenceNumber;
        Points = points;
    }

    public int SequenceNumber { get; set; }
    public List<SosiPoint> Points { get; private set; }

    public Geometry GetGeometry(int? srcEpsg, bool reverse = false)
    {
        var points = reverse ?
            Enumerable.Reverse(Points).ToList() :
            Points;

        var lineString = new Geometry(wkbGeometryType.wkbLineString);

        foreach (var point in points)
            lineString.AddPoint_2D(point.X, point.Y);

        if (srcEpsg.HasValue)
        {
            using var coordTrans = GeometryHelpers.GetCoordinateTransformation(srcEpsg.Value, 4326);
            lineString.Transform(coordTrans);
        }

        return lineString;
    }

    public LineString ToGeoJson(int? srcEpsg)
    {
        using var geometry = GetGeometry(srcEpsg, false);
        var coordPrecision = srcEpsg.HasValue ? 6 : 2;
        var json = geometry.ExportToJson([$"COORDINATE_PRECISION={coordPrecision}"]);

        return JsonSerializer.Deserialize<LineString>(json);
    }

    public static Kurve Create(SosiObject sosiObject, int decimalPlaces)
    {
        var points = SosiHelpers.GetPoints(sosiObject, decimalPlaces);

        return new Kurve(sosiObject.SequenceNumber, points);
    }
}