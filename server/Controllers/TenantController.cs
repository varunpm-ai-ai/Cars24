using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TenantController : ControllerBase
    {
        private readonly TenantService _tenantService;

        public TenantController(TenantService tenantService)
        {
            _tenantService = tenantService;
        }

        [HttpGet("configs")]
        public async Task<IActionResult> GetAllTenantConfigs()
        {
            var configs = await _tenantService.GetAllTenantConfigsAsync();
            return Ok(configs);
        }

        [HttpGet("config/{tenantId}")]
        public async Task<IActionResult> GetTenantConfig(string tenantId)
        {
            var config = await _tenantService.GetTenantConfigAsync(tenantId);
            return Ok(config);
        }

        [HttpPost("config")]
        public async Task<IActionResult> SaveTenantConfig([FromBody] TenantConfig config)
        {
            if (config == null || string.IsNullOrWhiteSpace(config.TenantId))
                return BadRequest("TenantId is required.");

            await _tenantService.CreateOrUpdateTenantConfigAsync(config);
            return Ok(new { message = "Tenant configuration saved successfully.", config });
        }
    }
}
