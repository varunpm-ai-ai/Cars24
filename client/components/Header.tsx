"use client";

import React, { useState } from "react";
import {
  Car,
  Calendar,
  Package,
  FileText,
  HelpCircle,
  Users,
  Menu,
  Heart,
  User,
  ChevronDown,
  MapPin,
  TrendingUp,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "@/context/LocationContext";
import { SandwichBar } from "@/components/navigation/SandwichBar";
import { LocationSlidebar } from "@/components/navigation/LocationSlidebar";
import { AuthModal } from "@/components/auth/AuthModal";

const Header = () => {
  const navItems = [
    { name: "Buy used car", href: "/buy-car" },
    { name: "Sell car", href: "/sell-car" },
    { name: "Car finance", href: "/finance" },
    { name: "New cars", href: "/new-cars" },
    { name: "Car services", href: "/services" },
  ];

  const menuItems = [
    { label: "My Profile & Listings", icon: User, link: "/profile" },
    { label: "My Appointments", icon: Calendar, link: "/appointments" },
    { label: "My Bookings", icon: Package, link: "/bookings" },
    { label: "Become Our Partner", icon: Users, link: "/partner" },
    { label: "FAQ & Support", icon: HelpCircle, link: "/faq" },
  ];

  const { user, signOut, openAuthModal } = useAuth();
  const { selectedPreset, openLocationDrawer, isGeoFenceActive } = useLocation();
  const [sandwichBarOpen, setSandwichBarOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between p-3.5 lg:px-8"
          aria-label="Global"
        >
          {/* Left: Mobile Menu & Logo */}
          <div className="flex items-center space-x-3 lg:flex-1">
            <button
              onClick={() => setSandwichBarOpen(true)}
              className="lg:hidden p-2 text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
              <div className="flex items-center space-x-1.5 font-black text-2xl tracking-tighter text-blue-600">
                <Car className="h-7 w-7 text-orange-500 fill-orange-500" />
                <span>CARS<span className="text-orange-500">24</span></span>
              </div>
            </Link>
          </div>

          {/* Center: Nav Items */}
          <div className="hidden lg:flex lg:gap-x-7">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className="flex items-center text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {item.name}
                </Link>
              </div>
            ))}
          </div>

          {/* Right: Location Pill & User Profile Menu */}
          <div className="flex items-center space-x-3 lg:flex-1 lg:justify-end">
            {/* Dynamic Pricing Location Switcher Button */}
            <button
              onClick={openLocationDrawer}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200/80 rounded-full text-xs font-bold transition-all shadow-xs"
              title="Click to change location or market season"
            >
              <span className="text-sm">{selectedPreset.icon}</span>
              <span className="hidden sm:inline-block max-w-[120px] truncate">
                {selectedPreset.cityName.split("/")[0]}
              </span>
              {isGeoFenceActive && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200 animate-pulse" title="Geo-fence Active" />
              )}
              <ChevronDown className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            </button>

            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex text-xs text-gray-700 hover:text-blue-600"
            >
              <Heart className="mr-1 h-4 w-4" />
              <span>Wishlist</span>
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="inline-flex items-center justify-center p-1 px-2.5 rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-700 transition-colors cursor-pointer">
                  {user ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-extrabold flex items-center justify-center text-xs uppercase shadow-xs">
                        {user.fullName ? user.fullName.charAt(0) : "U"}
                      </div>
                      <span className="hidden md:inline-block max-w-[100px] truncate font-bold text-xs">
                        {user.fullName}
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-800">
                      <User className="h-4 w-4 text-blue-600" />
                      <span>Account</span>
                      <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                    </div>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 rounded-2xl shadow-xl p-2 border-gray-100">
                {user ? (
                  <>
                    <div className="p-3 bg-blue-50/70 rounded-xl mb-1">
                      <p className="text-xs font-extrabold text-blue-900 truncate">
                        {user.fullName}
                      </p>
                      <p className="text-[11px] text-blue-700 truncate">{user.email}</p>
                    </div>

                    <DropdownMenuItem>
                      <Link
                        href="/profile"
                        className="w-full flex items-center gap-2 text-xs font-semibold cursor-pointer py-2"
                      >
                        <User className="h-4 w-4 text-blue-600" />
                        My Profile & Listed Cars
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="text-red-600 focus:bg-red-50 text-xs font-bold cursor-pointer py-2"
                      onClick={signOut}
                    >
                      Sign Out
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                  </>
                ) : (
                  <>
                    <div className="p-2">
                      <button
                        onClick={() => openAuthModal("login")}
                        className="w-full py-2 px-3 text-center font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors text-xs flex items-center justify-center space-x-1.5 shadow-sm"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>LOG IN / SIGN UP</span>
                      </button>
                    </div>
                    <DropdownMenuSeparator />
                  </>
                )}

                {/* Common menu items */}
                {menuItems.map(({ label, icon: Icon, link }) => (
                  <DropdownMenuItem key={label}>
                    <Link
                      href={link}
                      className="flex items-center gap-2.5 w-full text-xs font-medium cursor-pointer py-2"
                    >
                      <Icon className="h-4 w-4 text-gray-500" />
                      {label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </header>

      {/* Global Navigation Components */}
      <SandwichBar
        isOpen={sandwichBarOpen}
        onClose={() => setSandwichBarOpen(false)}
      />
      <LocationSlidebar />
      <AuthModal />
    </>
  );
};

export default Header;