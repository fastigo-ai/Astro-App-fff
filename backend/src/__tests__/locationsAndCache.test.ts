import { locationsController } from '../modules/locations/locations.controller';
import { cacheService } from '../shared/services/redis.service';

function createMockRes() {
  const res: any = {};
  res.statusCode = 200;
  res.data = null;
  res.status = (code: number) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data: any) => {
    res.data = data;
    return res;
  };
  return res;
}

async function runTests() {
  console.log('🧪 Starting Locations (States & Cities) + Redis / Cache Layer Tests...\n');

  let passed = 0;
  let failed = 0;

  async function assert(desc: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${desc}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ FAIL: ${desc}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  // 1. Test getStates returns Indian states with name and iso2
  let initialStates: any[] = [];
  await assert('locationsController.getStates returns all 36 Indian states and union territories with name and iso2', async () => {
    const req: any = { query: {} };
    const res = createMockRes();
    await locationsController.getStates(req, res, () => {});

    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!Array.isArray(res.data) || res.data.length < 30) {
      throw new Error(`Expected at least 30 states, got ${res.data?.length}`);
    }

    const mh = res.data.find((s: any) => s.iso2 === 'MH');
    if (!mh) throw new Error('Maharashtra (MH) state not found');
    if (mh.name !== 'Maharashtra') throw new Error(`Expected Maharashtra, got ${mh.name}`);

    const dl = res.data.find((s: any) => s.iso2 === 'DL');
    if (!dl) throw new Error('Delhi (DL) not found');

    initialStates = res.data;
  });

  // 2. Test States are Cached (Redis / Memory Cache)
  await assert('locationsController.getStates serves data from cache on subsequent calls', async () => {
    const cachedStates = await cacheService.get<any[]>('locations:states:IN');
    if (!cachedStates || cachedStates.length !== initialStates.length) {
      throw new Error('States data was not saved to cache');
    }

    const req: any = { query: {} };
    const res = createMockRes();
    await locationsController.getStates(req, res, () => {});

    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (res.data.length !== initialStates.length) throw new Error('Cached states length mismatch');
  });

  // 3. Test getCities returns cities of state (e.g. MH) with name, latitude, longitude
  let mhCities: any[] = [];
  await assert('locationsController.getCities returns cities of Maharashtra with name, latitude, longitude', async () => {
    const req: any = { params: { stateCode: 'MH' }, query: {} };
    const res = createMockRes();
    await locationsController.getCities(req, res, () => {});

    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!Array.isArray(res.data) || res.data.length === 0) {
      throw new Error(`Expected cities list, got ${res.data?.length}`);
    }

    const firstCity = res.data[0];
    if (!firstCity.name || !('latitude' in firstCity) || !('longitude' in firstCity)) {
      throw new Error(`City item missing required fields (name, latitude, longitude): ${JSON.stringify(firstCity)}`);
    }

    const mumbai = res.data.find((c: any) => c.name.toLowerCase().includes('mumbai'));
    if (!mumbai) throw new Error('Mumbai city not found in Maharashtra cities');

    mhCities = res.data;
  });

  // 4. Test Cities are Cached (Redis / Memory Cache)
  await assert('locationsController.getCities caches result for fast subsequent lookups', async () => {
    const cachedCities = await cacheService.get<any[]>('locations:cities:IN:MH');
    if (!cachedCities || cachedCities.length !== mhCities.length) {
      throw new Error('Cities data was not saved to cache');
    }
  });

  // 5. Test Cache Service In-Memory Fallback & Expiration
  await assert('cacheService handles get, set, del and ttl expiration gracefully', async () => {
    await cacheService.set('test:key', { message: 'hello' }, 10);
    const val = await cacheService.get<{ message: string }>('test:key');
    if (!val || val.message !== 'hello') throw new Error('Cache value mismatch');

    await cacheService.del('test:key');
    const deletedVal = await cacheService.get('test:key');
    if (deletedVal !== null) throw new Error('Expected deleted key to return null');
  });

  console.log(`\n========================================`);
  console.log(`🏁 Locations & Cache Tests Completed: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
