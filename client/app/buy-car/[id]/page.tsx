"use client";

import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "@/context/LocationContext";
import { createBooking } from "@/lib/Bookingapi";
import { getcarByid } from "@/lib/Carapi";
import { PricingResult } from "@/lib/Pricingapi";
import {
  AlertCircle,
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  Phone,
  User,
  Lock,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Info,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const CarDetailsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    preferredDate: "",
    preferredTime: "",
    paymentMethod: "",
    loanRequired: "no",
    downPayment: "",
  });

  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { user, openAuthModal } = useAuth();
  const { selectedPreset, season, isFuelSpikeActive, openLocationDrawer, getPriceRecommendation } = useLocation();

  const [carDetails, setCarDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [pricingResult, setPricingResult] = useState<PricingResult | null>(null);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!id) return;
    async function fetchCar() {
      try {
        const data = await getcarByid(id as string);
        if (data) {
          setCarDetails(data);
        } else {
          // Fallback mock details if backend ID not found
          setCarDetails({
            id: id,
            title: "2023 Maruti FRONX DELTA PLUS 1.2L AGS",
            images: [
              "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
              "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg",
              "https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg",
            ],
            price: "₹7,80,000",
            basePriceNumeric: 780000,
            bodyType: "SUV",
            emi: "₹15,245/month",
            location: selectedPreset.cityName,
            specs: {
              year: 2023,
              km: "10,048 km",
              fuel: "Petrol",
              transmission: "Automatic",
              owner: "1st owner",
              insurance: "Valid till 2026",
            },
            features: [
              "Power Steering",
              "Power Windows",
              "Automatic Climate Control",
              "Dual Airbags",
              "ABS with EBD",
              "Alloy Wheels",
              "Touchscreen Infotainment",
            ],
            highlights: [
              "Single owner non-accidental vehicle",
              "140-point inspection certified by Cars24",
              "7-day money-back guarantee",
              "1-year warranty coverage",
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching car:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCar();
  }, [id, selectedPreset.cityName]);

  // Recalculate dynamic pricing whenever car details or location preset changes
  useEffect(() => {
    if (!carDetails) return;

    let numericBase = carDetails.basePriceNumeric;
    if (!numericBase) {
      const cleaned = (carDetails.price || "").replace(/[^0-9.]/g, "");
      numericBase = parseFloat(cleaned) || 750000;
      if (carDetails.price && carDetails.price.toLowerCase().includes("lakh")) {
        numericBase = numericBase * 100000;
      }
    }

    async function computePricing() {
      const res = await getPriceRecommendation(
        numericBase,
        carDetails.bodyType || "SUV",
        carDetails.specs?.fuel || "Petrol"
      );
      setPricingResult(res);
    }
    computePricing();
  }, [carDetails, selectedPreset, season, isFuelSpikeActive, getPriceRecommendation]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!carDetails) {
    return (
      <div className="text-center py-20 text-red-500 font-bold">
        Vehicle details not found.
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to complete your booking");
      openAuthModal("login");
      return;
    }
    try {
      const booking = {
        CarId: id,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        paymentMethod: formData.paymentMethod,
        loanRequired: formData.loanRequired,
        downPayment: formData.downPayment,
      };
      const response = await createBooking(user.id, booking);
      if (response?.id) {
        toast.success("Test drive & car booking reserved successfully!");
        router.push(`/bookings`);
      } else {
        toast.success("Booking submitted!");
        router.push(`/bookings`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit booking.");
    }
  };

  const validateStep = () => {
    if (step === 1) return formData.name && formData.phone && formData.email;
    if (step === 2) return formData.preferredDate && formData.preferredTime;
    return true;
  };

  const availableTimes = [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 text-white py-6">
        <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Cars24 Certified Inspection & Dynamic Valuation</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black">{carDetails.title}</h1>
            <p className="text-xs text-blue-200 mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" /> {carDetails.location || selectedPreset.cityName}
              <span>•</span>
              <span className="bg-blue-800/80 px-2 py-0.5 rounded text-[11px]">
                {carDetails.specs?.km} driven
              </span>
            </p>
          </div>

          {/* Location Switcher Pill */}
          <button
            onClick={openLocationDrawer}
            className="self-start md:self-auto bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2"
          >
            <span>{selectedPreset.icon} Region: {selectedPreset.cityName}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Car Overview & Specs Column (8 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Gallery Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative aspect-video bg-gray-900">
                <img
                  src={carDetails.images[0] || "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg"}
                  alt={carDetails.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                  140-Point Quality Inspected
                </div>
              </div>

              {/* Dynamic Pricing Banner */}
              <div className="p-6 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 border-t border-blue-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="inline-block px-2.5 py-1 rounded-full bg-blue-600 text-white text-[11px] font-extrabold uppercase tracking-wide mb-1">
                      {pricingResult?.demandBadge || "🔥 Recommended Market Price"}
                    </span>
                    <div className="flex items-baseline space-x-3">
                      <p className="text-3xl font-black text-blue-900">
                        ₹{(pricingResult?.recommendedPrice || carDetails.basePriceNumeric || 780000).toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-gray-500 line-through">
                        Base: {carDetails.price}
                      </p>
                    </div>
                    <p className="text-xs font-semibold text-gray-600 mt-0.5">
                      EMI starting from <span className="text-blue-700 font-bold">{carDetails.emi}</span>
                    </p>
                  </div>

                  <button
                    onClick={openLocationDrawer}
                    className="px-3.5 py-2 bg-white border border-blue-200 text-blue-800 font-bold text-xs rounded-xl shadow-xs hover:bg-blue-50 transition-colors flex items-center space-x-1.5 shrink-0"
                  >
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span>View Market Factors</span>
                  </button>
                </div>

                {/* Pricing Rationale Detail */}
                {pricingResult && (
                  <div className="mt-4 pt-3 border-t border-blue-100/60 text-xs text-blue-900 space-y-1.5">
                    <p className="font-semibold flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      {pricingResult.rationale}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {pricingResult.breakdown.map((item, idx) => (
                        <div key={idx} className="bg-white/80 p-2 rounded-lg border border-blue-100/80 text-[11px]">
                          <span className="font-bold text-blue-950">{item.factorName}: </span>
                          <span className="text-gray-700">{item.impactText}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* UNAUTHENTICATED USER ACCESS GATE OVERLAY CARD */}
            {!user ? (
              <div className="relative bg-white rounded-3xl shadow-lg border-2 border-blue-500/30 p-8 overflow-hidden">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />

                <div className="relative z-10 text-center max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
                    <Lock className="w-8 h-8" />
                  </div>

                  <h3 className="text-2xl font-black text-gray-900">
                    Sign In to Unlock Full Specs & Test Drive
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    To access detailed technical specifications, 140-point inspection history, direct seller contact details, and complete your test drive booking, please log in or create your free account.
                  </p>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => openAuthModal("login")}
                      className="py-3 px-6 bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-blue-700 transition-colors"
                    >
                      Log In to Unlock Details
                    </button>
                    <button
                      onClick={() => openAuthModal("signup")}
                      className="py-3 px-6 bg-orange-500 text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-orange-600 transition-colors"
                    >
                      Create Free Account
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* AUTHENTICATED USER DETAILED SPECS & HIGHLIGHTS */
              <div className="space-y-6">
                {/* Specs Grid */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    Vehicle Key Specifications
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                      <p className="text-[11px] font-bold uppercase text-gray-400">Make Year</p>
                      <p className="font-extrabold text-sm text-gray-900 mt-0.5">{carDetails.specs?.year}</p>
                    </div>
                    <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                      <p className="text-[11px] font-bold uppercase text-gray-400">Kilometers</p>
                      <p className="font-extrabold text-sm text-gray-900 mt-0.5">{carDetails.specs?.km}</p>
                    </div>
                    <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                      <p className="text-[11px] font-bold uppercase text-gray-400">Fuel Type</p>
                      <p className="font-extrabold text-sm text-gray-900 mt-0.5">{carDetails.specs?.fuel}</p>
                    </div>
                    <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                      <p className="text-[11px] font-bold uppercase text-gray-400">Transmission</p>
                      <p className="font-extrabold text-sm text-gray-900 mt-0.5">{carDetails.specs?.transmission}</p>
                    </div>
                    <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                      <p className="text-[11px] font-bold uppercase text-gray-400">Owner History</p>
                      <p className="font-extrabold text-sm text-gray-900 mt-0.5">{carDetails.specs?.owner}</p>
                    </div>
                    <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                      <p className="text-[11px] font-bold uppercase text-gray-400">Insurance</p>
                      <p className="font-extrabold text-sm text-gray-900 mt-0.5">{carDetails.specs?.insurance}</p>
                    </div>
                  </div>
                </div>

                {/* Highlights & Features */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">Features & Key Highlights</h3>
                  <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100">
                    <ul className="space-y-2 text-xs font-semibold text-blue-900">
                      {carDetails.highlights?.map((h: string, idx: number) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {carDetails.features?.map((f: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs rounded-xl transition-colors"
                      >
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Booking Form / Purchase Wizard (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-xl font-black text-gray-900 mb-1">
                Reserve & Book Test Drive
              </h3>
              <p className="text-xs text-gray-500 mb-6">
                Zero booking fee. Free doorstep or branch inspection test drive.
              </p>

              {!user ? (
                <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-center space-y-3">
                  <Lock className="w-8 h-8 text-amber-600 mx-auto" />
                  <p className="text-xs font-bold text-amber-900">
                    Authentication Required
                  </p>
                  <p className="text-[11px] text-amber-800">
                    Please log in or create an account to schedule test drives and reserve vehicles.
                  </p>
                  <button
                    onClick={() => openAuthModal("login")}
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
                  >
                    Log In / Register Now
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Step Indicators */}
                  <div className="flex items-center space-x-2 mb-6">
                    {[1, 2, 3].map((stepNum) => (
                      <div key={stepNum} className="flex-1 flex items-center space-x-2">
                        <div
                          className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                            step === stepNum
                              ? "bg-blue-600 text-white ring-4 ring-blue-100"
                              : step > stepNum
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {step > stepNum ? "✓" : stepNum}
                        </div>
                        {stepNum < 3 && (
                          <div
                            className={`flex-1 h-1 rounded-full ${
                              step > stepNum ? "bg-green-500" : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {step === 1 && (
                    <div className="space-y-3 animate-in fade-in">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-3 animate-in fade-in">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                          Preferred Test Drive Date
                        </label>
                        <Input
                          type="date"
                          name="preferredDate"
                          value={formData.preferredDate}
                          onChange={handleInputChange}
                          className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                          Preferred Time Slot
                        </label>
                        <select
                          name="preferredTime"
                          value={formData.preferredTime}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                          required
                        >
                          <option value="">Select time slot</option>
                          {availableTimes.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                          Delivery / Address Location
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="House, Street, City"
                          className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-3 animate-in fade-in">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                          Payment Mode
                        </label>
                        <select
                          name="paymentMethod"
                          value={formData.paymentMethod}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                          required
                        >
                          <option value="">Select payment option</option>
                          <option value="full">Full Payment / Cash</option>
                          <option value="loan">Cars24 Easy Finance Loan</option>
                        </select>
                      </div>

                      {formData.paymentMethod === "loan" && (
                        <div>
                          <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                            Down Payment Amount (₹)
                          </label>
                          <input
                            type="text"
                            name="downPayment"
                            value={formData.downPayment}
                            onChange={handleInputChange}
                            placeholder="e.g. ₹ 1,00,000"
                            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                          />
                        </div>
                      )}

                      <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-xs text-blue-900 space-y-1">
                        <p className="font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-blue-600" /> Free 7-Day Trial Included
                        </p>
                        <p className="text-[11px] text-blue-800">
                          Money-back guarantee if you change your mind within 7 days.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={() => setStep(step - 1)}
                        className="py-2.5 px-4 text-xs font-bold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50"
                      >
                        Back
                      </button>
                    )}

                    {step < 3 ? (
                      <button
                        type="button"
                        onClick={() => validateStep() && setStep(step + 1)}
                        disabled={!validateStep()}
                        className={`ml-auto py-2.5 px-6 font-bold text-xs rounded-xl text-white shadow-sm transition-all ${
                          validateStep()
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-gray-300 cursor-not-allowed"
                        }`}
                      >
                        Continue Next
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="ml-auto py-2.5 px-6 font-bold text-xs rounded-xl text-white bg-green-600 hover:bg-green-700 shadow-md transition-all"
                      >
                        Confirm Booking
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default CarDetailsPage;
