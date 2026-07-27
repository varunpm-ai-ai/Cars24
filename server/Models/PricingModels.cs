namespace server.Models;

public class PricingCalculationRequest
{
    public double BasePrice { get; set; }
    public string BodyType { get; set; } = "SUV"; // SUV, Hatchback, Sedan, MUV, EV, Luxury
    public string FuelType { get; set; } = "Petrol"; // Petrol, Diesel, EV, CNG
    public string Region { get; set; } = "Metro"; // Hilly, MonsoonMetro, MetroFuelSpike, Suburban, Coastal, Standard
    public string Season { get; set; } = "Monsoon"; // Monsoon, Festive, Summer, Winter, Standard
    public bool IsFuelSpikeActive { get; set; } = false;
}

public class PricingCalculationResult
{
    public double BasePrice { get; set; }
    public double RecommendedPrice { get; set; }
    public double Multiplier { get; set; }
    public double PriceDifference { get; set; }
    public string DemandBadge { get; set; } = string.Empty;
    public string Rationale { get; set; } = string.Empty;
    public List<PricingFactorDetail> Breakdown { get; set; } = new List<PricingFactorDetail>();
}

public class PricingFactorDetail
{
    public string FactorName { get; set; } = string.Empty;
    public double Multiplier { get; set; }
    public string ImpactText { get; set; } = string.Empty;
}
