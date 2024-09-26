using Microsoft.AspNetCore.Mvc;

namespace Dok.Arealanalyse.Api.Controllers;

public abstract class BaseController(
    ILogger<BaseController> logger) : ControllerBase
{
    protected IActionResult HandleException(Exception exception)
    {
        logger.LogError("{exception}", exception.ToString());

        return exception switch
        {
            Exception => StatusCode(StatusCodes.Status500InternalServerError),
            _ => null,
        };
    }
}
