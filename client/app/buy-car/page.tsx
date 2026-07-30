"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { getcarSummaries } from "@/lib/Carapi";
import { useLocation } from "@/context/LocationContext";
import { useAuth } from "@/context/AuthContext";
import { InteractiveLocationMap } from "@/components/location/InteractiveLocationMap";
import {
  ChevronDown,
  Heart,
  Search,
  Sliders,
  MapPin,
  TrendingUp,
  Sparkles,
  Zap,
  Lock,
  Shield,
  Navigation,
  CheckCircle2,
  Globe,
} from "lucide-react";
import Link from "next/link";

const mockCarsList = [
  {
    id: "fronx-2023",
    title: "2023 Maruti FRONX DELTA PLUS 1.2L AGS",
    km: "10,048 km",
    fuel: "Petrol",
    transmission: "Auto",
    owner: "1st owner",
    emi: "₹15,245/m",
    price: "₹7.80 lakh",
    basePriceNumeric: 780000,
    bodyType: "SUV",
    location: "Metro Walk, Rohini, New Delhi",
    image: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
  },
  {
    id: "swift-2017",
    title: "2017 Maruti Swift VXI (O)",
    km: "60,056 km",
    fuel: "Petrol",
    transmission: "Manual",
    owner: "1st owner",
    emi: "₹7,214/m",
    price: "₹3.69 lakh",
    basePriceNumeric: 369000,
    bodyType: "Hatchback",
    location: "Metro Walk, Rohini, New Delhi",
    image: "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg",
  },
  {
    id: "creta-2021",
    title: "2021 Hyundai Creta SX IVT",
    km: "20,500 km",
    fuel: "Petrol",
    transmission: "Auto",
    owner: "1st owner",
    emi: "₹18,999/m",
    price: "₹11.20 lakh",
    basePriceNumeric: 1120000,
    bodyType: "SUV",
    location: "Sector 29, Gurugram",
    image: "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
  },
  {
    id: "baleno-2020",
    title: "2020 Maruti Baleno ZETA",
    km: "30,000 km",
    fuel: "Petrol",
    transmission: "Manual",
    owner: "2nd owner",
    emi: "₹10,600/m",
    price: "₹6.45 lakh",
    basePriceNumeric: 645000,
    bodyType: "Hatchback",
    location: "Karol Bagh, New Delhi",
    image: "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg",
  },
  {
    id: "city-2019",
    title: "2019 Honda City ZX CVT",
    km: "25,000 km",
    fuel: "Petrol",
    transmission: "Auto",
    owner: "1st owner",
    emi: "₹16,500/m",
    price: "₹9.95 lakh",
    basePriceNumeric: 995000,
    bodyType: "Sedan",
    location: "South Ex, New Delhi",
    image: "https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg",
  },
  {
    id: "venue-2022",
    title: "2022 Hyundai Venue SX Turbo",
    km: "12,000 km",
    fuel: "Petrol",
    transmission: "Auto",
    owner: "1st owner",
    emi: "₹14,875/m",
    price: "₹9.40 lakh",
    basePriceNumeric: 940000,
    bodyType: "SUV",
    location: "Noida Sector 63, Uttar Pradesh",
    image: "https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg",
  },
  {
    id: "kia-sonet-2023",
    title: "2023 Kia Sonet GTX+",
    km: "15,400 km",
    fuel: "Petrol",
    transmission: "Auto",
    owner: "1st owner",
    emi: "₹22,900/m",
    price: "₹13.80 lakh",
    basePriceNumeric: 1380000,
    bodyType: "SUV",
    location: "Andheri West, Mumbai",
    image: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
  },
  {
    id: "thar-2022",
    title: "2022 Mahindra Thar LX 4x4",
    km: "18,200 km",
    fuel: "Diesel",
    transmission: "Manual",
    owner: "1st owner",
    emi: "₹23,500/m",
    price: "₹14.50 lakh",
    basePriceNumeric: 1450000,
    bodyType: "SUV",
    location: "Mall Road Zone, Manali",
    image: "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
  },
  {
    id: "nexon-ev-2023",
    title: "2023 Tata Nexon EV Max Lux",
    km: "14,100 km",
    fuel: "Electric",
    transmission: "Auto",
    owner: "1st owner",
    emi: "₹24,100/m",
    price: "₹14.90 lakh",
    basePriceNumeric: 1490000,
    bodyType: "EV",
    location: "Whitefield, Bengaluru",
    image: "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg",
  },
];

interface CarCardItem {
  id: string;
  title: string;
  km: string;
  fuel: string;
  transmission: string;
  owner: string;
  emi: string;
  price: string;
  basePriceNumeric?: number;
  recommendedPriceNumeric?: number;
  bodyType?: string;
  location: string;
  image: string;
}

function LoaderCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse overflow-hidden">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}

export default function BuyCarPage() {
  const { user, openAuthModal } = useAuth();
  const {
    selectedPreset,
    openLocationDrawer,
    getPriceRecommendation,
    isGeoFenceActive,
    toggleGeoFence,
    isCarInGeoFence,
    detectUserLocation,
    isDetectingLocation,
  } = useLocation();

  const [priceRange, setPriceRange] = useState<number[]>([0, 1500000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cars, setCars] = useState<CarCardItem[] | null>(null);

  useEffect(() => {
    async function fetchCars() {
      try {
        const fetched = await getcarSummaries();
        if (fetched && fetched.length > 0) {
          setCars(fetched);
        } else {
          setCars(mockCarsList);
        }
      } catch {
        setCars(mockCarsList);
      }
    }
    fetchCars();
  }, []);

  // Filter cars based on Geo-fence, brand & search query
  const filteredCars = (cars || []).filter((car) => {
    const matchesGeoFence = isCarInGeoFence(car.location);

    const matchesSearch =
      !searchQuery ||
      car.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.location?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBrand =
      selectedBrands.length === 0 ||
      selectedBrands.some((brand) =>
        car.title.toLowerCase().includes(brand.toLowerCase())
      );

    return matchesGeoFence && matchesSearch && matchesBrand;
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-16 text-gray-900">
      {/* Top Dynamic Location Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 text-white py-6 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Geo-Fenced Search & Dynamic Pricing Engine</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black">
              Used Cars for Sale in {selectedPreset.cityName}
            </h1>
            <p className="text-xs text-blue-200 mt-1 max-w-2xl">
              {selectedPreset.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={detectUserLocation}
              disabled={isDetectingLocation}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-2xl text-xs font-black transition-all flex items-center space-x-1.5 shadow-sm active:scale-95 disabled:opacity-50"
            >
              <Navigation className={`w-3.5 h-3.5 ${isDetectingLocation ? "animate-spin" : ""}`} />
              <span>{isDetectingLocation ? "Detecting..." : "Detect GPS"}</span>
            </button>

            <button
              onClick={openLocationDrawer}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center space-x-2 shadow-xs"
            >
              <span>{selectedPreset.icon} City: {selectedPreset.cityName}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Geo-Fence Status Banner */}
        <div className="bg-white p-4 md:p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shrink-0 ${isGeoFenceActive ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-gray-100 text-gray-500"}`}>
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-black text-gray-900">
                  Geo-Fence Filter: {isGeoFenceActive ? "Active" : "Disabled (All India)"}
                </span>
                {isGeoFenceActive && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {selectedPreset.cityName}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {isGeoFenceActive
                  ? `Displaying verified listings strictly located in ${selectedPreset.cityName} and surrounding hub area.`
                  : "Showing listings across all cities in India. Enable geo-fence to restrict search."}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              type="button"
              onClick={() => toggleGeoFence()}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 ${
                isGeoFenceActive
                  ? "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              {isGeoFenceActive ? <Shield className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
              <span>{isGeoFenceActive ? "Showing City Only" : "Showing All Cities"}</span>
            </button>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-800">
                Filter Vehicles
              </h3>

              {/* Price Range Filter */}
              <div>
                <label className="text-xs font-bold text-gray-700 mb-2 block">
                  Price Budget (₹)
                </label>
                <Slider
                  defaultValue={[0, 1500000]}
                  max={1500000}
                  step={25000}
                  value={priceRange}
                  onValueChange={(val) =>
                    setPriceRange(Array.isArray(val) ? [...val] : [val, val])
                  }
                  className="mt-2"
                />
                <div className="flex justify-between mt-2 text-xs font-bold text-blue-700">
                  <span>₹{priceRange[0].toLocaleString("en-IN")}</span>
                  <span>₹{priceRange[1].toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Brand Filter */}
              <div className="border-t border-gray-100 pt-4">
                <label className="text-xs font-bold text-gray-700 mb-2.5 block">
                  Popular Brands
                </label>
                <div className="space-y-2">
                  {["Maruti", "Hyundai", "Honda", "Tata", "Toyota", "Kia", "Mahindra"].map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center text-xs font-semibold text-gray-700 cursor-pointer hover:text-blue-600"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2.5 w-4 h-4"
                        checked={selectedBrands.includes(brand)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBrands([...selectedBrands, brand]);
                          } else {
                            setSelectedBrands(
                              selectedBrands.filter((b) => b !== brand)
                            );
                          }
                        }}
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cars Grid */}
          <div className="md:col-span-3 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-gray-900">
                  Available Cars ({filteredCars.length})
                </h2>
                {isGeoFenceActive && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    Restricted to {selectedPreset.cityName} geo-fence
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <div className="relative flex-1 sm:w-64">
                  <Input
                    type="text"
                    placeholder="Search model or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-white text-xs rounded-xl border-gray-200"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Cars Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars === null ? (
                Array.from({ length: 6 }).map((_, idx) => <LoaderCard key={idx} />)
              ) : filteredCars.length === 0 ? (
                <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-gray-900">
                      No cars match your search filter in {selectedPreset.cityName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Try expanding your geo-fence to all cities or change your selected city.
                    </p>
                  </div>
                  <button
                    onClick={() => toggleGeoFence(false)}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all inline-flex items-center space-x-2"
                  >
                    <Globe className="w-4 h-4" />
                    <span>View Cars Across All Cities</span>
                  </button>
                </div>
              ) : (
                filteredCars.map((car) => {
                  return (
                    <CarCard
                      key={car.id}
                      car={car}
                      user={user}
                      openAuthModal={openAuthModal}
                      selectedPreset={selectedPreset}
                      getPriceRecommendation={getPriceRecommendation}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Interactive Google Map Section for Cars24 Hubs */}
        <InteractiveLocationMap />
      </div>
    </div>
  );
}

// Individual Car Card Component with Live Dynamic Price Badge
function CarCard({
  car,
  user,
  openAuthModal,
  selectedPreset,
  getPriceRecommendation,
}: {
  car: CarCardItem;
  user: any;
  openAuthModal: (mode: "login" | "signup") => void;
  selectedPreset: any;
  getPriceRecommendation: any;
}) {
  const [recPrice, setRecPrice] = useState<number | null>(null);

  useEffect(() => {
    let numeric = car.basePriceNumeric;
    if (!numeric) {
      const cleaned = (car.price || "").replace(/[^0-9.]/g, "");
      numeric = parseFloat(cleaned) || 500000;
      if (car.price && car.price.toLowerCase().includes("lakh")) {
        numeric = numeric * 100000;
      }
    }

    getPriceRecommendation(numeric, car.bodyType || "SUV", car.fuel || "Petrol").then(
      (res: any) => {
        if (res?.recommendedPrice) setRecPrice(res.recommendedPrice);
      }
    );
  }, [car, selectedPreset, getPriceRecommendation]);

  return (
    <Link
      href={`/buy-car/${car.id}`}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group"
    >
      <div>
        <div className="relative h-48 bg-gray-900 overflow-hidden">
          <img
            src={car.image || "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg"}
            alt={car.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (!user) openAuthModal("login");
            }}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white text-gray-600 hover:text-red-500 transition-colors shadow-sm"
          >
            <Heart className="h-4 w-4" />
          </button>

          <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1">
            <MapPin className="w-3 h-3 text-blue-400" />
            <span className="max-w-[150px] truncate">{car.location || selectedPreset.cityName}</span>
          </div>
        </div>

        <div className="p-5 space-y-3">
          <h3 className="font-bold text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
            {car.title}
          </h3>

          <div className="flex items-center justify-between text-xs text-gray-500 font-medium border-y border-gray-100 py-2">
            <span>{car.km}</span>
            <span>•</span>
            <span>{car.transmission}</span>
            <span>•</span>
            <span>{car.fuel}</span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold">Base Price</p>
              <p className="text-lg font-black text-gray-900">{car.price}</p>
            </div>
            {recPrice && (
              <div className="text-right">
                <p className="text-[10px] text-blue-600 font-extrabold uppercase flex items-center justify-end gap-1">
                  <Sparkles className="w-3 h-3" /> Recommended
                </p>
                <p className="text-sm font-black text-blue-700">
                  ₹ {recPrice.toLocaleString("en-IN")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs font-bold text-blue-600 group-hover:text-blue-700 flex items-center justify-between">
        <span>View Vehicle Details & Reserve</span>
        <span>→</span>
      </div>
    </Link>
  );
}
