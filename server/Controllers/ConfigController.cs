using Microsoft.AspNetCore.Mvc;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConfigController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ConfigController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("maps-key")]
        public IActionResult GetMapsKey()
        {
            var key = _configuration["GoogleMaps:ApiKey"] ?? _configuration["GoogleMapsApiKey"] ?? "";
            return Ok(new { apiKey = key });
        }
    }
}
