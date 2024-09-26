using System.Text.Json.Nodes;

namespace Dok.Arealanalyse.Api.Application.Models;

public class GeoJsonSample
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string FileName { get; set; }
    public JsonNode GeoJson { get; set; }
}
