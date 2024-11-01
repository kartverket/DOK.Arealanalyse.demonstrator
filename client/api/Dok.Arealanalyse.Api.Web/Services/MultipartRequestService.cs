using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Primitives;
using Microsoft.Net.Http.Headers;
using System.Text;

namespace Dok.Arealanalyse.Api.Web.Services;

public class MultipartRequestService(
    IHttpContextAccessor httpContextAccessor,
    ILogger<MultipartRequestService> logger) : IMultipartRequestService
{
    public async Task<T> ReadFromMultipartAsync<T>()
        where T : new()
    {
        var formData = await ReadFromMultipartAsync();

        return CreateInstance<T>(formData);
    }

    public async Task<Dictionary<string, dynamic>> ReadFromMultipartAsync()
    {
        var request = httpContextAccessor.HttpContext.Request;
        var reader = new MultipartReader(request.GetMultipartBoundary(), request.Body);
        var formAccumulator = new KeyValueAccumulator();
        var formData = new Dictionary<string, dynamic>();
        MultipartSection section;

        try
        {
            while ((section = await reader.ReadNextSectionAsync()) != null)
            {
                if (!ContentDispositionHeaderValue.TryParse(section.ContentDisposition, out var contentDisposition))
                    continue;

                var name = contentDisposition.Name.Value.ToLower();

                if (contentDisposition.IsFileDisposition())
                {
                    var fileStream = await GetFileStreamAsync(section);
                    formData.Add(name, fileStream);
                }
                else if (contentDisposition.IsFormDisposition())
                {
                    formAccumulator = await AccumulateFormAsync(formAccumulator, section, contentDisposition);
                }
            }

            var accumulatedValues = formAccumulator.GetResults();

            foreach (var value in accumulatedValues)
                formData.Add(value.Key, value.Value.ToString());

            return formData;
        }
        catch (Exception exception)
        {
            logger.LogError(exception, "Kunne ikke lese POST-data fra request");
            throw;
        }
    }

    private static T CreateInstance<T>(Dictionary<string, dynamic> formData)
    {
        var instance = Activator.CreateInstance<T>();
        var propertyInfos = typeof(T).GetProperties();

        foreach (var kvp in formData)
        {
            var propertyInfo = propertyInfos
                .SingleOrDefault(propInfo => propInfo.Name.Equals(kvp.Key, StringComparison.InvariantCultureIgnoreCase));

            if (propertyInfo == null)
                continue;

            var valueType = kvp.Value.GetType();
            var value = kvp.Value;

            if (!propertyInfo.PropertyType.Equals(valueType))
            {
                value = ParseFormValue(kvp.Value, propertyInfo.PropertyType);

                if (value == null)
                    continue;
            }

            propertyInfo.SetValue(instance, value);
        }

        return instance;
    }

    private static object ParseFormValue(dynamic value, Type type)
    {
        if (type == typeof(int) || type == typeof(int?))
            return int.TryParse(value, out int result) ? result : null;

        if (type == typeof(double) || type == typeof(double?))
            return double.TryParse(value, out double result) ? result : null;

        if (type == typeof(bool))
            return bool.TryParse(value, out bool result) ? result : null;

        return null;
    }

    private static async Task<MemoryStream> GetFileStreamAsync(MultipartSection section)
    {
        var memoryStream = new MemoryStream();
        await section.Body.CopyToAsync(memoryStream);
        await section.Body.DisposeAsync();
        memoryStream.Position = 0;

        return memoryStream;
    }

    private static string GetFormValue(Dictionary<string, StringValues> formValues, string key)
    {
        var kvp = formValues
            .SingleOrDefault(value => value.Key.ToLower().Equals(key.ToLower()));

        if (kvp.Value.Equals(default(KeyValuePair<string, StringValues>)))
            return null;

        return kvp.Value;
    }

    private static async Task<KeyValueAccumulator> AccumulateFormAsync(
        KeyValueAccumulator formAccumulator, MultipartSection section, ContentDispositionHeaderValue contentDisposition)
    {
        var key = HeaderUtilities.RemoveQuotes(contentDisposition.Name).Value;

        using var streamReader = new StreamReader(section.Body, GetEncoding(section), true, 1024, true);
        {
            var value = await streamReader.ReadToEndAsync();

            if (string.Equals(value, "undefined", StringComparison.OrdinalIgnoreCase))
                value = string.Empty;

            formAccumulator.Append(key, value);

            if (formAccumulator.ValueCount > FormReader.DefaultValueCountLimit)
                throw new InvalidDataException($"Form key count limit {FormReader.DefaultValueCountLimit} exceeded.");
        }

        return formAccumulator;
    }

    private static Encoding GetEncoding(MultipartSection section)
    {
        var hasMediaTypeHeader = MediaTypeHeaderValue.TryParse(section.ContentType, out var mediaType);

#pragma warning disable SYSLIB0001
        if (!hasMediaTypeHeader || Encoding.UTF7.Equals(mediaType.Encoding))
            return Encoding.UTF8;
#pragma warning restore SYSLIB0001

        return mediaType.Encoding;
    }
}
