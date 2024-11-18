using Dok.Arealanalyse.Api.Application.Models;
using Dok.Arealanalyse.Api.Application.Models.Settings;
using Microsoft.Extensions.Configuration;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace Dok.Arealanalyse.Api.Application.Services;

public class GeoJsonSampleService : IGeoJsonSampleService
{
    private static readonly string _jsonFilesPath = GetGeoJsonFilesPath();
    private static readonly JsonSerializerOptions _jsonSerializerOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    public async Task<List<GeoJsonSample>> GetSamplesAsync()
    {
        var settings = await ReadJsonFileAsync<List<GeoJsonSampleSetting>>("config.json");
        var samples = new List<GeoJsonSample>();

        foreach (var setting in settings)
        {
            samples.Add(new GeoJsonSample
            {
                Name = setting.Name,
                Description = setting.Description,
                FileName = setting.FileName,
                GeoJson = await ReadJsonFileAsync<JsonNode>(setting.FileName)
            });
        }

        return [.. samples.OrderBy(sample => sample.Name)];
    }

    private static async Task<T> ReadJsonFileAsync<T>(string fileName)
        where T : class
    {
        var path = Path.Combine(_jsonFilesPath, fileName);
        var json = await File.ReadAllTextAsync(path);

        return JsonSerializer.Deserialize<T>(json, _jsonSerializerOptions);
    }

    private static string GetGeoJsonFilesPath()
    {
        return Path.Combine(Path.GetDirectoryName(Assembly.GetEntryAssembly().Location), "Resources", "GeoJson");
    }
}
