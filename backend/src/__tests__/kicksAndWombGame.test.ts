import { momController } from '../modules/mom/mom.controller';
import { momService } from '../modules/mom/mom.service';
import { adminController } from '../modules/admin/admin.controller';
import { adminService } from '../modules/admin/admin.service';

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
  console.log('🧪 Starting Fetal Kick Counter & Interactive Womb Game Backend Tests...\n');

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

  const testPhone = '9876543210';
  const twinPhone = '9988776655';

  // 1. Save clinical kick session
  await assert('momController.saveKickSession records 10-kick clinical session with duration & timestamps', async () => {
    const req: any = {
      user: { phone: testPhone, id: 'usr_kick_1' },
      body: {
        babyId: 'Baby 1',
        totalKicks: 10,
        durationSeconds: 1820,
        targetKicks: 10,
        completed: true,
        notes: 'Active morning movements after warm kesar milk',
        kickTimestamps: ['0:01:20', '0:03:45', '0:07:10', '0:12:30', '0:18:15', '0:22:00', '0:25:40', '0:27:10', '0:29:15', '0:30:20'],
      },
    };
    const res = createMockRes();
    await momController.saveKickSession(req, res, () => {});

    if (res.statusCode !== 201) throw new Error(`Expected 201, got ${res.statusCode}`);
    if (!res.data?.success) throw new Error('Expected success: true');
    if (res.data?.data?.totalKicks !== 10) throw new Error(`Expected 10 kicks, got ${res.data?.data?.totalKicks}`);
    if (res.data?.data?.vigourLevel !== 'Champion Gymnast') {
      throw new Error(`Expected Champion Gymnast tumour, got ${res.data?.data?.vigourLevel}`);
    }
  });

  // 2. Save Kick & Play Womb Game session with stimuli and reaction latency
  await assert('momController.saveKickSession stores gameScore, vigourLevel & stimulusResponses from Womb Game', async () => {
    const req: any = {
      user: { phone: testPhone, id: 'usr_kick_1' },
      body: {
        babyId: 'Baby 1',
        totalKicks: 6,
        durationSeconds: 960,
        targetKicks: 10,
        completed: false,
        gameScore: 150,
        vigourLevel: 'Playful Stretching',
        streakDays: 4,
        stimulusResponses: [
          { stimulus: 'flute', latencySeconds: 1.4, zone: 0 },
          { stimulus: 'bell', latencySeconds: 1.7, zone: 3 },
          { stimulus: 'tap', latencySeconds: 0.9, zone: 5 },
        ],
      },
    };
    const res = createMockRes();
    await momController.saveKickSession(req, res, () => {});

    if (res.statusCode !== 201) throw new Error(`Expected 201, got ${res.statusCode}`);
    if (res.data?.data?.gameScore !== 150) throw new Error(`Expected gameScore 150, got ${res.data?.data?.gameScore}`);
    if (res.data?.data?.stimulusResponses?.length !== 3) {
      throw new Error(`Expected 3 stimulus responses, got ${res.data?.data?.stimulusResponses?.length}`);
    }
  });

  // 3. Twin tracking: Baby 1 and Baby 2 recorded separately
  await assert('momService tracks Baby 1 and Baby 2 separately for twin pregnancies', async () => {
    await momService.saveKickSession({
      userId: 'usr_twin',
      phone: twinPhone,
      babyId: 'Baby 1',
      totalKicks: 10,
      durationSeconds: 1200,
      targetKicks: 10,
      completed: true,
    });

    await momService.saveKickSession({
      userId: 'usr_twin',
      phone: twinPhone,
      babyId: 'Baby 2',
      totalKicks: 8,
      durationSeconds: 1500,
      targetKicks: 10,
      completed: false,
    });

    const sessions = await momService.getKickSessions(twinPhone);
    if (sessions.length < 2) throw new Error(`Expected at least 2 twin sessions, got ${sessions.length}`);

    const baby1 = sessions.find(s => s.babyId === 'Baby 1');
    const baby2 = sessions.find(s => s.babyId === 'Baby 2');
    if (!baby1 || !baby2) throw new Error('Did not find separate records for Baby 1 and Baby 2');
    if (baby1.totalKicks !== 10) throw new Error('Baby 1 totalKicks mismatch');
    if (baby2.totalKicks !== 8) throw new Error('Baby 2 totalKicks mismatch');
  });

  // 4. Test 7-Day Stats & Summary Analytics Endpoint
  await assert('momController.getKickStats calculates 7-day breakdown, completion rate & avg duration', async () => {
    const req: any = {
      user: { phone: testPhone },
      query: {},
    };
    const res = createMockRes();
    await momController.getKickStats(req, res, () => {});

    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    const stats = res.data?.data;
    if (!stats) throw new Error('Missing stats payload');
    if (stats.totalSessions < 2) throw new Error(`Expected at least 2 sessions, got ${stats.totalSessions}`);
    if (!Array.isArray(stats.last7Days) || stats.last7Days.length !== 7) {
      throw new Error(`Expected 7 days in last7Days, got ${stats.last7Days?.length}`);
    }
    if (typeof stats.completionRate !== 'number') throw new Error('Expected numerical completionRate');
    if (typeof stats.clinicalStatus !== 'string') throw new Error('Expected clinicalStatus string');
  });

  // 5. Test Admin endpoint to monitor patient kick sessions
  await assert('adminController.listKicks allows admin/OB-GYN to monitor patient kick records', async () => {
    const req: any = {
      query: { phone: testPhone },
    };
    const res = createMockRes();
    await adminController.listKicks(req, res);

    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!res.data?.success) throw new Error('Expected success: true');
    if (!Array.isArray(res.data?.data)) throw new Error('Expected array of kick records');
    if (res.data.count < 2) throw new Error(`Expected at least 2 filtered records, got ${res.data.count}`);
    const first = res.data.data[0];
    if (first.phone !== testPhone) throw new Error(`Expected phone ${testPhone}, got ${first.phone}`);
  });

  console.log('\n========================================');
  console.log(`🏁 Fetal Kick Backend Tests Completed: ${passed} Passed, ${failed} Failed`);
  console.log('========================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
