using Microsoft.EntityFrameworkCore;

namespace CuidaMais.Infrastructure.Persistence;

public class CuidaMaisDbContext(DbContextOptions<CuidaMaisDbContext> options) : DbContext(options)
{
}
