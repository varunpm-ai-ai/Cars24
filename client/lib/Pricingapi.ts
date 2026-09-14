const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://cars24-iq0g.onrender.com/api";

export type PricingRequest = {
  basePrice: number;
  bodyType?: string;
  fuelType?: string;
  region?: string;
  season?: string;
  isFuelSpikeActive?: boolean;
};

export type PricingFactorDetail = {
  factorName: string;
  multiplier: number;
  impactText: string;
};

export type PricingResult = {
  basePrice: number;
  recommendedPrice: number;
  multiplier: number;
  priceDifference: number;
  demandBadge: string;
  rationale: string;
  breakdown: PricingFactorDetail[];
};

export const calculateRecommendedPrice = async (
  request: PricingRequest
): Promise<PricingResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Pricing/calculate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn("Backend pricing API unreachable, using client-side calculation fallback", error);
  }

  // Client-side fallback calculation matching backend engine logic
  const base = request.basePrice > 0 ? request.basePrice : 500000;
  const body = request.bodyType || "SUV";
  const fuel = request.fuelType || "Petrol";
  const region = request.region || "Standard";
  const season = request.season || "Monsoon";

  let regMult = 1.0;
  let regImpact = "Standard regional baseline";
  if (region === "Hilly") {
    if (body === "SUV" || body === "Off-Road") { regMult = 1.16; regImpact = "Hilly Region: High demand for 4x4 / SUVs (+16%)"; }
    else if (body === "Hatchback") { regMult = 0.95; regImpact = "Hilly Region: Steep terrain penalty (-5%)"; }
    else if (body === "Sedan") { regMult = 0.92; regImpact = "Hilly Region: Low clearance penalty (-8%)"; }
  } else if (region === "MonsoonMetro" || region === "Monsoon") {
    if (body === "SUV" || body === "MUV") { regMult = 1.14; regImpact = "Monsoon Region: Flood & high clearance demand (+14%)"; }
    else if (body === "Sedan") { regMult = 0.94; regImpact = "Monsoon Region: Waterlogging risk discount (-6%)"; }
  } else if (region === "MetroFuelSpike" || region === "Metro") {
    if (fuel === "EV" || body === "EV") { regMult = 1.15; regImpact = "Metro Fuel Spike: EV demand surge (+15%)"; }
    else if (body === "Hatchback" || fuel === "CNG") { regMult = 1.10; regImpact = "Metro Fuel Spike: Compact fuel-saver demand (+10%)"; }
    else if (body === "SUV" && fuel === "Petrol") { regMult = 0.92; regImpact = "Metro Fuel Spike: Petrol SUV consumption penalty (-8%)"; }
  }

  let seasMult = 1.0;
  let seasImpact = "Standard seasonal baseline";
  if (season === "Monsoon") {
    if (body === "SUV") { seasMult = 1.08; seasImpact = "Monsoon Season: Rain-ready SUV demand (+8%)"; }
    else if (body === "Sedan") { seasMult = 0.96; seasImpact = "Monsoon Season: Low clearance discount (-4%)"; }
  } else if (season === "Festive") {
    seasMult = 1.08; seasImpact = "Festive Season: Nationwide surge (+8%)";
  }

  let fuelMult = 1.0;
  let fuelImpact = "Fuel price steady";
  if (request.isFuelSpikeActive) {
    if (fuel === "EV" || body === "EV") { fuelMult = 1.06; fuelImpact = "Active Fuel Spike: EV bonus (+6%)"; }
    else if (body === "Hatchback" || fuel === "CNG") { fuelMult = 1.05; fuelImpact = "Active Fuel Spike: Compact saver (+5%)"; }
    else if (body === "SUV" && fuel === "Petrol") { fuelMult = 0.94; fuelImpact = "Active Fuel Spike: Petrol SUV penalty (-6%)"; }
  }

  const compositeMultiplier = Number((regMult * seasMult * fuelMult).toFixed(4));
  const recPrice = Math.round(base * compositeMultiplier);
  const diff = recPrice - base;
  const pct = Math.round((compositeMultiplier - 1.0) * 100);

  const badge = pct >= 10 ? `🔥 High Market Demand (+${pct}%)` : pct > 0 ? `📈 Favorable Market Trend (+${pct}%)` : `💡 Smart Value Buyer Price (${pct}%)`;

  return {
    basePrice: base,
    recommendedPrice: recPrice,
    multiplier: compositeMultiplier,
    priceDifference: diff,
    demandBadge: badge,
    rationale: `Market adjusted for ${region} region during ${season} season.`,
    breakdown: [
      { factorName: "Regional Demand", multiplier: regMult, impactText: regImpact },
      { factorName: "Seasonal Trend", multiplier: seasMult, impactText: seasImpact },
      ...(request.isFuelSpikeActive ? [{ factorName: "Fuel Surge", multiplier: fuelMult, impactText: fuelImpact }] : []),
    ],
  };
};
