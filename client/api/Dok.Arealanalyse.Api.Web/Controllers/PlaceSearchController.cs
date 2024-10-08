using Dok.Arealanalyse.Api.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace Dok.Arealanalyse.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlaceSearchController(
    IPlaceSearchHttpClient placeSearchHttpClient,
    ILogger<PlaceSearchController> logger) : BaseController(logger)
{
    [HttpGet("{searchString}")]
    [ResponseCache(VaryByQueryKeys = ["*"], Duration = 86400)]
    public async Task<IActionResult> Search(string searchString)
    {
        try
        {
            var result = await placeSearchHttpClient.SearchAsync(searchString);

            return Ok(result);
        }
        catch (Exception ex)
        {
            var result = HandleException(ex);

            if (result != null)
                return result;

            throw;
        }
    }
}
