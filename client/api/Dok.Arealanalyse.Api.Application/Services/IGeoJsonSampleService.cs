using Dok.Arealanalyse.Api.Application.Models;

namespace Dok.Arealanalyse.Api.Application.Services;

public interface IGeoJsonSampleService
{
    Task<List<GeoJsonSample>> GetSamplesAsync();
}
