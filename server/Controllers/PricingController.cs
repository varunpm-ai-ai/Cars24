using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PricingController : ControllerBase
{
    private readonly PricingEngineService _pricingEngineService;

    public PricingController(PricingEngineService pricingEngineService)
    {
        _pricingEngineService = pricingEngineService;
    }

    [HttpPost("calculate")]
    public IActionResult CalculateRecommendedPrice([FromBody] PricingCalculationRequest request)
    {
        if (request == null)
        {
            return BadRequest("Pricing request parameter is missing.");
        }

        var result = _pricingEngineService.CalculatePrice(request);
        return Ok(result);
    }
}
