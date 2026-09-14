"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "@/context/LocationContext";
import { CarsHub, HubType } from "@/lib/hubsData";
import { fetchGoogleMapsApiKey } from "@/lib/ConfigApi";
import {
  MapPin,
  Navigation,
  Phone,
  Clock,
  Star,
  Building,
  Wrench,
  Package,
  Layers,
  Compass,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export const InteractiveLocationMap: React.FC = () => {
  const { selectedPreset, nearbyHubs, detectUserLocation, isDetectingLocation } = useLocation();
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const [selectedHub, setSelectedHub] = useState<CarsHub | null>(nearbyHubs[0] || null);
  const [filterType, setFilterType] = useState<HubType | "All">("All");
  const [apiKey, setApiKey] = useState<string>("");
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [mapError, setMapError] = useState<boolean>(false);

  // Fetch API key securely from configuration / environment placeholder
  useEffect(() => {
    async function loadKey() {
      const key = await fetchGoogleMapsApiKey();
      if (key) setApiKey(key);
    }
    loadKey();
  }, []);

  // Sync selected hub when preset changes
  useEffect(() => {
    if (nearbyHubs.length > 0) {
      setSelectedHub(nearbyHubs[0]);
    }
  }, [selectedPreset, nearbyHubs]);

  // Load Google Maps JS API script dynamically
  useEffect(() => {
    if (!apiKey || !mapRef.current) return;

    if ((window as any).google && (window as any).google.maps) {
      initMap();
      return;
    }

    const scriptId = "google-maps-js-sdk";
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setMapLoaded(true);
        initMap();
      };
      script.onerror = () => {
        console.warn("Failed to load Google Maps SDK script.");
        setMapError(true);
      };
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, [apiKey, selectedPreset]);

  // Initialize Map
  const initMap = () => {
    if (!mapRef.current || !(window as any).google?.maps) return;

    const centerLat = selectedPreset.lat || 19.0760;
    const centerLng = selectedPreset.lng || 72.8777;

    const mapOptions = {
      center: { lat: centerLat, lng: centerLng },
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "simplified" }],
        },
      ],
    };

    try {
      const google = (window as any).google;
      const map = new google.maps.Map(mapRef.current, mapOptions);
      googleMapInstance.current = map;
      setMapLoaded(true);
      renderMarkers(map);
    } catch (e) {
      console.warn("Error rendering Google Map instance", e);
      setMapError(true);
    }
  };

  // Render Markers on Map
  const renderMarkers = (map: any) => {
    if (!map || !(window as any).google?.maps) return;
    const google = (window as any).google;

    // Clear old markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const filtered = filterType === "All" ? nearbyHubs : nearbyHubs.filter((h) => h.type === filterType);

    const bounds = new google.maps.LatLngBounds();

    filtered.forEach((hub) => {
      const position = { lat: hub.lat, lng: hub.lng };
      bounds.extend(position);

      const markerColor =
        hub.type === "Mega Hub" ? "#2563eb" : hub.type === "Service Center" ? "#059669" : "#d97706";

      const marker = new google.maps.Marker({
        position,
        map,
        title: hub.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: markerColor,
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#ffffff",
        },
      });

      const infoContent = `
        <div style="padding: 8px; max-width: 220px; font-family: system-ui, sans-serif;">
          <span style="background:${markerColor}; color:#fff; font-size:10px; font-weight:bold; padding:2px 6px; border-radius:4px; text-transform:uppercase;">
            ${hub.type}
          </span>
          <h4 style="margin: 6px 0 2px 0; font-size: 13px; font-weight: bold; color: #0f172a;">${hub.name}</h4>
          <p style="margin:0; font-size: 11px; color: #475569;">${hub.address}</p>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${hub.lat},${hub.lng}" target="_blank" style="display:inline-block; margin-top:8px; font-size:11px; color:#2563eb; font-weight:bold; text-decoration:none;">
            📍 Get Directions &rarr;
          </a>
        </div>
      `;

      const infoWindow = new google.maps.InfoWindow({
        content: infoContent,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
        setSelectedHub(hub);
      });

      markersRef.current.push(marker);
    });

    if (filtered.length > 0 && map) {
      map.fitBounds(bounds);
      if (filtered.length === 1) map.setZoom(14);
    }
  };

  // Re-filter markers when filterType changes
  useEffect(() => {
    if (googleMapInstance.current) {
      renderMarkers(googleMapInstance.current);
    }
  }, [filterType]);

  const filteredHubs = filterType === "All" ? nearbyHubs : nearbyHubs.filter((h) => h.type === filterType);

  const centerLat = selectedPreset.lat || 19.0760;
  const centerLng = selectedPreset.lng || 72.8777;
  const iframeSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    (selectedHub?.address || selectedPreset.cityName) + " India"
  )}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden my-8">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Interactive Geo-fence Map</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Nearby Cars24 Hubs & Service Centers
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl">
              Showing verified Cars24 Mega Refurbishment Labs, Inspection Hubs, and Express Pickup Stations in{" "}
              <strong className="text-white font-bold">{selectedPreset.cityName}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={detectUserLocation}
              disabled={isDetectingLocation}
              className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50"
            >
              <Navigation className={`w-4 h-4 ${isDetectingLocation ? "animate-spin" : ""}`} />
              <span>{isDetectingLocation ? "Detecting GPS..." : "Detect My Location"}</span>
            </button>
          </div>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex items-center space-x-2 mt-6 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setFilterType("All")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
              filterType === "All"
                ? "bg-white text-blue-950 shadow-md"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Locations ({nearbyHubs.length})</span>
          </button>

          <button
            onClick={() => setFilterType("Mega Hub")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
              filterType === "Mega Hub"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <Building className="w-3.5 h-3.5 text-blue-300" />
            <span>Mega Refurbishment Hubs</span>
          </button>

          <button
            onClick={() => setFilterType("Service Center")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
              filterType === "Service Center"
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-emerald-300" />
            <span>Service Centers</span>
          </button>

          <button
            onClick={() => setFilterType("Pickup Point")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
              filterType === "Pickup Point"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <Package className="w-3.5 h-3.5 text-amber-300" />
            <span>Express Pickup Stations</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Map + Sidebar List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[480px]">
        {/* Left Side: Sidebar List of Hubs */}
        <div className="lg:col-span-5 p-5 border-r border-gray-100 bg-slate-50/50 flex flex-col max-h-[520px] overflow-y-auto space-y-3">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-xs font-black text-gray-500 uppercase tracking-wider">
              {filteredHubs.length} Location{filteredHubs.length !== 1 ? "s" : ""} Available
            </span>
            <span className="text-[11px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              Geo-Fence Active
            </span>
          </div>

          {filteredHubs.map((hub) => {
            const isSelected = selectedHub?.id === hub.id;
            const badgeBg =
              hub.type === "Mega Hub"
                ? "bg-blue-100 text-blue-800 border-blue-200"
                : hub.type === "Service Center"
                ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                : "bg-amber-100 text-amber-800 border-amber-200";

            return (
              <div
                key={hub.id}
                onClick={() => {
                  setSelectedHub(hub);
                  if (googleMapInstance.current) {
                    googleMapInstance.current.panTo({ lat: hub.lat, lng: hub.lng });
                    googleMapInstance.current.setZoom(14);
                  }
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white border-blue-600 shadow-md ring-2 ring-blue-500/20"
                    : "bg-white border-gray-200/80 hover:border-blue-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide border rounded-full ${badgeBg}`}>
                      {hub.type}
                    </span>
                    <h3 className="text-sm font-black text-gray-900 mt-1.5 leading-snug">
                      {hub.name}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-1 text-amber-500 text-xs font-black bg-amber-50 px-2 py-1 rounded-lg shrink-0">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{hub.rating}</span>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-gray-600">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2 leading-relaxed">{hub.address}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-gray-500 font-medium">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span>{hub.hours}</span>
                    </div>

                    <div className="flex items-center space-x-1 text-blue-600 font-bold">
                      <Phone className="w-3 h-3" />
                      <span>{hub.phone}</span>
                    </div>
                  </div>
                </div>

                {hub.totalCarsAvailable && (
                  <div className="mt-3 bg-blue-50/70 rounded-xl p-2 flex items-center justify-between text-xs font-bold text-blue-900">
                    <span className="flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Ready for Test Drive</span>
                    </span>
                    <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                      {hub.totalCarsAvailable}+ Cars
                    </span>
                  </div>
                )}

                <div className="mt-3 flex items-center gap-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${hub.lat},${hub.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-600 text-xs font-bold rounded-xl transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Get Directions</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Google Map Container */}
        <div className="lg:col-span-7 relative min-h-[380px] lg:min-h-full bg-slate-100">
          {/* Map canvas container */}
          <div ref={mapRef} className="w-full h-full min-h-[400px]" />

          {/* Fallback to Embed Map iframe if SDK script is unavailable */}
          {(!mapLoaded || mapError) && (
            <div className="absolute inset-0 w-full h-full">
              <iframe
                title="Cars24 Location Map"
                src={iframeSrc}
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          )}

          {/* Floating Selected Hub Card Overlay */}
          {selectedHub && (
            <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-xs bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-200/80 z-10 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between text-xs font-extrabold text-blue-600 uppercase tracking-wide">
                <span>Selected Destination</span>
                <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px]">
                  {selectedHub.type}
                </span>
              </div>

              <h4 className="text-sm font-black text-gray-900 mt-1">{selectedHub.name}</h4>
              <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{selectedHub.address}</p>

              <div className="mt-3 flex items-center gap-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedHub.lat},${selectedHub.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl text-center shadow-md flex items-center justify-center space-x-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigate with Google Maps</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
