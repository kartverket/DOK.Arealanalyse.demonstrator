using GeoJSON.Text.Feature;

namespace Dok.Arealanalyse.Api.Application.Services;

public interface IPlaceSearchHttpClient
{
    Task<FeatureCollection> SearchAsync(string searchString);
}
