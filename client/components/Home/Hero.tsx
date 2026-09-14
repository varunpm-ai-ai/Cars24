"use client";

import React, { useState } from "react";
import SearchInput from "../SearchInput";
import { useLocation } from "@/context/LocationContext";
import { useRouter } from "next/navigation";
import { Sparkles, SlidersHorizontal, TrendingUp } from "lucide-react";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedPreset, openLocationDrawer } = useLocation();
  const router = useRouter();

  const quickFilters = [
    { label: "Automatic Cars", query: "Automatic" },
    { label: "Petrol SUVs", query: "Petrol SUV" },
    { label: "Hyundai Creta", query: "Hyundai Creta" },
    { label: "Tata Nexon", query: "Tata Nexon" },
    { label: "Maruti Baleno", query: "Maruti Baleno" },
    { label: "1st Owner Cars", query: "1st Owner" },
    { label: "Cars in Bengaluru", query: "Bengaluru" },
  ];

  const handleChipClick = (q: string) => {
    router.push(`/buy-car?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="relative min-h-[520px] w-full flex items-center">
      {/* Background image & gradient overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg"
          alt="Cars24 Dynamic Marketplace"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 flex flex-col justify-center">
        <div className="mb-6 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 backdrop-blur-md px-3.5 py-1.5 rounded-full text-blue-300 text-xs font-extrabold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>AI Dynamic Pricing & Multi-Tenant Platform</span>
          </div>

          <h1 className="text-white text-3xl sm:text-4xl font-extrabold mb-2 flex items-center flex-wrap gap-2">
            <span>Welcome to</span>
            <span className="inline-flex items-center">
              <span className="bg-blue-600 text-white font-black py-1 px-2.5 rounded-lg text-lg tracking-wider">
                CARS
              </span>
              <span className="text-orange-500 font-black text-xl ml-0.5">24</span>
            </span>
          </h1>

          <div className="flex flex-col space-y-1">
            <h2 className="text-white text-3xl sm:text-5xl font-black tracking-tight">
              Smarter Decisions.
            </h2>
            <h2 className="text-orange-400 text-3xl sm:text-5xl font-black tracking-tight">
              Real-World Demand Pricing.
            </h2>
            <p className="text-gray-300 text-sm md:text-base max-w-xl mt-2">
              Explore verified quality cars with instant auto-suggestions, predictive typing, and regional dynamic market pricing.
            </p>
          </div>
        </div>

        {/* Enhanced Search bar container */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 md:p-6 max-w-4xl w-full border border-white/20">
          <div className="mb-3 flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
              <span>Smart Car Finder (Auto-Suggestions & Predictive Search)</span>
            </label>

            {/* Location Switcher Pill */}
            <button
              type="button"
              onClick={openLocationDrawer}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200/80 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-xs"
            >
              <span>{selectedPreset.icon}</span>
              <span className="truncate max-w-[120px]">{selectedPreset.cityName.split("/")[0]}</span>
              <TrendingUp className="w-3.5 h-3.5 text-blue-600 ml-0.5" />
            </button>
          </div>

          {/* Predictive Search Input Component */}
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            navigateToBuyPage={true}
            placeholder="Type any car brand, model, fuel or city (e.g. Creta, Automatic, Petrol in Delhi)..."
          />

          {/* Quick Filter Tags / Chips */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 font-semibold flex items-center gap-1">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Popular Searches:
            </span>
            {quickFilters.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(chip.query)}
                className="bg-gray-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-transparent text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-150"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
