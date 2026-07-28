import { getAllCars, getCarById as getLocalCarById } from "./carsData";

const BASE_URL = "https://cars24-iq0g.onrender.com/api/Car";

type CarDetails = {
  title: string;
  images: string[];
  price: string;
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

export const createCar = async (carDetails: CarDetails) => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(carDetails),
    });
    return await response.json();
  } catch (err) {
    console.warn("API offline, fallback mode:", err);
    return { id: "local-created-car", ...carDetails };
  }
};

export const getcarByid = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.title) return data;
    }
  } catch (error) {
    console.warn("Failed to fetch car by ID from backend, using local dataset fallback:", error);
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

  // Final fallback to first car if id not found
  const firstCar = getAllCars()[0];
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
        return data;
      }
    }
  } catch (error) {
    console.warn("Failed to fetch car summaries from remote backend, using local 100-car dataset:", error);
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
