import { getStatesOfCountry, getCitiesOfState } from '@countrystatecity/countries';
import { cacheService } from '../../shared/services/redis.service';

const STATES_CACHE_KEY = 'locations:states:IN';
const CITIES_CACHE_PREFIX = 'locations:cities:';
const CACHE_TTL_SECONDS = 86400; // 24 hours

export interface StateItem {
  name: string;
  iso2: string;
}

export interface CityItem {
  name: string;
  latitude: string;
  longitude: string;
}

export const locationsService = {
  async getStates(countryCode = 'IN'): Promise<StateItem[]> {
    const normalizedCountry = countryCode.trim().toUpperCase();
    const cacheKey = `locations:states:${normalizedCountry}`;

    // 1. Check cache (Redis or in-memory)
    const cached = await cacheService.get<StateItem[]>(cacheKey);
    if (cached && Array.isArray(cached)) {
      return cached;
    }

    // 2. Fetch using @countrystatecity/countries
    const states = await getStatesOfCountry(normalizedCountry);
    const result: StateItem[] = (states || []).map(({ name, iso2 }: any) => ({
      name,
      iso2,
    }));

    // 3. Store in cache
    await cacheService.set(cacheKey, result, CACHE_TTL_SECONDS);

    return result;
  },

  async getCities(stateCode: string, countryCode = 'IN'): Promise<CityItem[]> {
    const normalizedCountry = countryCode.trim().toUpperCase();
    const normalizedState = stateCode.trim().toUpperCase();
    const cacheKey = `${CITIES_CACHE_PREFIX}${normalizedCountry}:${normalizedState}`;

    // 1. Check cache (Redis or in-memory)
    const cached = await cacheService.get<CityItem[]>(cacheKey);
    if (cached && Array.isArray(cached)) {
      return cached;
    }

    // 2. Fetch using @countrystatecity/countries
    const cities = await getCitiesOfState(normalizedCountry, normalizedState);
    const result: CityItem[] = (cities || []).map(({ name, latitude, longitude }: any) => ({
      name,
      latitude,
      longitude,
    }));

    // 3. Store in cache
    await cacheService.set(cacheKey, result, CACHE_TTL_SECONDS);

    return result;
  },
};
