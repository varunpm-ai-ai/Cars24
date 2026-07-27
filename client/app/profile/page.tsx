"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserCars, deleteCar } from "@/lib/Carapi";
import { getBookingByUserId } from "@/lib/Bookingapi";
import { getAppointmentByUserId } from "@/lib/Appointmentapi";
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
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, signOut, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<"listings" | "bookings" | "appointments">("listings");

  const [userCars, setUserCars] = useState<any[]>([]);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [userAppointments, setUserAppointments] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  useEffect(() => {
    if (!user?.id) return;
    const userId = user.id;

    async function loadUserData() {
      setLoadingData(true);
      try {
        const [cars, bookings, appointments] = await Promise.all([
          getUserCars(userId),
          getBookingByUserId(userId).catch(() => []),
          getAppointmentByUserId(userId).catch(() => []),
        ]);

        setUserCars(cars || []);
        setUserBookings(bookings || []);
        setUserAppointments(appointments || []);
      } catch (error) {
        console.error("Failed to load user profile data:", error);
      } finally {
        setLoadingData(false);
      }
    }

    loadUserData();
  }, [user]);

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
              Please log in or create an account to access your personal dashboard, manage your listed vehicles, & view active bookings.
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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 text-white py-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-400 to-amber-300 text-blue-950 font-black text-2xl flex items-center justify-center shadow-xl border-2 border-white/20 uppercase">
                {user.fullName ? user.fullName.charAt(0) : "U"}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-black text-white">{user.fullName}</h1>
                  <span className="bg-green-500/20 text-green-300 border border-green-400/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Multi-Tenant Account
                  </span>
                </div>
                <p className="text-xs text-blue-200 mt-1">{user.email} • {user.phone || "No phone linked"}</p>
              </div>
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

      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 bg-white rounded-2xl p-1.5 shadow-xs">
          <button
            onClick={() => setActiveTab("listings")}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 ${
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
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 ${
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
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 ${
              activeTab === "appointments"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>My Appointments ({userAppointments.length})</span>
          </button>
        </div>

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
                  You haven't listed any cars for sale yet. List your vehicle to receive instant dynamic pricing recommendations.
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
              <p className="text-xs text-gray-500">Test drive & car purchase reservations.</p>
            </div>

            {userBookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
                <Package className="w-12 h-12 text-gray-300 mx-auto" />
                <h4 className="text-base font-bold text-gray-800">No Bookings Found</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  You haven't reserved any vehicles yet. Explore available cars to schedule a test drive.
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
                    </div>

                    <div className="text-right text-xs">
                      <p className="font-bold text-blue-700">₹ {b.car?.price || "7,80,000"}</p>
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
