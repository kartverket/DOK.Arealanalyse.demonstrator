using Dok.Arealanalyse.Api.Application.Models;
using System.Text;

namespace Dok.Arealanalyse.Api.Application.Utils;

public partial class SosiHelpers
{
    public static async Task<Dictionary<string, List<SosiObject>>> ReadSosiFileAsync(MemoryStream memoryStream)
    {
        using var streamReader = new StreamReader(memoryStream, Encoding.UTF8);
        var sosiLines = new Dictionary<string, List<string>>();
        string line;

        while ((line = await streamReader.ReadLineAsync()) != null)
        {
            if (Regexes.SosiObjectRegex().IsMatch(line) && !line.Equals(".SLUTT"))
                sosiLines.Add(line, []);
            else
                sosiLines.Last().Value.Add(line);
        }

        var sosiObjects = sosiLines
            .Select(kvp => SosiObject.Create(kvp.Key, kvp.Value))
            .GroupBy(sosiObject => sosiObject.ElementType)
            .ToDictionary(grouping => grouping.Key, grouping => grouping.ToList());

        return sosiObjects;
    }

    public static Hode GetHode(Dictionary<string, List<SosiObject>> sosiObjects)
    {
        sosiObjects.TryGetValue("HODE", out var hodeObjects);

        return Hode.Create(hodeObjects.Single());
    }

    public static List<Kurve> GetKurver(Dictionary<string, List<SosiObject>> sosiObjects, int decimalPlaces)
    {
        if (!sosiObjects.TryGetValue("KURVE", out var kurveObjects))
            return [];

        return kurveObjects
            .Select(sosiObject => Kurve.Create(sosiObject, decimalPlaces))
            .ToList();
    }

    public static List<BueP> GetBuer(Dictionary<string, List<SosiObject>> sosiObjects, int decimalPlaces)
    {
        if (!sosiObjects.TryGetValue("BUEP", out var bueObjects))
            return [];

        return bueObjects
            .Select(sosiObject => BueP.Create(sosiObject, decimalPlaces))
            .ToList();
    }

    public static List<Flate> GetFlater(Dictionary<string, List<SosiObject>> sosiObjects)
    {
        if (!sosiObjects.TryGetValue("FLATE", out var flateObjects))
            return [];

        return flateObjects
            .Select(Flate.Create)
            .ToList();
    }

    public static List<SosiPoint> GetPoints(SosiObject sosiObject, int decimalPlaces)
    {
        var points = new List<SosiPoint>();

        for (int i = 0; i < sosiObject.SosiValues.Values.Count; i++)
        {
            var value = sosiObject.SosiValues.Values[i];

            if (Regexes.PointsStartRegex().IsMatch(value))
            {
                var pointValues = sosiObject.SosiValues.Values.Skip(i);

                foreach (var pointValue in pointValues)
                {
                    var pointMatch = Regexes.PointRegex().Match(pointValue);

                    if (pointMatch.Success)
                        points.Add(SosiPoint.Create(pointMatch.Groups["x"].Value, pointMatch.Groups["y"].Value, decimalPlaces));
                }

                break;
            }
        }

        return points;
    }

    public static List<List<int>> GetRefs(SosiObject sosiObject)
    {
        var index = sosiObject.SosiValues.Values
            .FindIndex(value => value.StartsWith("..REF"));

        if (index == -1)
            return null;

        var value = sosiObject.SosiValues.Values[index++];
        var values = new List<string>();

        while (!value.StartsWith("..NØ"))
        {
            values.Add(value);
            value = sosiObject.SosiValues.Values[index++];
        }

        var refsString = string.Join(' ', values);
        var match = Regexes.RefRegex().Match(refsString);

        if (!match.Success)
            return null;

        var exteriorRefStr = match.Groups["exterior"].Captures
            .SingleOrDefault()
            .Value;

        var exterior = ParseRefString(exteriorRefStr);

        var interiors = match.Groups["interior"].Captures
            .Select(capture => ParseRefString(capture.Value))
            .ToList();

        var refs = new List<List<int>> { exterior };
        refs.AddRange(interiors);

        return refs;
    }

    private static List<int> ParseRefString(string refStr)
    {
        return refStr.Split(' ')
            .Select(@ref => int.Parse(@ref.TrimStart(':')))
            .ToList();
    }
}
