using System.Text.RegularExpressions;

namespace Dok.Arealanalyse.Api.Application.Utils;

public partial class Regexes
{
    [GeneratedRegex(@"^\.[A-ZÆØÅ]+", RegexOptions.Compiled)]
    public static partial Regex SosiObjectRegex();
    [GeneratedRegex(@"^\.\.OBJTYPE (?<objType>(\w+))", RegexOptions.Compiled)]
    public static partial Regex ObjTypeRegex();
    [GeneratedRegex(@"^(?<y>\d+) (?<x>\d+)", RegexOptions.Compiled)]
    public static partial Regex PointRegex();
    [GeneratedRegex(@"^\.\.NØ", RegexOptions.Compiled)]
    public static partial Regex PointsStartRegex();
    [GeneratedRegex(@"^\.(?<cartographicElementType>([A-ZÆØÅ]+)) (?<sn>\d+)\:", RegexOptions.Compiled)]
    public static partial Regex CartographicElementTypeRegex();
    [GeneratedRegex(@"^\.\.REF.(?<exterior>.*?)( \((?<interior>.*?)\))*$", RegexOptions.RightToLeft | RegexOptions.Compiled)]
    public static partial Regex RefRegex();
    [GeneratedRegex(@"^0\.(?<decimal_places>\d+)0*$", RegexOptions.RightToLeft | RegexOptions.Compiled)]
    public static partial Regex DecimalPlaceRegex();
    [GeneratedRegex(@"^\.+((?!(NØ|REF)).)*$", RegexOptions.Compiled)]
    public static partial Regex PropertyRegex();
    [GeneratedRegex(@"^(?<name>(\.+[A-ZÆØÅ-]+))( (?<value>.*))?", RegexOptions.Compiled)]
    public static partial Regex NameAndValueRegex();
    [GeneratedRegex(@"^(http:\/\/www\.opengis\.net\/def\/crs\/EPSG\/0\/|urn:ogc:def:crs:EPSG::|EPSG:)(?<epsg>\d+)$", RegexOptions.Compiled)]
    public static partial Regex SrsNameRegex();
    [GeneratedRegex(@"^\.(?<elementType>([A-ZÆØÅ]+))( (?<sn>\d+))?", RegexOptions.Compiled)]
    public static partial Regex ElementTypeRegex();
}
