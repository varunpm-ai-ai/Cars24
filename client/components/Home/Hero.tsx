'use client';

import React, { useState } from "react";
import SearchInput from "../SearchInput";
import { useRouter } from "next/navigation";
import { Sparkles, SlidersHorizontal } from "lucide-react";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
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
          alt="Happy woman driving car"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 flex flex-col justify-center">
        <div className="mb-6">
          <h1 className="text-white text-3xl md:text-5xl font-extrabold mb-3 tracking-tight">
            Welcome to{" "}
            <span className="inline-flex items-center">
              <span className="bg-blue-600 text-white font-black py-1 px-2.5 rounded-lg text-2xl md:text-3xl mr-1 shadow-md">
                CARS
              </span>
              <span className="text-orange-500 font-black text-2xl md:text-3xl">24</span>
            </span>
          </h1>
          <div className="flex flex-col space-y-1">
            <h2 className="text-white/90 text-2xl md:text-4xl font-bold">
              Better drives, better lives.
            </h2>
            <p className="text-gray-300 text-sm md:text-base max-w-xl">
              Explore 100+ verified quality cars with instant auto-suggestions, fuzzy match intelligence, and personalized relevance ranking.
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
            <span className="text-xs text-blue-600 font-medium hidden sm:inline">
              100 Cars Available
            </span>
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
