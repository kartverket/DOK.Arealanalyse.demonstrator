namespace Dok.Arealanalyse.Api.Application.Models;

public class SosiPoint(double x, double y)
{
    public double X { get; set; } = x;
    public double Y { get; set; } = y;

    public override string ToString()
    {
        return FormattableString.Invariant($"{X} {Y}");
    }

    public static SosiPoint Create(string x, string y, int numDecimals)
    {
        return new SosiPoint(double.Parse(x.Insert(x.Length - numDecimals, ".")), double.Parse(y.Insert(y.Length - numDecimals, ".")));
    }
}
