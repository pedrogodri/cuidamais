using CuidaMais.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CuidaMais.Api.Controllers;

[ApiController]
[Route("health")]
public class HealthController(HealthCheckAppService healthCheckAppService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        var status = await healthCheckAppService.GetStatusAsync(cancellationToken);
        return Ok(status);
    }
}
