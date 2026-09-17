const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://cars24-iq0g.onrender.com/api";
const BASE_URL = `${API_BASE}/Appointment`;

export const createAppointment = async (userid: string, appointment: any) => {
  try {
    const response = await fetch(`${BASE_URL}?userId=${userid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointment),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn("createAppointment fetch failed:", err);
  }

  return {
    id: `appointment-${Date.now()}`,
    ...appointment,
    status: "upcoming",
  };
};

export const getAppointmentbyid = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn("getAppointmentbyid failed:", err);
  }
  return null;
};

export const getappointmentbyuser = async (userId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/user/${userId}/appointments`);
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
};

export const getAppointmentByUserId = getappointmentbyuser;