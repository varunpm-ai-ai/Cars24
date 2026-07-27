using System;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MaintenanceController : ControllerBase
    {
        private readonly MaintenanceService _maintenanceService;
        private readonly CarService _carService;

        public MaintenanceController(MaintenanceService maintenanceService, CarService carService)
        {
            _maintenanceService = maintenanceService;
            _carService = carService;
        }

        [HttpPost("estimate")]
        public IActionResult Estimate([FromBody] MaintenanceEstimateRequest request)
        {
            if (request == null)
            {
                return BadRequest("Invalid maintenance request data.");
            }

            var result = _maintenanceService.EstimateMaintenance(request);
            return Ok(result);
        }

        [HttpGet("estimate-car/{id}")]
        public async Task<IActionResult> EstimateForCar(string id)
        {
            var car = await _carService.GetByIdAsync(id);
            if (car == null)
            {
                return NotFound("Car not found.");
            }

            // Extract parameters from Car model
            int year = car.Specs.Year > 0 ? car.Specs.Year : 2020;
            
            // Parse km from string (e.g. "10,048" or "80,000 km")
            int km = 30000;
            if (!string.IsNullOrEmpty(car.Specs.Km))
            {
                string cleanKm = Regex.Replace(car.Specs.Km, @"[^\d]", "");
                if (int.TryParse(cleanKm, out int parsedKm))
                {
                    km = parsedKm;
                }
            }

            // Extract brand and model from Title (e.g. "2023 Maruti FRONX DELTA PLUS 1.2L AGS")
            string title = car.Title;
            string brand = "Maruti";
            string model = title;

            string[] commonBrands = new[] { "Maruti", "Hyundai", "Honda", "Tata", "Mahindra", "Toyota", "Kia", "BMW", "Mercedes", "Audi", "Volkswagen", "Skoda" };
            foreach (var b in commonBrands)
            {
                if (title.Contains(b, StringComparison.OrdinalIgnoreCase))
                {
                    brand = b;
                    break;
                }
            }

            var request = new MaintenanceEstimateRequest
            {
                Brand = brand,
                Model = model,
                Year = year,
                KilometersDriven = km,
                FuelType = string.IsNullOrEmpty(car.Specs.Fuel) ? "Petrol" : car.Specs.Fuel
            };

            var result = _maintenanceService.EstimateMaintenance(request);
            return Ok(result);
        }
    }
}
