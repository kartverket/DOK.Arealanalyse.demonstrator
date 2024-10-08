using Dok.Arealanalyse.Api.Application.Models.Api;

namespace Dok.Arealanalyse.Api.Application.Services;

public interface IValidationService
{
    Task<ValidationMessage> ValidateAsync(MemoryStream memoryStream);
}
