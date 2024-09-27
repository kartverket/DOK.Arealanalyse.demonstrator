using Dok.Arealanalyse.Api.Application.Utils;

namespace Dok.Arealanalyse.Api.Application.Models;

public partial class SosiValues
{
    private SosiValues(List<string> values, Dictionary<string, string> objectProperties)
    {
        Values = values;
        ObjectProperties = objectProperties;
    }

    public Dictionary<string, string> ObjectProperties { get; private set; } = [];
    public List<string> Values { get; private set; } = [];

    public string Get(string key)
    {
        return ObjectProperties.TryGetValue(key, out var value) ? value : null;
    }

    public bool Has(string key)
    {
        return ObjectProperties.ContainsKey(key);
    }

    public static SosiValues Create(List<string> values)
    {
        var propertyLines = values.Where(value => Regexes.PropertyRegex().IsMatch(value));
        var objectProperties = new Dictionary<string, string>();

        foreach (var line in propertyLines)
        {
            var match = Regexes.NameAndValueRegex().Match(line);

            if (match.Success)
            {
                var value = match.Groups["value"].Value;
                objectProperties.Add(match.Groups["name"].Value, !string.IsNullOrWhiteSpace(value) ? value : null);
            }
        }

        return new SosiValues(values, objectProperties);
    }
}
