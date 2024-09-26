using Dok.Arealanalyse.Api.Application.Models;
using Dok.Arealanalyse.Api.Application.Models.Settings;
using Microsoft.Extensions.Configuration;
using System.Reflection;
using System.Text.Json.Nodes;

namespace Dok.Arealanalyse.Api.Application.Services;

public class GeoJsonSampleService(
    IConfiguration configuration) : IGeoJsonSampleService
{
    private static readonly string _jsonFilesPath = GetGeoJsonFilesPath();

    public async Task<List<GeoJsonSample>> GetSamplesAsync()
    {
        var settings = configuration
            .GetSection(GeoJsonSampleSetting.SectionName)
            .Get<List<GeoJsonSampleSetting>>();

        var samples = new List<GeoJsonSample>();

        foreach (var setting in settings)
        {
            samples.Add(new GeoJsonSample
            {
                Name = setting.Name,
                Description = setting.Description,
                FileName = setting.FileName,
                GeoJson = await ReadGeoJsonFileAsync(setting.FileName)
            });
        }

        return [.. samples.OrderBy(sample => sample.Name)];
    }

    private static async Task<JsonNode> ReadGeoJsonFileAsync(string fileName)
    {
        var path = Path.Combine(_jsonFilesPath, fileName);
        var json = await File.ReadAllTextAsync(path);

        return JsonNode.Parse(json);
    }

    private static string GetGeoJsonFilesPath()
    {
        return Path.Combine(Path.GetDirectoryName(Assembly.GetEntryAssembly().Location), "Resources", "GeoJson");
    }
}
