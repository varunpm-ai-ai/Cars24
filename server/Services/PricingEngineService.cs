using server.Models;

namespace server.Services;

public class PricingEngineService
{
    public PricingCalculationResult CalculatePrice(PricingCalculationRequest request)
    {
        double basePrice = request.BasePrice <= 0 ? 500000 : request.BasePrice;
        string bodyType = (request.BodyType ?? "SUV").Trim();
        string fuelType = (request.FuelType ?? "Petrol").Trim();
        string region = (request.Region ?? "Standard").Trim();
        string season = (request.Season ?? "Monsoon").Trim();

        double regionMultiplier = 1.0;
        string regionImpact = "Standard regional baseline";

        // 1. Regional Multiplier Logic
        if (region.Equals("Hilly", StringComparison.OrdinalIgnoreCase))
        {
            if (bodyType.Equals("SUV", StringComparison.OrdinalIgnoreCase) || bodyType.Equals("Off-Road", StringComparison.OrdinalIgnoreCase))
            {
                regionMultiplier = 1.16;
                regionImpact = "Hilly Region: High demand for 4x4 / SUVs with steep grade climbing capabilities (+16%)";
            }
            else if (bodyType.Equals("Hatchback", StringComparison.OrdinalIgnoreCase))
            {
                regionMultiplier = 0.95;
                regionImpact = "Hilly Region: Low ground clearance hatchbacks face moderate demand reduction (-5%)";
            }
            else if (bodyType.Equals("Sedan", StringComparison.OrdinalIgnoreCase))
            {
                regionMultiplier = 0.92;
                regionImpact = "Hilly Region: Low clearance sedans face terrain penalty (-8%)";
            }
            else
            {
                regionMultiplier = 1.04;
                regionImpact = "Hilly Region: Moderate utility demand (+4%)";
            }
        }
        else if (region.Equals("MonsoonMetro", StringComparison.OrdinalIgnoreCase) || region.Equals("Monsoon", StringComparison.OrdinalIgnoreCase))
        {
            if (bodyType.Equals("SUV", StringComparison.OrdinalIgnoreCase) || bodyType.Equals("Off-Road", StringComparison.OrdinalIgnoreCase) || bodyType.Equals("MUV", StringComparison.OrdinalIgnoreCase))
            {
                regionMultiplier = 1.14;
                regionImpact = "Monsoon Region: High waterlogging & flood clearance demand for SUVs/MUVs (+14%)";
            }
            else if (bodyType.Equals("Sedan", StringComparison.OrdinalIgnoreCase))
            {
                regionMultiplier = 0.94;
                regionImpact = "Monsoon Region: Sedans face waterlogging risk discount (-6%)";
            }
            else
            {
                regionMultiplier = 1.02;
                regionImpact = "Monsoon Region: Baseline regional stability (+2%)";
            }
        }
        else if (region.Equals("MetroFuelSpike", StringComparison.OrdinalIgnoreCase) || region.Equals("Metro", StringComparison.OrdinalIgnoreCase))
        {
            if (fuelType.Equals("EV", StringComparison.OrdinalIgnoreCase) || bodyType.Equals("EV", StringComparison.OrdinalIgnoreCase))
            {
                regionMultiplier = 1.15;
                regionImpact = "Metro Area: Fuel price surge drives high demand for Electric Vehicles (+15%)";
            }
            else if (bodyType.Equals("Hatchback", StringComparison.OrdinalIgnoreCase) || fuelType.Equals("CNG", StringComparison.OrdinalIgnoreCase))
            {
                regionMultiplier = 1.10;
                regionImpact = "Metro Area: Fuel price spike boosts small fuel-efficient hatchbacks/CNG (+10%)";
            }
            else if (bodyType.Equals("SUV", StringComparison.OrdinalIgnoreCase) && fuelType.Equals("Petrol", StringComparison.OrdinalIgnoreCase))
            {
                regionMultiplier = 0.92;
                regionImpact = "Metro Area: High-displacement petrol SUVs face fuel cost discount (-8%)";
            }
            else
            {
                regionMultiplier = 1.01;
                regionImpact = "Metro Area: Balanced urban commuting demand (+1%)";
            }
        }
        else if (region.Equals("Coastal", StringComparison.OrdinalIgnoreCase))
        {
            if (fuelType.Equals("EV", StringComparison.OrdinalIgnoreCase))
            {
                regionMultiplier = 1.08;
                regionImpact = "Coastal Region: EV & clean transit preference (+8%)";
            }
            else
            {
                regionMultiplier = 1.01;
                regionImpact = "Coastal Region: Steady market demand (+1%)";
            }
        }
        else // Suburban or Standard
        {
            regionMultiplier = 1.03;
            regionImpact = "Suburban/Tier-2: Healthy family car demand (+3%)";
        }

        // 2. Seasonal Trend Multiplier Logic
        double seasonMultiplier = 1.0;
        string seasonImpact = "Standard seasonal baseline";

        if (season.Equals("Monsoon", StringComparison.OrdinalIgnoreCase))
        {
            if (bodyType.Equals("SUV", StringComparison.OrdinalIgnoreCase) || bodyType.Equals("Off-Road", StringComparison.OrdinalIgnoreCase))
            {
                seasonMultiplier = 1.08;
                seasonImpact = "Monsoon Season: Rain-ready SUV seasonal surge (+8%)";
            }
            else if (bodyType.Equals("Sedan", StringComparison.OrdinalIgnoreCase))
            {
                seasonMultiplier = 0.96;
                seasonImpact = "Monsoon Season: Low ground clearance sedan seasonal slowdown (-4%)";
            }
            else
            {
                seasonMultiplier = 1.00;
                seasonImpact = "Monsoon Season: Normal seasonal trend";
            }
        }
        else if (season.Equals("Festive", StringComparison.OrdinalIgnoreCase))
        {
            seasonMultiplier = 1.08;
            seasonImpact = "Festive Season (Diwali/New Year): Festive buying surge across all categories (+8%)";
            if (bodyType.Equals("Luxury", StringComparison.OrdinalIgnoreCase) || bodyType.Equals("Sedan", StringComparison.OrdinalIgnoreCase))
            {
                seasonMultiplier = 1.12;
                seasonImpact = "Festive Season: Peak festive demand for Premium Sedans & Luxury (+12%)";
            }
        }
        else if (season.Equals("Summer", StringComparison.OrdinalIgnoreCase))
        {
            if (bodyType.Equals("SUV", StringComparison.OrdinalIgnoreCase) || bodyType.Equals("MUV", StringComparison.OrdinalIgnoreCase))
            {
                seasonMultiplier = 1.07;
                seasonImpact = "Summer Vacation: Long road trip & travel demand (+7%)";
            }
            else
            {
                seasonMultiplier = 1.02;
                seasonImpact = "Summer Season: Warm weather travel (+2%)";
            }
        }
        else if (season.Equals("Winter", StringComparison.OrdinalIgnoreCase) || season.Equals("EndFiscal", StringComparison.OrdinalIgnoreCase))
        {
            seasonMultiplier = 0.97;
            seasonImpact = "End of Fiscal Year: Inventory clearance trend (-3%)";
        }

        // 3. Optional Fuel Price Spike Toggle Override
        double fuelSpikeMultiplier = 1.0;
        string fuelSpikeImpact = "Fuel prices steady";
        if (request.IsFuelSpikeActive)
        {
            if (fuelType.Equals("EV", StringComparison.OrdinalIgnoreCase) || bodyType.Equals("EV", StringComparison.OrdinalIgnoreCase))
            {
                fuelSpikeMultiplier = 1.06;
                fuelSpikeImpact = "Active Fuel Spike: Electric vehicle demand boost (+6%)";
            }
            else if (bodyType.Equals("Hatchback", StringComparison.OrdinalIgnoreCase) || fuelType.Equals("CNG", StringComparison.OrdinalIgnoreCase))
            {
                fuelSpikeMultiplier = 1.05;
                fuelSpikeImpact = "Active Fuel Spike: Compact fuel-saver bonus (+5%)";
            }
            else if (bodyType.Equals("SUV", StringComparison.OrdinalIgnoreCase) && fuelType.Equals("Petrol", StringComparison.OrdinalIgnoreCase))
            {
                fuelSpikeMultiplier = 0.94;
                fuelSpikeImpact = "Active Fuel Spike: Heavy petrol SUV consumption penalty (-6%)";
            }
        }

        // Final Composite Multiplier calculation
        double compositeMultiplier = Math.Round(regionMultiplier * seasonMultiplier * fuelSpikeMultiplier, 4);
        double recommendedPrice = Math.Round(basePrice * compositeMultiplier);
        double priceDiff = recommendedPrice - basePrice;

        // Formulate Demand Badge text
        string demandBadge = "🔥 Standard Market Value";
        double totalPctChange = Math.Round((compositeMultiplier - 1.0) * 100, 1);

        if (totalPctChange >= 10)
        {
            demandBadge = $"🔥 High Market Demand (+{totalPctChange}%)";
        }
        else if (totalPctChange > 0)
        {
            demandBadge = $"📈 Favorable Market Trend (+{totalPctChange}%)";
        }
        else if (totalPctChange < 0)
        {
            demandBadge = $"💡 Smart Value Buyer Price ({totalPctChange}%)";
        }

        var breakdown = new List<PricingFactorDetail>
        {
            new PricingFactorDetail { FactorName = "Regional Demand", Multiplier = regionMultiplier, ImpactText = regionImpact },
            new PricingFactorDetail { FactorName = "Seasonal Trend", Multiplier = seasonMultiplier, ImpactText = seasonImpact }
        };

        if (request.IsFuelSpikeActive)
        {
            breakdown.Add(new PricingFactorDetail { FactorName = "Fuel Price Surge", Multiplier = fuelSpikeMultiplier, ImpactText = fuelSpikeImpact });
        }

        string rationale = $"Based on selected region ({region}) and season ({season}), vehicle value reflects a composite {totalPctChange:+#0.0;-#0.0;0}% market adjustment.";

        return new PricingCalculationResult
        {
            BasePrice = basePrice,
            RecommendedPrice = recommendedPrice,
            Multiplier = compositeMultiplier,
            PriceDifference = priceDiff,
            DemandBadge = demandBadge,
            Rationale = rationale,
            Breakdown = breakdown
        };
    }
}
