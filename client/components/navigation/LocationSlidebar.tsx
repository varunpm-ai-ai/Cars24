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
    { key: "Festive", label: "Festive Season (Oct - Jan)", icon: Flame },
    { key: "Summer", label: "Summer Trips (Mar - May)", icon: Sun },
    { key: "Winter", label: "Winter Fiscal Year-End", icon: Calendar },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex justify-end bg-slate-950/60 transition-all duration-300">
      <div
        className="relative w-full max-w-md h-full bg-white shadow-lg flex flex-col overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-blue-600 p-6 text-white shadow-sm">
          <button
            onClick={closeLocationDrawer}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-md transition-colors"
            aria-label="Close location slidebar"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-bold tracking-tight text-white">
            Location & City Selector
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            Filter car listings to your preferred city and view nearby service hubs.
          </p>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {/* Section 0: Auto-Detect GPS Location */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <LocateFixed className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                  GPS Auto-Detection
                </span>
              </div>
              {detectedCityName && (
                <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded">
                  Detected: {detectedCityName}
                </span>
              )}
            </div>

            <button
              onClick={detectUserLocation}
              disabled={isDetectingLocation}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md shadow-sm transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Navigation className={`w-4 h-4 ${isDetectingLocation ? "animate-spin" : ""}`} />
              <span>{isDetectingLocation ? "Detecting GPS Position..." : "Detect Current City via GPS"}</span>
            </button>
          </div>

          {/* Section 0.5: Geo-Fence Toggle */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-md flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Location Filter Mode
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
            <label className="flex items-center space-x-2 text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Select Your City</span>
            </label>

            <div className="grid grid-cols-1 gap-2">
              {LOCATION_PRESETS.map((preset) => {
                const isSelected = selectedPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setPreset(preset.id)}
                    className={`flex items-start p-3 rounded-md border text-left transition-colors ${
                      isSelected
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                    }`}
                  >
                    <MapPin className={`w-4 h-4 mr-2.5 mt-0.5 shrink-0 ${isSelected ? "text-blue-600" : "text-gray-400"}`} />
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
            <label className="flex items-center space-x-2 text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Seasonal Conditions</span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              {seasonsList.map((s) => {
                const Icon = s.icon;
                const isSelected = season === s.key;
                return (
                  <button
                    key={s.key}
                    onClick={() => setSeason(s.key)}
                    className={`flex flex-col p-3 rounded-md border text-left transition-colors ${
                      isSelected
                        ? "border-blue-600 bg-blue-50 font-bold text-blue-900"
                        : "border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-gray-50"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 mb-1.5 ${
                        isSelected ? "text-blue-600" : "text-gray-400"
                      }`}
                    />
                    <span className="text-xs">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 sticky bottom-0">
          <button
            onClick={closeLocationDrawer}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-md shadow-sm transition-colors"
          >
            Apply Location Filter
          </button>
        </div>
      </div>
    </div>
  );
};
