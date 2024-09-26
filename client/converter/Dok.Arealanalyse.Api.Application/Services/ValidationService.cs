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

            return geometryType == wkbGeometryType.wkbPolygon || geometryType == wkbGeometryType.wkbMultiPolygon;
        }
		catch
		{
            return false;
		}
    }
}
