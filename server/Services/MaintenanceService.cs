using System;
using System.Collections.Generic;
using server.Models;

namespace server.Services
{
    public class MaintenanceService
    {
        public MaintenanceEstimateResult EstimateMaintenance(MaintenanceEstimateRequest request)
        {
            int currentYear = 2026;
            int carAge = Math.Max(0, currentYear - request.Year);
            int km = Math.Max(0, request.KilometersDriven);

            // Determine Brand Base Cost
            decimal baseAnnualCost = GetBrandBaseCost(request.Brand);

            // Multipliers
            double ageMultiplier = GetAgeMultiplier(carAge);
            double kmMultiplier = GetKmMultiplier(km);
            double fuelMultiplier = GetFuelMultiplier(request.FuelType);

            double totalConditionMultiplier = Math.Round(ageMultiplier * kmMultiplier * fuelMultiplier, 2);

            decimal annualEstimate = Math.Round(baseAnnualCost * (decimal)totalConditionMultiplier, 0);
            decimal monthlyEstimate = Math.Round(annualEstimate / 12m, 0);

            // Risk Tag Determination
            // Prompt rule example: tagging a 6-year-old car with over 80,000 km driven as High Maintenance Expected
            string riskTag;
            string riskLevel;

            if (carAge >= 9 || km >= 120000 || totalConditionMultiplier >= 2.8)
            {
                riskTag = "Very High Maintenance Expected";
                riskLevel = "critical";
            }
            else if ((carAge >= 6 && km >= 80000) || totalConditionMultiplier >= 2.1)
            {
                riskTag = "High Maintenance Expected";
                riskLevel = "high";
            }
            else if (totalConditionMultiplier >= 1.4 || carAge >= 4 || km >= 50000)
            {
                riskTag = "Moderate Maintenance Expected";
                riskLevel = "moderate";
            }
            else
            {
                riskTag = "Low Maintenance Expected";
                riskLevel = "low";
            }

            // Calculate next service due (every 10,000 km interval)
            int remainderKm = km % 10000;
            int kmToNextService = 10000 - remainderKm;
            if (kmToNextService == 0) kmToNextService = 10000;

            // Generate Actionable Insights & Component Alerts
            var insights = new List<string>();
            var alerts = new List<ComponentAlert>();

            insights.Add($"Next major service due in {kmToNextService:N0} km");

            if (km > 40000 || (km % 30000 >= 20000))
            {
                insights.Add("Brake pads likely to need replacement soon");
                alerts.Add(new ComponentAlert
                {
                    Component = "Brake Pads & Rotors",
                    Status = "Attention Needed",
                    Severity = "warning",
                    Message = "Inspect brake friction pads and discs for wear before long trips.",
                    EstimatedCost = 4500
                });
            }

            if (km >= 40000 || carAge >= 4)
            {
                insights.Add("Tire replacement expected in the near future");
                alerts.Add(new ComponentAlert
                {
                    Component = "Tires Set (4 Wheels)",
                    Status = "Replacement Expected Soon",
                    Severity = "warning",
                    Message = "Tread depth should be checked. Recommended replacement interval is 40,000 - 50,000 km.",
                    EstimatedCost = 18000
                });
            }

            if (carAge >= 4)
            {
                insights.Add("12V Battery replacement check recommended");
                alerts.Add(new ComponentAlert
                {
                    Component = "12V Battery",
                    Status = "Check Charge Level",
                    Severity = "info",
                    Message = "Car battery lifespan averages 3-4 years. Voltage testing advised.",
                    EstimatedCost = 5500
                });
            }

            if (km >= 75000 || carAge >= 6)
            {
                insights.Add("Transmission fluid & clutch / timing belt overhaul due");
                alerts.Add(new ComponentAlert
                {
                    Component = "Transmission & Timing System",
                    Status = "Major Component Service",
                    Severity = "danger",
                    Message = "High mileage component wear check for smooth gear shifts and engine timing alignment.",
                    EstimatedCost = 12500
                });
            }

            if (km >= 80000)
            {
                insights.Add("Suspension bushings and shock absorbers evaluation suggested");
                alerts.Add(new ComponentAlert
                {
                    Component = "Suspension & Struts",
                    Status = "Inspection Recommended",
                    Severity = "warning",
                    Message = "Check for fluid leaks and worn rubber bushings for optimal ride comfort.",
                    EstimatedCost = 9000
                });
            }

            // Detailed Cost Breakdown
            var costBreakdown = new CostBreakdownDetails
            {
                RoutineServicing = Math.Round(annualEstimate * 0.40m, 0),
                WearAndTearRepairs = Math.Round(annualEstimate * 0.30m, 0),
                TiresAndBrakes = Math.Round(annualEstimate * 0.18m, 0),
                ContingencyBuffer = Math.Round(annualEstimate * 0.12m, 0)
            };

            // 5-Year Forecast
            var forecastList = new List<YearlyForecast>();
            int annualDriven = request.AnnualKmEstimate > 0 ? request.AnnualKmEstimate : 12000;

            for (int i = 1; i <= 5; i++)
            {
                int forecastAge = carAge + i;
                int forecastKm = km + (annualDriven * i);
                double fAgeMult = GetAgeMultiplier(forecastAge);
                double fKmMult = GetKmMultiplier(forecastKm);
                double fTotalMult = Math.Round(fAgeMult * fKmMult * fuelMultiplier, 2);

                decimal fAnnualCost = Math.Round(baseAnnualCost * (decimal)fTotalMult, 0);

                string fRisk;
                if (forecastAge >= 9 || forecastKm >= 120000 || fTotalMult >= 2.8)
                    fRisk = "Very High Maintenance";
                else if ((forecastAge >= 6 && forecastKm >= 80000) || fTotalMult >= 2.1)
                    fRisk = "High Maintenance";
                else if (fTotalMult >= 1.4)
                    fRisk = "Moderate Maintenance";
                else
                    fRisk = "Low Maintenance";

                forecastList.Add(new YearlyForecast
                {
                    Year = currentYear + i,
                    ForecastAge = forecastAge,
                    ForecastKm = forecastKm,
                    EstimatedCost = fAnnualCost,
                    RiskTag = fRisk
                });
            }

            return new MaintenanceEstimateResult
            {
                Brand = request.Brand,
                Model = request.Model,
                CarAgeYears = carAge,
                KilometersDriven = km,
                FuelType = request.FuelType,
                RiskTag = riskTag,
                RiskLevel = riskLevel,
                MonthlyCostEstimate = monthlyEstimate,
                AnnualCostEstimate = annualEstimate,
                BaseAnnualCost = baseAnnualCost,
                ConditionMultiplier = totalConditionMultiplier,
                AgeMultiplier = Math.Round(ageMultiplier, 2),
                KmMultiplier = Math.Round(kmMultiplier, 2),
                NextServiceKmDue = kmToNextService,
                ActionableInsights = insights,
                ComponentAlerts = alerts,
                CostBreakdown = costBreakdown,
                FiveYearForecast = forecastList
            };
        }

        private decimal GetBrandBaseCost(string brand)
        {
            if (string.IsNullOrWhiteSpace(brand)) return 8500m;
            string b = brand.Trim().ToLower();

            if (b.Contains("maruti") || b.Contains("suzuki") || b.Contains("renault") || b.Contains("datsun"))
                return 6800m;
            if (b.Contains("hyundai") || b.Contains("tata") || b.Contains("honda") || b.Contains("nissan"))
                return 8800m;
            if (b.Contains("toyota") || b.Contains("kia") || b.Contains("mahindra") || b.Contains("mg"))
                return 10200m;
            if (b.Contains("volkswagen") || b.Contains("vw") || b.Contains("skoda") || b.Contains("jeep") || b.Contains("ford"))
                return 13500m;
            if (b.Contains("bmw") || b.Contains("mercedes") || b.Contains("audi") || b.Contains("jaguar") || b.Contains("volvo") || b.Contains("porsche"))
                return 32000m;

            return 8500m;
        }

        private double GetAgeMultiplier(int age)
        {
            if (age <= 1) return 0.85;
            if (age <= 3) return 1.05;
            if (age <= 5) return 1.30;
            if (age <= 7) return 1.60;
            if (age <= 9) return 1.90;
            return 2.25;
        }

        private double GetKmMultiplier(int km)
        {
            if (km <= 15000) return 0.90;
            if (km <= 35000) return 1.05;
            if (km <= 60000) return 1.25;
            if (km <= 80000) return 1.50;
            if (km <= 110000) return 1.80;
            return 2.15;
        }

        private double GetFuelMultiplier(string fuelType)
        {
            if (string.IsNullOrWhiteSpace(fuelType)) return 1.0;
            string f = fuelType.Trim().ToLower();

            if (f.Contains("diesel")) return 1.18;
            if (f.Contains("cng") || f.Contains("lpg")) return 1.08;
            if (f.Contains("electric") || f.Contains("ev")) return 0.65;
            if (f.Contains("hybrid")) return 0.88;

            return 1.0; // Petrol
        }
    }
}
