"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { validateReferralCode } from "@/lib/walletapi";
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Gift,
  Building2,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    openAuthModal,
    signIn,
    signUp,
  } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">(authModalMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [tenantId, setTenantId] = useState("tenant-default");
  const [referralCode, setReferralCode] = useState("");

  const [referralValidation, setReferralValidation] = useState<{
    status: "idle" | "loading" | "valid" | "invalid";
    message: string;
    referrerName?: string;
    bonusPoints?: number;
  }>({ status: "idle", message: "" });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMode(authModalMode);
    setError("");
  }, [authModalMode, isAuthModalOpen]);

  // Debounced referral code validation
  useEffect(() => {
    if (!referralCode || referralCode.trim().length < 4) {
      setReferralValidation({ status: "idle", message: "" });
      return;
    }

    const timer = setTimeout(async () => {
      setReferralValidation({ status: "loading", message: "Validating code..." });
      try {
        const res = await validateReferralCode(referralCode.trim());
        if (res.isValid) {
          setReferralValidation({
            status: "valid",
            message: `Valid code from ${res.referrerName}! +${res.signupRewardReferee} bonus points on signup.`,
            referrerName: res.referrerName,
            bonusPoints: res.signupRewardReferee,
          });
        } else {
          setReferralValidation({ status: "invalid", message: res.message || "Invalid code" });
        }
      } catch (err: any) {
        setReferralValidation({ status: "invalid", message: err?.message || "Invalid referral code" });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [referralCode]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await signIn(email, password);
        toast.success("Welcome back! Signed in successfully.");
      } else {
        if (!fullName || !phone) {
          setError("Please fill in all required fields.");
          setIsSubmitting(false);
          return;
        }
        await signUp(email, password, {
          fullName,
          phone,
          tenantId,
          referralCode: referralCode.trim() || undefined,
        });
        toast.success("Account created! Referral welcome bonus credited to your wallet.");
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      const msg =
        err?.message ||
        (mode === "login"
          ? "Invalid email or password. Please try again."
          : "Signup failed. User may already exist.");
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-in fade-in">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 transform transition-all duration-300 scale-100 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 p-6 text-white overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close auth dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-white text-blue-900 font-extrabold px-2.5 py-0.5 rounded-lg text-sm tracking-wider">
              CARS
            </span>
            <span className="text-orange-400 font-extrabold text-xl">24</span>
          </div>

          <h3 className="text-xl font-bold text-white">
            {mode === "login"
              ? "Welcome Back to Cars24"
              : "Join Cars24 & Claim Rewards"}
          </h3>
          <p className="text-xs text-blue-200 mt-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
            {mode === "login"
              ? "Sign in to access seller tools, car details, & wallet points."
              : "Multi-tenant automotive platform with referral reward benefits."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 p-1 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all ${
              mode === "login"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError("");
            }}
            className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all ${
              mode === "signup"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Create Account & Earn Points
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="flex items-start p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-xl space-x-2 animate-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {mode === "signup" && (
            <>
              {/* Tenant Location */}
              <div>
                <label className="block text-[11px] font-extrabold text-gray-700 uppercase tracking-wider mb-1">
                  Select Tenant Hub Location
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <select
                    value={tenantId}
                    onChange={(e) => setTenantId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-gray-900 font-bold"
                  >
                    <option value="tenant-default">Cars24 Standard (Global)</option>
                    <option value="tenant-delhi">Cars24 Delhi-NCR Hub (+150 pts referral bonus)</option>
                    <option value="tenant-mumbai">Cars24 Mumbai Metro (+120 pts referral bonus)</option>
                    <option value="tenant-bangalore">Cars24 Bangalore Tech Hub (+200 pts referral bonus)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-gray-900 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-gray-700 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-gray-900 transition-all font-medium"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-extrabold text-gray-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-gray-900 transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-gray-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-gray-900 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {mode === "signup" && (
            <div>
              <label className="block text-[11px] font-extrabold text-gray-700 uppercase tracking-wider mb-1">
                Referral Code (Optional)
              </label>
              <div className="relative">
                <Gift className="absolute left-3.5 top-3 w-4 h-4 text-orange-500" />
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="e.g. REF-JOH-1A2B"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-orange-50/40 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-gray-900 font-extrabold uppercase"
                />
              </div>

              {referralValidation.status === "loading" && (
                <p className="text-[10px] text-gray-500 mt-1 animate-pulse">Checking referral code...</p>
              )}

              {referralValidation.status === "valid" && (
                <div className="flex items-center gap-1.5 text-[11px] text-green-700 bg-green-50 p-2 rounded-lg border border-green-200 mt-1.5 font-bold">
                  <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0" />
                  <span>{referralValidation.message}</span>
                </div>
              )}

              {referralValidation.status === "invalid" && (
                <div className="flex items-center gap-1.5 text-[11px] text-red-600 bg-red-50 p-2 rounded-lg border border-red-200 mt-1.5 font-bold">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>{referralValidation.message}</span>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>
                {mode === "login" ? "Sign In Now" : "Create Account & Unlock Benefits"}
              </span>
            )}
          </button>

          <div className="pt-2 text-center">
            {mode === "login" ? (
              <p className="text-xs text-gray-600">
                Don't have an account yet?{" "}
                <button
                  type="button"
                  onClick={() => openAuthModal("signup")}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Sign Up Free
                </button>
              </p>
            ) : (
              <p className="text-xs text-gray-600">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => openAuthModal("login")}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Log In Here
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
