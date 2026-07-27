"use client";

import React, { useState } from "react";
import { Check, Car, Image, FileText, DollarSign, Lock, ShieldCheck } from "lucide-react";
import Carform from "@/components/sellcar/Carform";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "@/context/LocationContext";
import { toast } from "sonner";
import { createCar } from "@/lib/Carapi";

const SellCarPage = () => {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();
  const { selectedPreset } = useLocation();

  const [currentStep, setCurrentStep] = useState(1);
  const [carDetails, setCarDetails] = useState<any>({
    title: "",
    images: [],
    price: "",
    emi: "",
    location: selectedPreset.cityName,
    bodyType: "SUV",
    specs: {
      year: new Date().getFullYear(),
      km: "",
      fuel: "Petrol",
      transmission: "Manual",
      owner: "1st Owner",
      insurance: "Comprehensive",
    },
    features: [],
    highlights: [],
  });

  const steps = [
    { id: 1, name: "Basic Details", icon: Car },
    { id: 2, name: "Images & Specs", icon: Image },
    { id: 3, name: "Features", icon: FileText },
    { id: 4, name: "Pricing & Valuation", icon: DollarSign },
  ];

  const updateCarDetails = (updatedDetails: Partial<any>) => {
    setCarDetails((prev: any) => ({
      ...prev,
      ...updatedDetails,
    }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to submit your vehicle listing");
      openAuthModal("login");
      return;
    }

    try {
      const payload = {
        ...carDetails,
        userId: user.id,
        sellerName: user.fullName,
        location: carDetails.location || selectedPreset.cityName,
      };

      const car = await createCar(payload);
      toast.success("Car listed successfully in your account!");

      if (car?.id) {
        router.push(`/bookappointment/${car.id}`);
      } else {
        router.push("/profile");
      }
    } catch (error) {
      console.error("Listing error:", error);
      toast.error("Failed to list vehicle. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Heading */}
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Sell Your Car On Cars24
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              List your car directly, get real-time dynamic market recommendations, & receive instant buyer offers.
            </p>
          </div>

          {/* Auth Gate for Unauthenticated Users */}
          {!user ? (
            <div className="bg-white rounded-3xl shadow-xl border-2 border-blue-500/20 p-8 sm:p-12 text-center space-y-5 max-w-2xl mx-auto my-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-gray-900">
                  Authentication Required to Sell
                </h2>
                <p className="text-xs text-gray-600 max-w-md mx-auto mt-2 leading-relaxed">
                  Each vehicle listed on Cars24 belongs to a verified user account. Log in or create your account to list your car with dynamic regional price insights.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <button
                  onClick={() => openAuthModal("login")}
                  className="py-3 px-6 bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-blue-700 transition-all"
                >
                  Log In to Start Listing
                </button>
                <button
                  onClick={() => openAuthModal("signup")}
                  className="py-3 px-6 bg-orange-500 text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-orange-600 transition-all"
                >
                  Create New Account
                </button>
              </div>
            </div>
          ) : (
            /* Authenticated Listing Wizard */
            <div className="space-y-6">
              {/* Stepper Header */}
              <div className="w-full py-4 bg-white rounded-2xl p-4 shadow-xs border border-gray-100">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                            currentStep > step.id
                              ? "bg-green-500 border-green-500 text-white shadow-sm"
                              : currentStep === step.id
                              ? "border-blue-600 bg-blue-50 text-blue-600 font-bold"
                              : "border-gray-300 text-gray-300"
                          }`}
                        >
                          {currentStep > step.id ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <step.icon className="w-5 h-5" />
                          )}
                        </div>
                        <span
                          className={`mt-2 text-[11px] font-bold ${
                            currentStep >= step.id
                              ? "text-gray-900"
                              : "text-gray-400"
                          }`}
                        >
                          {step.name}
                        </span>
                      </div>

                      {index < steps.length - 1 && (
                        <div
                          className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${
                            currentStep > index + 1
                              ? "bg-green-500"
                              : "bg-gray-200"
                          }`}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Form Content */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <Carform
                  carDetails={carDetails}
                  updateCarDetails={updateCarDetails}
                  currentStep={currentStep}
                  nextStep={nextStep}
                  prevStep={prevStep}
                  handleSubmit={handleSubmit}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SellCarPage;
