'use client'

import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  Check,
  User,
  Settings,
  Fuel,
  Gauge,
  Mail,
  Phone,
  Landmark,
  CreditCard,
  DollarSign,
  Shield,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getBookingbyuser } from "@/lib/Bookingapi";

const PurchasedCarsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [purchasedCars, setpurchasedCars] = useState<any[]>([]);

  useEffect(() => {
    const fetchpurchasedCars = async () => {
      try {
        if (user) {
          const res = await getBookingbyuser(user.id);
          setpurchasedCars(Array.isArray(res) ? res : []);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchpurchasedCars();
  }, [user]);

  const formatPrice = (price: any) => {
    if (!price) return "₹ 0";
    const cleaned = String(price).replace(/[^0-9]/g, "");
    const num = parseInt(cleaned, 10);
    return isNaN(num) ? `₹ ${price}` : `₹ ${num.toLocaleString("en-IN")}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!purchasedCars || purchasedCars.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-blue-50 p-6 rounded-full mb-4">
          <ShoppingBag className="w-12 h-12 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Bookings Found</h2>
        <p className="text-gray-600 max-w-md mb-6">
          You haven&apos;t reserved or purchased any vehicles yet. Explore our curated catalog to find your dream car.
        </p>
        <Link
          href="/buy-car"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all"
        >
          Explore Available Cars
        </Link>
      </div>
    );
  }

  const defaultCar = {
    title: "Vehicle Reserved",
    location: "Cars24 Hub",
    price: "750000",
    emi: "15000",
    images: ["https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg"],
    specs: {
      year: 2022,
      km: "30,000",
      fuel: "Petrol",
      transmission: "Manual",
      owner: "1st Owner",
      insurance: "Valid",
    },
    highlights: ["Verified Quality", "Free Trial & Warranty"],
    features: ["Airbags", "ABS", "Reverse Camera"],
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 print:py-0 print:px-0 text-black">
      <div className="mb-8 text-center print:hidden">
        <h1 className="text-3xl font-bold text-gray-800">
          Car Booking Confirmation
        </h1>
        <p className="text-gray-600">Thank you for your reservation!</p>
      </div>

      <div className="space-y-8">
        {purchasedCars.map((item: any, idx: number) => {
          const booking = item?.booking || item || {};
          const car = item?.car || defaultCar;

          const bookingIdStr = String(booking.id || booking._id || `BK-${idx + 100}`);
          const displayId = bookingIdStr.length > 8 ? bookingIdStr.slice(-8).toUpperCase() : bookingIdStr.toUpperCase();

          const carImages = Array.isArray(car.images) && car.images.length > 0
            ? car.images
            : [car.image || defaultCar.images[0]];

          const specs = car.specs || defaultCar.specs;
          const highlights = Array.isArray(car.highlights) ? car.highlights : defaultCar.highlights;
          const features = Array.isArray(car.features) ? car.features : defaultCar.features;

          return (
            <div key={bookingIdStr + idx} className="max-w-5xl mx-auto bg-gray-50 rounded-lg overflow-hidden shadow-xl">
              <div className="bg-blue-900 text-white p-6 rounded-t-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-2">
                      <Check className="w-6 h-6 mr-2 text-green-400" />
                      <h1 className="text-2xl font-bold">Booking Confirmed</h1>
                    </div>
                    <p className="text-blue-200 mb-4">
                      Booking ID: {displayId}
                    </p>

                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-blue-300" />
                        <span>{booking.preferredDate || "Date Pending"}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-blue-300" />
                        <span>{booking.preferredTime || "10:00 AM"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center">
                    <Car className="w-12 h-12 text-blue-300" />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="bg-white p-6 rounded-lg shadow-md mb-6 transition-all duration-300 hover:shadow-lg">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Car Image */}
                    <div className="md:w-2/5 h-64 overflow-hidden rounded-lg">
                      <img
                        src={carImages[0]}
                        alt={car.title || "Reserved Car"}
                        className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
                      />
                    </div>

                    {/* Car Details */}
                    <div className="md:w-3/5">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {car.title || "Vehicle Details"}
                      </h2>
                      <p className="text-gray-600 mb-4">{car.location || "Bengaluru Hub"}</p>

                      <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm text-blue-700">Price</p>
                          <p className="text-xl font-bold text-blue-900">
                            {formatPrice(car.price)}
                          </p>
                        </div>
                        {car.emi && (
                          <div className="bg-amber-50 p-3 rounded-lg">
                            <p className="text-sm text-amber-700">EMI from</p>
                            <p className="text-xl font-bold text-amber-900">
                              {formatPrice(car.emi)}/month
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Car Specifications */}
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Specifications
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="text-gray-700">
                            {specs.year || 2022}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Gauge className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="text-gray-700">
                            {specs.km || "30,000"} km
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Fuel className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="text-gray-700">
                            {specs.fuel || "Petrol"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Settings className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="text-gray-700">
                            {specs.transmission || "Manual"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="text-gray-700">
                            {specs.owner || "1st Owner"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Shield className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="text-gray-700">
                            {specs.insurance || "Valid"}
                          </span>
                        </div>
                      </div>

                      {/* Highlights and Features */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {highlights.map((highlight: any, index: number) => (
                          <span
                            key={`highlight-${index}`}
                            className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                          >
                            {highlight}
                          </span>
                        ))}
                        {features.map((feature: any, index: number) => (
                          <span
                            key={`feature-${index}`}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      Customer Details
                    </h2>

                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="w-8 flex-shrink-0 text-gray-500">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="text-gray-800 font-medium">
                            {booking.name || user?.fullName || "Valued Customer"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-8 flex-shrink-0 text-gray-500">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="text-gray-800 font-medium">
                            {booking.phone || user?.phone || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-8 flex-shrink-0 text-gray-500">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="text-gray-800 font-medium">
                            {booking.email || user?.email || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-8 flex-shrink-0 text-gray-500">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="text-gray-800 font-medium">
                            {booking.address || "Hub Pickup / Primary Address"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                      Payment Details
                    </h2>

                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-600">Car Price</span>
                        <span className="font-semibold">
                          {formatPrice(car.price)}
                        </span>
                      </div>

                      {booking.downPayment && (
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-gray-600">Down Payment</span>
                          <span className="font-semibold">
                            {formatPrice(booking.downPayment)}
                          </span>
                        </div>
                      )}

                      {booking.pointsRedeemed ? (
                        <div className="flex justify-between items-center mb-3 text-green-700">
                          <span className="text-sm font-medium">Points Redeemed</span>
                          <span className="font-semibold">-{booking.pointsRedeemed} pts</span>
                        </div>
                      ) : null}

                      <div className="border-t border-gray-200 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-800 font-medium">
                            Total Amount
                          </span>
                          <span className="text-xl font-bold text-blue-900">
                            {formatPrice(booking.finalPrice || car.price)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                        <CreditCard className="w-5 h-5 mr-3 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Payment Method</p>
                          <p className="text-gray-800 font-medium">
                            {booking.paymentMethod || "Direct Payment"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                        <Landmark className="w-5 h-5 mr-3 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Financing</p>
                          <p className="text-gray-800 font-medium">
                            {booking.loanRequired === "yes" || booking.loanStatus === "Approved" ? "Loan Required" : "Self Funded"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 p-4 text-center text-gray-500 text-sm">
                <p>
                  Thank you for your purchase! For any queries, please contact our customer support.
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center text-gray-500 text-sm print:hidden">
        <p>© 2025 Premium Auto Sales. All rights reserved.</p>
      </div>
    </div>
  );
};

export default PurchasedCarsPage;
