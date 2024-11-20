using GeoJSON.Text.Geometry;
using OSGeo.OGR;
using Dok.Arealanalyse.Api.Application.Utils;
using System.Text.Json;
using System.Xml.Linq;
using Dok.Arealanalyse.Api.Application.Models.Api;
using Dok.Arealanalyse.Api.Application.Models;

namespace Dok.Arealanalyse.Api.Application.Services;

public partial class GmlConvertService : IGmlConvertService
{
    private static readonly string[] _gmlGeometryElementNames =
    [
        "MultiPolygon",
        "MultiSurface",
        "Polygon",
        "Surface"
    ];

    public async Task<IGeometryObject> GetOutlineAsync(Payload payload)
    {
        var document = await XDocument.LoadAsync(payload.File, LoadOptions.None, default);
        var epsg = GmlHelpers.GetEpsgFromEnvelope(document);

        if (!epsg.HasValue)
            throw new ConvertException("Kunne ikke konvertere GML-filen");

        var featureMembers = GetFeatureMembers(document);

        var geometries = featureMembers
            .SelectMany(GetSurfaceGeometryElements)
            .Select(GeometryHelpers.CreateFromGML)
            .Where(geometry => geometry != null)
            .ToList();

        using var multiPolygon = new Geometry(wkbGeometryType.wkbMultiPolygon);

        var polygons = GetPolygonsFromGeometries(geometries);

        foreach (var polygon in polygons)
            multiPolygon.AddGeometry(polygon);

        using var union = multiPolygon.UnionCascaded();
        
        if (payload.DestEpsg.HasValue && payload.DestEpsg.Value != epsg.Value)
        {
            using var coordTrans = GeometryHelpers.GetCoordinateTransformation(epsg.Value, payload.DestEpsg.Value);
            union.Transform(coordTrans);
        }

        var outEpsg = payload.DestEpsg ?? epsg.Value;
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

    private static List<XElement> GetFeatureMembers(XDocument document)
    {
        var featureMemberName = GetFeatureMemberName(document);

        return document.Root.Elements()
            .Where(element => element.Name.LocalName == featureMemberName)
            .SelectMany(element => element.Elements())
            .ToList();
    }

    private static List<XElement> GetSurfaceGeometryElements(XElement featureMember)
    {
        return featureMember.Descendants()
            .Where(element => _gmlGeometryElementNames.Contains(element.Name.LocalName) &&
                element.Parent.Name.Namespace != element.Parent.GetNamespaceOfPrefix("gml"))
            .ToList();
    }

    private static string GetFeatureMemberName(XDocument document)
    {
        if (document.Root.Elements().Any(element => element.Name.LocalName == "featureMember"))
            return "featureMember";

        if (document.Root.Elements().Any(element => element.Name.LocalName == "featureMembers"))
            return "featureMembers";

        if (document.Root.Elements().Any(element => element.Name.LocalName == "member"))
            return "member";

        return "featureMember";
    }

    private static List<Geometry> GetPolygonsFromGeometries(List<Geometry> geometries)
    {
        var polygons = new List<Geometry>();

        foreach (var geometry in geometries)
        {
            if (geometry.GetGeometryType() == wkbGeometryType.wkbPolygon)
            {
                polygons.Add(geometry);
            }
            else if (geometry.GetGeometryType() == wkbGeometryType.wkbMultiPolygon)
            {
                var geomCount = geometry.GetGeometryCount();

                for (var i = 0; i < geomCount; i++)
                    polygons.Add(geometry.GetGeometryRef(i));
            }
            else if (geometry.GetGeometryType() == wkbGeometryType.wkbSurface)
            {
                var linearGeometry = geometry.GetLinearGeometry(0, []);
                polygons.Add(linearGeometry);
            }
            else if (geometry.GetGeometryType() == wkbGeometryType.wkbMultiSurface)
            {
                var linearGeometry = geometry.GetLinearGeometry(0, []);
                var geomCount = linearGeometry.GetGeometryCount();

                for (var i = 0; i < geomCount; i++)
                    polygons.Add(linearGeometry.GetGeometryRef(i));
            }
        }

        return polygons;
    }
}
