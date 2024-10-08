using Dok.Arealanalyse.Api.Application.Models.Api;
using Dok.Arealanalyse.Api.Application.Utils;
using OSGeo.OGR;
using OSGeo.OSR;

namespace Dok.Arealanalyse.Api.Application.Services;

public class ValidationService : IValidationService
{
    private const int MaxEnvelopeExtent = 20_000;
    private const int MaxAreaSize = 50_000_000;

    public async Task<ValidationMessage> ValidateAsync(MemoryStream memoryStream)
    {
        try
		{
            using var reader = new StreamReader(memoryStream);
            var jsonString = await reader.ReadToEndAsync();
            using var geometry = Ogr.CreateGeometryFromJson(jsonString);

            if (geometry == null || !geometry.IsValid())
                return new ValidationMessage(false, "Geometrien i analyseområdet er ugyldig");

            var geometryType = geometry.GetGeometryType();

            if (geometryType != wkbGeometryType.wkbPolygon && geometryType != wkbGeometryType.wkbMultiPolygon)
                return new ValidationMessage(false, "Geometrien må være et (multi)polygon");

            using var spatialReference = geometry.GetSpatialReference();

            if (!IsMetric(spatialReference))
            {
                var epsg = GetEpsg(spatialReference);
                using var coordTrans = GeometryHelpers.GetCoordinateTransformation(epsg, 25832);
                geometry.Transform(coordTrans);
            }

            var distance = GetEnvelopeExtent(geometry);

            if (distance > MaxEnvelopeExtent)
                return new ValidationMessage(false, "Analyseområdets utstrekning er for stor");

            var area = geometry.GetArea();

            if (area > MaxAreaSize)
                return new ValidationMessage(false, "Analyseområdet er for stort");

            return new ValidationMessage(true);
        }
		catch
		{
            return new ValidationMessage(false, "Kunne ikke validere geometrien. En ukjent feil har oppstått");
		}
    }

    private static double GetEnvelopeExtent(Geometry geometry)
    {
        using var envelope = new Envelope();
        geometry.GetEnvelope(envelope);

        using var pointA = new Geometry(wkbGeometryType.wkbPoint);
        pointA.AddPoint_2D(envelope.MinX, envelope.MinY);

        using var pointB = new Geometry(wkbGeometryType.wkbPoint);
        pointB.AddPoint_2D(envelope.MaxX, envelope.MaxY);

        return pointA.Distance(pointB);
    }

    private static int GetEpsg(SpatialReference spatialReference)
    {
        var epsgStr = spatialReference.GetAuthorityCode(null);

        return int.Parse(epsgStr);
    }

    private static bool IsMetric(SpatialReference spatialReference)
    {
        return spatialReference.GetLinearUnitsName() == "metre";
    }
}
