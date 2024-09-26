namespace Dok.Arealanalyse.Api.Application.Models.Api;

public class ValidatePayload : IDisposable
{
    private bool _disposed = false;

    public MemoryStream File { get; set; }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed)
        {
            if (disposing)
                File?.Dispose();

            _disposed = true;
        }
    }
}
