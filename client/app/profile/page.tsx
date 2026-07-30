"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserCars, deleteCar } from "@/lib/Carapi";
import { getBookingByUserId } from "@/lib/Bookingapi";
import { getAppointmentByUserId } from "@/lib/Appointmentapi";
import {
  getUserWallet,
  getUserTransactions,
  getAllTenantConfigs,
  WalletSummary,
  WalletTransaction,
  TenantConfig,
} from "@/lib/walletapi";
import {
  User,
  Car,
  Package,
  Calendar,
  LogOut,
  PlusCircle,
  Trash2,
  Lock,
  ShieldCheck,
  Tag,
  MapPin,
  ExternalLink,
  Wallet,
  Gift,
  Copy,
  Check,
  Share2,
  TrendingUp,
  Award,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  Building2,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, signOut, openAuthModal, updateUserData } = useAuth();
  const [activeTab, setActiveTab] = useState<"wallet" | "listings" | "bookings" | "appointments">("wallet");

  const [userCars, setUserCars] = useState<any[]>([]);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [userAppointments, setUserAppointments] = useState<any[]>([]);

  // Wallet & Referral state
  const [walletSummary, setWalletSummary] = useState<WalletSummary | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [txFilter, setTxFilter] = useState<"all" | "earned" | "redeemed">("all");
  const [tenantConfigs, setTenantConfigs] = useState<TenantConfig[]>([]);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const [loadingData, setLoadingData] = useState<boolean>(true);

  useEffect(() => {
    if (!user?.id) return;
    const userId = user.id;

    async function loadUserData() {
      setLoadingData(true);
      try {
        const [cars, bookings, appointments, walletData, txList, configs] = await Promise.all([
          getUserCars(userId),
          getBookingByUserId(userId).catch(() => []),
          getAppointmentByUserId(userId).catch(() => []),
          getUserWallet(userId).catch(() => null),
          getUserTransactions(userId).catch(() => []),
          getAllTenantConfigs().catch(() => []),
        ]);

        setUserCars(cars || []);
        setUserBookings(bookings || []);
        setUserAppointments(appointments || []);
        if (walletData) {
          setWalletSummary(walletData);
          updateUserData({
            referralCode: walletData.referralCode,
            tenantId: walletData.tenantId,
            walletBalance: walletData.currentBalance,
          });
        }
        setTransactions(txList || []);
        setTenantConfigs(configs || []);
      } catch (error) {
        console.error("Failed to load user profile data:", error);
      } finally {
        setLoadingData(false);
      }
    }

    loadUserData();
  }, [user?.id]);

  const handleCopyCode = () => {
    if (!walletSummary?.referralCode) return;
    navigator.clipboard.writeText(walletSummary.referralCode);
    setCopiedCode(true);
    toast.success("Referral code copied to clipboard!");
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyLink = () => {
    if (!walletSummary?.referralCode) return;
    const link = `${window.location.origin}/signup?ref=${walletSummary.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    toast.success("Referral invitation link copied!");
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = () => {
    if (!walletSummary?.referralCode) return;
    const link = `${window.location.origin}/signup?ref=${walletSummary.referralCode}`;
    const text = encodeURIComponent(
      `Hey! Use my Cars24 referral code *${walletSummary.referralCode}* to get bonus reward points when buying or selling your car on Cars24! Join here: ${link}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleDeleteCar = async (carId: string) => {
    if (!confirm("Are you sure you want to remove this car listing?")) return;

    try {
      await deleteCar(carId);
      toast.success("Car listing removed successfully.");
      setUserCars((prev) => prev.filter((c) => c.id !== carId));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete car listing.");
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (txFilter === "earned") return tx.points > 0;
    if (txFilter === "redeemed") return tx.points < 0;
    return true;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-gray-900">
        <div className="bg-white rounded-3xl shadow-xl border-2 border-blue-500/20 p-8 sm:p-12 text-center space-y-5 max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-gray-900">
              User Profile Access Locked
            </h2>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              Please log in or create an account to access your personal wallet dashboard, referral code, & active bookings.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <button
              onClick={() => openAuthModal("login")}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
            >
              Log In to Access Profile
            </button>
            <button
              onClick={() => openAuthModal("signup")}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeTenant = walletSummary?.tenantConfig;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-blue-900 text-white py-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-400 to-amber-300 text-blue-950 font-black text-2xl flex items-center justify-center shadow-xl border-2 border-white/20 uppercase shrink-0">
                {user.fullName ? user.fullName.charAt(0) : "U"}
              </div>
              <div>
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <h1 className="text-2xl font-black text-white">{user.fullName}</h1>
                  <span className="bg-green-500/20 text-green-300 border border-green-400/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-green-400" /> Multi-Tenant Account ({activeTenant?.tenantName || "Cars24 Standard"})
                  </span>
                </div>
                <p className="text-xs text-blue-200 mt-1">
                  {user.email} • {user.phone || "No phone linked"} • Code: <span className="font-mono font-bold text-orange-300">{walletSummary?.referralCode || user.referralCode || "—"}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 text-center">
                <p className="text-[10px] uppercase font-bold text-blue-200">Points Balance</p>
                <p className="text-xl font-black text-orange-400">{walletSummary?.currentBalance ?? 0} <span className="text-xs text-white">pts</span></p>
              </div>

              <button
                onClick={() => signOut()}
                className="py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors border border-white/20 flex items-center space-x-1.5 self-start sm:self-auto"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 bg-white rounded-2xl p-1.5 shadow-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab("wallet")}
            className={`flex-1 min-w-[140px] py-3 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center space-x-2 ${
              activeTab === "wallet"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Wallet className="w-4 h-4 text-orange-300" />
            <span>Referrals & Wallet</span>
          </button>

          <button
            onClick={() => setActiveTab("listings")}
            className={`flex-1 min-w-[140px] py-3 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center space-x-2 ${
              activeTab === "listings"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Car className="w-4 h-4" />
            <span>My Listed Vehicles ({userCars.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex-1 min-w-[140px] py-3 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center space-x-2 ${
              activeTab === "bookings"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Bookings ({userBookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("appointments")}
            className={`flex-1 min-w-[140px] py-3 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center space-x-2 ${
              activeTab === "appointments"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>My Appointments ({userAppointments.length})</span>
          </button>
        </div>

        {/* TAB 0: REFERRALS & WALLET SYSTEM */}
        {activeTab === "wallet" && (
          <div className="space-y-6">
            {/* Wallet Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Card 1: Balance */}
              <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 text-white rounded-3xl p-6 shadow-lg border border-blue-700/50 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Wallet className="w-24 h-24" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase font-bold text-blue-200">Current Wallet Balance</span>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <p className="text-3xl font-black text-amber-300 mt-2">
                    {walletSummary?.currentBalance ?? 0} <span className="text-sm font-semibold text-white">pts</span>
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs">
                  <span className="text-blue-200">INR Discount Value:</span>
                  <span className="font-extrabold text-green-400">₹ {(walletSummary?.equivalentInINR ?? 0).toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Card 2: Lifetime Earned */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-extrabold text-gray-500">Lifetime Points Earned</span>
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <ArrowDownLeft className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-gray-900 mt-2">
                  {walletSummary?.lifetimeEarned ?? 0} <span className="text-xs text-gray-400">pts</span>
                </p>
                <p className="text-[11px] text-gray-400 mt-3 pt-2 border-t border-gray-50">
                  Earned via signups, purchases & sales
                </p>
              </div>

              {/* Card 3: Lifetime Redeemed */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-extrabold text-gray-500">Points Redeemed</span>
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-gray-900 mt-2">
                  {walletSummary?.lifetimeRedeemed ?? 0} <span className="text-xs text-gray-400">pts</span>
                </p>
                <p className="text-[11px] text-gray-400 mt-3 pt-2 border-t border-gray-50">
                  Applied as vehicle booking discounts
                </p>
              </div>

              {/* Card 4: Friends Invited */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-extrabold text-gray-500">Successful Referrals</span>
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                    <Gift className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900 mt-2">
                    {walletSummary?.successfulReferrals ?? 0} <span className="text-xs text-gray-400">buyers/sellers</span>
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1 font-medium">
                    Total Signups: {walletSummary?.referralCount ?? 0}
                  </p>
                </div>
                <p className="text-[11px] text-purple-600 font-bold mt-2 pt-2 border-t border-gray-50">
                  Organic growth rewarded
                </p>
              </div>
            </div>

            {/* Referral Code & Sharing Card */}
            <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 bg-black/20 text-orange-100 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    <Gift className="w-3.5 h-3.5" /> Organic Referral Program
                  </div>
                  <h3 className="text-2xl font-black text-white leading-tight">
                    Invite Friends & Both Earn Points on Every Car Purchase or Sale!
                  </h3>
                  <p className="text-xs text-orange-100 leading-relaxed">
                    Share your unique referral code. When a friend signs up and completes a car purchase or valuation under your tenant, you both get rewarded with points in your dedicated wallet!
                  </p>
                </div>

                {/* Code display box */}
                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/30 text-center space-y-3 shrink-0 w-full md:w-auto min-w-[280px]">
                  <p className="text-[10px] uppercase font-black text-orange-100 tracking-wider">Your Unique Referral Code</p>
                  <div className="bg-white text-gray-900 rounded-xl py-3 px-6 font-mono font-black text-2xl tracking-widest shadow-inner select-all flex items-center justify-center gap-2">
                    <span>{walletSummary?.referralCode || "REF-C24"}</span>
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      onClick={handleCopyCode}
                      className="flex-1 py-2 px-3 bg-white text-orange-700 hover:bg-orange-50 font-extrabold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
                    </button>

                    <button
                      onClick={handleCopyLink}
                      className="flex-1 py-2 px-3 bg-black/30 hover:bg-black/40 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 border border-white/20"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? "Link Copied!" : "Share Link"}</span>
                    </button>
                  </div>

                  <button
                    onClick={handleShareWhatsApp}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Share on WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tenant Benefits Breakdown Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <h3 className="text-base font-black text-gray-900">
                      Tenant-Specific Referral Benefits ({activeTenant?.tenantName || "Cars24 Standard"})
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {activeTenant?.description}
                  </p>
                </div>

                {/* Tenant selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-semibold">Tenant Region:</span>
                  <select
                    value={activeTenant?.tenantId || "tenant-default"}
                    onChange={(e) => {
                      const selected = tenantConfigs.find((t) => t.tenantId === e.target.value);
                      if (selected && walletSummary) {
                        setWalletSummary({
                          ...walletSummary,
                          tenantId: selected.tenantId,
                          tenantConfig: selected,
                        });
                        toast.info(`Switched tenant view to ${selected.tenantName}`);
                      }
                    }}
                    className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-extrabold text-blue-800 focus:outline-none"
                  >
                    {tenantConfigs.map((tc) => (
                      <option key={tc.tenantId} value={tc.tenantId}>
                        {tc.tenantName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Benefits breakdown grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 space-y-1">
                  <div className="flex items-center justify-between text-blue-900 font-extrabold text-xs">
                    <span>Friend Signup</span>
                    <Gift className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-lg font-black text-blue-700">+{activeTenant?.signupRewardReferrer ?? 100} pts</p>
                  <p className="text-[10px] text-blue-600">Referee gets: +{activeTenant?.signupRewardReferee ?? 50} pts</p>
                </div>

                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 space-y-1">
                  <div className="flex items-center justify-between text-emerald-900 font-extrabold text-xs">
                    <span>Car Purchase</span>
                    <Car className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-lg font-black text-emerald-700">+{activeTenant?.purchaseRewardReferrer ?? 500} pts</p>
                  <p className="text-[10px] text-emerald-600">Referee gets: +{activeTenant?.purchaseRewardReferee ?? 250} pts</p>
                </div>

                <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100 space-y-1">
                  <div className="flex items-center justify-between text-purple-900 font-extrabold text-xs">
                    <span>Car Sale / Valuation</span>
                    <Tag className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-lg font-black text-purple-700">+{activeTenant?.saleRewardReferrer ?? 300} pts</p>
                  <p className="text-[10px] text-purple-600">Referee gets: +{activeTenant?.saleRewardReferee ?? 150} pts</p>
                </div>

                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 space-y-1">
                  <div className="flex items-center justify-between text-amber-900 font-extrabold text-xs">
                    <span>Redemption Rules</span>
                    <Award className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="text-lg font-black text-amber-700">1 Point = ₹{activeTenant?.pointValueInINR ?? 1.0}</p>
                  <p className="text-[10px] text-amber-700">Max {activeTenant?.maxRedemptionPercent ?? 20}% discount per booking (Min {activeTenant?.minRedeemPoints ?? 50} pts)</p>
                </div>
              </div>
            </div>

            {/* Transaction Ledger Table */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-black text-gray-900">Dedicated Wallet Transaction History</h3>
                  <p className="text-xs text-gray-500">Real-time ledger of earned referral rewards & redeemed points.</p>
                </div>

                {/* Filter buttons */}
                <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setTxFilter("all")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${txFilter === "all" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-800"}`}
                  >
                    All ({transactions.length})
                  </button>
                  <button
                    onClick={() => setTxFilter("earned")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${txFilter === "earned" ? "bg-white text-green-700 shadow-xs" : "text-gray-500 hover:text-gray-800"}`}
                  >
                    Earned
                  </button>
                  <button
                    onClick={() => setTxFilter("redeemed")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${txFilter === "redeemed" ? "bg-white text-orange-700 shadow-xs" : "text-gray-500 hover:text-gray-800"}`}
                  >
                    Redeemed
                  </button>
                </div>
              </div>

              {filteredTransactions.length === 0 ? (
                <div className="p-8 text-center text-gray-400 space-y-2">
                  <Wallet className="w-10 h-10 mx-auto text-gray-300" />
                  <p className="text-xs font-bold">No transactions found for selected filter.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-[10px] uppercase text-gray-400 border-b border-gray-100 font-extrabold">
                        <th className="pb-3 px-2">Type / Transaction</th>
                        <th className="pb-3 px-2">Description</th>
                        <th className="pb-3 px-2 text-right">Points</th>
                        <th className="pb-3 px-2 text-right">Date & Time</th>
                        <th className="pb-3 px-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-medium">
                      {filteredTransactions.map((tx, idx) => {
                        const isEarned = tx.points > 0;
                        return (
                          <tr key={tx.id || idx} className="hover:bg-gray-50/80 transition-colors">
                            <td className="py-3 px-2">
                              <span
                                className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                                  isEarned ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                                }`}
                              >
                                {isEarned ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                                {tx.type}
                              </span>
                            </td>
                            <td className="py-3 px-2 font-bold text-gray-900">{tx.description}</td>
                            <td
                              className={`py-3 px-2 text-right font-black text-sm ${
                                isEarned ? "text-green-600" : "text-orange-600"
                              }`}
                            >
                              {isEarned ? `+${tx.points}` : tx.points} pts
                            </td>
                            <td className="py-3 px-2 text-right text-gray-400 text-[11px]">
                              {new Date(tx.timestamp).toLocaleString("en-IN", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </td>
                            <td className="py-3 px-2 text-center">
                              <span className="bg-blue-50 text-blue-700 font-bold text-[10px] px-2 py-0.5 rounded-md">
                                {tx.status || "Completed"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 1: MY LISTED CARS */}
        {activeTab === "listings" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900">Your Vehicle Inventory</h3>
                <p className="text-xs text-gray-500">Cars listed under your multi-tenant account.</p>
              </div>

              <Link
                href="/sell-car"
                className="py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List Another Car</span>
              </Link>
            </div>

            {loadingData ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : userCars.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
                <Car className="w-12 h-12 text-gray-300 mx-auto" />
                <h4 className="text-base font-bold text-gray-800">No Listed Cars Found</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  You haven't listed any cars for sale yet. List your vehicle to receive instant dynamic pricing recommendations & referral points!
                </p>
                <Link
                  href="/sell-car"
                  className="inline-block py-2.5 px-5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow hover:bg-blue-700 transition-colors"
                >
                  Sell Your Car Now
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userCars.map((car: any) => (
                  <div
                    key={car.id}
                    className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="relative aspect-video bg-gray-900">
                        <img
                          src={
                            car.images?.[0] ||
                            "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg"
                          }
                          alt={car.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                          {car.bodyType || "SUV"}
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <h4 className="font-bold text-gray-900 text-sm line-clamp-1">
                          {car.title}
                        </h4>

                        <div className="flex items-baseline justify-between">
                          <div>
                            <p className="text-xs text-gray-400 uppercase font-bold">Listing Price</p>
                            <p className="text-lg font-black text-blue-700">₹ {car.price}</p>
                          </div>
                          {car.recommendedPriceNumeric && (
                            <div className="text-right">
                              <p className="text-[10px] text-gray-400 font-bold uppercase">Recommended</p>
                              <p className="text-xs font-extrabold text-orange-600">
                                ₹ {car.recommendedPriceNumeric.toLocaleString("en-IN")}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-100">
                          <p className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            <span>{car.location || "Standard Market"}</span>
                          </p>
                          <p className="flex items-center gap-1.5 text-[11px]">
                            <Tag className="w-3.5 h-3.5 text-gray-400" />
                            <span>{car.specs?.fuel} • {car.specs?.km}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2">
                      <Link
                        href={`/buy-car/${car.id}`}
                        className="py-2 px-3 bg-white text-blue-700 border border-blue-200 font-bold text-xs rounded-xl hover:bg-blue-50 transition-colors flex items-center space-x-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View Page</span>
                      </Link>

                      <button
                        onClick={() => handleDeleteCar(car.id)}
                        className="py-2 px-3 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY BOOKINGS */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-black text-gray-900">Your Reserved Bookings</h3>
              <p className="text-xs text-gray-500">Test drive & car purchase reservations with wallet discounts applied.</p>
            </div>

            {userBookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
                <Package className="w-12 h-12 text-gray-300 mx-auto" />
                <h4 className="text-base font-bold text-gray-800">No Bookings Found</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  You haven't reserved any vehicles yet. Explore available cars to schedule a test drive and redeem your wallet points!
                </p>
                <Link
                  href="/buy-car"
                  className="inline-block py-2.5 px-5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow hover:bg-blue-700 transition-colors"
                >
                  Browse Cars
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {userBookings.map((b: any, idx: number) => (
                  <div
                    key={b.booking?.id || idx}
                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full">
                        Confirmed Booking
                      </span>
                      <h4 className="font-bold text-sm text-gray-900 mt-1">
                        {b.car?.title || "Reserved Vehicle"}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Visit Date: {b.booking?.preferredDate} at {b.booking?.preferredTime}
                      </p>
                      {b.booking?.pointsRedeemed > 0 && (
                        <p className="text-[11px] font-bold text-green-600 mt-1">
                          🎁 Redeemed {b.booking.pointsRedeemed} pts (Discount: ₹{b.booking.discountAmount})
                        </p>
                      )}
                    </div>

                    <div className="text-right text-xs">
                      <p className="font-bold text-blue-700">₹ {b.booking?.finalPrice || b.car?.price || "7,80,000"}</p>
                      <p className="text-gray-500 text-[11px]">Payment: {b.booking?.paymentMethod}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MY APPOINTMENTS */}
        {activeTab === "appointments" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-black text-gray-900">Your Service Appointments</h3>
              <p className="text-xs text-gray-500">Scheduled vehicle inspection & valuation appointments.</p>
            </div>

            {userAppointments.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto" />
                <h4 className="text-base font-bold text-gray-800">No Appointments Scheduled</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  You have no pending valuation or inspection appointments.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {userAppointments.map((app: any, idx: number) => (
                  <div
                    key={app.appointment?.id || idx}
                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex justify-between items-center"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                        Inspection Scheduled
                      </span>
                      <h4 className="font-bold text-sm text-gray-900 mt-1">
                        {app.car?.title || "Inspected Car"}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Date: {app.appointment?.appointmentDate} ({app.appointment?.city})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
