"use client";

import React, { useState, useEffect } from "react";
import {
  MaintenanceEstimateResult,
  calculateLocalEstimate,
} from "@/lib/maintenanceApi";
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Gauge,
  TrendingUp,
  ShieldAlert,
  Info,
  DollarSign,
  ChevronRight,
  Sparkles,
  Car as CarIcon,
} from "lucide-react";

interface MaintenanceCardProps {
  initialEstimate?: MaintenanceEstimateResult;
  carTitle?: string;
  brand?: string;
  model?: string;
  year?: number;
  km?: number | string;
  fuel?: string;
  showCustomizer?: boolean;
}

export const MaintenanceCard: React.FC<MaintenanceCardProps> = ({
  initialEstimate,
  carTitle,
  brand = "Maruti",
  model = "Swift",
  year = 2018,
  km = 80000,
  fuel = "Petrol",
  showCustomizer = true,
}) => {
  // Parse KM numeric
  const parsedKm = typeof km === "number" ? km : parseInt(km.replace(/[^\d]/g, ""), 10) || 80000;

  const [currentKm, setCurrentKm] = useState<number>(parsedKm);
  const [annualDrivenKm, setAnnualDrivenKm] = useState<number>(12000);
  const [activeTab, setActiveTab] = useState<"insights" | "breakdown" | "forecast">("insights");

  const [estimate, setEstimate] = useState<MaintenanceEstimateResult>(() => {
    if (initialEstimate) return initialEstimate;
    return calculateLocalEstimate({
      brand,
      model,
      year,
      kilometersDriven: parsedKm,
      fuelType: fuel,
      annualKmEstimate: 12000,
    });
  });

  // Recalculate if user moves sliders or props change
  useEffect(() => {
    const updated = calculateLocalEstimate({
      brand,
      model,
      year,
      kilometersDriven: currentKm,
      fuelType: fuel,
      annualKmEstimate: annualDrivenKm,
    });
    setEstimate(updated);
  }, [currentKm, annualDrivenKm, brand, model, year, fuel]);

  const getRiskBadgeStyle = (level: string) => {
    switch (level) {
      case "critical":
      case "very-high":
        return {
          bg: "bg-red-50 text-red-700 border-red-200",
          dot: "bg-red-500",
          iconColor: "text-red-600",
          barColor: "bg-red-500",
        };
      case "high":
        return {
          bg: "bg-orange-50 text-orange-700 border-orange-200",
          dot: "bg-orange-500",
          iconColor: "text-orange-600",
          barColor: "bg-orange-500",
        };
      case "moderate":
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          dot: "bg-amber-500",
          iconColor: "text-amber-600",
          barColor: "bg-amber-500",
        };
      default:
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          dot: "bg-emerald-500",
          iconColor: "text-emerald-600",
          barColor: "bg-emerald-500",
        };
    }
  };

  const badgeStyle = getRiskBadgeStyle(estimate.riskLevel);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 text-white relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <Wrench className="w-48 h-48 text-white" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                AI Maintenance Cost Estimator
              </span>
            </div>
            <h3 className="text-xl font-bold mt-1 text-white">
              {carTitle || `${year} ${brand} ${model}`}
            </h3>
            <p className="text-sm text-gray-300 mt-0.5">
              Based on vehicle age ({estimate.carAgeYears} yrs), {currentKm.toLocaleString()} km odometer & brand service metrics
            </p>
          </div>

          {/* Risk Tag Badge */}
          <div
            className={`flex items-center space-x-2 px-4 py-2 rounded-full border text-sm font-semibold shadow-sm backdrop-blur-sm ${badgeStyle.bg}`}
          >
            <span className={`w-2.5 h-2.5 rounded-full animate-ping ${badgeStyle.dot}`} />
            <ShieldAlert className={`w-4 h-4 ${badgeStyle.iconColor}`} />
            <span>{estimate.riskTag}</span>
          </div>
        </div>
      </div>

      {/* Primary Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-slate-50/50 border-b border-gray-100">
        {/* Monthly Cost Estimate */}
        <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-blue-600" />
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Estimated Monthly Upkeep
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-blue-700">
              ₹{estimate.monthlyCostEstimate.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500 font-medium"> / month</span>
          </div>
          <div className="text-xs text-gray-500">
            ₹{estimate.annualCostEstimate.toLocaleString()} estimated per year
          </div>
        </div>

        {/* Condition Multiplier Factor */}
        <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-amber-500" />
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Condition Multiplier
          </div>
          <div className="my-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-800">
              {estimate.conditionMultiplier.toFixed(2)}x
            </span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
              Base: ₹{estimate.baseAnnualCost.toLocaleString()}/yr
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Age factor ({estimate.ageMultiplier}x) × Mileage factor ({estimate.kmMultiplier}x)
          </div>
        </div>

        {/* Service Schedule Status */}
        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500" />
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Next Major Service
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold text-emerald-700">
              Due in {estimate.nextServiceKmDue.toLocaleString()} km
            </span>
          </div>
          <div className="text-xs text-emerald-600 font-medium flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Oil, filter & 40-point safety check
          </div>
        </div>
      </div>

      {/* Interactive Tabs Navigation */}
      <div className="flex border-b border-gray-200 px-6 bg-white">
        <button
          onClick={() => setActiveTab("insights")}
          className={`py-3 px-4 font-semibold text-sm border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === "insights"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Actionable Insights & Alerts ({estimate.actionableInsights.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("breakdown")}
          className={`py-3 px-4 font-semibold text-sm border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === "breakdown"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Cost Breakdown</span>
        </button>

        <button
          onClick={() => setActiveTab("forecast")}
          className={`py-3 px-4 font-semibold text-sm border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === "forecast"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>5-Year Forecast</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-6">
        {/* TAB 1: Insights & Component Predictions */}
        {activeTab === "insights" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-900 text-base">
                Predictive Maintenance Insights
              </h4>
              <span className="text-xs text-gray-500">
                Calculated from real service intervals & mileage wear models
              </span>
            </div>

            {/* Actionable Insights Pills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {estimate.actionableInsights.map((insight, idx) => (
                <div
                  key={idx}
                  className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 flex items-start space-x-3 transition-transform hover:translate-x-1"
                >
                  <div className="p-2 bg-blue-600 text-white rounded-lg mt-0.5">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-blue-950 text-sm">{insight}</p>
                    <p className="text-xs text-blue-700 mt-0.5">
                      Recommended item for pre-purchase inspection or routine service budget.
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Component Alert Cards */}
            {estimate.componentAlerts.length > 0 && (
              <div className="mt-6">
                <h5 className="font-semibold text-gray-800 text-sm mb-3">
                  Upcoming Component Attention & Estimated Costs
                </h5>
                <div className="space-y-3">
                  {estimate.componentAlerts.map((alert, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white hover:border-blue-200 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`p-2 rounded-lg mt-0.5 ${
                            alert.severity === "danger"
                              ? "bg-red-100 text-red-700"
                              : alert.severity === "warning"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          <Wrench className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-gray-900 text-sm">
                              {alert.component}
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded font-semibold ${
                                alert.severity === "danger"
                                  ? "bg-red-100 text-red-800"
                                  : alert.severity === "warning"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {alert.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-xs text-gray-500 block">Est. Component Cost</span>
                        <span className="font-bold text-gray-900 text-base">
                          ₹{alert.estimatedCost.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Cost Breakdown */}
        {activeTab === "breakdown" && (
          <div className="space-y-6">
            <h4 className="font-bold text-gray-900 text-base">
              Annual Maintenance Cost Distribution (₹{estimate.annualCostEstimate.toLocaleString()})
            </h4>

            {/* Visual Bar */}
            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex">
              <div
                style={{ width: "40%" }}
                className="bg-blue-600 h-full"
                title="Routine Servicing (40%)"
              />
              <div
                style={{ width: "30%" }}
                className="bg-amber-500 h-full"
                title="Wear & Tear Repairs (30%)"
              />
              <div
                style={{ width: "18%" }}
                className="bg-emerald-500 h-full"
                title="Tires & Brakes (18%)"
              />
              <div
                style={{ width: "12%" }}
                className="bg-purple-500 h-full"
                title="Contingency Buffer (12%)"
              />
            </div>

            {/* Grid Legend & Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center space-x-2 text-blue-700 text-xs font-bold uppercase">
                  <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
                  <span>Routine Servicing</span>
                </div>
                <div className="text-xl font-bold text-gray-900 mt-2">
                  ₹{estimate.costBreakdown.routineServicing.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">Oil, filters, fluids, spark plugs</div>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex items-center space-x-2 text-amber-700 text-xs font-bold uppercase">
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                  <span>Wear & Tear</span>
                </div>
                <div className="text-xl font-bold text-gray-900 mt-2">
                  ₹{estimate.costBreakdown.wearAndTearRepairs.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">Clutch, suspension, belts</div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold uppercase">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                  <span>Tires & Brakes</span>
                </div>
                <div className="text-xl font-bold text-gray-900 mt-2">
                  ₹{estimate.costBreakdown.tiresAndBrakes.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">Pad replacement, tire alignment</div>
              </div>

              <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                <div className="flex items-center space-x-2 text-purple-700 text-xs font-bold uppercase">
                  <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" />
                  <span>Unforeseen Buffer</span>
                </div>
                <div className="text-xl font-bold text-gray-900 mt-2">
                  ₹{estimate.costBreakdown.contingencyBuffer.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">Minor sensor or electrical fixes</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 5-Year Forecast */}
        {activeTab === "forecast" && (
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 text-base">
              5-Year Upkeep Forecast ({annualDrivenKm.toLocaleString()} km driven per year)
            </h4>

            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4">Year</th>
                    <th className="py-3 px-4">Car Age</th>
                    <th className="py-3 px-4">Est. Odometer</th>
                    <th className="py-3 px-4">Expected Maintenance Risk</th>
                    <th className="py-3 px-4 text-right">Annual Cost</th>
                    <th className="py-3 px-4 text-right">Monthly Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {estimate.fiveYearForecast.map((fc, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-gray-900">{fc.year}</td>
                      <td className="py-3 px-4 text-gray-600">{fc.forecastAge} years</td>
                      <td className="py-3 px-4 text-gray-600">{fc.forecastKm.toLocaleString()} km</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                            fc.riskTag.includes("Very High")
                              ? "bg-red-100 text-red-800"
                              : fc.riskTag.includes("High")
                              ? "bg-orange-100 text-orange-800"
                              : fc.riskTag.includes("Moderate")
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {fc.riskTag}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-gray-900">
                        ₹{fc.estimatedCost.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600">
                        ₹{Math.round(fc.estimatedCost / 12).toLocaleString()}/mo
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Customizer Sliders (If enabled) */}
      {showCustomizer && (
        <div className="bg-slate-900 text-white p-6 border-t border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-sm uppercase tracking-wider text-orange-400 flex items-center">
              <Gauge className="w-4 h-4 mr-2" /> Dynamic Mileage Adjuster
            </span>
            <span className="text-xs text-gray-400">
              Move sliders to see real-time cost changes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Odometer Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-300 mb-2">
                <span>Current Odometer Reading</span>
                <span className="text-orange-400 font-bold">{currentKm.toLocaleString()} km</span>
              </div>
              <input
                type="range"
                min={5000}
                max={150000}
                step={5000}
                value={currentKm}
                onChange={(e) => setCurrentKm(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>5,000 km</span>
                <span>80,000 km (High Maintenance Threshold)</span>
                <span>150,000 km</span>
              </div>
            </div>

            {/* Annual Usage Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-300 mb-2">
                <span>Expected Yearly Driving</span>
                <span className="text-blue-400 font-bold">{annualDrivenKm.toLocaleString()} km/year</span>
              </div>
              <input
                type="range"
                min={5000}
                max={30000}
                step={1000}
                value={annualDrivenKm}
                onChange={(e) => setAnnualDrivenKm(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>5,000 km/yr</span>
                <span>12,000 km/yr (Avg)</span>
                <span>30,000 km/yr</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
