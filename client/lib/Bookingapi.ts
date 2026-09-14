const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://cars24-iq0g.onrender.com/api";
const BASE_URL = `${API_BASE}/Booking`;

export const createBooking = async (userid: string, booking: any) => {
  const response = await fetch(`${BASE_URL}?userId=${userid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(booking),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to create booking.");
  }
  return data;
};

export const getBookingbyid = async (id: string) => {
  const response = await fetch(`${BASE_URL}/${id}`);
  return response.json();
};

export const getBookingbyuser = async (userId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/user/${userId}/bookings`);
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
};

export const getBookingByUserId = getBookingbyuser;
