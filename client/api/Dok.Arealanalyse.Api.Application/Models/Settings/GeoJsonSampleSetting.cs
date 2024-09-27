namespace Dok.Arealanalyse.Api.Application.Models.Settings;

public class GeoJsonSampleSetting
{
    public static readonly string SectionName = "GeoJsonSamples";
    public string Name { get; set; }
    public string Description { get; set; }
    public string FileName { get; set; }
}
