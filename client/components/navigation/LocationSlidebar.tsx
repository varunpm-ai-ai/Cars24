"use client";

import React from "react";
import { useLocation, LOCATION_PRESETS, SeasonKey } from "@/context/LocationContext";
import {
  MapPin,
  X,
  Sparkles,
  TrendingUp,
  Sun,
  CloudRain,
  Zap,
  Calendar,
  Flame,
  Check,
  Navigation,
  Shield,
  LocateFixed,
} from "lucide-react";

export const LocationSlidebar: React.FC = () => {
  const {
    selectedPreset,
    season,
    isFuelSpikeActive,
    isLocationDrawerOpen,
    isGeoFenceActive,
    isDetectingLocation,
    detectedCityName,
    closeLocationDrawer,
    setPreset,
    setSeason,
    setIsFuelSpikeActive,
    toggleGeoFence,
    detectUserLocation,
  } = useLocation();

  if (!isLocationDrawerOpen) return null;

  const seasonsList: { key: SeasonKey; label: string; icon: any }[] = [
    { key: "Monsoon", label: "Monsoon (Jun - Sep)", icon: CloudRain },
    { key: "Festive", label: "Festive Surge (Oct - Jan)", icon: Sparkles },
    { key: "Summer", label: "Summer Trips (Mar - May)", icon: Sun },
    { key: "Winter", label: "Winter Fiscal Year-End", icon: Calendar },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex justify-end bg-slate-950/60 backdrop-blur-sm transition-all duration-300 animate-in fade-in">
      <div
        className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 p-6 text-white shadow-md">
          <button
            onClick={closeLocationDrawer}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close location slidebar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-orange-400 font-semibold text-xs uppercase tracking-widest mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Geo-Fence & Market Engine</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white">
            Location & City Selector
          </h2>
          <p className="text-xs text-blue-200 mt-1">
            Filter car listings geographically to your current or preferred city and view nearby service hubs.
          </p>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {/* Section 0: Auto-Detect GPS Location */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <LocateFixed className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-black text-blue-950 uppercase tracking-wider">
                  GPS Auto-Detection
                </span>
              </div>
              {detectedCityName && (
                <span className="text-[10px] font-extrabold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                  Detected: {detectedCityName}
                </span>
              )}
            </div>

            <button
              onClick={detectUserLocation}
              disabled={isDetectingLocation}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
            >
              <Navigation className={`w-4 h-4 ${isDetectingLocation ? "animate-spin" : ""}`} />
              <span>{isDetectingLocation ? "Detecting GPS Position..." : "Detect Current City via GPS"}</span>
            </button>
          </div>

          {/* Section 0.5: Geo-Fence Toggle */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-900">
                  Strict Geo-Fencing Filter
                </p>
                <p className="text-[11px] text-slate-600">
                  {isGeoFenceActive
                    ? `Showing only listings in ${selectedPreset.cityName}`
                    : "Show listings across all cities"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleGeoFence()}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isGeoFenceActive ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isGeoFenceActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Section 1: City Selection */}
          <div>
            <label className="flex items-center space-x-2 text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-3">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Select Your City / Market Zone</span>
            </label>

            <div className="grid grid-cols-1 gap-2.5">
              {LOCATION_PRESETS.map((preset) => {
                const isSelected = selectedPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setPreset(preset.id)}
                    className={`flex items-start p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-sm"
                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-2xl mr-3">{preset.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-bold ${
                            isSelected ? "text-blue-900" : "text-gray-900"
                          }`}
                        >
                          {preset.cityName}
                        </span>
                        {isSelected && (
                          <span className="bg-blue-600 text-white rounded-full p-0.5">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        {preset.stateName}
                      </p>
                      <p className="text-[11px] text-gray-600 mt-1 line-clamp-2">
                        {preset.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Seasonal Trends */}
          <div className="border-t border-gray-100 pt-5">
            <label className="flex items-center space-x-2 text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-3">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Seasonal Market Conditions</span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              {seasonsList.map((s) => {
                const Icon = s.icon;
                const isSelected = season === s.key;
                return (
                  <button
                    key={s.key}
                    onClick={() => setSeason(s.key)}
                    className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 font-bold text-indigo-900"
                        : "border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-gray-50"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 mb-1.5 ${
                        isSelected ? "text-indigo-600" : "text-gray-400"
                      }`}
                    />
                    <span className="text-xs">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Macro Economic Factors */}
          <div className="border-t border-gray-100 pt-5">
            <label className="flex items-center space-x-2 text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-3">
              <Zap className="w-4 h-4 text-orange-500" />
              <span>Macro Economic Factors</span>
            </label>

            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">
                    Fuel Price Surge Factor
                  </p>
                  <p className="text-[11px] text-gray-600">
                    Boosts Hatchback & EV values; reduces petrol SUV demand.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFuelSpikeActive(!isFuelSpikeActive)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isFuelSpikeActive ? "bg-orange-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isFuelSpikeActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 sticky bottom-0">
          <button
            onClick={closeLocationDrawer}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-sm rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all"
          >
            Apply Location & Filter Listings
          </button>
        </div>
      </div>
    </div>
  );
};
