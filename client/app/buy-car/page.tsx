"use client";

<<<<<<< HEAD
import React, { useEffect, useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Heart,
  RotateCcw,
  Sparkles,
  Car as CarIcon,
  Fuel,
  Gauge,
  Calendar,
  MapPin,
  Check,
  X,
  Filter,
  ArrowUpDown,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import SearchInput from "@/components/SearchInput";
import {
  getAllCars,
  getUniqueBrands,
  getUniqueFuels,
  getUniqueTransmissions,
  getUniqueLocations,
  getUniqueOwners,
  CarItem,
} from "@/lib/carsData";
import {
  rankCars,
  SearchFilterState,
  SortOption,
  RankedCar,
  getSearchSuggestions,
} from "@/lib/searchEngine";

=======
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { getcarSummaries } from "@/lib/Carapi";
import { useLocation } from "@/context/LocationContext";
import { useAuth } from "@/context/AuthContext";
import { InteractiveLocationMap } from "@/components/location/InteractiveLocationMap";
import {
  ChevronDown,
  Heart,
  Search,
  Sliders,
  MapPin,
  TrendingUp,
  Sparkles,
  Zap,
  Lock,
  Shield,
  Navigation,
  CheckCircle2,
  Globe,
} from "lucide-react";
import Link from "next/link";

const mockCarsList = [
  {
    id: "fronx-2023",
    title: "2023 Maruti FRONX DELTA PLUS 1.2L AGS",
    km: "10,048 km",
    fuel: "Petrol",
    transmission: "Auto",
    owner: "1st owner",
    emi: "₹15,245/m",
    price: "₹7.80 lakh",
    basePriceNumeric: 780000,
    bodyType: "SUV",
    location: "Metro Walk, Rohini, New Delhi",
    image: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
  },
  {
    id: "swift-2017",
    title: "2017 Maruti Swift VXI (O)",
    km: "60,056 km",
    fuel: "Petrol",
    transmission: "Manual",
    owner: "1st owner",
    emi: "₹7,214/m",
    price: "₹3.69 lakh",
    basePriceNumeric: 369000,
    bodyType: "Hatchback",
    location: "Metro Walk, Rohini, New Delhi",
    image: "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg",
  },
  {
    id: "creta-2021",
    title: "2021 Hyundai Creta SX IVT",
    km: "20,500 km",
    fuel: "Petrol",
    transmission: "Auto",
    owner: "1st owner",
    emi: "₹18,999/m",
    price: "₹11.20 lakh",
    basePriceNumeric: 1120000,
    bodyType: "SUV",
    location: "Sector 29, Gurugram",
    image: "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
  },
  {
    id: "baleno-2020",
    title: "2020 Maruti Baleno ZETA",
    km: "30,000 km",
    fuel: "Petrol",
    transmission: "Manual",
    owner: "2nd owner",
    emi: "₹10,600/m",
    price: "₹6.45 lakh",
    basePriceNumeric: 645000,
    bodyType: "Hatchback",
    location: "Karol Bagh, New Delhi",
    image: "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg",
  },
  {
    id: "city-2019",
    title: "2019 Honda City ZX CVT",
    km: "25,000 km",
    fuel: "Petrol",
    transmission: "Auto",
    owner: "1st owner",
    emi: "₹16,500/m",
    price: "₹9.95 lakh",
    basePriceNumeric: 995000,
    bodyType: "Sedan",
    location: "South Ex, New Delhi",
    image: "https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg",
  },
  {
    id: "venue-2022",
    title: "2022 Hyundai Venue SX Turbo",
    km: "12,000 km",
    fuel: "Petrol",
    transmission: "Auto",
    owner: "1st owner",
    emi: "₹14,875/m",
    price: "₹9.40 lakh",
    basePriceNumeric: 940000,
    bodyType: "SUV",
    location: "Noida Sector 63, Uttar Pradesh",
    image: "https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg",
  },
  {
    id: "kia-sonet-2023",
    title: "2023 Kia Sonet GTX+",
    km: "15,400 km",
    fuel: "Petrol",
    transmission: "Auto",
    owner: "1st owner",
    emi: "₹22,900/m",
    price: "₹13.80 lakh",
    basePriceNumeric: 1380000,
    bodyType: "SUV",
    location: "Andheri West, Mumbai",
    image: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
  },
  {
    id: "thar-2022",
    title: "2022 Mahindra Thar LX 4x4",
    km: "18,200 km",
    fuel: "Diesel",
    transmission: "Manual",
    owner: "1st owner",
    emi: "₹23,500/m",
    price: "₹14.50 lakh",
    basePriceNumeric: 1450000,
    bodyType: "SUV",
    location: "Mall Road Zone, Manali",
    image: "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
  },
  {
    id: "nexon-ev-2023",
    title: "2023 Tata Nexon EV Max Lux",
    km: "14,100 km",
    fuel: "Electric",
    transmission: "Auto",
    owner: "1st owner",
    emi: "₹24,100/m",
    price: "₹14.90 lakh",
    basePriceNumeric: 1490000,
    bodyType: "EV",
    location: "Whitefield, Bengaluru",
    image: "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg",
  },
];

interface CarCardItem {
  id: string;
  title: string;
  km: string;
  fuel: string;
  transmission: string;
  owner: string;
  emi: string;
  price: string;
  basePriceNumeric?: number;
  recommendedPriceNumeric?: number;
  bodyType?: string;
  location: string;
  image: string;
}

>>>>>>> feature/multitenent-backend
function LoaderCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse overflow-hidden">
      <div className="h-48 bg-gray-200" />
<<<<<<< HEAD
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
=======
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
>>>>>>> feature/multitenent-backend
      </div>
    </div>
  );
}

<<<<<<< HEAD
function BuyCarContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const allCars = useMemo(() => getAllCars(), []);
  const availableBrands = useMemo(() => getUniqueBrands(), []);
  const availableFuels = useMemo(() => getUniqueFuels(), []);
  const availableTransmissions = useMemo(() => getUniqueTransmissions(), []);
  const availableLocations = useMemo(() => getUniqueLocations(), []);
  const availableOwners = useMemo(() => getUniqueOwners(), []);

  // Filter State
  const [query, setQuery] = useState(initialQuery);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedOwners, setSelectedOwners] = useState<string[]>([]);

  // Range States
  const [priceRange, setPriceRange] = useState<number[]>([0, 2500000]); // 0 to 25 Lakhs
  const [kmRange, setKmRange] = useState<number[]>([0, 100000]);       // 0 to 100,000 km
  const [yearRange, setYearRange] = useState<number[]>([2015, 2024]);

  // Sort State
  const [sortBy, setSortBy] = useState<SortOption>("relevance");

  // Mobile Filter Drawer Toggle
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync initial query param if changed
  useEffect(() => {
    if (searchParams.get("q")) {
      setQuery(searchParams.get("q") || "");
    }
  }, [searchParams]);

  // Combine filter state
  const currentFilters: SearchFilterState = useMemo(() => {
    return {
      query,
      brands: selectedBrands.length > 0 ? selectedBrands : undefined,
      fuels: selectedFuels.length > 0 ? selectedFuels : undefined,
      transmissions: selectedTransmissions.length > 0 ? selectedTransmissions : undefined,
      locations: selectedLocations.length > 0 ? selectedLocations : undefined,
      owners: selectedOwners.length > 0 ? selectedOwners : undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minKm: kmRange[0],
      maxKm: kmRange[1],
      minYear: yearRange[0],
      maxYear: yearRange[1],
>>>>>>> feature/auto-suggestions
    };
  }, [
    query,
    selectedBrands,
    selectedFuels,
    selectedTransmissions,
    selectedLocations,
    selectedOwners,
    priceRange,
    kmRange,
    yearRange,
  ]);

  // Compute Ranked Results
  const rankedResults: RankedCar[] = useMemo(() => {
    return rankCars(allCars, currentFilters, sortBy);
  }, [allCars, currentFilters, sortBy]);

  // Compute Fuzzy Suggestions for Search
  const suggestionsResult = useMemo(() => {
    return getSearchSuggestions(query, allCars);
  }, [query, allCars]);

  // Reset all filters
  const handleResetFilters = () => {
    setQuery("");
    setSelectedBrands([]);
    setSelectedFuels([]);
    setSelectedTransmissions([]);
    setSelectedLocations([]);
    setSelectedOwners([]);
    setPriceRange([0, 2500000]);
    setKmRange([0, 100000]);
    setYearRange([2015, 2024]);
    setSortBy("relevance");
  };

  // Toggle helper for arrays
  const toggleArrayItem = (item: string, currentList: string[], setList: (val: string[]) => void) => {
    if (currentList.includes(item)) {
      setList(currentList.filter((i) => i !== item));
    } else {
      setList([...currentList, item]);
    }
  };

  // Active filters count
  const activeFilterCount =
    (selectedBrands.length ? 1 : 0) +
    (selectedFuels.length ? 1 : 0) +
    (selectedTransmissions.length ? 1 : 0) +
    (selectedLocations.length ? 1 : 0) +
    (selectedOwners.length ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 2500000 ? 1 : 0) +
    (kmRange[0] > 0 || kmRange[1] < 100000 ? 1 : 0) +
    (yearRange[0] > 2015 || yearRange[1] < 2024 ? 1 : 0) +
    (query ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-blue-900/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-orange-400 mb-1">
              <Sparkles className="h-4 w-4" />
              <span>Smart AI Search & Relevance Engine</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Buy Verified Used Cars in India
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Instant auto-suggestions, predictive typing, fuzzy matching, and multi-attribute relevance scoring across 100 certified cars.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 px-4 border border-white/15 text-xs flex items-center space-x-4">
            <div className="text-center">
              <div className="text-lg font-extrabold text-blue-400">{allCars.length}</div>
              <div className="text-slate-300">Total Cars</div>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center">
              <div className="text-lg font-extrabold text-orange-400">{rankedResults.length}</div>
              <div className="text-slate-300">Matching Results</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Controls: Search Input Bar & Sort Selector */}
        <div className="mb-6 bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Enhanced Search Input */}
          <div className="flex-1">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search by title, brand, fuel, transmission, city (e.g., Hyundai Creta, Petrol, Automatic)..."
            />
          </div>

          {/* Controls: Mobile Filter Button & Sort Dropdown */}
          <div className="flex items-center space-x-3 justify-between md:justify-end">
            
            {/* Mobile Filter Toggle */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsMobileFilterOpen(true)}
              className="md:hidden flex items-center space-x-2 border-slate-300 text-slate-700"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-blue-600 text-white rounded-full text-xs px-2 py-0.5 font-bold">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {/* Sort Selector */}
            <div className="flex items-center space-x-2">
              <ArrowUpDown className="h-4 w-4 text-slate-400 hidden sm:inline" />
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="relevance">⚡ Relevance (Recommended)</option>
                <option value="price_asc">💰 Price: Low to High</option>
                <option value="price_desc">💎 Price: High to Low</option>
                <option value="km_asc">🏎️ Mileage: Lowest First</option>
                <option value="year_desc">📅 Year: Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Badges Bar */}
        {activeFilterCount > 0 && (
          <div className="mb-6 bg-blue-50/60 border border-blue-100 rounded-xl p-3 px-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1">
              <SlidersHorizontal className="h-3.5 w-3.5 text-blue-600" /> Active Filters:
            </span>

            {query && (
              <span className="inline-flex items-center gap-1 bg-white border border-blue-200 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-lg shadow-2xs">
                <span>Query: "{query}"</span>
                <button type="button" onClick={() => setQuery("")} className="text-blue-500 hover:text-blue-700">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedBrands.map((b) => (
              <span key={b} className="inline-flex items-center gap-1 bg-white border border-blue-200 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-lg shadow-2xs">
                <span>Make: {b}</span>
                <button type="button" onClick={() => toggleArrayItem(b, selectedBrands, setSelectedBrands)} className="text-blue-500 hover:text-blue-700">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}

            {selectedFuels.map((f) => (
              <span key={f} className="inline-flex items-center gap-1 bg-white border border-blue-200 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-lg shadow-2xs">
                <span>Fuel: {f}</span>
                <button type="button" onClick={() => toggleArrayItem(f, selectedFuels, setSelectedFuels)} className="text-blue-500 hover:text-blue-700">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}

            {selectedTransmissions.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 bg-white border border-blue-200 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-lg shadow-2xs">
                <span>Transmission: {t}</span>
                <button type="button" onClick={() => toggleArrayItem(t, selectedTransmissions, setSelectedTransmissions)} className="text-blue-500 hover:text-blue-700">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}

            {selectedLocations.map((loc) => (
              <span key={loc} className="inline-flex items-center gap-1 bg-white border border-blue-200 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-lg shadow-2xs">
                <span>City: {loc}</span>
                <button type="button" onClick={() => toggleArrayItem(loc, selectedLocations, setSelectedLocations)} className="text-blue-500 hover:text-blue-700">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-bold text-red-600 hover:text-red-800 ml-auto flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="h-3 w-3" /> Clear All Filters
            </button>
          </div>
        )}

        {/* Main Grid: Filters Sidebar + Cars Listing */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Filter Sidebar (Desktop) */}
          <div className="hidden md:block md:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-6 sticky top-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                  <SlidersHorizontal className="h-4 w-4 text-blue-600" />
                  <span>Advanced Filters</span>
                </h3>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Price Range Filter */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Price Range (₹)
                  </label>
                  <span className="text-xs font-bold text-blue-600">
                    ₹{(priceRange[0] / 100000).toFixed(1)}L - ₹{(priceRange[1] / 100000).toFixed(1)}L
                  </span>
                </div>
                <Slider
                  defaultValue={[0, 2500000]}
                  min={0}
                  max={2500000}
                  step={50000}
                  value={priceRange}
                  onValueChange={(val) => setPriceRange(val as number[])}
                  className="mt-2"
                />
                <div className="flex justify-between mt-2 text-[11px] text-slate-400 font-medium">
                  <span>₹0</span>
                  <span>₹10L</span>
                  <span>₹25L+</span>
                </div>
                {/* Budget Quick Chips */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  <button
                    type="button"
                    onClick={() => setPriceRange([0, 500000])}
                    className="text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 px-2 py-1 rounded-md font-medium"
                  >
                    Under 5L
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriceRange([500000, 1000000])}
                    className="text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 px-2 py-1 rounded-md font-medium"
                  >
                    5L - 10L
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriceRange([1000000, 1500000])}
                    className="text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 px-2 py-1 rounded-md font-medium"
                  >
                    10L - 15L
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriceRange([1500000, 2500000])}
                    className="text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 px-2 py-1 rounded-md font-medium"
                  >
                    15L+
                  </button>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Brand / Make Filter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 block">
                  Brand / Make
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {availableBrands.map((brand) => {
                    const count = allCars.filter((c) => c.brand === brand).length;
                    const isChecked = selectedBrands.includes(brand);
                    return (
                      <label
                        key={brand}
                        className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                          isChecked
                            ? "bg-blue-50/70 border-blue-300 text-blue-900 font-semibold"
                            : "bg-slate-50/50 border-slate-100 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleArrayItem(brand, selectedBrands, setSelectedBrands)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                          />
                          <span>{brand}</span>
                        </div>
                        <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded-full font-medium">
                          {count}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Fuel Type Filter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 block flex items-center gap-1">
                  <Fuel className="h-3.5 w-3.5 text-blue-600" /> Fuel Type
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {availableFuels.map((fuel) => {
                    const isChecked = selectedFuels.includes(fuel);
                    return (
                      <button
                        key={fuel}
                        type="button"
                        onClick={() => toggleArrayItem(fuel, selectedFuels, setSelectedFuels)}
                        className={`text-xs px-2.5 py-2 rounded-xl font-medium border text-center transition-all ${
                          isChecked
                            ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {fuel}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Transmission Type Filter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 block flex items-center gap-1">
                  <Gauge className="h-3.5 w-3.5 text-blue-600" /> Transmission
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {availableTransmissions.map((trans) => {
                    const isChecked = selectedTransmissions.includes(trans);
                    return (
                      <button
                        key={trans}
                        type="button"
                        onClick={() => toggleArrayItem(trans, selectedTransmissions, setSelectedTransmissions)}
                        className={`text-xs px-2.5 py-2 rounded-xl font-medium border text-center transition-all ${
                          isChecked
                            ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {trans}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Mileage Range Filter */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Kilometers Driven
                  </label>
                  <span className="text-xs font-bold text-blue-600">
                    Up to {kmRange[1].toLocaleString()} km
                  </span>
                </div>
                <Slider
                  defaultValue={[0, 100000]}
                  min={0}
                  max={100000}
                  step={5000}
                  value={kmRange}
                  onValueChange={(val) => setKmRange(val as number[])}
                  className="mt-2"
                />
              </div>

              <div className="h-px bg-slate-100" />

              {/* Year of Manufacture Filter */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Manufacture Year
                  </label>
                  <span className="text-xs font-bold text-blue-600">
                    {yearRange[0]} - {yearRange[1]}
                  </span>
                </div>
                <Slider
                  defaultValue={[2015, 2024]}
                  min={2015}
                  max={2024}
                  step={1}
                  value={yearRange}
                  onValueChange={(val) => setYearRange(val as number[])}
                  className="mt-2"
                />
              </div>

              <div className="h-px bg-slate-100" />

              {/* City / Location Filter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 block flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-blue-600" /> City / Location
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {availableLocations.slice(0, 10).map((loc) => {
                    const isChecked = selectedLocations.includes(loc);
                    return (
                      <label
                        key={loc}
                        className={`flex items-center space-x-2 p-1.5 rounded-lg text-xs cursor-pointer ${
                          isChecked ? "text-blue-700 font-semibold" : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleArrayItem(loc, selectedLocations, setSelectedLocations)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                        />
                        <span>{loc}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* Cars Results Listing */}
          <div className="md:col-span-3">
            
            {/* Header info bar */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  {query ? `Search Results for "${query}"` : "Featured Cars & Best Deals"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing <strong className="text-blue-600">{rankedResults.length}</strong> of {allCars.length} cars
                </p>
              </div>
            </div>

            {/* Fuzzy match alert notice if misspelled query was auto-corrected */}
            {suggestionsResult.fuzzyCorrectedQuery && query && (
              <div className="mb-6 bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-orange-900">
                  <Sparkles className="h-5 w-5 text-orange-600 animate-bounce" />
                  <div>
                    <p className="text-xs font-semibold">
                      Auto-Corrected Fuzzy Match Applied:
                    </p>
                    <p className="text-sm">
                      Showing results for "<strong className="text-orange-950 underline">{suggestionsResult.fuzzyCorrectedQuery}</strong>" (matched from your input "{query}")
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setQuery(suggestionsResult.fuzzyCorrectedQuery!)}
                  className="bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-orange-700 transition-colors"
                >
                  Use Suggesion
                </button>
              </div>
            )}

            {/* Empty state */}
            {rankedResults.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center my-6">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  No matching cars found
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                  We couldn't find any listings matching your current query or filter combinations.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button
                    type="button"
                    onClick={handleResetFilters}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" /> Reset All Filters
                  </Button>
                </div>
              </div>
            ) : (
              /* Cars Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rankedResults.map(({ car, matchPercentage, matchedHighlights }) => (
                  <Link
                    key={car.id}
                    href={`/buy-car/${car.id}`}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200/80 overflow-hidden transition-all duration-300 flex flex-col group relative"
                  >
                    {/* Image Thumbnail & Relevance Badge */}
                    <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                      <img
                        src={car.image}
                        alt={car.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Match percentage badge */}
                      <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20 shadow-md flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-orange-400" />
                        <span>{matchPercentage}% Match</span>
                      </div>

                      {/* Wishlist Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-white text-slate-600 hover:text-red-500 transition-colors shadow-sm"
                      >
                        <Heart className="h-4 w-4" />
                      </button>

                      {/* Location Chip */}
                      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-red-400" />
                        <span>{car.location}</span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        {/* Title */}
                        <h3 className="font-extrabold text-slate-900 text-base mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {car.title}
                        </h3>

                        {/* Specs row */}
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <div className="flex items-center space-x-1.5">
                            <Gauge className="h-3.5 w-3.5 text-blue-500" />
                            <span>{car.km} km</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <Fuel className="h-3.5 w-3.5 text-orange-500" />
                            <span>{car.fuel}</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <CarIcon className="h-3.5 w-3.5 text-purple-500" />
                            <span>{car.transmission}</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <Calendar className="h-3.5 w-3.5 text-green-500" />
                            <span>{car.year}</span>
                          </div>
                        </div>

                        {/* Relevance Highlight Chips */}
                        {matchedHighlights.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {matchedHighlights.slice(0, 2).map((hl, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-md border border-blue-100 flex items-center gap-1"
                              >
                                <CheckCircle2 className="h-2.5 w-2.5 text-blue-500" />
                                {hl}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Pricing Footer */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-slate-400 font-medium block">
                            EMI Starts at
                          </span>
                          <span className="text-xs font-bold text-slate-700">{car.emi}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] text-slate-400 font-medium block">
                            Fixed Price
                          </span>
                          <span className="text-lg font-black text-blue-600">
                            {car.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
=======
export default function BuyCarPage() {
  const { user, openAuthModal } = useAuth();
  const {
    selectedPreset,
    openLocationDrawer,
    getPriceRecommendation,
    isGeoFenceActive,
    toggleGeoFence,
    isCarInGeoFence,
    detectUserLocation,
    isDetectingLocation,
  } = useLocation();

  const [priceRange, setPriceRange] = useState<number[]>([0, 1500000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cars, setCars] = useState<CarCardItem[] | null>(null);

  useEffect(() => {
    async function fetchCars() {
      try {
        const fetched = await getcarSummaries();
        if (fetched && fetched.length > 0) {
          setCars(fetched);
        } else {
          setCars(mockCarsList);
        }
      } catch {
        setCars(mockCarsList);
      }
    }
    fetchCars();
  }, []);

  // Filter cars based on Geo-fence, brand & search query
  const filteredCars = (cars || []).filter((car) => {
    const matchesGeoFence = isCarInGeoFence(car.location);

    const matchesSearch =
      !searchQuery ||
      car.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.location?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBrand =
      selectedBrands.length === 0 ||
      selectedBrands.some((brand) =>
        car.title.toLowerCase().includes(brand.toLowerCase())
      );

    return matchesGeoFence && matchesSearch && matchesBrand;
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-16 text-gray-900">
      {/* Top Dynamic Location Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 text-white py-6 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Geo-Fenced Search & Dynamic Pricing Engine</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black">
              Used Cars for Sale in {selectedPreset.cityName}
            </h1>
            <p className="text-xs text-blue-200 mt-1 max-w-2xl">
              {selectedPreset.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={detectUserLocation}
              disabled={isDetectingLocation}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-2xl text-xs font-black transition-all flex items-center space-x-1.5 shadow-sm active:scale-95 disabled:opacity-50"
            >
              <Navigation className={`w-3.5 h-3.5 ${isDetectingLocation ? "animate-spin" : ""}`} />
              <span>{isDetectingLocation ? "Detecting..." : "Detect GPS"}</span>
            </button>

            <button
              onClick={openLocationDrawer}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center space-x-2 shadow-xs"
            >
              <span>{selectedPreset.icon} City: {selectedPreset.cityName}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Geo-Fence Status Banner */}
        <div className="bg-white p-4 md:p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shrink-0 ${isGeoFenceActive ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-gray-100 text-gray-500"}`}>
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-black text-gray-900">
                  Geo-Fence Filter: {isGeoFenceActive ? "Active" : "Disabled (All India)"}
                </span>
                {isGeoFenceActive && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {selectedPreset.cityName}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {isGeoFenceActive
                  ? `Displaying verified listings strictly located in ${selectedPreset.cityName} and surrounding hub area.`
                  : "Showing listings across all cities in India. Enable geo-fence to restrict search."}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              type="button"
              onClick={() => toggleGeoFence()}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 ${
                isGeoFenceActive
                  ? "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              {isGeoFenceActive ? <Shield className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
              <span>{isGeoFenceActive ? "Showing City Only" : "Showing All Cities"}</span>
            </button>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-800">
                Filter Vehicles
              </h3>

              {/* Price Range Filter */}
              <div>
                <label className="text-xs font-bold text-gray-700 mb-2 block">
                  Price Budget (₹)
                </label>
                <Slider
                  defaultValue={[0, 1500000]}
                  max={1500000}
                  step={25000}
                  value={priceRange}
                  onValueChange={(val) =>
                    setPriceRange(Array.isArray(val) ? [...val] : [val, val])
                  }
                  className="mt-2"
                />
                <div className="flex justify-between mt-2 text-xs font-bold text-blue-700">
                  <span>₹{priceRange[0].toLocaleString("en-IN")}</span>
                  <span>₹{priceRange[1].toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Brand Filter */}
              <div className="border-t border-gray-100 pt-4">
                <label className="text-xs font-bold text-gray-700 mb-2.5 block">
                  Popular Brands
                </label>
                <div className="space-y-2">
                  {["Maruti", "Hyundai", "Honda", "Tata", "Toyota", "Kia", "Mahindra"].map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center text-xs font-semibold text-gray-700 cursor-pointer hover:text-blue-600"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2.5 w-4 h-4"
                        checked={selectedBrands.includes(brand)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBrands([...selectedBrands, brand]);
                          } else {
                            setSelectedBrands(
                              selectedBrands.filter((b) => b !== brand)
                            );
                          }
                        }}
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cars Grid */}
          <div className="md:col-span-3 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-gray-900">
                  Available Cars ({filteredCars.length})
                </h2>
                {isGeoFenceActive && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    Restricted to {selectedPreset.cityName} geo-fence
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <div className="relative flex-1 sm:w-64">
                  <Input
                    type="text"
                    placeholder="Search model or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-white text-xs rounded-xl border-gray-200"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Cars Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars === null ? (
                Array.from({ length: 6 }).map((_, idx) => <LoaderCard key={idx} />)
              ) : filteredCars.length === 0 ? (
                <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-gray-900">
                      No cars match your search filter in {selectedPreset.cityName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Try expanding your geo-fence to all cities or change your selected city.
                    </p>
                  </div>
                  <button
                    onClick={() => toggleGeoFence(false)}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all inline-flex items-center space-x-2"
                  >
                    <Globe className="w-4 h-4" />
                    <span>View Cars Across All Cities</span>
                  </button>
                </div>
              ) : (
                filteredCars.map((car) => {
                  return (
                    <CarCard
                      key={car.id}
                      car={car}
                      user={user}
                      openAuthModal={openAuthModal}
                      selectedPreset={selectedPreset}
                      getPriceRecommendation={getPriceRecommendation}
                    />
                  );
                })
              )}
            </div>
>>>>>>> feature/multitenent-backend
          </div>
        </div>

        {/* Interactive Google Map Section for Cars24 Hubs */}
        <InteractiveLocationMap />
      </div>
    </div>
  );
}

<<<<<<< HEAD
export default function BuyCarPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading Cars catalog...</div>}>
      <BuyCarContent />
    </Suspense>
=======
// Individual Car Card Component with Live Dynamic Price Badge
function CarCard({
  car,
  user,
  openAuthModal,
  selectedPreset,
  getPriceRecommendation,
}: {
  car: CarCardItem;
  user: any;
  openAuthModal: (mode: "login" | "signup") => void;
  selectedPreset: any;
  getPriceRecommendation: any;
}) {
  const [recPrice, setRecPrice] = useState<number | null>(null);

  useEffect(() => {
    let numeric = car.basePriceNumeric;
    if (!numeric) {
      const cleaned = (car.price || "").replace(/[^0-9.]/g, "");
      numeric = parseFloat(cleaned) || 500000;
      if (car.price && car.price.toLowerCase().includes("lakh")) {
        numeric = numeric * 100000;
      }
    }

    getPriceRecommendation(numeric, car.bodyType || "SUV", car.fuel || "Petrol").then(
      (res: any) => {
        if (res?.recommendedPrice) setRecPrice(res.recommendedPrice);
      }
    );
  }, [car, selectedPreset, getPriceRecommendation]);

  return (
    <Link
      href={`/buy-car/${car.id}`}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group"
    >
      <div>
        <div className="relative h-48 bg-gray-900 overflow-hidden">
          <img
            src={car.image || "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg"}
            alt={car.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (!user) openAuthModal("login");
            }}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white text-gray-600 hover:text-red-500 transition-colors shadow-sm"
          >
            <Heart className="h-4 w-4" />
          </button>

          <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1">
            <MapPin className="w-3 h-3 text-blue-400" />
            <span className="max-w-[150px] truncate">{car.location || selectedPreset.cityName}</span>
          </div>
        </div>

        <div className="p-5 space-y-3">
          <h3 className="font-bold text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
            {car.title}
          </h3>

          <div className="flex items-center justify-between text-xs text-gray-500 font-medium border-y border-gray-100 py-2">
            <span>{car.km}</span>
            <span>•</span>
            <span>{car.transmission}</span>
            <span>•</span>
            <span>{car.fuel}</span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold">Base Price</p>
              <p className="text-lg font-black text-gray-900">{car.price}</p>
            </div>
            {recPrice && (
              <div className="text-right">
                <p className="text-[10px] text-blue-600 font-extrabold uppercase flex items-center justify-end gap-1">
                  <Sparkles className="w-3 h-3" /> Recommended
                </p>
                <p className="text-sm font-black text-blue-700">
                  ₹ {recPrice.toLocaleString("en-IN")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs font-bold text-blue-600 group-hover:text-blue-700 flex items-center justify-between">
        <span>View Vehicle Details & Reserve</span>
        <span>→</span>
      </div>
    </Link>
>>>>>>> feature/multitenent-backend
  );
}
