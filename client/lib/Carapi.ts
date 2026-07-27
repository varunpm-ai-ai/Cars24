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

export const createCar = async (carDetails: Partial<CarDetails>) => {
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(carDetails),
  });
  return response.json();
};

export const getcarByid = async (id: string) => {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) return null;
  return response.json();
};

export const getcarSummaries = async () => {
  const response = await fetch(`${BASE_URL}/summaries`);
  if (!response.ok) return [];
  return response.json();
};

export const getUserCars = async (userId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/user/${userId}`);
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
};

export const deleteCar = async (carId: string) => {
  const response = await fetch(`${BASE_URL}/${carId}`, {
    method: "DELETE",
  });
  return response.json();
};
