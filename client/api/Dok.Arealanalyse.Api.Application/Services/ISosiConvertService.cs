using GeoJSON.Text.Feature;
using GeoJSON.Text.Geometry;
using Dok.Arealanalyse.Api.Application.Models.Api;

namespace Dok.Arealanalyse.Api.Application.Services;

public interface ISosiConvertService
{
    Task<FeatureCollection> GetFeatureCollectionAsync(Payload payload);
    Task<IGeometryObject> GetOutlineAsync(Payload payload);
}
