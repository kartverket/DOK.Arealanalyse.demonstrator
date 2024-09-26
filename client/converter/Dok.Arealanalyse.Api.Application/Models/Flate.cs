using GeoJSON.Text.Geometry;
using OSGeo.OGR;
using Dok.Arealanalyse.Api.Application.Utils;
using System.Text.Json;

namespace Dok.Arealanalyse.Api.Application.Models;

public class Flate
{
    private Flate(int sequenceNumber, List<List<int>> refs)
    {
        SequenceNumber = sequenceNumber;
        Refs = refs;
    }

    public int SequenceNumber { get; private set; }
    public List<List<int>> Refs { get; private set; }

    public Geometry GetGeometry(IEnumerable<IKurve> kurveObjects, int? srcEpsg)
    {
        return GeometryHelpers.CreateFlatePolygon(Refs, kurveObjects, srcEpsg);
    }

    public Polygon ToGeoJson(IEnumerable<IKurve> kurveObjects, int? srcEpsg)
    {
        using var geometry = GetGeometry(kurveObjects, srcEpsg);
        using var linearGeometry = geometry.GetLinearGeometry(0, []);
        var coordPrecision = srcEpsg.HasValue ? 6 : 2;
        var json = linearGeometry.ExportToJson([$"COORDINATE_PRECISION={coordPrecision}"]);

        return JsonSerializer.Deserialize<Polygon>(json);
    }

    public static Flate Create(SosiObject sosiObject)
    {
        var refs = SosiHelpers.GetRefs(sosiObject);

        return new Flate(sosiObject.SequenceNumber, refs);
    }
}