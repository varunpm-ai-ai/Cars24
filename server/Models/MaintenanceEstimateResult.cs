using System.Collections.Generic;

namespace server.Models
{
    public class ComponentAlert
    {
        public string Component { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty; // "Due Soon", "Attention Needed", "Good Condition"
        public string Severity { get; set; } = string.Empty; // "warning", "danger", "info"
        public string Message { get; set; } = string.Empty;
        public decimal EstimatedCost { get; set; }
    }

    public class CostBreakdownDetails
    {
        public decimal RoutineServicing { get; set; }
        public decimal WearAndTearRepairs { get; set; }
        public decimal TiresAndBrakes { get; set; }
        public decimal ContingencyBuffer { get; set; }
    }

    public class YearlyForecast
    {
        public int Year { get; set; }
        public int ForecastAge { get; set; }
        public int ForecastKm { get; set; }
        public decimal EstimatedCost { get; set; }
        public string RiskTag { get; set; } = string.Empty;
    }

    public class MaintenanceEstimateResult
    {
        public string Brand { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int CarAgeYears { get; set; }
        public int KilometersDriven { get; set; }
        public string FuelType { get; set; } = string.Empty;

        public string RiskTag { get; set; } = string.Empty; // e.g., "High Maintenance Expected"
        public string RiskLevel { get; set; } = string.Empty; // "low", "moderate", "high", "very-high"

        public decimal MonthlyCostEstimate { get; set; }
        public decimal AnnualCostEstimate { get; set; }
        public decimal BaseAnnualCost { get; set; }

        public double ConditionMultiplier { get; set; }
        public double AgeMultiplier { get; set; }
        public double KmMultiplier { get; set; }

        public int NextServiceKmDue { get; set; }
        public List<string> ActionableInsights { get; set; } = new List<string>();
        public List<ComponentAlert> ComponentAlerts { get; set; } = new List<ComponentAlert>();
        public CostBreakdownDetails CostBreakdown { get; set; } = new CostBreakdownDetails();
        public List<YearlyForecast> FiveYearForecast { get; set; } = new List<YearlyForecast>();
    }
}
