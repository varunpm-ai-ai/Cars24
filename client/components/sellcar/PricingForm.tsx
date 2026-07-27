"use client";

import React, { useEffect, useState } from "react";
import { useLocation } from "@/context/LocationContext";
import { PricingResult } from "@/lib/Pricingapi";
import {
  AlertCircle,
  CreditCard,
  DollarSign,
  Tag,
  TrendingUp,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

type CarDetails = {
  id: string;
  title: string;
  images: string[];
  price: string;
  basePriceNumeric?: number;
  recommendedPriceNumeric?: number;
  bodyType?: string;
  emi: string;
  location: string;
  specs: {
    year: number;
    km: string;
    fuel: string;
    transmission: string;
    owner: string;
    insurance: string;
  };
  features: string[];
  highlights: string[];
};

interface PricingFormprop {
  carDetails: CarDetails;
  updateCarDetails: (details: Partial<CarDetails>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  prevStep: () => void;
}

const PricingForm: React.FC<PricingFormprop> = ({
  carDetails,
  updateCarDetails,
  handleSubmit,
  prevStep,
}) => {
  const { selectedPreset, season, isFuelSpikeActive, getPriceRecommendation } = useLocation();
  const [isValid, setIsValid] = useState(false);
  const [pricingResult, setPricingResult] = useState<PricingResult | null>(null);

  useEffect(() => {
    setIsValid(!!carDetails.price);

    const numericVal = parseInt(carDetails.price.replace(/[^\d]/g, ""), 10) || 0;
    if (numericVal > 0) {
      getPriceRecommendation(
        numericVal,
        carDetails.bodyType || "SUV",
        carDetails.specs.fuel || "Petrol"
      ).then((res) => {
        setPricingResult(res);
        updateCarDetails({
          basePriceNumeric: numericVal,
          recommendedPriceNumeric: res.recommendedPrice,
        });
      });
    }
  }, [carDetails.price, carDetails.bodyType, selectedPreset, season, isFuelSpikeActive, getPriceRecommendation]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    const formattedValue = value ? parseInt(value, 10).toLocaleString() : "";
    updateCarDetails({ price: formattedValue });
  };

  const handleEmiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCarDetails({ emi: e.target.value });
  };

  const applyRecommendedPrice = () => {
    if (pricingResult?.recommendedPrice) {
      updateCarDetails({
        price: pricingResult.recommendedPrice.toLocaleString("en-IN"),
        basePriceNumeric: pricingResult.recommendedPrice,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 py-4 text-gray-900">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">Pricing & Valuation</h2>
        <p className="text-xs text-gray-500">
          Set your vehicle listing price. Our Dynamic Engine recommends optimal market pricing based on your region ({selectedPreset.cityName}).
        </p>
      </div>

      {/* Dynamic Recommended Price Engine Banner Card */}
      {pricingResult && (
        <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 text-white p-6 rounded-3xl shadow-md border border-blue-700/50 space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-500 text-white text-[11px] font-extrabold uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended Market Price Engine</span>
            </span>
            <span className="text-xs text-blue-200 font-semibold">
              Region: {selectedPreset.cityName}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-blue-200 uppercase tracking-wider font-bold">Suggested Listing Value</p>
              <p className="text-3xl font-black text-white mt-0.5">
                ₹ {pricingResult.recommendedPrice.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-orange-300 font-bold mt-1">
                {pricingResult.demandBadge}
              </p>
            </div>

            <button
              type="button"
              onClick={applyRecommendedPrice}
              className="py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl transition-all shadow-md active:scale-95 shrink-0"
            >
              Use Recommended Price
            </button>
          </div>

          <div className="pt-3 border-t border-blue-700/60 text-xs text-blue-100 space-y-1">
            <p className="font-semibold">{pricingResult.rationale}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {pricingResult.breakdown.map((item, idx) => (
                <div key={idx} className="bg-white/10 p-2 rounded-lg text-[11px]">
                  <span className="font-bold text-white">{item.factorName}: </span>
                  <span className="text-blue-200">{item.impactText}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Price Input Section */}
      <div className="space-y-5">
        <div>
          <label
            htmlFor="price"
            className="flex items-center text-xs font-bold uppercase text-gray-700 mb-1"
          >
            <Tag className="h-4 w-4 mr-1 text-blue-600" /> Your Listing Price (₹)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <span className="text-gray-500 font-bold">₹</span>
            </div>
            <input
              type="text"
              id="price"
              className="block w-full pl-8 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-xs text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              placeholder="e.g. 5,00,000"
              value={carDetails.price}
              onChange={handlePriceChange}
              required
            />
          </div>
          <div className="mt-1.5 flex items-center space-x-1 text-xs text-blue-600 font-medium">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Pricing aligned with regional demand speeds up buyers' offers by 3x.</span>
          </div>
        </div>

        {/* EMI Section */}
        <div className="space-y-2">
          <label
            htmlFor="emi"
            className="flex items-center text-xs font-bold uppercase text-gray-700"
          >
            <CreditCard className="h-4 w-4 mr-1 text-blue-600" /> Estimated EMI Starting From (₹/month)
          </label>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <span className="text-gray-500 font-bold">₹</span>
            </div>
            <input
              type="text"
              id="emi"
              className="block w-full pl-8 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-xs text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              placeholder="e.g. 10,500"
              value={carDetails.emi}
              onChange={handleEmiChange}
            />
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
              <span className="text-gray-400 text-xs font-semibold">/mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Listing Summary Card */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-3">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-800">
          Listing Preview Summary
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between pb-2 border-b border-gray-200/60">
            <span className="text-gray-500 font-medium">Vehicle Title</span>
            <span className="font-bold text-gray-900">{carDetails.title || "Not provided"}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-gray-200/60">
            <span className="text-gray-500 font-medium">Market Location</span>
            <span className="font-bold text-gray-900">{carDetails.location || selectedPreset.cityName}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-gray-200/60">
            <span className="text-gray-500 font-medium">Model Year</span>
            <span className="font-bold text-gray-900">{carDetails.specs.year}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-gray-200/60">
            <span className="text-gray-500 font-medium">Listing Price</span>
            <span className="font-bold text-blue-700">{carDetails.price ? `₹ ${carDetails.price}` : "Not provided"}</span>
          </div>
          {pricingResult && (
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Market Recommended</span>
              <span className="font-bold text-orange-600">₹ {pricingResult.recommendedPrice.toLocaleString("en-IN")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Form Buttons */}
      <div className="pt-2 flex justify-between items-center">
        <button
          type="button"
          onClick={prevStep}
          className="px-5 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className={`px-6 py-3 rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center space-x-2 ${
            isValid
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 active:scale-95"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Publish & List Vehicle</span>
        </button>
      </div>
    </form>
  );
};

export default PricingForm;
