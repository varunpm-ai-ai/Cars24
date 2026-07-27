'use client'

import { Bell, Calendar, Car, LogOut, Mail, Settings, User, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import Header from "@/components/Header";
import Fotter from "@/components/Fotter";
import { useAuth } from "@/context/AuthContext";

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-black">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-2xl uppercase shadow-md">
                  {user?.fullName ? user.fullName.charAt(0) : <User className="w-10 h-10 text-blue-600" />}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {user?.fullName || "Guest User"}
                  </h1>
                  <p className="text-blue-100">{user?.email || "No email provided"}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Profile Information */}
                <div className="md:col-span-2">
                  <div className="bg-white rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">
                        Profile Information
                      </h2>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 text-sm">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-500">Full Name:</span>
                        <span className="font-semibold text-gray-900">{user?.fullName || "N/A"}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-500">Email:</span>
                        <span className="font-semibold text-gray-900">{user?.email || "N/A"}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-500">Phone:</span>
                        <span className="font-semibold text-gray-900">{user?.phone || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Quick Actions</h2>
                  <div className="space-y-2">
                    <button
                      onClick={() => router.push("/profile/notifications")}
                      className="w-full flex items-center justify-between p-3 text-left rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 font-medium transition-colors border border-orange-200"
                    >
                      <div className="flex items-center space-x-2">
                        <Bell className="w-5 h-5 text-orange-600" />
                        <span>Push Notifications</span>
                      </div>
                      <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-bold">New</span>
                    </button>

                    <button
                      onClick={() => router.push("/bookings")}
                      className="w-full flex items-center space-x-2 p-3 text-left rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <Car className="w-5 h-5 text-gray-400" />
                      <span>My Bookings</span>
                    </button>

                    <button
                      onClick={() => router.push("/appointments")}
                      className="w-full flex items-center space-x-2 p-3 text-left rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span>Appointments</span>
                    </button>

                    <button
                      onClick={signOut}
                      className="w-full flex items-center space-x-2 p-3 text-left rounded-xl hover:bg-red-50 text-red-600 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Fotter />
    </div>
  );
};

export default ProfilePage;
