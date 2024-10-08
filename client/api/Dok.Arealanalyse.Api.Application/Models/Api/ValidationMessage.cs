namespace Dok.Arealanalyse.Api.Application.Models.Api;

public class ValidationMessage
{
    public ValidationMessage(bool valid)
    {
        Valid = valid;
    }

    public ValidationMessage(bool valid, string message)
    {
        Valid = valid;
        Message = message;
    }

    public bool Valid { get; set; }
    public string Message { get; set; }
}
