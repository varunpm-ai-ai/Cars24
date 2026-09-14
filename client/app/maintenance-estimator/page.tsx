"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MaintenanceCard } from "@/components/maintenance/MaintenanceCard";
import {
  calculateLocalEstimate,
  MaintenanceEstimateResult,
} from "@/lib/maintenanceApi";
import {
  Wrench,
  Calculator,
  ShieldCheck,
  Zap,
  CheckCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Car,
} from "lucide-react";
import Link from "next/link";

const POPULAR_BRANDS = [
  { name: "Maruti", models: ["Swift", "Baleno", "FRONX", "Eeco", "Brezza", "Ertiga", "Dzire"] },
  { name: "Hyundai", models: ["Creta", "Venue", "i20", "Verna", "Grand i10"] },
  { name: "Honda", models: ["City", "Amaze", "Civic", "WR-V"] },
  { name: "Tata", models: ["Nexon", "Punch", "Altroz", "Harrier", "Safari"] },
  { name: "Mahindra", models: ["Thar", "XUV700", "Scorpio-N", "Bolero"] },
  { name: "Toyota", models: ["Fortuner", "Innova Crysta", "Urban Cruiser", "Glanza"] },
  { name: "Kia", models: ["Seltos", "Sonet", "Carens"] },
  { name: "Volkswagen", models: ["Virtus", "Polo", "Taigun"] },
  { name: "BMW", models: ["3 Series", "5 Series", "X1", "X3"] },
];

export default function MaintenanceEstimatorPage() {
  const [selectedBrand, setSelectedBrand] = useState("Maruti");
  const [selectedModel, setSelectedModel] = useState("Swift");
  const [selectedYear, setSelectedYear] = useState(2020);
  const [kmDriven, setKmDriven] = useState(80000);
  const [fuelType, setFuelType] = useState("Petrol");
  const [annualDriven, setAnnualDriven] = useState(12000);

  const availableModels =
    POPULAR_BRANDS.find((b) => b.name === selectedBrand)?.models || ["Standard Model"];

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    const models = POPULAR_BRANDS.find((b) => b.name === brand)?.models;
    if (models && models.length > 0) {
      setSelectedModel(models[0]);
    }
  };

  const estimateResult: MaintenanceEstimateResult = calculateLocalEstimate({
    brand: selectedBrand,
    model: selectedModel,
    year: selectedYear,
    kilometersDriven: kmDriven,
    fuelType: fuelType,
    annualKmEstimate: annualDriven,
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      <div>
        <Header />

        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
          <div className="max-w-7xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Smart Car Ownership Analytics</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Car Maintenance Cost Estimator
            </h1>
            <p className="max-w-2xl mx-auto text-slate-300 text-base sm:text-lg">
              Predict future upkeep expenses, service schedules & component wear before buying.
              Plan your ownership budget with confidence.
            </p>
          </div>
        </section>

        {/* Main Content Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          {/* Controls & Estimator Card Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Input Form (5 cols) */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/80 space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                <div className="p-2.5 bg-blue-600 text-white rounded-xl">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Vehicle Specifications</h2>
                  <p className="text-xs text-slate-500">Configure parameters for cost prediction</p>
                </div>
              </div>

              {/* Brand Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Brand / Manufacturer
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {POPULAR_BRANDS.slice(0, 6).map((b) => (
                    <button
                      key={b.name}
                      type="button"
                      onClick={() => handleBrandChange(b.name)}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${selectedBrand === b.name
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
                <select
                  value={selectedBrand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  className="mt-2 w-full p-2.5 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {POPULAR_BRANDS.map((b) => (
                    <option key={b.name} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Model Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Car Model
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full p-2.5 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {availableModels.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Selector */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Registration Year
                  </label>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    Age: {Math.max(0, 2026 - selectedYear)} yrs
                  </span>
                </div>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                  className="w-full p-2.5 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {Array.from({ length: 13 }, (_, i) => 2026 - i).map((y) => (
                    <option key={y} value={y}>
                      {y} {y === 2026 ? "(New)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Kilometers Driven Input & Presets */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Kilometers Driven (Odometer)
                  </label>
                  <span className="text-xs font-bold text-slate-900">
                    {kmDriven.toLocaleString()} km
                  </span>
                </div>

                <input
                  type="number"
                  value={kmDriven}
                  onChange={(e) => setKmDriven(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full p-2.5 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold mb-2"
                />

                {/* Quick Presets */}
                <div className="flex gap-2">
                  {[
                    { label: "15k (Low)", val: 15000 },
                    { label: "45k (Mid)", val: 45000 },
                    { label: "80k (High)", val: 80000 },
                    { label: "120k (Heavy)", val: 120000 },
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => setKmDriven(preset.val)}
                      className={`flex-1 py-1.5 px-2 text-[11px] font-semibold rounded-lg border text-center transition-all ${kmDriven === preset.val
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                        }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Fuel Type
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["Petrol", "Diesel", "CNG", "Electric"].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFuelType(f)}
                      className={`py-2 text-xs font-semibold rounded-xl border transition-all ${fuelType === f
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Output Maintenance Card (7 cols) */}
            <div className="lg:col-span-7">
              <MaintenanceCard
                initialEstimate={estimateResult}
                brand={selectedBrand}
                model={selectedModel}
                year={selectedYear}
                km={kmDriven}
                fuel={fuelType}
                showCustomizer={true}
              />
            </div>
          </div>

          {/* Educational Insights / Why It Matters Banner */}
          <section className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Buyer & Owner Guide
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">
                How Maintenance Multipliers Work
              </h3>
              <p className="text-slate-600 text-sm mt-1">
                Our predictive algorithm models real-world wear curves using brand spare-part pricing,
                scheduled service manuals, and condition-based multipliers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Age Multiplier</h4>
                <p className="text-xs text-slate-600">
                  Rubber seals, hoses, and suspension bushings degrade with time even on low-mileage cars.
                  A 6-year-old vehicle carries a ~1.6x multiplier.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Mileage Multiplier</h4>
                <p className="text-xs text-slate-600">
                  Passing 80,000 km requires major component replacements including timing belts, brake rotors,
                  and shock absorbers (1.5x - 1.8x multiplier).
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Actionable Predictions</h4>
                <p className="text-xs text-slate-600">
                  Receive upfront warnings like "Brake pads likely to need replacement soon" so you can negotiate
                  the car purchase price or budget accordingly.
                </p>
              </div>
            </div>
          </section>

          {/* Quick CTA to browse cars */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
            <div>
              <h3 className="text-2xl font-bold">Ready to find a low-maintenance car?</h3>
              <p className="text-blue-100 text-sm mt-1">
                Explore our certified inventory of thoroughly inspected used cars with full service history.
              </p>
            </div>
            <Link
              href="/buy-car"
              className="px-6 py-3.5 bg-white text-blue-700 font-bold text-sm rounded-xl shadow hover:bg-blue-50 transition-colors flex items-center space-x-2 whitespace-nowrap"
            >
              <span>Explore Verified Cars</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
