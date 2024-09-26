using GeoJSON.Text.Geometry;

namespace Dok.Arealanalyse.Api.Application.Services;

public interface IValidationService
{
    Task<bool> ValidateAsync(MemoryStream memoryStream);
}
