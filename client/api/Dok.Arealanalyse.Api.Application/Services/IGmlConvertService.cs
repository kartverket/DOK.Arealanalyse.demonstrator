using GeoJSON.Text.Geometry;
using Dok.Arealanalyse.Api.Application.Models.Api;

namespace Dok.Arealanalyse.Api.Application.Services;

public interface IGmlConvertService
{
    Task<IGeometryObject> GetOutlineAsync(Payload payload);
}
