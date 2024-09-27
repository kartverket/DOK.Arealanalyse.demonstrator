namespace Dok.Arealanalyse.Api.Web.Services;

public interface IMultipartRequestService
{
    Task<T> ReadFromMultipartAsync<T>() where T : new();
    Task<Dictionary<string, dynamic>> ReadFromMultipartAsync();
}
