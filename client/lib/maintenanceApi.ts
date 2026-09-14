export interface MaintenanceRequest {
  brand: string;
  model: string;
  year: number;
  kilometersDriven: number;
  fuelType?: string;
  annualKmEstimate?: number;
}

export interface ComponentAlert {
  component: string;
  status: string;
  severity: "warning" | "danger" | "info";
  message: string;
  estimatedCost: number;
}

export interface CostBreakdownDetails {
  routineServicing: number;
  wearAndTearRepairs: number;
  tiresAndBrakes: number;
  contingencyBuffer: number;
}

export interface YearlyForecast {
  year: number;
  forecastAge: number;
  forecastKm: number;
  estimatedCost: number;
  riskTag: string;
}

export interface MaintenanceEstimateResult {
  brand: string;
  model: string;
  carAgeYears: number;
  kilometersDriven: number;
  fuelType: string;
  riskTag: string;
  riskLevel: "low" | "moderate" | "high" | "critical" | "very-high" | string;
  monthlyCostEstimate: number;
  annualCostEstimate: number;
  baseAnnualCost: number;
  conditionMultiplier: number;
  ageMultiplier: number;
  kmMultiplier: number;
  nextServiceKmDue: number;
  actionableInsights: string[];
  componentAlerts: ComponentAlert[];
  costBreakdown: CostBreakdownDetails;
  fiveYearForecast: YearlyForecast[];
}

const API_BASE = "https://cars24-iq0g.onrender.com/api/Maintenance";

export async function getMaintenanceEstimate(
  req: MaintenanceRequest
): Promise<MaintenanceEstimateResult> {
  try {
    const res = await fetch(`${API_BASE}/estimate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend maintenance API unavailable, computing client-side:", err);
  }

  // Fallback client-side calculation engine
  return calculateLocalEstimate(req);
}

export async function getMaintenanceEstimateForCar(
  carId: string,
  fallbackSpecs?: { brand?: string; model?: string; year?: number; km?: string | number; fuel?: string }
): Promise<MaintenanceEstimateResult> {
  try {
    const res = await fetch(`${API_BASE}/estimate-car/${carId}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend estimate-car API failed, using fallback calculation:", err);
  }

  // Parse fallback specs
  let year = fallbackSpecs?.year || 2020;
  let km = 30000;
  if (typeof fallbackSpecs?.km === "number") {
    km = fallbackSpecs.km;
  } else if (typeof fallbackSpecs?.km === "string") {
    const parsed = parseInt(fallbackSpecs.km.replace(/[^\d]/g, ""), 10);
    if (!isNaN(parsed)) km = parsed;
  }

  const brand = fallbackSpecs?.brand || "Maruti";
  const model = fallbackSpecs?.model || "Standard Car";
  const fuelType = fallbackSpecs?.fuel || "Petrol";

  return calculateLocalEstimate({
    brand,
    model,
    year,
    kilometersDriven: km,
    fuelType,
  });
}

export function calculateLocalEstimate(
  req: MaintenanceRequest
): MaintenanceEstimateResult {
  const currentYear = 2026;
  const carAge = Math.max(0, currentYear - (req.year || 2020));
  const km = Math.max(0, req.kilometersDriven || 0);
  const fuel = req.fuelType || "Petrol";
  const annualKm = req.annualKmEstimate || 12000;

  // Base cost per brand tier
  const baseAnnualCost = getBrandBaseCost(req.brand);

  const ageMult = getAgeMultiplier(carAge);
  const kmMult = getKmMultiplier(km);
  const fuelMult = getFuelMultiplier(fuel);

  const conditionMultiplier = Number((ageMult * kmMult * fuelMult).toFixed(2));
  const annualCostEstimate = Math.round(baseAnnualCost * conditionMultiplier);
  const monthlyCostEstimate = Math.round(annualCostEstimate / 12);

  // Risk Tag Logic
  let riskTag = "Low Maintenance Expected";
  let riskLevel = "low";

  if (carAge >= 9 || km >= 120000 || conditionMultiplier >= 2.8) {
    riskTag = "Very High Maintenance Expected";
    riskLevel = "critical";
  } else if ((carAge >= 6 && km >= 80000) || conditionMultiplier >= 2.1) {
    riskTag = "High Maintenance Expected";
    riskLevel = "high";
  } else if (conditionMultiplier >= 1.4 || carAge >= 4 || km >= 50000) {
    riskTag = "Moderate Maintenance Expected";
    riskLevel = "moderate";
  }

  // Service Due
  const remainderKm = km % 10000;
  const nextServiceKmDue = remainderKm === 0 ? 10000 : 10000 - remainderKm;

  // Insights & Component Alerts
  const actionableInsights: string[] = [
    `Next major service due in ${nextServiceKmDue.toLocaleString()} km`,
  ];

  const componentAlerts: ComponentAlert[] = [];

  if (km >= 40000 || km % 30000 >= 20000) {
    actionableInsights.push("Brake pads likely to need replacement soon");
    componentAlerts.push({
      component: "Brake Pads & Rotors",
      status: "Attention Needed",
      severity: "warning",
      message: "Inspect brake friction pads and discs for wear before long trips.",
      estimatedCost: 4500,
    });
  }

  if (km >= 40000 || carAge >= 4) {
    actionableInsights.push("Tire replacement expected in the near future");
    componentAlerts.push({
      component: "Tires Set (4 Wheels)",
      status: "Replacement Expected Soon",
      severity: "warning",
      message: "Tread depth should be checked. Recommended replacement interval is 40,000 - 50,000 km.",
      estimatedCost: 18000,
    });
  }

  if (carAge >= 4) {
    actionableInsights.push("12V Battery replacement check recommended");
    componentAlerts.push({
      component: "12V Battery",
      status: "Check Charge Level",
      severity: "info",
      message: "Car battery lifespan averages 3-4 years. Voltage testing advised.",
      estimatedCost: 5500,
    });
  }

  if (km >= 75000 || carAge >= 6) {
    actionableInsights.push("Transmission fluid & clutch / timing belt overhaul due");
    componentAlerts.push({
      component: "Transmission & Timing System",
      status: "Major Component Service",
      severity: "danger",
      message: "High mileage component wear check for smooth gear shifts and engine timing alignment.",
      estimatedCost: 12500,
    });
  }

  if (km >= 80000) {
    actionableInsights.push("Suspension bushings and shock absorbers evaluation suggested");
    componentAlerts.push({
      component: "Suspension & Struts",
      status: "Inspection Recommended",
      severity: "warning",
      message: "Check for fluid leaks and worn rubber bushings for optimal ride comfort.",
      estimatedCost: 9000,
    });
  }

  // Cost breakdown
  const costBreakdown: CostBreakdownDetails = {
    routineServicing: Math.round(annualCostEstimate * 0.40),
    wearAndTearRepairs: Math.round(annualCostEstimate * 0.30),
    tiresAndBrakes: Math.round(annualCostEstimate * 0.18),
    contingencyBuffer: Math.round(annualCostEstimate * 0.12),
  };

  // 5-Year forecast
  const fiveYearForecast: YearlyForecast[] = [];
  for (let i = 1; i <= 5; i++) {
    const fAge = carAge + i;
    const fKm = km + annualKm * i;
    const fAgeMult = getAgeMultiplier(fAge);
    const fKmMult = getKmMultiplier(fKm);
    const fMult = Number((fAgeMult * fKmMult * fuelMult).toFixed(2));
    const fAnnual = Math.round(baseAnnualCost * fMult);

    let fRisk = "Low Maintenance";
    if (fAge >= 9 || fKm >= 120000 || fMult >= 2.8) fRisk = "Very High Maintenance";
    else if ((fAge >= 6 && fKm >= 80000) || fMult >= 2.1) fRisk = "High Maintenance";
    else if (fMult >= 1.4) fRisk = "Moderate Maintenance";

    fiveYearForecast.push({
      year: currentYear + i,
      forecastAge: fAge,
      forecastKm: fKm,
      estimatedCost: fAnnual,
      riskTag: fRisk,
    });
  }

  return {
    brand: req.brand,
    model: req.model,
    carAgeYears: carAge,
    kilometersDriven: km,
    fuelType: fuel,
    riskTag,
    riskLevel,
    monthlyCostEstimate,
    annualCostEstimate,
    baseAnnualCost,
    conditionMultiplier,
    ageMultiplier: Number(ageMult.toFixed(2)),
    kmMultiplier: Number(kmMult.toFixed(2)),
    nextServiceKmDue,
    actionableInsights,
    componentAlerts,
    costBreakdown,
    fiveYearForecast,
  };
}

function getBrandBaseCost(brand?: string): number {
  if (!brand) return 8500;
  const b = brand.trim().toLowerCase();
  if (b.includes("maruti") || b.includes("suzuki") || b.includes("renault") || b.includes("datsun"))
    return 6800;
  if (b.includes("hyundai") || b.includes("tata") || b.includes("honda") || b.includes("nissan"))
    return 8800;
  if (b.includes("toyota") || b.includes("kia") || b.includes("mahindra") || b.includes("mg"))
    return 10200;
  if (b.includes("volkswagen") || b.includes("vw") || b.includes("skoda") || b.includes("jeep") || b.includes("ford"))
    return 13500;
  if (b.includes("bmw") || b.includes("mercedes") || b.includes("audi") || b.includes("jaguar") || b.includes("volvo"))
    return 32000;
  return 8500;
}

function getAgeMultiplier(age: number): number {
  if (age <= 1) return 0.85;
  if (age <= 3) return 1.05;
  if (age <= 5) return 1.30;
  if (age <= 7) return 1.60;
  if (age <= 9) return 1.90;
  return 2.25;
}

function getKmMultiplier(km: number): number {
  if (km <= 15000) return 0.90;
  if (km <= 35000) return 1.05;
  if (km <= 60000) return 1.25;
  if (km <= 80000) return 1.50;
  if (km <= 110000) return 1.80;
  return 2.15;
}

function getFuelMultiplier(fuel: string): number {
  const f = fuel.trim().toLowerCase();
  if (f.includes("diesel")) return 1.18;
  if (f.includes("cng") || f.includes("lpg")) return 1.08;
  if (f.includes("electric") || f.includes("ev")) return 0.65;
  if (f.includes("hybrid")) return 0.88;
  return 1.0;
}
