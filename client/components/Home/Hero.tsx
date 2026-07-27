"use client";

import { Search, MapPin, TrendingUp, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { useLocation } from "@/context/LocationContext";
import { useRouter } from "next/navigation";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedPreset, openLocationDrawer } = useLocation();
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/buy-car`);
  };

  return (
    <div className="relative min-h-[520px] w-full flex items-center">
      {/* Background image */}
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
          </div>

          <p className="text-xs sm:text-sm text-gray-300 mt-4 leading-relaxed">
            Discover cars dynamically valued by regional terrain demand and seasonal trends across India.
          </p>
        </div>

        {/* Search bar and location pill */}
        <div className="bg-white rounded-3xl shadow-2xl p-4 md:p-6 max-w-4xl w-full border border-gray-100">
          <form onSubmit={handleSearchSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Search input */}
              <div className="relative flex-1 w-full">
                <div className="flex items-center border border-gray-200 rounded-2xl overflow-hidden bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                  <div className="pl-4 text-gray-400">
                    <Search className="h-5 w-5" />
                  </div>
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search SUV, Swift, Creta, City..."
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900 text-sm font-medium py-3"
                  />
                </div>
              </div>

              {/* Location Switcher Pill */}
              <button
                type="button"
                onClick={openLocationDrawer}
                className="w-full sm:w-auto px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200/80 rounded-2xl text-xs font-bold transition-all flex items-center justify-center space-x-2 shrink-0 shadow-xs"
              >
                <span>{selectedPreset.icon}</span>
                <span className="truncate max-w-[140px]">{selectedPreset.cityName}</span>
                <TrendingUp className="w-3.5 h-3.5 text-blue-600 ml-1" />
              </button>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full sm:w-auto py-3 px-7 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs rounded-2xl shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all shrink-0"
              >
                Search Cars
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Hero;
