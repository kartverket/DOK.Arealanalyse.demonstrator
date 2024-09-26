using Dok.Arealanalyse.Api.Application.Utils;

namespace Dok.Arealanalyse.Api.Application.Models;

public partial class Hode
{
    private static readonly Dictionary<string, int> EpsgCodes = new()
    {
        { "22", 25832 },
        { "23", 25833 },
        { "25", 25835 }
    };

    public int DecimalPlaces { get; private set; }
    public int EPSG { get; private set; }

    public static Hode Create(SosiObject sosiObject)
    {
        var enhet = sosiObject.SosiValues.Get("...ENHET");
        var koordsys = sosiObject.SosiValues.Get("...KOORDSYS");
        var match = Regexes.DecimalPlaceRegex().Match(enhet);

        return new Hode
        {
            DecimalPlaces = match.Groups["decimal_places"].Value.Length,
            EPSG = EpsgCodes[koordsys]
        };
    }
}
