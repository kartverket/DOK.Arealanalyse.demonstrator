using Dok.Arealanalyse.Api.Application.Utils;

namespace Dok.Arealanalyse.Api.Application.Models;

public partial class SosiObject
{
    public string ElementType { get; private set; }
    public int SequenceNumber { get; private set; }
    public SosiValues SosiValues { get; private set; }

    public static SosiObject Create(string elementName, List<string> values)
    {
        var elementTypeMatch = Regexes.ElementTypeRegex().Match(elementName);
        var elementType = elementTypeMatch.Groups["elementType"].Value;

        var sosiObject = new SosiObject
        {
            ElementType = elementType,
            SosiValues = SosiValues.Create(values)
        };

        if (int.TryParse(elementTypeMatch.Groups["sn"].Value, out var sequenceNumber))
            sosiObject.SequenceNumber = sequenceNumber;

        return sosiObject;
    }
}
