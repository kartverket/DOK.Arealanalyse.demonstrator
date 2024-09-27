using System.Xml.Linq;

namespace Dok.Arealanalyse.Api.Application.Utils;

public class GmlHelpers
{
    private static readonly XNamespace _gmlNs = "http://www.opengis.net/gml/3.2";

    public static int? GetEpsgFromEnvelope(XDocument document)
    {
        var envelopeElement = document.Root
            .Element(_gmlNs + "boundedBy")?
            .Element(_gmlNs + "Envelope");

        if (envelopeElement == null)
            return null;

        var srsName = envelopeElement.Attribute("srsName")?.Value;

        if (srsName == null)
            return null;

        var match = Regexes.SrsNameRegex().Match(srsName);

        return match.Success ?
            int.Parse(match.Groups["epsg"].Value) :
            null;
    }
}
