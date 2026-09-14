"use client";

import React, { useState } from "react";
import SearchInput from "../SearchInput";
import { useLocation } from "@/context/LocationContext";
import { useRouter } from "next/navigation";
import { MapPin, SlidersHorizontal, TrendingUp } from "lucide-react";

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
    <div className="relative min-h-[520px] w-full flex items-center justify-center">
      {/* Background image & overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg"
          alt="Cars24 Dynamic Marketplace"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 flex flex-col items-center justify-center text-center">
        <div className="mb-6 max-w-3xl flex flex-col items-center">
          <div className="inline-flex items-center space-x-2 bg-blue-600 text-white px-3.5 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider mb-3">
            <span>Car Search & Market Pricing</span>
          </div>

          <h1 className="text-white text-3xl sm:text-4xl font-extrabold mb-2 flex items-center justify-center flex-wrap gap-2 text-center">
            <span>Welcome to</span>
            <span className="inline-flex items-center">
              <span className="bg-blue-600 text-white font-bold py-1 px-2.5 rounded text-lg tracking-wider">
                CARS
              </span>
              <span className="text-orange-500 font-bold text-xl ml-0.5">24</span>
            </span>
          </h1>

          <div className="flex flex-col items-center space-y-1 text-center">
            <h2 className="text-white text-3xl sm:text-5xl font-black tracking-tight">
              Smarter Decisions.
            </h2>
            <h2 className="text-orange-400 text-3xl sm:text-5xl font-black tracking-tight">
              Real-World Demand Pricing.
            </h2>
            <p className="text-gray-300 text-sm md:text-base max-w-xl mt-2 text-center">
              Explore verified quality cars with instant search auto-suggestions and regional market pricing.
            </p>
          </div>
        </div>

        {/* Search bar container */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 max-w-4xl w-full border border-gray-200 text-left mx-auto">
          <div className="mb-3 flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
              <span>Find a Car</span>
            </label>

            {/* Location Switcher Button */}
            <button
              type="button"
              onClick={openLocationDrawer}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-md text-xs font-semibold transition-colors flex items-center space-x-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span className="truncate max-w-[120px]">{selectedPreset.cityName.split("/")[0]}</span>
            </button>
          </div>

          {/* Search Input Component */}
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            navigateToBuyPage={true}
            placeholder="Type any car brand, model, fuel or city (e.g. Creta, Automatic, Petrol in Delhi)..."
          />

          {/* Quick Filter Tags / Chips */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-gray-500 font-semibold flex items-center gap-1">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Popular Searches:
            </span>
            {quickFilters.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(chip.query)}
                className="bg-gray-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-transparent text-gray-700 text-xs font-medium px-3 py-1 rounded-full transition-colors"
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
