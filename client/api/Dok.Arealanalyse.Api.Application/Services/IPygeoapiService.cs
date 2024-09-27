using System.Text.Json.Nodes;

namespace Dok.Arealanalyse.Api.Application.Services;

public interface IPygeoapiService
{
    Task<JsonNode> ExecuteAsync(JsonNode payload);
}
