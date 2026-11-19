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
  res.headers = {};
  res.setHeader = (key: string, val: any) => {
    res.headers[key.toLowerCase()] = String(val);
    return res;
  };
  res.getHeader = (key: string) => res.headers[key.toLowerCase()];
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

  // 4b. Test Language Preference Update & Retrieval (en -> hi)
  await assert('profileController.updateLanguage updates and stores language preference', async () => {
    const updateReq: any = {
      user: { phone: testNewUserPhone },
      body: { language: 'hi' },
    };
    const updateRes = createMockRes();
    await profileController.updateLanguage(updateReq, updateRes, () => {});

    if (updateRes.statusCode !== 200) throw new Error(`Expected 200, got ${updateRes.statusCode}`);
    if (updateRes.data.data.language !== 'hi') {
      throw new Error(`Expected language 'hi', got ${updateRes.data.data.language}`);
    }

    // Verify GET /language returns 'hi'
    const getReq: any = { user: { phone: testNewUserPhone } };
    const getRes = createMockRes();
    await profileController.getLanguage(getReq, getRes, () => {});

    if (getRes.statusCode !== 200) throw new Error(`Expected 200, got ${getRes.statusCode}`);
    if (getRes.data.data.language !== 'hi') {
      throw new Error(`Expected getLanguage to return 'hi', got ${getRes.data.data.language}`);
    }
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

  // 8. Test First Avatar Upload & Count Tracking (Count = 1)
  await assert('profileController.uploadAvatar records 1st photo and sets avatarUpdateCount to 1', async () => {
    const req: any = {
      user: { phone: testNewUserPhone },
      body: {
        avatar: 'https://res.cloudinary.com/dt59dbh3f/image/upload/v12345/astrobaby/avatar1.jpg',
        publicId: 'astrobaby/avatar1',
      },
      headers: {
        'x-forwarded-for': '49.36.120.45',
        'user-agent': 'Astrobaby-iOS/1.0',
      },
      socket: { remoteAddress: '49.36.120.45' },
    };
    const res = createMockRes();
    await profileController.uploadAvatar(req, res, () => {});

    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (res.data.data.avatarUpdateCount !== 1) {
      throw new Error(`Expected avatarUpdateCount to be 1, got ${res.data.data.avatarUpdateCount}`);
    }
    if (!res.data.data.avatarUpdatedAt) throw new Error('Expected avatarUpdatedAt timestamp');
  });

  // 9. Test Second Avatar Upload & Count Tracking (Count = 2, Audit Trail)
  await assert('profileController.uploadAvatar increments avatarUpdateCount to 2 and appends audit history', async () => {
    const req: any = {
      user: { phone: testNewUserPhone },
      body: {
        avatar: 'https://res.cloudinary.com/dt59dbh3f/image/upload/v12345/astrobaby/avatar2.jpg',
        publicId: 'astrobaby/avatar2',
      },
      headers: {
        'x-forwarded-for': '49.36.120.99',
        'user-agent': 'Astrobaby-Android/1.0',
      },
      socket: { remoteAddress: '49.36.120.99' },
    };
    const res = createMockRes();
    await profileController.uploadAvatar(req, res, () => {});

    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (res.data.data.avatarUpdateCount !== 2) {
      throw new Error(`Expected avatarUpdateCount to be 2, got ${res.data.data.avatarUpdateCount}`);
    }
    if (res.data.data.historyCount !== 2) {
      throw new Error(`Expected historyCount 2 in audit trail, got ${res.data.data.historyCount}`);
    }

    // Verify stored user in collection has full history
    const profileReq: any = { user: { phone: testNewUserPhone }, query: { phone: testNewUserPhone } };
    const profileRes = createMockRes();
    await profileController.getProfile(profileReq, profileRes, () => {});

    const history = profileRes.data.data.avatarHistory;
    if (!Array.isArray(history) || history.length !== 2) {
      throw new Error(`Expected avatarHistory array with 2 entries, got: ${history?.length}`);
    }
    if (history[0].count !== 1 || history[1].count !== 2) {
      throw new Error('Audit history entries missing proper count tags');
    }
  });

  // 10. Test Account Deletion (Compliant Soft Delete: is_deleted = true, preserve audit history)
  await assert('profileController.deleteAccount soft-deletes account with is_deleted=true and audit reason', async () => {
    const req: any = {
      user: { phone: testNewUserPhone },
      body: { reason: 'Switching to another platform' },
    };
    const res = createMockRes();
    await profileController.deleteAccount(req, res, () => {});

    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (res.data.is_deleted !== true) throw new Error('Expected is_deleted to be true in response');
    if (!res.data.deleted_at) throw new Error('Expected deleted_at timestamp in response');

    // Verify record in collection was NOT hard-deleted
    const rawUsers = UserJourneysCollection.read();
    const stored = rawUsers.find((u: any) => u.phone === testNewUserPhone);
    if (!stored) throw new Error('User record was hard-deleted! Must be retained for legal compliance.');
    if (stored.is_deleted !== true) throw new Error(`Expected stored.is_deleted to be true, got: ${stored.is_deleted}`);
    if (stored.deletion_reason !== 'Switching to another platform') {
      throw new Error(`Expected deletion_reason 'Switching to another platform', got: ${stored.deletion_reason}`);
    }
  });

  // 11. Test Auth Middleware rejects soft-deleted account with 403 Forbidden
  await assert('authMiddleware rejects soft-deleted user requests with 403 Forbidden', async () => {
    const { authMiddleware } = await import('../shared/middlewares/authMiddleware');
    const req: any = {
      headers: { authorization: `Bearer ${userToken}` },
    };
    const res = createMockRes();
    let nextCalled = false;
    await authMiddleware(req, res, () => {
      nextCalled = true;
    });

    if (nextCalled) throw new Error('Expected authMiddleware to reject deleted account, but next() was called!');
    if (res.statusCode !== 403) throw new Error(`Expected 403, got ${res.statusCode}`);
    if (res.data.is_deleted !== true) throw new Error('Expected is_deleted: true in 403 response');
  });

  // 12. Test Reactivation when user logs back in with OTP
  await assert('authController.verifyOtp reactivates soft-deleted user as isNewUser: true with is_deleted=false', async () => {
    const sendReq: any = { body: { phone: testNewUserPhone } };
    const sendRes = createMockRes();
    await authController.sendOtp(sendReq, sendRes, () => {});

    const validOtp = mockSmsProvider.getStoredOtp(testNewUserPhone);
    const verifyReq: any = { body: { phone: testNewUserPhone, otp: validOtp } };
    const verifyRes = createMockRes();
    await authController.verifyOtp(verifyReq, verifyRes, () => {});

    if (verifyRes.statusCode !== 200) throw new Error(`Expected 200, got ${verifyRes.statusCode}`);
    if (verifyRes.data.data.isNewUser !== true) {
      throw new Error(`Expected isNewUser: true on reactivation, got ${verifyRes.data.data.isNewUser}`);
    }

    // Verify record in database is no longer marked deleted
    const rawUsers = UserJourneysCollection.read();
    const stored = rawUsers.find((u: any) => u.phone === testNewUserPhone);
    if (stored?.is_deleted !== false) {
      throw new Error(`Expected stored.is_deleted to be false after reactivation, got: ${stored?.is_deleted}`);
    }
  });

  // 13. Test Swagger Spec registers Account Deletion Endpoints
  await assert('Swagger Spec (/api-docs) registers Account Deletion DELETE & POST endpoints', async () => {
    const { swaggerSpec } = await import('../shared/config/swagger');
    const deletePath = swaggerSpec.paths['/api/v1/profile']?.delete;
    const postDeletePath = swaggerSpec.paths['/api/v1/profile/delete-account']?.post;

    if (!deletePath) throw new Error('Missing DELETE /api/v1/profile in Swagger spec');
    if (!deletePath.summary.includes('Delete Account')) {
      throw new Error(`Unexpected Swagger summary: ${deletePath.summary}`);
    }
    if (!postDeletePath) throw new Error('Missing POST /api/v1/profile/delete-account in Swagger spec');
  });

  // 14. Test Send OTP Rate Limiting (Account-based: 30s Cooldown & Max 3 requests in 10 mins)
  await assert('sendOtpRateLimiter enforces 30s cooldown and account rate limit (429 Too Many Requests)', async () => {
    const { sendOtpRateLimiter } = await import('../shared/middlewares/rateLimitMiddleware');
    const { cacheService } = await import('../shared/services/redis.service');
    const targetPhone = `91234${Math.floor(10000 + Math.random() * 90000)}`;

    // 1st request succeeds
    const req1: any = { body: { phone: targetPhone }, headers: {}, socket: { remoteAddress: '10.0.0.1' } };
    const res1 = createMockRes();
    let next1 = false;
    await sendOtpRateLimiter(req1, res1, () => { next1 = true; });
    if (!next1) throw new Error('First sendOtp request should have passed rate limiter');

    // Immediate 2nd request within 30s triggers cooldown limit
    const req2: any = { body: { phone: targetPhone }, headers: {}, socket: { remoteAddress: '10.0.0.1' } };
    const res2 = createMockRes();
    let next2 = false;
    await sendOtpRateLimiter(req2, res2, () => { next2 = true; });
    if (next2) throw new Error('Expected 2nd immediate request to be blocked by 30s cooldown');
    if (res2.statusCode !== 429) throw new Error(`Expected 429, got ${res2.statusCode}`);
    if (res2.data.code !== 'OTP_COOLDOWN_ACTIVE') {
      throw new Error(`Expected code 'OTP_COOLDOWN_ACTIVE', got ${res2.data.code}`);
    }
    if (!res2.headers['retry-after']) throw new Error('Expected Retry-After header');

    // Simulate cooldown passing by clearing cooldown key, then send 2 more to hit 3 max limit
    await cacheService.del(`rl:otp:cooldown:${targetPhone}`);
    const req3: any = { body: { phone: targetPhone }, headers: {}, socket: { remoteAddress: '10.0.0.1' } };
    const res3 = createMockRes();
    await sendOtpRateLimiter(req3, res3, () => {});

    await cacheService.del(`rl:otp:cooldown:${targetPhone}`);
    const req4: any = { body: { phone: targetPhone }, headers: {}, socket: { remoteAddress: '10.0.0.1' } };
    const res4 = createMockRes();
    await sendOtpRateLimiter(req4, res4, () => {});

    // 4th request exceeds max 3 limit in window
    await cacheService.del(`rl:otp:cooldown:${targetPhone}`);
    const req5: any = { body: { phone: targetPhone }, headers: {}, socket: { remoteAddress: '10.0.0.1' } };
    const res5 = createMockRes();
    let next5 = false;
    await sendOtpRateLimiter(req5, res5, () => { next5 = true; });
    if (next5) throw new Error('Expected 4th request to exceed RATE_LIMIT_OTP_MAX_PER_PHONE');
    if (res5.statusCode !== 429) throw new Error(`Expected 429, got ${res5.statusCode}`);
    if (res5.data.code !== 'ACCOUNT_RATE_LIMIT_EXCEEDED') {
      throw new Error(`Expected code 'ACCOUNT_RATE_LIMIT_EXCEEDED', got ${res5.data.code}`);
    }
  });

  // 15. Test Send OTP Rate Limiting (IP-based: Max 10 requests per 15 mins)
  await assert('sendOtpRateLimiter blocks IP after exceeding max requests across different accounts', async () => {
    const { sendOtpRateLimiter } = await import('../shared/middlewares/rateLimitMiddleware');
    const attackIp = `192.168.100.${Math.floor(10 + Math.random() * 80)}`;

    for (let i = 0; i < 10; i++) {
      const dummyPhone = `95555${Math.floor(10000 + Math.random() * 90000)}`;
      const req: any = { body: { phone: dummyPhone }, headers: {}, socket: { remoteAddress: attackIp } };
      const res = createMockRes();
      await sendOtpRateLimiter(req, res, () => {});
    }

    // 11th request from same IP should be blocked
    const dummyPhone11 = `95555${Math.floor(10000 + Math.random() * 90000)}`;
    const req11: any = { body: { phone: dummyPhone11 }, headers: {}, socket: { remoteAddress: attackIp } };
    const res11 = createMockRes();
    let next11 = false;
    await sendOtpRateLimiter(req11, res11, () => { next11 = true; });

    if (next11) throw new Error('Expected 11th request from same IP to be blocked');
    if (res11.statusCode !== 429) throw new Error(`Expected 429, got ${res11.statusCode}`);
    if (res11.data.code !== 'IP_RATE_LIMIT_EXCEEDED') {
      throw new Error(`Expected code 'IP_RATE_LIMIT_EXCEEDED', got ${res11.data.code}`);
    }
  });

  // 16. Test Verify OTP Account Lockout on 5 Consecutive Failed Attempts
  await assert('verifyOtp locks account for 15 minutes after 5 consecutive failed attempts', async () => {
    const { verifyOtpRateLimiter } = await import('../shared/middlewares/rateLimitMiddleware');
    const victimPhone = `97777${Math.floor(10000 + Math.random() * 90000)}`;

    // Generate valid OTP first so user exists in mock store
    mockSmsProvider.sendOtp(victimPhone, '5555');

    // Fail 4 times: returns 401 with remaining attempts
    for (let i = 1; i <= 4; i++) {
      const verifyReq: any = { body: { phone: victimPhone, otp: '9999' } };
      const verifyRes = createMockRes();
      await authController.verifyOtp(verifyReq, verifyRes, () => {});
      if (verifyRes.statusCode !== 401) throw new Error(`Expected 401, got ${verifyRes.statusCode}`);
      if (verifyRes.data.remainingAttempts !== 5 - i) {
        throw new Error(`Expected remainingAttempts ${5 - i}, got ${verifyRes.data.remainingAttempts}`);
      }
    }

    // 5th failed attempt: locks account and returns 429
    const verifyReq5: any = { body: { phone: victimPhone, otp: '9999' } };
    const verifyRes5 = createMockRes();
    await authController.verifyOtp(verifyReq5, verifyRes5, () => {});
    if (verifyRes5.statusCode !== 429) throw new Error(`Expected 429 on 5th failure, got ${verifyRes5.statusCode}`);
    if (verifyRes5.data.code !== 'ACCOUNT_TEMPORARILY_LOCKED') {
      throw new Error(`Expected 'ACCOUNT_TEMPORARILY_LOCKED', got ${verifyRes5.data.code}`);
    }

    // Subsequent verifyOtpRateLimiter middleware blocks before processing
    const verifyLimiterReq: any = { body: { phone: victimPhone, otp: '5555' }, headers: {}, socket: { remoteAddress: '127.0.0.1' } };
    const verifyLimiterRes = createMockRes();
    let limiterPassed = false;
    await verifyOtpRateLimiter(verifyLimiterReq, verifyLimiterRes, () => { limiterPassed = true; });
    if (limiterPassed) throw new Error('Expected verifyOtpRateLimiter to block locked account');
    if (verifyLimiterRes.statusCode !== 429) throw new Error(`Expected 429, got ${verifyLimiterRes.statusCode}`);
  });

  // 17. Test Bypass Phone is immune to rate limits
  await assert('Bypass phone number 9366128220 is exempt from rate limits and lockout', async () => {
    const { sendOtpRateLimiter, verifyOtpRateLimiter } = await import('../shared/middlewares/rateLimitMiddleware');

    // Multiple rapid requests on bypass phone pass without cooldown or limit
    for (let i = 0; i < 5; i++) {
      const req: any = { body: { phone: BYPASS_PHONE }, headers: {}, socket: { remoteAddress: '127.0.0.1' } };
      const res = createMockRes();
      let nextCalled = false;
      await sendOtpRateLimiter(req, res, () => { nextCalled = true; });
      if (!nextCalled) throw new Error(`Bypass phone request ${i + 1} blocked by sendOtpRateLimiter`);
    }

    // Multiple verify requests on bypass phone pass without lockout
    for (let i = 0; i < 7; i++) {
      const req: any = { body: { phone: BYPASS_PHONE, otp: '0000' }, headers: {}, socket: { remoteAddress: '127.0.0.1' } };
      const res = createMockRes();
      let nextCalled = false;
      await verifyOtpRateLimiter(req, res, () => { nextCalled = true; });
      if (!nextCalled) throw new Error(`Bypass phone verify request ${i + 1} blocked by verifyOtpRateLimiter`);
    }
  });

  // 18. Test Update Mother Details (Pregnant Woman)
  await assert('profileController.updateMotherDetails saves personal and medical profile for mother', async () => {
    const req: any = {
      user: { phone: testNewUserPhone },
      body: {
        name: 'Aaditi Sharma',
        dob: '14/08/1996',
        bloodGroup: 'B+',
        height: '5 ft 4 in',
        weight: '58 kg',
        occupation: 'Software Engineer',
        emergencyContact: '+91 98765 43210',
        medicalHistory: 'Mild Morning Sickness',
        allergies: 'None',
      },
    };
    const res = createMockRes();
    await profileController.updateMotherDetails(req, res, () => {});

    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (res.data.success !== true) throw new Error('Expected success true');
    if (res.data.data.bloodGroup !== 'B+') throw new Error(`Expected B+, got ${res.data.data.bloodGroup}`);
    if (res.data.data.height !== '5 ft 4 in') throw new Error(`Expected 5 ft 4 in, got ${res.data.data.height}`);
  });

  // 19. Test Update Father / Husband Details
  await assert('profileController.updateFatherDetails saves father contact, blood group & routine notes', async () => {
    const req: any = {
      user: { phone: testNewUserPhone },
      body: {
        name: 'Vipul Sharma',
        phone: '+91 98765 12345',
        email: 'vipul@astrobaby.in',
        dob: '22/11/1993',
        bloodGroup: 'O+',
        occupation: 'Architect',
        notes: 'Chants mantras and reads Garbh Samvad daily',
      },
    };
    const res = createMockRes();
    await profileController.updateFatherDetails(req, res, () => {});

    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (res.data.success !== true) throw new Error('Expected success true');
    if (res.data.data.name !== 'Vipul Sharma') throw new Error(`Expected Vipul Sharma, got ${res.data.data.name}`);
    if (res.data.data.bloodGroup !== 'O+') throw new Error(`Expected O+, got ${res.data.data.bloodGroup}`);
  });

  // 20. Test Update Doctor Details
  await assert('profileController.updateDoctorDetails saves consulting gynecologist & maternity clinic info', async () => {
    const req: any = {
      user: { phone: testNewUserPhone },
      body: {
        doctorName: 'Dr. Radhika Sen',
        hospitalName: 'Apollo Cradle Maternity Hospital',
        doctorPhone: '+91 98765 43210',
        clinicAddress: 'Bandra West, Mumbai',
        speciality: 'Obstetrics & Gynecology',
      },
    };
    const res = createMockRes();
    await profileController.updateDoctorDetails(req, res, () => {});

    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (res.data.success !== true) throw new Error('Expected success true');
    if (res.data.data.doctorName !== 'Dr. Radhika Sen') throw new Error(`Expected Dr. Radhika Sen, got ${res.data.data.doctorName}`);
  });

  // 21. Test Consolidated Family Details & Swagger Spec
  await assert('profileController.getFamilyDetails returns all 3 profiles & Swagger registers family endpoints', async () => {
    const req: any = { user: { phone: testNewUserPhone }, query: { phone: testNewUserPhone } };
    const res = createMockRes();
    await profileController.getFamilyDetails(req, res, () => {});

    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!res.data.data.mother || res.data.data.mother.name !== 'Aaditi Sharma') {
      throw new Error('Mother details missing in family response');
    }
    if (!res.data.data.father || res.data.data.father.name !== 'Vipul Sharma') {
      throw new Error('Father details missing in family response');
    }
    if (!res.data.data.doctor || res.data.data.doctor.doctorName !== 'Dr. Radhika Sen') {
      throw new Error('Doctor details missing in family response');
    }

    const { swaggerSpec } = await import('../shared/config/swagger');
    if (!swaggerSpec.paths['/api/v1/profile/family']?.get) throw new Error('Missing /api/v1/profile/family in Swagger');
    if (!swaggerSpec.paths['/api/v1/profile/mother']?.put) throw new Error('Missing /api/v1/profile/mother in Swagger');
    if (!swaggerSpec.paths['/api/v1/profile/father']?.put) throw new Error('Missing /api/v1/profile/father in Swagger');
    if (!swaggerSpec.paths['/api/v1/profile/doctor']?.put) throw new Error('Missing /api/v1/profile/doctor in Swagger');
  });

  // 22. Test 3-Tier RBAC: Role assignment in verifyOtp for normal user and super_admin
  await assert('authController.verifyOtp issues role=user for normal users and role=super_admin for SUPER_ADMIN_PHONE', async () => {
    // Normal user
    const normalPhone = `91111${Math.floor(10000 + Math.random() * 90000)}`;
    await authService.sendOtp(normalPhone);
    const otp = mockSmsProvider.getStoredOtp(normalPhone);
    const normalVerifyReq: any = { body: { phone: normalPhone, otp } };
    const normalVerifyRes = createMockRes();
    await authController.verifyOtp(normalVerifyReq, normalVerifyRes, () => {});

    if (normalVerifyRes.statusCode !== 200) throw new Error(`Expected 200, got ${normalVerifyRes.statusCode}`);
    if (normalVerifyRes.data.data.user.role !== 'user') {
      throw new Error(`Expected role 'user', got ${normalVerifyRes.data.data.user.role}`);
    }

    // Super Admin user
    const superAdminVerifyReq: any = { body: { phone: BYPASS_PHONE, otp: BYPASS_OTP } };
    const superAdminVerifyRes = createMockRes();
    await authController.verifyOtp(superAdminVerifyReq, superAdminVerifyRes, () => {});

    if (superAdminVerifyRes.statusCode !== 200) throw new Error(`Expected 200, got ${superAdminVerifyRes.statusCode}`);
    if (superAdminVerifyRes.data.data.user.role !== 'super_admin') {
      throw new Error(`Expected role 'super_admin', got ${superAdminVerifyRes.data.data.user.role}`);
    }
  });

  // 23. Test RBAC Middleware: Normal user blocked from admin routes (403 Forbidden)
  await assert('RBAC middleware requireAdmin blocks normal user (role=user) with 403 Forbidden', async () => {
    const { requireAdmin } = await import('../shared/middlewares/authMiddleware');
    const req: any = { user: { phone: testNewUserPhone, role: 'user' } };
    const res = createMockRes();
    let nextCalled = false;
    requireAdmin(req, res, () => { nextCalled = true; });

    if (nextCalled) throw new Error('Expected requireAdmin to block role=user');
    if (res.statusCode !== 403) throw new Error(`Expected 403 Forbidden, got ${res.statusCode}`);
    if (res.data.success !== false) throw new Error('Expected success false');
  });

  // 24. Test RBAC Middleware: Admin can access admin routes, but blocked from super_admin routes
  await assert('RBAC middleware allows admin for requireAdmin, but blocks admin from requireSuperAdmin', async () => {
    const { requireAdmin, requireSuperAdmin } = await import('../shared/middlewares/authMiddleware');
    const adminReq: any = { user: { phone: '9876543210', role: 'admin' } };
    const adminRes = createMockRes();
    let adminPassed = false;
    requireAdmin(adminReq, adminRes, () => { adminPassed = true; });
    if (!adminPassed) throw new Error('Expected requireAdmin to allow role=admin');

    // Admin tries to access super_admin endpoint
    const superReq: any = { user: { phone: '9876543210', role: 'admin' } };
    const superRes = createMockRes();
    let superPassed = false;
    requireSuperAdmin(superReq, superRes, () => { superPassed = true; });
    if (superPassed) throw new Error('Expected requireSuperAdmin to block role=admin');
    if (superRes.statusCode !== 403) throw new Error(`Expected 403 Forbidden, got ${superRes.statusCode}`);
  });

  // 25. Test Super Admin assignRole: Promote user to admin and demote back to user
  await assert('adminService.assignRole promotes user to admin, validates input, and protects root super_admin', async () => {
    const { adminService } = await import('../modules/admin/admin.service');
    const { adminController } = await import('../modules/admin/admin.controller');

    // 1. Promote test user to admin
    const promoteReq: any = { body: { phone: testNewUserPhone, role: 'admin' } };
    const promoteRes = createMockRes();
    await adminController.assignRole(promoteReq, promoteRes);
    if (promoteRes.statusCode !== 200) throw new Error(`Expected 200, got ${promoteRes.statusCode}`);
    if (promoteRes.data.data.role !== 'admin') throw new Error(`Expected role admin, got ${promoteRes.data.data.role}`);

    // 2. Reject invalid role
    const invalidRoleRes = await adminService.assignRole(testNewUserPhone, 'moderator' as any);
    if (invalidRoleRes.status !== 400) throw new Error(`Expected 400 for invalid role, got ${invalidRoleRes.status}`);

    // 3. Reject non-existent user phone
    const notFoundRes = await adminService.assignRole('9000000000', 'admin');
    if (notFoundRes.status !== 404) throw new Error(`Expected 404 for unknown user, got ${notFoundRes.status}`);

    // 4. Prevent demoting root SUPER_ADMIN_PHONE
    const demoteRootRes = await adminService.assignRole(BYPASS_PHONE, 'user');
    if (demoteRootRes.status !== 403) throw new Error(`Expected 403 when trying to demote root super admin, got ${demoteRootRes.status}`);

    // 5. Demote test user back to user
    const demoteRes = await adminService.assignRole(testNewUserPhone, 'user');
    if (demoteRes.status !== 200) throw new Error(`Expected 200, got ${demoteRes.status}`);
    if (demoteRes.data.role !== 'user') throw new Error(`Expected role user, got ${demoteRes.data.role}`);
  });

  // 26. Test Swagger RBAC Endpoints Documentation
  await assert('Swagger Spec (/api-docs) registers 3-tier RBAC admin routes and AssignRoleRequest', async () => {
    const { swaggerSpec } = await import('../shared/config/swagger');
    if (!swaggerSpec.components.schemas['AssignRoleRequest']) {
      throw new Error('AssignRoleRequest schema missing in Swagger Spec');
    }
    if (!swaggerSpec.paths['/api/v1/admin/roles/assign']?.post) {
      throw new Error('Missing /api/v1/admin/roles/assign in Swagger Spec');
    }
    if (!swaggerSpec.paths['/api/v1/admin/stats']?.get) {
      throw new Error('Missing /api/v1/admin/stats in Swagger Spec');
    }
    if (!swaggerSpec.paths['/api/v1/admin/users']?.get) {
      throw new Error('Missing /api/v1/admin/users in Swagger Spec');
    }
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

