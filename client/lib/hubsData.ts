export type HubType = "Mega Hub" | "Service Center" | "Pickup Point";

export interface CarsHub {
  id: string;
  name: string;
  cityId: string;
  cityName: string;
  type: HubType;
  lat: number;
  lng: number;
  address: string;
  phone: string;
  hours: string;
  rating: number;
  totalCarsAvailable?: number;
}

export interface CityLocation {
  id: string;
  cityName: string;
  stateName: string;
  lat: number;
  lng: number;
  searchKeywords: string[];
  region: "MonsoonMetro" | "Hilly" | "MetroFuelSpike" | "Suburban" | "Coastal" | "Standard";
  icon: string;
  description: string;
}

export const CITIES: CityLocation[] = [
  {
    id: "mumbai",
    cityName: "Mumbai",
    stateName: "Maharashtra",
    lat: 19.0760,
    lng: 72.8777,
    searchKeywords: ["mumbai", "kurla", "andheri", "lower parel", "thane", "navi mumbai", "kerala"],
    region: "MonsoonMetro",
    icon: "🌧️",
    description: "High demand for SUVs & High Ground Clearance cars due to monsoon waterlogging.",
  },
  {
    id: "delhi",
    cityName: "Delhi NCR",
    stateName: "Delhi / Haryana / UP",
    lat: 28.6139,
    lng: 77.2090,
    searchKeywords: ["delhi", "new delhi", "rohini", "gurugram", "noida", "karol bagh", "south ex", "gurgaon"],
    region: "MetroFuelSpike",
    icon: "⚡",
    description: "Surge in EVs, CNG & compact hatchbacks. High commuting demand.",
  },
  {
    id: "bengaluru",
    cityName: "Bengaluru",
    stateName: "Karnataka",
    lat: 12.9716,
    lng: 77.5946,
    searchKeywords: ["bengaluru", "bangalore", "whitefield", "koramangala", "hebbal", "indiranagar"],
    region: "MetroFuelSpike",
    icon: "🚗",
    description: "High demand for Automatic Hatchbacks and Electric Vehicles.",
  },
  {
    id: "hyderabad",
    cityName: "Hyderabad",
    stateName: "Telangana",
    lat: 17.3850,
    lng: 78.4867,
    searchKeywords: ["hyderabad", "gachibowli", "hitec city", "jubilee hills", "secunderabad"],
    region: "MetroFuelSpike",
    icon: "🏙️",
    description: "High demand for tech commuter sedans and premium SUVs.",
  },
  {
    id: "pune",
    cityName: "Pune",
    stateName: "Maharashtra",
    lat: 18.5204,
    lng: 73.8567,
    searchKeywords: ["pune", "baner", "viman nagar", "hinjewadi", "kothrud"],
    region: "Suburban",
    icon: "🚘",
    description: "Popular for compact SUVs and mileage-efficient hatchbacks.",
  },
  {
    id: "chennai",
    cityName: "Chennai",
    stateName: "Tamil Nadu",
    lat: 13.0827,
    lng: 80.2707,
    searchKeywords: ["chennai", "guindy", "anna nagar", "velachery", "t nagar"],
    region: "Coastal",
    icon: "🌊",
    description: "Strong market for durable sedans and automatic hatchbacks.",
  },
  {
    id: "manali",
    cityName: "Manali",
    stateName: "Himachal Pradesh",
    lat: 32.2432,
    lng: 77.1892,
    searchKeywords: ["manali", "himachal", "uk", "shimla", "hilly"],
    region: "Hilly",
    icon: "⛰️",
    description: "High demand for 4x4 / AWD SUVs and Off-roaders for steep grade climbing.",
  },
  {
    id: "goa",
    cityName: "Goa",
    stateName: "Goa Coastal Zone",
    lat: 15.2993,
    lng: 74.1240,
    searchKeywords: ["goa", "panaji", "miramar", "coastal"],
    region: "Coastal",
    icon: "🏖️",
    description: "Steady demand for compact cruisers, convertibles, and EVs.",
  },
  {
    id: "standard",
    cityName: "National (All Cities)",
    stateName: "All India Coverage",
    lat: 20.5937,
    lng: 78.9629,
    searchKeywords: ["all", "national", "india", "standard"],
    region: "Standard",
    icon: "🇮🇳",
    description: "Shows all listings across India without geographical restrictions.",
  },
];

export const CARS_HUBS: CarsHub[] = [
  // Mumbai
  {
    id: "mumbai-hub-1",
    name: "Cars24 Mega Refurbishment Lab & Hub",
    cityId: "mumbai",
    cityName: "Mumbai",
    type: "Mega Hub",
    lat: 19.0833,
    lng: 72.8833,
    address: "Phoenix Marketcity Annexe, LBS Marg, Kurla West, Mumbai 400070",
    phone: "+91 1800-258-5656",
    hours: "9:00 AM - 9:00 PM",
    rating: 4.8,
    totalCarsAvailable: 142,
  },
  {
    id: "mumbai-service-1",
    name: "Cars24 Technical Service & Inspection Center",
    cityId: "mumbai",
    cityName: "Mumbai",
    type: "Service Center",
    lat: 19.1197,
    lng: 72.8464,
    address: "MIDC Industrial Area, Opp. SEEPZ Gate 1, Andheri East, Mumbai 400069",
    phone: "+91 1800-258-5657",
    hours: "8:30 AM - 7:30 PM",
    rating: 4.7,
  },
  {
    id: "mumbai-pickup-1",
    name: "Cars24 Express Pickup & Inspection Station",
    cityId: "mumbai",
    cityName: "Mumbai",
    type: "Pickup Point",
    lat: 18.9986,
    lng: 72.8258,
    address: "Lower Parel Innovation Park, Senapati Bapat Marg, Lower Parel, Mumbai",
    phone: "+91 1800-258-5658",
    hours: "10:00 AM - 8:00 PM",
    rating: 4.9,
  },

  // Delhi NCR
  {
    id: "delhi-hub-1",
    name: "Cars24 Mega Hub Rohini",
    cityId: "delhi",
    cityName: "Delhi NCR",
    type: "Mega Hub",
    lat: 28.7041,
    lng: 77.1025,
    address: "Metro Walk Complex, Sector 10, Rohini, New Delhi 110085",
    phone: "+91 1800-258-5600",
    hours: "9:00 AM - 9:00 PM",
    rating: 4.9,
    totalCarsAvailable: 185,
  },
  {
    id: "delhi-service-1",
    name: "Cars24 Technical Service Hub Gurugram",
    cityId: "delhi",
    cityName: "Delhi NCR",
    type: "Service Center",
    lat: 28.4595,
    lng: 77.0266,
    address: "HUDA City Centre Metro Complex, Sector 29, Gurugram 122002",
    phone: "+91 1800-258-5601",
    hours: "8:30 AM - 8:00 PM",
    rating: 4.8,
  },
  {
    id: "delhi-pickup-1",
    name: "Cars24 Express Pickup Hub Noida",
    cityId: "delhi",
    cityName: "Delhi NCR",
    type: "Pickup Point",
    lat: 28.6280,
    lng: 77.3769,
    address: "Block C, Electronic City Metro Zone, Sector 63, Noida 201301",
    phone: "+91 1800-258-5602",
    hours: "9:30 AM - 8:30 PM",
    rating: 4.6,
  },

  // Bengaluru
  {
    id: "blr-hub-1",
    name: "Cars24 Mega Hub Whitefield",
    cityId: "bengaluru",
    cityName: "Bengaluru",
    type: "Mega Hub",
    lat: 12.9698,
    lng: 77.7500,
    address: "Hoodi Main Road, Near ITPL Main Gate, Whitefield, Bengaluru 560066",
    phone: "+91 1800-258-5700",
    hours: "9:00 AM - 9:00 PM",
    rating: 4.9,
    totalCarsAvailable: 210,
  },
  {
    id: "blr-service-1",
    name: "Cars24 Service Hub Koramangala",
    cityId: "bengaluru",
    cityName: "Bengaluru",
    type: "Service Center",
    lat: 12.9352,
    lng: 77.6245,
    address: "80 Feet Road, 5th Block, Koramangala, Bengaluru 560095",
    phone: "+91 1800-258-5701",
    hours: "8:30 AM - 8:00 PM",
    rating: 4.8,
  },
  {
    id: "blr-pickup-1",
    name: "Cars24 Express Pickup Hebbal",
    cityId: "bengaluru",
    cityName: "Bengaluru",
    type: "Pickup Point",
    lat: 13.0358,
    lng: 77.5970,
    address: "Outer Ring Road Junction, Bellary Road, Hebbal, Bengaluru",
    phone: "+91 1800-258-5702",
    hours: "9:30 AM - 8:30 PM",
    rating: 4.7,
  },

  // Hyderabad
  {
    id: "hyd-hub-1",
    name: "Cars24 Mega Hub Gachibowli",
    cityId: "hyderabad",
    cityName: "Hyderabad",
    type: "Mega Hub",
    lat: 17.4401,
    lng: 78.3489,
    address: "ISB Road, Financial District, Gachibowli, Hyderabad 500032",
    phone: "+91 1800-258-5800",
    hours: "9:00 AM - 9:00 PM",
    rating: 4.8,
    totalCarsAvailable: 160,
  },
  {
    id: "hyd-service-1",
    name: "Cars24 Service Center Hitec City",
    cityId: "hyderabad",
    cityName: "Hyderabad",
    type: "Service Center",
    lat: 17.4435,
    lng: 78.3772,
    address: "Mindspace Road, Hitec City Phase 2, Hyderabad 500081",
    phone: "+91 1800-258-5801",
    hours: "8:30 AM - 8:00 PM",
    rating: 4.7,
  },

  // Pune
  {
    id: "pune-hub-1",
    name: "Cars24 Mega Hub Baner",
    cityId: "pune",
    cityName: "Pune",
    type: "Mega Hub",
    lat: 18.5590,
    lng: 73.7868,
    address: "Baner Road Highway Junction, Baner, Pune 411045",
    phone: "+91 1800-258-5900",
    hours: "9:00 AM - 9:00 PM",
    rating: 4.8,
    totalCarsAvailable: 115,
  },
  {
    id: "pune-service-1",
    name: "Cars24 Service Center Viman Nagar",
    cityId: "pune",
    cityName: "Pune",
    type: "Service Center",
    lat: 18.5679,
    lng: 73.9143,
    address: "Nagar Road, Opposite Phoenix Marketcity, Viman Nagar, Pune",
    phone: "+91 1800-258-5901",
    hours: "8:30 AM - 8:00 PM",
    rating: 4.7,
  },

  // Chennai
  {
    id: "chennai-hub-1",
    name: "Cars24 Mega Hub Guindy",
    cityId: "chennai",
    cityName: "Chennai",
    type: "Mega Hub",
    lat: 13.0067,
    lng: 80.2020,
    address: "GST Road, Near Olympia Tech Park, Guindy, Chennai 600032",
    phone: "+91 1800-258-5500",
    hours: "9:00 AM - 9:00 PM",
    rating: 4.8,
    totalCarsAvailable: 130,
  },
  {
    id: "chennai-service-1",
    name: "Cars24 Service Hub Anna Nagar",
    cityId: "chennai",
    cityName: "Chennai",
    type: "Service Center",
    lat: 13.0850,
    lng: 80.2101,
    address: "2nd Avenue, Block AB, Anna Nagar, Chennai 600040",
    phone: "+91 1800-258-5501",
    hours: "8:30 AM - 8:00 PM",
    rating: 4.7,
  },

  // Manali
  {
    id: "manali-hub-1",
    name: "Cars24 Hill & AWD Center Manali",
    cityId: "manali",
    cityName: "Manali",
    type: "Mega Hub",
    lat: 32.2432,
    lng: 77.1892,
    address: "NH3 Highway Expressway Hub, Mall Road Zone, Manali 175131",
    phone: "+91 1800-258-5400",
    hours: "9:00 AM - 8:00 PM",
    rating: 4.9,
    totalCarsAvailable: 45,
  },

  // Goa
  {
    id: "goa-hub-1",
    name: "Cars24 Coastal Hub Panaji",
    cityId: "goa",
    cityName: "Goa",
    type: "Mega Hub",
    lat: 15.4989,
    lng: 73.8278,
    address: "Miramar Expressway, Panaji, Goa 403001",
    phone: "+91 1800-258-5300",
    hours: "9:00 AM - 8:00 PM",
    rating: 4.8,
    totalCarsAvailable: 60,
  },
];

export function getHubsForCity(cityId: string): CarsHub[] {
  if (cityId === "standard") return CARS_HUBS;
  const list = CARS_HUBS.filter((h) => h.cityId === cityId);
  return list.length > 0 ? list : CARS_HUBS;
}

export function findClosestCity(lat: number, lng: number): CityLocation {
  let closest = CITIES[0];
  let minDistance = Infinity;

  for (const city of CITIES) {
    if (city.id === "standard") continue;
    const distance = Math.hypot(city.lat - lat, city.lng - lng);
    if (distance < minDistance) {
      minDistance = distance;
      closest = city;
    }
  }

  return closest;
}
