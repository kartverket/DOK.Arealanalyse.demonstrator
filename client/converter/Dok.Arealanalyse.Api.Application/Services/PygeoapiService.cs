using Dok.Arealanalyse.Api.Application.Models.Settings;
using Microsoft.Extensions.Options;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json.Nodes;

namespace Dok.Arealanalyse.Api.Application.Services;

public class PygeoapiService(
    HttpClient httpClient,
    IOptions<PygeoapiSettings> options) : IPygeoapiService
{
    public async Task<JsonNode> ExecuteAsync(JsonNode payload)
    {
        using var content = new StringContent(payload.ToJsonString(), Encoding.UTF8, "application/json");

        try
        {
            using var response = await httpClient.PostAsync(options.Value.ApiUrl, content);

            response.EnsureSuccessStatusCode();

            return await response.Content.ReadFromJsonAsync<JsonNode>();
        }
        catch (Exception)
        {
            throw;
        }
    }
}
