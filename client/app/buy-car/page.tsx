"use client";

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

function LoaderCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse overflow-hidden">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}

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
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BuyCarPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading Cars catalog...</div>}>
      <BuyCarContent />
    </Suspense>
  );
}
