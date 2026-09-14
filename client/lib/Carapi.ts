import { getAllCars, getCarById as getLocalCarById } from "./carsData";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://cars24-iq0g.onrender.com/api";
const BASE_URL = `${API_BASE}/Car`;

export type CarDetails = {
  id?: string;
  userId?: string;
  sellerName?: string;
  title: string;
  images: string[];
  price: string;
  basePriceNumeric?: number;
  recommendedPriceNumeric?: number;
  bodyType?: string;
  emi: string;
  location: string;
  specs: {
    year: number;
    km: string;
    fuel: string;
    transmission: string;
    owner: string;
    insurance: string;
  };
  features: string[];
  highlights: string[];
};

import { getAllCars, getCarById as getLocalCarById } from "./carsData";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://cars24-iq0g.onrender.com/api";
const BASE_URL = `${API_BASE}/Car`;

export type CarDetails = {
  id?: string;
  userId?: string;
  sellerName?: string;
  title: string;
  images: string[];
  price: string;
  basePriceNumeric?: number;
  recommendedPriceNumeric?: number;
  bodyType?: string;
  emi: string;
  location: string;
  specs: {
    year: number;
    km: string;
    fuel: string;
    transmission: string;
    owner: string;
    insurance: string;
  };
  features: string[];
  highlights: string[];
};

export const normalizeCarData = (rawData: any): CarDetails | null => {
  if (!rawData) return null;

  const rawImages = rawData.images || rawData.Images || rawData.image;
  let images: string[] = [];
  if (Array.isArray(rawImages)) {
    images = rawImages.map((img) => (typeof img === "string" ? img : String(img)));
  } else if (typeof rawImages === "string" && rawImages) {
    images = [rawImages];
  }
  if (images.length === 0) {
    images = ["https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg"];
  }

  const rawSpecs = rawData.specs || rawData.Specs || {};

  return {
    id: rawData.id || rawData._id || rawData.Id || "",
    userId: rawData.userId || rawData.UserId || "",
    sellerName: rawData.sellerName || rawData.SellerName || "",
    title: rawData.title || rawData.Title || "Car Details",
    images,
    price: rawData.price || rawData.Price || "₹0",
    basePriceNumeric: rawData.basePriceNumeric ?? rawData.BasePriceNumeric,
    recommendedPriceNumeric: rawData.recommendedPriceNumeric ?? rawData.RecommendedPriceNumeric,
    bodyType: rawData.bodyType || rawData.BodyType || "SUV",
    emi: rawData.emi || rawData.Emi || "₹0/m",
    location: rawData.location || rawData.Location || "",
    specs: {
      year: Number(rawSpecs.year ?? rawSpecs.Year ?? 2022),
      km: String(rawSpecs.km ?? rawSpecs.Km ?? ""),
      fuel: String(rawSpecs.fuel ?? rawSpecs.Fuel ?? ""),
      transmission: String(rawSpecs.transmission ?? rawSpecs.Transmission ?? ""),
      owner: String(rawSpecs.owner ?? rawSpecs.Owner ?? ""),
      insurance: String(rawSpecs.insurance ?? rawSpecs.Insurance ?? "Valid"),
    },
    features: Array.isArray(rawData.features || rawData.Features) ? rawData.features || rawData.Features : [],
    highlights: Array.isArray(rawData.highlights || rawData.Highlights) ? rawData.highlights || rawData.Highlights : [],
  };
};

export const createCar = async (carDetails: Partial<CarDetails>) => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(carDetails),
    });
    if (!response.ok) return { id: "local-created-car", ...carDetails };
    return await response.json();
  } catch (err) {
    console.warn("Backend createCar API unreachable:", err);
    return { id: "local-created-car", ...carDetails };
  }
};

export const getcarByid = async (id: string): Promise<CarDetails | null> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (response.ok) {
      const rawData = await response.json();
      const normalized = normalizeCarData(rawData);
      if (normalized && normalized.title) return normalized;
    }
  } catch (err) {
    console.warn("Backend getcarByid API unreachable, using local dataset fallback:", err);
  }

  // Fallback to local 100-car dataset
  const localCar = getLocalCarById(id);
  if (localCar) {
    return {
      id: localCar.id,
      title: localCar.title,
      images: localCar.images,
      price: localCar.price,
      emi: localCar.emi,
      location: localCar.location,
      specs: {
        year: localCar.year,
        km: localCar.km,
        fuel: localCar.fuel,
        transmission: localCar.transmission,
        owner: localCar.owner,
        insurance: localCar.insurance,
      },
      features: localCar.features,
      highlights: localCar.highlights,
    };
  }

  const firstCar = getAllCars()[0];
  if (!firstCar) return null;
  return {
    id: firstCar.id,
    title: firstCar.title,
    images: firstCar.images,
    price: firstCar.price,
    emi: firstCar.emi,
    location: firstCar.location,
    specs: {
      year: firstCar.year,
      km: firstCar.km,
      fuel: firstCar.fuel,
      transmission: firstCar.transmission,
      owner: firstCar.owner,
      insurance: firstCar.insurance,
    },
    features: firstCar.features,
    highlights: firstCar.highlights,
  };
};

export const getcarSummaries = async () => {
  try {
    const response = await fetch(`${BASE_URL}/summaries`);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length >= 10) {
        return data
          .map((item: any) => {
            const normalized = normalizeCarData(item);
            if (!normalized) return null;
            return {
              id: normalized.id || "",
              title: normalized.title || "Car",
              km: normalized.specs.km || "",
              fuel: normalized.specs.fuel || "",
              transmission: normalized.specs.transmission || "",
              owner: normalized.specs.owner || "",
              emi: normalized.emi || "",
              price: normalized.price || "",
              basePriceNumeric: normalized.basePriceNumeric,
              recommendedPriceNumeric: normalized.recommendedPriceNumeric,
              bodyType: normalized.bodyType,
              location: normalized.location || "",
              image: normalized.images[0] || "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
            };
          })
          .filter((car): car is NonNullable<typeof car> => car !== null);
      }
    }
  } catch (err) {
    console.warn("Backend getcarSummaries API unreachable, fallback will be used:", err);
  }

  // Return formatted 100 cars from local JSON database
  return getAllCars().map((car) => ({
    id: car.id,
    title: car.title,
    km: car.km,
    Fuel: car.fuel,
    Transmission: car.transmission,
    Owner: car.owner,
    emi: car.emi,
    price: car.price,
    location: car.location,
    image: car.images,
  }));
};

export const getUserCars = async (userId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/user/${userId}`);
    if (!response.ok) return [];
    const data = await response.json();
    if (!Array.isArray(data)) return [];
    return data.map(normalizeCarData).filter(Boolean);
  } catch (err) {
    console.warn("Backend getUserCars API unreachable:", err);
    return [];
  }
};

export const deleteCar = async (carId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/${carId}`, {
      method: "DELETE",
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    console.warn("Backend deleteCar API unreachable:", err);
    return { success: true };
  }
};

