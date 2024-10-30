using OSGeo.OGR;
using OSGeo.OSR;
using Dok.Arealanalyse.Api.Application.Models;
using System.Xml.Linq;

namespace Dok.Arealanalyse.Api.Application.Utils;

public class GeometryHelpers
{
    public static CoordinateTransformation GetCoordinateTransformation(int srcEpsg, int destEpsg)
    {
        using var srcSr = new SpatialReference(null);
        srcSr.SetAxisMappingStrategy(AxisMappingStrategy.OAMS_TRADITIONAL_GIS_ORDER);
        srcSr.ImportFromEPSG(srcEpsg);

        using var destSr = new SpatialReference(null);
        destSr.SetAxisMappingStrategy(AxisMappingStrategy.OAMS_TRADITIONAL_GIS_ORDER);
        destSr.ImportFromEPSG(destEpsg);

        return new CoordinateTransformation(srcSr, destSr);
    }

    public static Geometry CreateFromGML(XElement geomElement)
    {
        try
        {
            return Geometry.CreateFromGML(geomElement.ToString());
        }
        catch
        {
            return null;
        }
    }

    public static Geometry CreateFlatePolygon(List<List<int>> Refs, IEnumerable<IKurve> kurveObjects, int srcEpsg, int? destEpsg)
    {
        var exterior = Refs.First();
        var polygon = new Geometry(wkbGeometryType.wkbCurvePolygon);
        using var exteriorRing = CreateRing(kurveObjects, exterior, srcEpsg, destEpsg);

        polygon.AddGeometry(exteriorRing);

        foreach (var refs in Refs.Skip(1))
        {
            using var interiorRing = CreateRing(kurveObjects, refs, srcEpsg, destEpsg);

            polygon.AddGeometry(interiorRing);
        }

        return polygon;
    }

    private static Geometry CreateRing(IEnumerable<IKurve> kurveObjects, List<int> refs, int srcEpsg, int? destEpsg)
    {
        var ring = new Geometry(wkbGeometryType.wkbCompoundCurve);

        foreach (var sequenceNumber in refs)
        {
            var reverse = false;
            var sn = sequenceNumber;

            if (sequenceNumber < 0)
            {
                reverse = true;
                sn = sequenceNumber * -1;
            }

            var kurveObject = kurveObjects
                .Single(sosiObject => sosiObject.SequenceNumber == sn);

            using var kurveGeometry = kurveObject.GetGeometry(srcEpsg, destEpsg, reverse);

            ring.AddGeometry(kurveGeometry);
        }

        return ring;
    }
}
