import { CarItem, getAllCars } from "./carsData";

export interface SearchFilterState {
  query?: string;
  brands?: string[];
  fuels?: string[];
  transmissions?: string[];
  locations?: string[];
  owners?: string[];
  minPrice?: number; // in Rupees
  maxPrice?: number; // in Rupees
  minKm?: number;
  maxKm?: number;
  minYear?: number;
  maxYear?: number;
}

export type SortOption =
  | "relevance"
  | "price_asc"
  | "price_desc"
  | "km_asc"
  | "year_desc";

export interface RankedCar {
  car: CarItem;
  relevanceScore: number;
  matchPercentage: number;
  matchedHighlights: string[];
}

export interface SearchSuggestionResult {
  predictiveText: string;
  brands: { name: string; count: number }[];
  models: { name: string; brand: string }[];
  attributes: { label: string; filter: Partial<SearchFilterState> }[];
  cars: RankedCar[];
  fuzzyCorrectedQuery?: string;
}

// -------------------------------------------------------------
// 1. FUZZY MATCHING & ALIAS DICTIONARY
// -------------------------------------------------------------

// Alias / Misspelling Map
const ALIAS_MAP: Record<string, string> = {
  // Brands & Models
  hundai: "hyundai",
  hyundaii: "hyundai",
  hunda: "hyundai",
  hyundai: "hyundai",
  maruty: "maruti",
  maroti: "maruti",
  suzuki: "maruti",
  nxtn: "nexon",
  nexan: "nexon",
  balno: "baleno",
  belleno: "baleno",
  creata: "creta",
  kreta: "creta",
  crysta: "innova",
  inova: "innova",
  breza: "brezza",
  seltoss: "seltos",
  fortuner: "fortuner",
  fortunr: "fortuner",
  altros: "altroz",
  fronx: "fronx",
  
  // Fuels & Transmissions
  pertol: "petrol",
  petrl: "petrol",
  ptrol: "petrol",
  disel: "diesel",
  deisel: "diesel",
  desel: "diesel",
  auto: "automatic",
  autmatic: "automatic",
  automtc: "automatic",
  manul: "manual",
  mnual: "manual",

  // Cities
  banglore: "bengaluru",
  bangalore: "bengaluru",
  hydrabad: "hyderabad",
  delhy: "delhi",
  mumbaii: "mumbai",
};

// Calculate Levenshtein Distance
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  const lenA = a.length;
  const lenB = b.length;

  if (lenA === 0) return lenB;
  if (lenB === 0) return lenA;

  for (let i = 0; i <= lenB; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= lenA; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= lenB; i++) {
    for (let j = 1; j <= lenA; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[lenB][lenA];
}

// Normalized Similarity Score (0 to 1)
export function getSimilarityScore(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  if (s1 === s2) return 1.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.85;

  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen === 0) return 1.0;

  const dist = levenshteinDistance(s1, s2);
  return 1 - dist / maxLen;
}

// Normalize a search word using alias dictionary or fuzzy correction
export function normalizeToken(token: string): string {
  const cleaned = token.toLowerCase().trim();
  if (ALIAS_MAP[cleaned]) {
    return ALIAS_MAP[cleaned];
  }
  return cleaned;
}

// -------------------------------------------------------------
// 2. RELEVANCE SCORING SYSTEM
// -------------------------------------------------------------

export function calculateCarRelevance(
  car: CarItem,
  query: string,
  filters: SearchFilterState = {}
): { score: number; matchPercentage: number; highlights: string[] } {
  let score = 0;
  const maxPossibleScore = 120;
  const highlights: string[] = [];

  const rawQueryTokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const normalizedTokens = rawQueryTokens.map((t) => normalizeToken(t));

  // --- A. KEYWORD MATCH SCORING ---
  if (rawQueryTokens.length > 0) {
    const fullCarTitle = car.title.toLowerCase();
    const brandLower = car.brand.toLowerCase();
    const modelLower = car.model.toLowerCase();
    const locationLower = car.location.toLowerCase();
    const fuelLower = car.fuel.toLowerCase();
    const transLower = car.transmission.toLowerCase();
    const yearStr = car.year.toString();

    let titleMatchedTokens = 0;

    for (let i = 0; i < rawQueryTokens.length; i++) {
      const rawToken = rawQueryTokens[i];
      const normToken = normalizedTokens[i];

      // Exact title match / full query substring match
      if (fullCarTitle.includes(rawToken) || fullCarTitle.includes(normToken)) {
        score += 25;
        titleMatchedTokens++;
        highlights.push(`Title match: "${normToken}"`);
      } else if (getSimilarityScore(normToken, brandLower) > 0.75) {
        score += 20;
        highlights.push(`Brand: ${car.brand}`);
      } else if (getSimilarityScore(normToken, modelLower) > 0.75) {
        score += 20;
        highlights.push(`Model: ${car.model}`);
      } else {
        // Fuzzy token match against Title
        let bestTokenScore = 0;
        const titleWords = fullCarTitle.split(/\s+/);
        for (const word of titleWords) {
          const sim = getSimilarityScore(normToken, word);
          if (sim > bestTokenScore) bestTokenScore = sim;
        }

        if (bestTokenScore > 0.7) {
          score += Math.round(bestTokenScore * 20);
          highlights.push(`Fuzzy match on title`);
        }
      }

      // Attribute tokens match
      if (brandLower === normToken) score += 15;
      if (modelLower === normToken) score += 15;
      if (locationLower.includes(normToken) || normToken.includes(locationLower)) {
        score += 12;
        highlights.push(`Location: ${car.location}`);
      }
      if (fuelLower === normToken || (normToken === "automatic" && transLower !== "manual") || transLower.includes(normToken)) {
        score += 10;
        highlights.push(`Spec: ${normToken}`);
      }
      if (yearStr === normToken) {
        score += 15;
        highlights.push(`Year: ${car.year}`);
      }
    }

    // Bonus if all query tokens matched
    if (titleMatchedTokens === rawQueryTokens.length && rawQueryTokens.length > 1) {
      score += 20;
    }
  } else {
    // If no query string, baseline keyword score is neutral
    score += 50;
  }

  // --- B. FILTER ALIGNMENT SCORING ---
  if (filters.brands && filters.brands.length > 0) {
    if (filters.brands.includes(car.brand)) {
      score += 15;
      highlights.push(`Brand selected`);
    } else {
      score -= 20; // Filter mismatch penalty
    }
  }

  if (filters.fuels && filters.fuels.length > 0) {
    if (filters.fuels.includes(car.fuel)) {
      score += 10;
    } else {
      score -= 20;
    }
  }

  if (filters.transmissions && filters.transmissions.length > 0) {
    if (filters.transmissions.includes(car.transmission)) {
      score += 10;
    } else {
      score -= 20;
    }
  }

  if (filters.locations && filters.locations.length > 0) {
    if (filters.locations.includes(car.location)) {
      score += 10;
    } else {
      score -= 15;
    }
  }

  if (filters.owners && filters.owners.length > 0) {
    if (filters.owners.includes(car.owner)) {
      score += 10;
    } else {
      score -= 10;
    }
  }

  if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
    if (car.priceNumeric >= filters.minPrice && car.priceNumeric <= filters.maxPrice) {
      score += 10;
    } else {
      score -= 30;
    }
  }

  if (filters.minKm !== undefined && filters.maxKm !== undefined) {
    if (car.kmNumeric >= filters.minKm && car.kmNumeric <= filters.maxKm) {
      score += 10;
    } else {
      score -= 25;
    }
  }

  if (filters.minYear !== undefined && filters.maxYear !== undefined) {
    if (car.year >= filters.minYear && car.year <= filters.maxYear) {
      score += 10;
    } else {
      score -= 25;
    }
  }

  // --- C. POPULARITY & RECENCY BONUS ---
  if (car.owner.includes("1st")) score += 5;
  if (car.kmNumeric < 30000) score += 5;
  if (car.year >= 2021) score += 5;
  score += Math.round(car.popularityScore * 0.1);

  // Clamp final score
  const finalScore = Math.max(0, score);
  const matchPercentage = Math.min(99, Math.max(40, Math.round((finalScore / maxPossibleScore) * 100)));

  return {
    score: finalScore,
    matchPercentage,
    highlights: Array.from(new Set(highlights)),
  };
}

// -------------------------------------------------------------
// 3. RANKING & SEARCH ENGINE FUNCTION
// -------------------------------------------------------------

export function rankCars(
  cars: CarItem[],
  filters: SearchFilterState = {},
  sortBy: SortOption = "relevance"
): RankedCar[] {
  const query = filters.query || "";

  // 1. Calculate relevance for all cars
  let ranked: RankedCar[] = cars.map((car) => {
    const { score, matchPercentage, highlights } = calculateCarRelevance(car, query, filters);
    return {
      car,
      relevanceScore: score,
      matchPercentage,
      matchedHighlights: highlights,
    };
  });

  // 2. Hard filter out cars that severely break explicit hard bounds if set
  if (filters.brands && filters.brands.length > 0) {
    ranked = ranked.filter((r) => filters.brands!.includes(r.car.brand));
  }
  if (filters.fuels && filters.fuels.length > 0) {
    ranked = ranked.filter((r) => filters.fuels!.includes(r.car.fuel));
  }
  if (filters.transmissions && filters.transmissions.length > 0) {
    ranked = ranked.filter((r) => filters.transmissions!.includes(r.car.transmission));
  }
  if (filters.locations && filters.locations.length > 0) {
    ranked = ranked.filter((r) => filters.locations!.includes(r.car.location));
  }
  if (filters.owners && filters.owners.length > 0) {
    ranked = ranked.filter((r) => filters.owners!.includes(r.car.owner));
  }
  if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
    ranked = ranked.filter(
      (r) => r.car.priceNumeric >= filters.minPrice! && r.car.priceNumeric <= filters.maxPrice!
    );
  }
  if (filters.minKm !== undefined && filters.maxKm !== undefined) {
    ranked = ranked.filter(
      (r) => r.car.kmNumeric >= filters.minKm! && r.car.kmNumeric <= filters.maxKm!
    );
  }
  if (filters.minYear !== undefined && filters.maxYear !== undefined) {
    ranked = ranked.filter(
      (r) => r.car.year >= filters.minYear! && r.car.year <= filters.maxYear!
    );
  }

  // 3. Filter by search query relevance if query is non-empty
  if (query.trim().length > 0) {
    // Only keep cars with positive relevance score or above minimum threshold
    ranked = ranked.filter((r) => r.relevanceScore > 10);
  }

  // 4. Sort results according to sortBy preference
  ranked.sort((a, b) => {
    if (sortBy === "relevance") {
      return b.relevanceScore - a.relevanceScore;
    }
    if (sortBy === "price_asc") {
      return a.car.priceNumeric - b.car.priceNumeric;
    }
    if (sortBy === "price_desc") {
      return b.car.priceNumeric - a.car.priceNumeric;
    }
    if (sortBy === "km_asc") {
      return a.car.kmNumeric - b.car.kmNumeric;
    }
    if (sortBy === "year_desc") {
      return b.car.year - a.car.year;
    }
    return b.relevanceScore - a.relevanceScore;
  });

  return ranked;
}

// -------------------------------------------------------------
// 4. AUTO-SUGGESTIONS & PREDICTIVE TYPING ENGINE
// -------------------------------------------------------------

export function getSearchSuggestions(
  query: string,
  cars: CarItem[] = getAllCars()
): SearchSuggestionResult {
  const trimmed = query.trim().toLowerCase();

  if (!trimmed) {
    // Popular defaults when query is empty
    const defaultBrands = ["Maruti", "Hyundai", "Tata", "Honda", "Kia"].map((b) => ({
      name: b,
      count: cars.filter((c) => c.brand === b).length,
    }));

    const topCars = rankCars(cars, {}, "relevance").slice(0, 4);

    return {
      predictiveText: "",
      brands: defaultBrands,
      models: [
        { name: "Nexon", brand: "Tata" },
        { name: "Creta", brand: "Hyundai" },
        { name: "Baleno", brand: "Maruti" },
        { name: "City", brand: "Honda" },
      ],
      attributes: [
        { label: "Automatic Cars", filter: { transmissions: ["Automatic", "CVT", "AMT"] } },
        { label: "Petrol SUVs", filter: { fuels: ["Petrol"] } },
        { label: "Under ₹10 Lakhs", filter: { maxPrice: 1000000 } },
        { label: "Low Mileage (< 30,000 km)", filter: { maxKm: 30000 } },
      ],
      cars: topCars,
    };
  }

  // Normalize tokens
  const rawTokens = trimmed.split(/\s+/);
  const normTokens = rawTokens.map(normalizeToken);
  const primaryToken = normTokens[0];

  // 1. Detect if fuzzy correction occurred
  let fuzzyCorrectedQuery: string | undefined = undefined;
  if (ALIAS_MAP[rawTokens[0]] && ALIAS_MAP[rawTokens[0]] !== rawTokens[0]) {
    fuzzyCorrectedQuery = [ALIAS_MAP[rawTokens[0]], ...rawTokens.slice(1)].join(" ");
  }

  // 2. Calculate predictive completion text
  let predictiveText = "";
  // Find top matching car title for completion
  const bestMatchCar = cars.find((c) =>
    c.title.toLowerCase().startsWith(trimmed)
  ) || cars.find((c) => c.brand.toLowerCase().startsWith(trimmed));

  if (bestMatchCar) {
    if (bestMatchCar.title.toLowerCase().startsWith(trimmed)) {
      predictiveText = bestMatchCar.title;
    } else if (bestMatchCar.brand.toLowerCase().startsWith(trimmed)) {
      predictiveText = `${bestMatchCar.brand} ${bestMatchCar.model}`;
    }
  }

  // 3. Matching Brands
  const allBrands = Array.from(new Set(cars.map((c) => c.brand)));
  const matchingBrands = allBrands
    .filter(
      (b) =>
        b.toLowerCase().startsWith(primaryToken) ||
        b.toLowerCase().includes(primaryToken) ||
        getSimilarityScore(primaryToken, b) > 0.7
    )
    .map((b) => ({
      name: b,
      count: cars.filter((c) => c.brand === b).length,
    }));

  // 4. Matching Models
  const modelMap = new Map<string, string>();
  cars.forEach((c) => {
    if (
      c.model.toLowerCase().startsWith(primaryToken) ||
      c.model.toLowerCase().includes(primaryToken) ||
      c.title.toLowerCase().includes(trimmed) ||
      getSimilarityScore(primaryToken, c.model) > 0.7
    ) {
      modelMap.set(c.model, c.brand);
    }
  });

  const matchingModels = Array.from(modelMap.entries())
    .slice(0, 5)
    .map(([name, brand]) => ({ name, brand }));

  // 5. Dynamic Attributes
  const attributes: { label: string; filter: Partial<SearchFilterState> }[] = [];
  if (matchingBrands.length > 0) {
    const topB = matchingBrands[0].name;
    attributes.push({
      label: `${topB} Cars`,
      filter: { brands: [topB] },
    });
    attributes.push({
      label: `Automatic ${topB} Cars`,
      filter: { brands: [topB], transmissions: ["Automatic", "CVT", "AMT"] },
    });
  }

  if (["petrol", "diesel", "cng", "electric"].some((f) => f.includes(primaryToken))) {
    const matchedFuel = ["Petrol", "Diesel", "CNG", "Electric"].find((f) =>
      f.toLowerCase().includes(primaryToken)
    ) || "Petrol";
    attributes.push({
      label: `${matchedFuel} Fuel Cars`,
      filter: { fuels: [matchedFuel] },
    });
  }

  // 6. Top Ranked Cars for Dropdown Preview
  const rankedResults = rankCars(cars, { query: fuzzyCorrectedQuery || query }, "relevance").slice(0, 4);

  return {
    predictiveText,
    brands: matchingBrands.slice(0, 4),
    models: matchingModels,
    attributes,
    cars: rankedResults,
    fuzzyCorrectedQuery,
  };
}
