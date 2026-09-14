namespace server.Models
{
    public class MaintenanceEstimateRequest
    {
        public string Brand { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public int KilometersDriven { get; set; }
        public string FuelType { get; set; } = "Petrol";
        public int AnnualKmEstimate { get; set; } = 12000;
    }
}
