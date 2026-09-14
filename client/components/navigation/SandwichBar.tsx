"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "@/context/LocationContext";
import {
  X,
  User,
  Car,
  Tag,
  MapPin,
  Calendar,
  Package,
  FileText,
  HelpCircle,
  LogOut,
  LogIn,
  ChevronRight,
  ShieldCheck,
  Wrench,
  TrendingUp,
  Flame,
} from "lucide-react";
import { toast } from "sonner";

type SandwichBarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const SandwichBar: React.FC<SandwichBarProps> = ({ isOpen, onClose }) => {
  const { user, signOut, openAuthModal } = useAuth();
  const { selectedPreset, openLocationDrawer } = useLocation();

  if (!isOpen) return null;

  const handleAuthAction = (mode: "login" | "signup") => {
    onClose();
    openAuthModal(mode);
  };

  const handleLocationClick = () => {
    onClose();
    openLocationDrawer();
  };

  const navLinks = [
    { label: "Buy Used Cars", href: "/buy-car", icon: Car },
    { label: "Sell Your Car", href: "/sell-car", icon: Tag },
    { label: "My Profile & My Listings", href: "/profile", icon: User, protected: true },
    { label: "My Bookings", href: "/bookings", icon: Package, protected: true },
    { label: "My Appointments", href: "/appointments", icon: Calendar, protected: true },
    { label: "Car Finance", href: "/finance", icon: FileText },
    { label: "Car Services", href: "/services", icon: Wrench },
    { label: "FAQ & Support", href: "/faq", icon: HelpCircle },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex justify-start bg-black/50 transition-opacity duration-200">
      <div
        className="relative w-full max-w-sm h-full bg-white shadow-lg flex flex-col overflow-y-auto border-r border-gray-200 text-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Card */}
        <div className="relative bg-blue-600 p-6 text-white shadow-sm">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-md transition-colors"
            aria-label="Close sandwich navigation menu"
          >
            <X className="w-5 h-5" />
          </button>

          {/* User Profile Card Section */}
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-orange-500 text-white font-bold text-xl flex items-center justify-center uppercase">
                  {user.fullName ? user.fullName.charAt(0) : "U"}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white leading-tight">
                    {user.fullName}
                  </h3>
                  <p className="text-xs text-blue-100">{user.email}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="bg-white text-blue-800 font-bold px-2 py-0.5 rounded text-xs">
                  CARS
                </span>
                <span className="text-orange-400 font-bold text-lg">24</span>
              </div>
              <h3 className="font-bold text-xl text-white">
                Welcome to Cars24
              </h3>
              <p className="text-xs text-blue-100">
                Log in or sign up to access car listings, appointments, & details.
              </p>
              <div className="flex items-center space-x-2 pt-1">
                <button
                  onClick={() => handleAuthAction("login")}
                  className="flex-1 py-2 px-3 bg-white text-blue-900 font-bold text-xs rounded-md shadow-sm hover:bg-blue-50 transition-colors flex items-center justify-center space-x-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </button>
                <button
                  onClick={() => handleAuthAction("signup")}
                  className="flex-1 py-2 px-3 bg-orange-500 text-white font-bold text-xs rounded-md shadow-sm hover:bg-orange-600 transition-colors flex items-center justify-center space-x-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Location Selector */}
        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <div
            onClick={handleLocationClick}
            className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 cursor-pointer hover:border-blue-500 transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded bg-blue-100 text-blue-700 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase text-gray-500 tracking-wider">
                  Selected City
                </p>
                <p className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {selectedPreset.cityName}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Navigation Links */}
        <div className="p-4 space-y-1 flex-1">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase text-gray-400 tracking-wider">
            Menu Navigation
          </p>

          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors group font-semibold text-sm"
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  <span>{link.label}</span>
                </div>
                {link.protected && !user && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    Login Required
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Section / Sign Out */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          {user ? (
            <button
              onClick={() => {
                signOut();
                toast.success("Signed out successfully");
                onClose();
              }}
              className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-md transition-colors flex items-center justify-center space-x-2 border border-red-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out Account</span>
            </button>
          ) : (
            <div className="text-center">
              <p className="text-[11px] text-gray-500 font-medium">
                Cars24 Application
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
