using CuidaMais.Application.Interfaces;
using CuidaMais.Infrastructure.Persistence;

namespace CuidaMais.Infrastructure.Repositories;

public class HealthCheckRepository(CuidaMaisDbContext dbContext) : IHealthCheckRepository
{
    public Task<bool> CanConnectAsync(CancellationToken cancellationToken)
        => dbContext.Database.CanConnectAsync(cancellationToken);
}
