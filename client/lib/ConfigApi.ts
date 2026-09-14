const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function fetchGoogleMapsApiKey(): Promise<string> {
  const envKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (envKey) return envKey;

  try {
    const res = await fetch(`${API_BASE}/config/maps-key`);
    if (res.ok) {
      const data = await res.json();
      if (data.apiKey) return data.apiKey;
    }
  } catch (e) {
    console.warn("Could not fetch Maps API key from backend config endpoint", e);
  }
  return "";
}
