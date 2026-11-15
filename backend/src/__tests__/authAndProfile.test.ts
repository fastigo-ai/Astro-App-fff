import { authService } from '../modules/auth/auth.service';
import { profileService } from '../modules/profile/profile.service';
import { authController } from '../modules/auth/auth.controller';
import { profileController } from '../modules/profile/profile.controller';
import { mockSmsProvider } from '../modules/auth/sms/mockSmsProvider';
import { UserJourneysCollection } from '../shared/db/dbStore';
import { BYPASS_PHONE, BYPASS_OTP } from '../shared/config/constants';

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
  console.log('🧪 Starting Pluggable Auth, OTP (Mock/Twilio-ready) & Profile Form Unit / Integration Tests...\n');

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

  const testNewUserPhone = `98765${Math.floor(10000 + Math.random() * 90000)}`;

  // 1. Test Mock SMS Provider OTP Generation & Sending
  await assert('authController.sendOtp sends 4-digit OTP to new phone number', async () => {
    const req: any = { body: { phone: testNewUserPhone } };
    const res = createMockRes();
    await authController.sendOtp(req, res, () => {});

    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!res.data.success) throw new Error('Expected success true');
    if (!res.data.devOtp || res.data.devOtp.length !== 4) {
      throw new Error(`Expected 4-digit devOtp, got: ${res.data.devOtp}`);
    }
  });

  // 2. Test Invalid OTP rejection
  await assert('authController.verifyOtp rejects incorrect OTP code', async () => {
    const req: any = { body: { phone: testNewUserPhone, otp: '0000' } };
    const res = createMockRes();
    await authController.verifyOtp(req, res, () => {});

    if (res.statusCode !== 401) throw new Error(`Expected 401, got ${res.statusCode}`);
    if (res.data.success !== false) throw new Error('Expected success false');
  });

  // 3. Test New User Verification (isNewUser: true, hasProfile: false)
  let userToken = '';
  await assert('authController.verifyOtp detects new user (isNewUser: true, hasProfile: false)', async () => {
    const validOtp = mockSmsProvider.getStoredOtp(testNewUserPhone);
    if (!validOtp) throw new Error('Stored OTP not found in mock provider');

    const req: any = { body: { phone: testNewUserPhone, otp: validOtp } };
    const res = createMockRes();
    await authController.verifyOtp(req, res, () => {});

    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!res.data.success) throw new Error('Expected success true');
    if (res.data.data.isNewUser !== true) {
      throw new Error(`Expected isNewUser: true for fresh user, got ${res.data.data.isNewUser}`);
    }
    if (res.data.data.user.hasProfile !== false) {
      throw new Error('Expected hasProfile: false for fresh user');
    }
    if (!res.data.data.accessToken) throw new Error('Expected JWT accessToken');

    userToken = res.data.data.accessToken;
  });

  // 4. Test Profile Form Submission (Personal Details: Name, DOB, State, City)
  await assert('profileController.saveDetails saves user personal form details', async () => {
    const req: any = {
      user: { phone: testNewUserPhone },
      body: {
        name: 'Aaditi Sharma',
        dob: '05/14/1995',
        state: 'Maharashtra',
        city: 'Mumbai',
      },
    };
    const res = createMockRes();
    await profileController.saveDetails(req, res, () => {});

    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!res.data.success) throw new Error('Expected success true');
  });

  // 5. Test Profile Retrieval
  await assert('profileController.getProfile returns updated profile details', async () => {
    const req: any = {
      user: { phone: testNewUserPhone },
      query: { phone: testNewUserPhone },
    };
    const res = createMockRes();
    await profileController.getProfile(req, res, () => {});

    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (res.data.data.name !== 'Aaditi Sharma') {
      throw new Error(`Expected name Aaditi Sharma, got: ${res.data.data.name}`);
    }
    if (res.data.data.city !== 'Mumbai') {
      throw new Error(`Expected city Mumbai, got: ${res.data.data.city}`);
    }
  });

  // 6. Test Existing User Sign-In (isNewUser: false, hasProfile: true)
  await assert('authController.verifyOtp recognizes returning user (isNewUser: false, hasProfile: true)', async () => {
    // Send a new OTP
    const sendReq: any = { body: { phone: testNewUserPhone } };
    const sendRes = createMockRes();
    await authController.sendOtp(sendReq, sendRes, () => {});

    const otp = mockSmsProvider.getStoredOtp(testNewUserPhone);
    const verifyReq: any = { body: { phone: testNewUserPhone, otp } };
    const verifyRes = createMockRes();
    await authController.verifyOtp(verifyReq, verifyRes, () => {});

    if (verifyRes.statusCode !== 200) throw new Error(`Expected 200, got ${verifyRes.statusCode}`);
    if (verifyRes.data.data.isNewUser !== false) {
      throw new Error(`Expected isNewUser: false for onboarded user, got ${verifyRes.data.data.isNewUser}`);
    }
    if (verifyRes.data.data.user.hasProfile !== true) {
      throw new Error('Expected hasProfile: true for onboarded user');
    }
    if (verifyRes.data.data.user.name !== 'Aaditi Sharma') {
      throw new Error(`Expected user.name Aaditi Sharma, got: ${verifyRes.data.data.user.name}`);
    }
  });

  // 7. Test Bypass Number & OTP from .env
  await assert(`Bypass number ${BYPASS_PHONE} works instantly with OTP ${BYPASS_OTP} from .env`, async () => {
    const verifyReq: any = { body: { phone: BYPASS_PHONE, otp: BYPASS_OTP } };
    const verifyRes = createMockRes();
    await authController.verifyOtp(verifyReq, verifyRes, () => {});

    if (verifyRes.statusCode !== 200) throw new Error(`Expected 200, got ${verifyRes.statusCode}`);
    if (!verifyRes.data.data.accessToken) throw new Error('Expected accessToken for bypass number');
  });

  console.log(`\n========================================`);
  console.log(`🏁 Auth & Profile Tests Completed: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});

