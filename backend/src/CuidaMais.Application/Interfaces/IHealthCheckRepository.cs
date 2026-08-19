namespace CuidaMais.Application.Interfaces;

public interface IHealthCheckRepository
{
    Task<bool> CanConnectAsync(CancellationToken cancellationToken);
}
