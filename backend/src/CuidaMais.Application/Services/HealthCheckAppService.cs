using CuidaMais.Application.Interfaces;

namespace CuidaMais.Application.Services;

public class HealthCheckAppService(IHealthCheckRepository healthCheckRepository)
{
    public async Task<HealthStatus> GetStatusAsync(CancellationToken cancellationToken)
    {
        var databaseConnected = await healthCheckRepository.CanConnectAsync(cancellationToken);
        return new HealthStatus(databaseConnected);
    }
}

public record HealthStatus(bool DatabaseConnected);
