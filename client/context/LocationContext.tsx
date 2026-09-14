"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { calculateRecommendedPrice, PricingResult } from "@/lib/Pricingapi";
import { CITIES, CityLocation, findClosestCity, CARS_HUBS, CarsHub, getHubsForCity } from "@/lib/hubsData";

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
  lat?: number;
  lng?: number;
};

export const LOCATION_PRESETS: LocationPreset[] = CITIES.map((c) => ({
  id: c.id,
  cityName: c.cityName,
  stateName: c.stateName,
  region: c.region,
  icon: c.icon,
  description: c.description,
  lat: c.lat,
  lng: c.lng,
}));

type LocationContextType = {
  selectedPreset: LocationPreset;
  season: SeasonKey;
  isFuelSpikeActive: boolean;
  isLocationDrawerOpen: boolean;
  isGeoFenceActive: boolean;
  userCoordinates: { lat: number; lng: number } | null;
  detectedCityName: string | null;
  isDetectingLocation: boolean;
  nearbyHubs: CarsHub[];
  setPreset: (presetId: string) => void;
  setSeason: (season: SeasonKey) => void;
  setIsFuelSpikeActive: (active: boolean) => void;
  toggleGeoFence: (active?: boolean) => void;
  detectUserLocation: () => Promise<void>;
  isCarInGeoFence: (carLocation: string) => boolean;
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
    LOCATION_PRESETS[0] // Default Mumbai
  );
  const [season, setSeasonState] = useState<SeasonKey>("Monsoon");
  const [isFuelSpikeActive, setIsFuelSpikeActiveState] = useState<boolean>(true);
  const [isLocationDrawerOpen, setIsLocationDrawerOpen] = useState<boolean>(false);
  const [isGeoFenceActive, setIsGeoFenceActive] = useState<boolean>(true);
  const [userCoordinates, setUserCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [detectedCityName, setDetectedCityName] = useState<string | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);

  useEffect(() => {
    const savedPresetId = localStorage.getItem("user_selected_location");
    if (savedPresetId) {
      const found = LOCATION_PRESETS.find((p) => p.id === savedPresetId);
      if (found) setSelectedPreset(found);
    }

    const savedGeoFence = localStorage.getItem("user_geofence_active");
    if (savedGeoFence !== null) {
      setIsGeoFenceActive(savedGeoFence === "true");
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

  const toggleGeoFence = (active?: boolean) => {
    setIsGeoFenceActive((prev) => {
      const nextState = active !== undefined ? active : !prev;
      localStorage.setItem("user_geofence_active", String(nextState));
      return nextState;
    });
  };

  const detectUserLocation = async (): Promise<void> => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsDetectingLocation(true);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserCoordinates({ lat, lng });

          // Find matching city by coordinates
          const matchedCity = findClosestCity(lat, lng);
          if (matchedCity) {
            setPreset(matchedCity.id);
            setDetectedCityName(matchedCity.cityName);
          }

          setIsDetectingLocation(false);
          resolve();
        },
        (error) => {
          console.warn("Geolocation error:", error);
          // Fallback to default city gracefully
          setIsDetectingLocation(false);
          resolve();
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  };

  const isCarInGeoFence = (carLocation: string): boolean => {
    if (!isGeoFenceActive || selectedPreset.id === "standard") return true;
    if (!carLocation) return true;

    const locLower = carLocation.toLowerCase();
    const cityMeta = CITIES.find((c) => c.id === selectedPreset.id);

    if (!cityMeta) return true;

    // Check if car location contains any of the city keywords
    return cityMeta.searchKeywords.some((keyword) => locLower.includes(keyword));
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

  const nearbyHubs = getHubsForCity(selectedPreset.id);

  return (
    <LocationContext.Provider
      value={{
        selectedPreset,
        season,
        isFuelSpikeActive,
        isLocationDrawerOpen,
        isGeoFenceActive,
        userCoordinates,
        detectedCityName,
        isDetectingLocation,
        nearbyHubs,
        setPreset,
        setSeason,
        setIsFuelSpikeActive,
        toggleGeoFence,
        detectUserLocation,
        isCarInGeoFence,
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
