import rawCarsData from "@/data/cars.json";

export interface CarItem {
  id: string;
  title: string;
  brand: string;
  model: string;
  variant: string;
  year: number;
  price: string;
  priceNumeric: number; // in Rupees (e.g. 1040000)
  priceLakhs: number;   // e.g. 10.4
  emi: string;
  location: string;
  km: string;
  kmNumeric: number;
  fuel: string;
  transmission: string;
  owner: string;
  insurance: string;
  images: string[];
  image: string;
  features: string[];
  highlights: string[];
  popularityScore: number;
}

// Helper to parse price string like "₹10.40 lakh" or "₹7.60 lakh" or "₹75,000" into numeric Rupees
export function parsePriceToNumeric(priceStr: string): number {
  if (!priceStr) return 0;
  const cleanStr = priceStr.replace(/[₹,]/g, "").trim().toLowerCase();
  
  if (cleanStr.includes("lakh")) {
    const numPart = parseFloat(cleanStr.replace("lakh", "").trim());
    return isNaN(numPart) ? 0 : Math.round(numPart * 100000);
  }
  if (cleanStr.includes("cr") || cleanStr.includes("crore")) {
    const numPart = parseFloat(cleanStr.replace(/cr(ore)?/, "").trim());
    return isNaN(numPart) ? 0 : Math.round(numPart * 10000000);
  }
  const directNum = parseFloat(cleanStr);
  return isNaN(directNum) ? 0 : directNum;
}

// Helper to parse Km string like "18,400" into number 18400
export function parseKmToNumeric(kmStr: string): number {
  if (!kmStr) return 0;
  const cleanStr = kmStr.replace(/[^0-9]/g, "");
  const val = parseInt(cleanStr, 10);
  return isNaN(val) ? 0 : val;
}

// Extract Brand, Model, Variant from Title like "2022 Hyundai Venue SX"
export function parseTitleComponents(title: string) {
  const parts = title.trim().split(/\s+/);
  let year = 2020;
  let startIndex = 0;
  
  if (parts.length > 0 && /^\d{4}$/.test(parts[0])) {
    year = parseInt(parts[0], 10);
    startIndex = 1;
  }

  const remaining = parts.slice(startIndex);
  const brand = remaining[0] || "Maruti";
  const model = remaining[1] || "";
  const variant = remaining.slice(2).join(" ");

  return { year, brand, model, variant };
}

// Transform raw JSON cars to normalized CarItem array
const carsList: CarItem[] = (rawCarsData as any[]).map((raw, idx) => {
  const id = raw._id?.$oid || raw._id?.toString() || raw.id || `car-${idx + 1}`;
  const title = raw.Title || raw.title || "Used Car";
  const { year: titleYear, brand, model, variant } = parseTitleComponents(title);
  
  const specs = raw.Specs || {};
  const year = typeof specs.Year === "number" ? specs.Year : titleYear;
  const km = specs.Km || "20,000";
  const kmNumeric = parseKmToNumeric(km);
  const fuel = specs.Fuel || "Petrol";
  const transmission = specs.Transmission || "Manual";
  const owner = specs.Owner || "1st Owner";
  const insurance = specs.Insurance || "Valid";

  const priceStr = raw.Price || raw.price || "₹5.00 lakh";
  const priceNumeric = parsePriceToNumeric(priceStr);
  const priceLakhs = Number((priceNumeric / 100000).toFixed(2));

  const emi = raw.Emi || raw.emi || `₹${Math.round(priceNumeric * 0.015).toLocaleString("en-IN")}/m`;
  const location = raw.Location || raw.location || "Delhi";

  const images = Array.isArray(raw.Images) && raw.Images.length > 0 
    ? raw.Images 
    : ["https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg"];
  const image = images[0];

  const features = Array.isArray(raw.Features) ? raw.Features : [];
  const highlights = Array.isArray(raw.Highlights) ? raw.Highlights : [];

  // Calculate popularity score based on key attributes
  let popularityScore = 50;
  if (owner.includes("1st")) popularityScore += 15;
  if (kmNumeric < 30000) popularityScore += 15;
  if (year >= 2021) popularityScore += 10;
  if (["Hyundai", "Maruti", "Tata", "Toyota", "Kia"].includes(brand)) popularityScore += 10;

  return {
    id,
    title,
    brand,
    model,
    variant,
    year,
    price: priceStr,
    priceNumeric,
    priceLakhs,
    emi,
    location,
    km,
    kmNumeric,
    fuel,
    transmission,
    owner,
    insurance,
    images,
    image,
    features,
    highlights,
    popularityScore,
  };
});

export function getAllCars(): CarItem[] {
  return carsList;
}

export function getCarById(id: string): CarItem | undefined {
  return carsList.find((c) => c.id === id);
}

export function getUniqueBrands(): string[] {
  const brands = new Set(carsList.map((c) => c.brand));
  return Array.from(brands).sort();
}

export function getUniqueFuels(): string[] {
  const fuels = new Set(carsList.map((c) => c.fuel));
  return Array.from(fuels).sort();
}

export function getUniqueTransmissions(): string[] {
  const trans = new Set(carsList.map((c) => c.transmission));
  return Array.from(trans).sort();
}

export function getUniqueLocations(): string[] {
  const locs = new Set(carsList.map((c) => c.location));
  return Array.from(locs).sort();
}

export function getUniqueOwners(): string[] {
  const owners = new Set(carsList.map((c) => c.owner));
  return Array.from(owners).sort();
}
