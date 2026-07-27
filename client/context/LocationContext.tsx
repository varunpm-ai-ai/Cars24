"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { calculateRecommendedPrice, PricingResult } from "@/lib/Pricingapi";

export type RegionKey =
  | "Hilly"
  | "MonsoonMetro"
  | "MetroFuelSpike"
  | "Suburban"
  | "Coastal"
  | "Standard";

export type SeasonKey =
  | "Monsoon"
  | "Festive"
  | "Summer"
  | "Winter"
  | "Standard";

export type LocationPreset = {
  id: string;
  cityName: string;
  stateName: string;
  region: RegionKey;
  icon: string;
  description: string;
};

export const LOCATION_PRESETS: LocationPreset[] = [
  {
    id: "mumbai",
    cityName: "Mumbai / Kerala",
    stateName: "Monsoon & Heavy Rain Region",
    region: "MonsoonMetro",
    icon: "🌧️",
    description: "High demand for SUVs & High Ground Clearance cars due to waterlogging risk.",
  },
  {
    id: "manali",
    cityName: "Manali / Himachal / UK",
    stateName: "Hilly & Mountainous Terrain",
    region: "Hilly",
    icon: "⛰️",
    description: "High demand for 4x4 / AWD SUVs and Off-roaders for steep grade climbing.",
  },
  {
    id: "delhi",
    cityName: "Delhi NCR / Metro",
    stateName: "Fuel Price Spike & City Traffic",
    region: "MetroFuelSpike",
    icon: "⚡",
    description: "Surge in EVs, CNG & compact hatchbacks. Penalty on heavy petrol SUVs.",
  },
  {
    id: "bengaluru",
    cityName: "Bengaluru / Tech Hub",
    stateName: "Urban Traffic & Commute",
    region: "MetroFuelSpike",
    icon: "🚗",
    description: "High demand for Automatic Hatchbacks and Electric Vehicles.",
  },
  {
    id: "goa",
    cityName: "Goa / Coastal Belt",
    stateName: "Coastal & Tourism Zone",
    region: "Coastal",
    icon: "🏖️",
    description: "Steady demand for compact cruisers, convertibles, and EVs.",
  },
  {
    id: "standard",
    cityName: "National Average",
    stateName: "Standard Market Baseline",
    region: "Standard",
    icon: "🏙️",
    description: "Balanced market valuation baseline across India.",
  },
];

type LocationContextType = {
  selectedPreset: LocationPreset;
  season: SeasonKey;
  isFuelSpikeActive: boolean;
  isLocationDrawerOpen: boolean;
  setPreset: (presetId: string) => void;
  setSeason: (season: SeasonKey) => void;
  setIsFuelSpikeActive: (active: boolean) => void;
  openLocationDrawer: () => void;
  closeLocationDrawer: () => void;
  getPriceRecommendation: (
    basePriceNumeric: number,
    bodyType?: string,
    fuelType?: string
  ) => Promise<PricingResult>;
};

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<LocationPreset>(
    LOCATION_PRESETS[0] // Default Mumbai / Monsoon
  );
  const [season, setSeasonState] = useState<SeasonKey>("Monsoon");
  const [isFuelSpikeActive, setIsFuelSpikeActiveState] = useState<boolean>(true);
  const [isLocationDrawerOpen, setIsLocationDrawerOpen] =
    useState<boolean>(false);

  useEffect(() => {
    const savedPresetId = localStorage.getItem("user_selected_location");
    if (savedPresetId) {
      const found = LOCATION_PRESETS.find((p) => p.id === savedPresetId);
      if (found) setSelectedPreset(found);
    }

    const savedSeason = localStorage.getItem("user_selected_season");
    if (savedSeason) setSeasonState(savedSeason as SeasonKey);

    const savedFuel = localStorage.getItem("user_fuel_spike");
    if (savedFuel !== null) setIsFuelSpikeActiveState(savedFuel === "true");
  }, []);

  const setPreset = (presetId: string) => {
    const found = LOCATION_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setSelectedPreset(found);
      localStorage.setItem("user_selected_location", presetId);
    }
  };

  const setSeason = (s: SeasonKey) => {
    setSeasonState(s);
    localStorage.setItem("user_selected_season", s);
  };

  const setIsFuelSpikeActive = (active: boolean) => {
    setIsFuelSpikeActiveState(active);
    localStorage.setItem("user_fuel_spike", String(active));
  };

  const openLocationDrawer = () => setIsLocationDrawerOpen(true);
  const closeLocationDrawer = () => setIsLocationDrawerOpen(false);

  const getPriceRecommendation = async (
    basePriceNumeric: number,
    bodyType?: string,
    fuelType?: string
  ): Promise<PricingResult> => {
    return await calculateRecommendedPrice({
      basePrice: basePriceNumeric,
      bodyType: bodyType || "SUV",
      fuelType: fuelType || "Petrol",
      region: selectedPreset.region,
      season: season,
      isFuelSpikeActive: isFuelSpikeActive,
    });
  };

  return (
    <LocationContext.Provider
      value={{
        selectedPreset,
        season,
        isFuelSpikeActive,
        isLocationDrawerOpen,
        setPreset,
        setSeason,
        setIsFuelSpikeActive,
        openLocationDrawer,
        closeLocationDrawer,
        getPriceRecommendation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
