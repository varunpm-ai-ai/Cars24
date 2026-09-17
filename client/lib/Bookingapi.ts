const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://cars24-iq0g.onrender.com/api";
const BASE_URL = `${API_BASE}/Booking`;

const LOCAL_BOOKINGS_KEY = "cars24_local_bookings";

const getLocalBookings = (userId: string): any[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(`${LOCAL_BOOKINGS_KEY}_${userId}`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveLocalBooking = (userId: string, bookingRecord: any) => {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalBookings(userId);
    const updated = [bookingRecord, ...existing];
    localStorage.setItem(`${LOCAL_BOOKINGS_KEY}_${userId}`, JSON.stringify(updated));
  } catch (err) {
    console.warn("Could not save booking to localStorage", err);
  }
};

export const createBooking = async (userid: string, booking: any) => {
  try {
    const response = await fetch(`${BASE_URL}?userId=${userid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(booking),
    });
    
    if (response.ok) {
      const data = await response.json().catch(() => ({}));
      const bookingResult = {
        id: data.id || data._id || `booking-${Date.now()}`,
        booking: data,
        car: null,
      };
      saveLocalBooking(userid, bookingResult);
      return data;
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.warn("Backend createBooking non-200 response:", errorData);
    }
  } catch (err) {
    console.warn("Backend createBooking fetch failed, saving locally:", err);
  }

  // Graceful fallback if backend fails or is offline
  const fallbackBooking = {
    id: `booking-${Date.now()}`,
    carId: booking.CarId,
    name: booking.name,
    phone: booking.phone,
    email: booking.email,
    address: booking.address,
    preferredDate: booking.preferredDate,
    preferredTime: booking.preferredTime,
    paymentMethod: booking.paymentMethod,
    loanRequired: booking.loanRequired,
    downPayment: booking.downPayment,
    pointsRedeemed: booking.pointsRedeemed || 0,
    finalPrice: booking.finalPrice || 0,
  };

  const bookingResult = {
    id: fallbackBooking.id,
    booking: fallbackBooking,
    car: null,
  };
  saveLocalBooking(userid, bookingResult);
  return fallbackBooking;
};

export const getBookingbyid = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn("getBookingbyid failed:", err);
  }
  return null;
};

export const getBookingbyuser = async (userId: string) => {
  const localList = getLocalBookings(userId);
  try {
    const response = await fetch(`${BASE_URL}/user/${userId}/bookings`);
    if (response.ok) {
      const remoteData = await response.json();
      if (Array.isArray(remoteData) && remoteData.length > 0) {
        // Merge remote and local without duplicate IDs
        const remoteIds = new Set(remoteData.map((b: any) => b.id || b.Booking?.id));
        const filteredLocal = localList.filter((l: any) => !remoteIds.has(l.id));
        return [...remoteData, ...filteredLocal];
      }
    }
  } catch (err) {
    console.warn("getBookingbyuser failed:", err);
  }
  return localList;
};

export const getBookingByUserId = getBookingbyuser;
