using GeoJSON.Text.Geometry;
using OSGeo.OGR;
using Dok.Arealanalyse.Api.Application.Utils;
using System.Text.Json;

namespace Dok.Arealanalyse.Api.Application.Models;

public class BueP : IKurve
{
    private BueP(int sequenceNumber, List<SosiPoint> points)
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

        var arc = new Geometry(wkbGeometryType.wkbCircularString);

        foreach (var point in points)
            arc.AddPoint_2D(point.X, point.Y);

        if (srcEpsg.HasValue)
        {
            using var coordTrans = GeometryHelpers.GetCoordinateTransformation(srcEpsg.Value, 4326);
            arc.Transform(coordTrans);
        }

        return arc;
    }

    public LineString ToGeoJson(int? srcEpsg)
    {
        using var geometry = GetGeometry(srcEpsg, false);
        using var linearGeometry = geometry.GetLinearGeometry(0, []);
        var coordPrecision = srcEpsg.HasValue ? 6 : 2;
        var json = linearGeometry.ExportToJson([$"COORDINATE_PRECISION={coordPrecision}"]);

        return JsonSerializer.Deserialize<LineString>(json);
    }

    public static BueP Create(SosiObject sosiObject, int decimalPlaces)
    {
        var points = SosiHelpers.GetPoints(sosiObject, decimalPlaces);

        return new BueP(sosiObject.SequenceNumber, points);
    }
}