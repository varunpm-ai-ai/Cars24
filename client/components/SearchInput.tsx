"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Search, X, Sparkles, Car, ArrowRight, CornerDownLeft, Sliders } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSearchSuggestions, SearchSuggestionResult, RankedCar } from "@/lib/searchEngine";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  onSearchSubmit?: (query: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  navigateToBuyPage?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSearchSubmit,
  placeholder = "Search by brand, model, fuel type (e.g., Hyundai Creta, Petrol, Automatic)...",
  className = "",
  autoFocus = false,
  navigateToBuyPage = false,
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 0,
  });

  const [suggestions, setSuggestions] = useState<SearchSuggestionResult>({
    predictiveText: "",
    brands: [],
    models: [],
    attributes: [],
    cars: [],
  });

  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mount state for SSR safe portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update dropdown coordinates relative to window/page
  const updateCoords = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, []);

  // Compute suggestions whenever search input value changes
  useEffect(() => {
    const res = getSearchSuggestions(value);
    setSuggestions(res);
    setSelectedIndex(-1);
    if (isOpen) {
      updateCoords();
    }
  }, [value, isOpen, updateCoords]);

  // Update coords on window resize or scroll
  useEffect(() => {
    if (!isOpen) return;
    updateCoords();

    const handleScrollOrResize = () => {
      updateCoords();
    };

    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("scroll", handleScrollOrResize, true);

    return () => {
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("scroll", handleScrollOrResize, true);
    };
  }, [isOpen, updateCoords]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        // Check if click was inside the portal dropdown element
        const portalEl = document.getElementById("search-suggestions-portal");
        if (portalEl && portalEl.contains(event.target as Node)) {
          return;
        }
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Total selectable items count for arrow navigation
  const flatItemsList: { type: string; value: string; payload?: any }[] = [];

  if (suggestions.fuzzyCorrectedQuery) {
    flatItemsList.push({
      type: "fuzzy",
      value: suggestions.fuzzyCorrectedQuery,
    });
  }

  suggestions.brands.forEach((b) =>
    flatItemsList.push({ type: "brand", value: b.name })
  );

  suggestions.models.forEach((m) =>
    flatItemsList.push({ type: "model", value: `${m.brand} ${m.name}` })
  );

  suggestions.attributes.forEach((a) =>
    flatItemsList.push({ type: "attribute", value: a.label, payload: a.filter })
  );

  suggestions.cars.forEach((c) =>
    flatItemsList.push({ type: "car", value: c.car.title, payload: c.car })
  );

  const handleSelectQuery = (queryText: string, extraFilter?: any) => {
    onChange(queryText);
    setIsOpen(false);
    if (onSearchSubmit) {
      onSearchSubmit(queryText);
    }
    if (navigateToBuyPage) {
      const searchParams = new URLSearchParams();
      searchParams.set("q", queryText);
      router.push(`/buy-car?${searchParams.toString()}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
      updateCoords();
      setSelectedIndex((prev) => (prev < flatItemsList.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : flatItemsList.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < flatItemsList.length) {
        const item = flatItemsList[selectedIndex];
        handleSelectQuery(item.value, item.payload);
      } else {
        handleSelectQuery(value);
      }
    } else if (e.key === "Tab" || e.key === "ArrowRight") {
      if (
        suggestions.predictiveText &&
        value.trim().length > 0 &&
        suggestions.predictiveText.toLowerCase().startsWith(value.toLowerCase())
      ) {
        e.preventDefault();
        onChange(suggestions.predictiveText);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Determine Ghost text completion suffix
  const showGhostText =
    value.trim().length > 0 &&
    suggestions.predictiveText &&
    suggestions.predictiveText.toLowerCase().startsWith(value.toLowerCase());

  const ghostSuffix = showGhostText ? suggestions.predictiveText.slice(value.length) : "";

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative flex items-center bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 overflow-hidden z-20">
        {/* Search Icon */}
        <div className="pl-4 pr-2 text-gray-400 flex items-center justify-center">
          <Search className="h-5 w-5 text-blue-600" />
        </div>

        {/* Input Wrapper with Ghost Predictive Typing Overlay */}
        <div className="relative flex-1 flex items-center">
          {/* Ghost overlay */}
          {showGhostText && (
            <div className="absolute inset-0 pl-3 py-3 pointer-events-none flex items-center text-sm md:text-base font-normal text-gray-400 overflow-hidden">
              <span className="opacity-0">{value}</span>
              <span className="text-gray-400 bg-gray-100/80 px-1 rounded text-xs ml-1 font-mono">
                {ghostSuffix} (Tab ↹)
              </span>
            </div>
          )}

          <Input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setIsOpen(true);
              updateCoords();
            }}
            onFocus={() => {
              setIsOpen(true);
              updateCoords();
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="w-full border-0 bg-transparent py-3 text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm md:text-base pr-8"
          />
        </div>

        {/* Clear Button */}
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setIsOpen(true);
              updateCoords();
              inputRef.current?.focus();
            }}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors mr-1"
            title="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Search Action Button */}
        <Button
          type="button"
          onClick={() => handleSelectQuery(value)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 h-full rounded-r-xl transition-colors flex items-center gap-1.5"
        >
          <span>Search</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* REACT PORTAL for Auto-Suggestions Dropdown (Attached directly to document.body with z-[99999]) */}
      {mounted &&
        isOpen &&
        createPortal(
          <div
            id="search-suggestions-portal"
            style={{
              position: "absolute",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: `${coords.width}px`,
              zIndex: 99999,
            }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-h-[480px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150"
          >
            {/* Fuzzy Correction Suggestion */}
            {suggestions.fuzzyCorrectedQuery && (
              <div
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelectQuery(suggestions.fuzzyCorrectedQuery!);
                }}
                className="bg-orange-50 hover:bg-orange-100 border-b border-orange-100 p-3 px-4 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-2 text-sm text-orange-800 font-medium">
                  <Sparkles className="h-4 w-4 text-orange-600 animate-pulse" />
                  <span>
                    Did you mean{" "}
                    <strong className="underline text-orange-950">
                      {suggestions.fuzzyCorrectedQuery}
                    </strong>
                    ?
                  </span>
                </div>
                <span className="text-xs bg-orange-200/70 text-orange-900 px-2 py-0.5 rounded-full font-semibold">
                  Fuzzy match
                </span>
              </div>
            )}

            {/* Categorized Suggestions Container */}
            <div className="p-3 space-y-4">
              {/* Brands Suggestions */}
              {suggestions.brands.length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-400 px-3 mb-1.5 flex items-center gap-1">
                    <Car className="h-3.5 w-3.5" />
                    <span>Popular Makes / Brands</span>
                  </div>
                  <div className="flex flex-wrap gap-2 px-2">
                    {suggestions.brands.map((b) => (
                      <button
                        key={b.name}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectQuery(b.name);
                        }}
                        className="flex items-center space-x-1.5 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        <span>{b.name}</span>
                        <span className="bg-gray-200/80 text-gray-600 text-[10px] px-1.5 py-0.2 rounded-full font-normal">
                          {b.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Filter Attributes */}
              {suggestions.attributes.length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-400 px-3 mb-1.5 flex items-center gap-1">
                    <Sliders className="h-3.5 w-3.5" />
                    <span>Smart Filter Suggestions</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 px-1">
                    {suggestions.attributes.map((attr, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectQuery(attr.label, attr.filter);
                        }}
                        className="text-left px-3 py-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between group transition-colors cursor-pointer"
                      >
                        <span>✨ {attr.label}</span>
                        <CornerDownLeft className="h-3 w-3 opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Matching Car Listings Preview */}
              {suggestions.cars.length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-400 px-3 mb-2 flex items-center justify-between">
                    <span>Top Relevant Listings</span>
                    <span className="text-[10px] text-blue-600 font-normal">
                      Relevance Ranked
                    </span>
                  </div>
                  <div className="space-y-1.5 px-1">
                    {suggestions.cars.map((item) => (
                      <div
                        key={item.car.id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          if (navigateToBuyPage) {
                            router.push(`/buy-car/${item.car.id}`);
                          } else {
                            handleSelectQuery(item.car.title);
                          }
                        }}
                        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent hover:border-gray-200 transition-all group"
                      >
                        <img
                          src={item.car.image}
                          alt={item.car.title}
                          className="w-14 h-12 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-semibold text-gray-900 truncate group-hover:text-blue-600">
                              {item.car.title}
                            </h4>
                            <span className="text-[10px] font-bold bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full flex-shrink-0">
                              {item.matchPercentage}% match
                            </span>
                          </div>
                          <div className="flex items-center text-[11px] text-gray-500 space-x-2 mt-0.5">
                            <span className="font-semibold text-blue-600">
                              {item.car.price}
                            </span>
                            <span>•</span>
                            <span>{item.car.fuel}</span>
                            <span>•</span>
                            <span>{item.car.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No suggestions state */}
              {suggestions.brands.length === 0 &&
                suggestions.models.length === 0 &&
                suggestions.cars.length === 0 && (
                  <div className="py-6 text-center text-gray-500 text-sm">
                    <p>No exact cars found matching "{value}"</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Try searching by brand (Hyundai, Maruti), fuel type (Petrol), or location.
                    </p>
                  </div>
                )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default SearchInput;
