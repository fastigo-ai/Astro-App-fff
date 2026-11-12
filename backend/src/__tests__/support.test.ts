import { Request, Response } from 'express';
import { supportController } from '../modules/support/support.controller';
import { SupportTicketsCollection } from '../shared/db/dbStore';

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

async function runSupportTests() {
  console.log('🧪 Starting Role-Based Customer Support & Live Chat Unit / Integration Tests...\n');

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

  let createdTicketId = '';
  const testPhone = `98765${Date.now().toString().slice(-5)}`;
  const testUserId = `usr_test_${Date.now()}`;

  // 1. POST /api/v1/support/tickets - Validation failures
  await assert('supportController.createTicket fails when phone number is missing', async () => {
    const req: any = {
      body: {
        subject: 'No phone provided',
        message: 'Hello team',
      },
    };
    const res = createMockRes();
    await supportController.createTicket(req, res);

    if (res.statusCode !== 400) throw new Error(`Expected 400, got ${res.statusCode}`);
    if (res.data.success !== false) throw new Error('Expected success false');
  });

  await assert('supportController.createTicket fails when subject is missing', async () => {
    const req: any = {
      body: {
        userPhone: testPhone,
        message: 'Hello team with no subject',
      },
    };
    const res = createMockRes();
    await supportController.createTicket(req, res);

    if (res.statusCode !== 400) throw new Error(`Expected 400, got ${res.statusCode}`);
    if (res.data.success !== false) throw new Error('Expected success false');
  });

  await assert('supportController.createTicket fails when initial message is missing', async () => {
    const req: any = {
      body: {
        userPhone: testPhone,
        subject: 'Payment Issue',
      },
    };
    const res = createMockRes();
    await supportController.createTicket(req, res);

    if (res.statusCode !== 400) throw new Error(`Expected 400, got ${res.statusCode}`);
    if (res.data.success !== false) throw new Error('Expected success false');
  });

  // 2. POST /api/v1/support/tickets - Valid ticket creation
  await assert('supportController.createTicket creates a valid support ticket with initial message', async () => {
    const req: any = {
      body: {
        userId: testUserId,
        userPhone: testPhone,
        userName: 'Priya Sharma',
        category: 'payment',
        subject: 'Double charge on Utkarsh Garbh Sanskar scheme',
        priority: 'high',
        message: 'Hi Support, I noticed two debit notifications for my plan checkout. Please verify.',
      },
    };
    const res = createMockRes();
    await supportController.createTicket(req, res);

    if (res.statusCode !== 201) throw new Error(`Expected 201, got ${res.statusCode}`);
    if (!res.data.success) throw new Error('Expected success true');
    if (!res.data.data || !res.data.data._id) throw new Error('Ticket _id missing');
    if (res.data.data.status !== 'open') throw new Error(`Expected status open, got ${res.data.data.status}`);
    if (res.data.data.category !== 'payment') throw new Error(`Expected category payment, got ${res.data.data.category}`);
    if (res.data.data.priority !== 'high') throw new Error(`Expected priority high, got ${res.data.data.priority}`);
    if (!Array.isArray(res.data.data.messages) || res.data.data.messages.length !== 1) {
      throw new Error(`Expected 1 message, got ${res.data.data.messages?.length}`);
    }

    const firstMsg = res.data.data.messages[0];
    if (firstMsg.sender !== 'user') throw new Error(`Expected sender user, got ${firstMsg.sender}`);
    if (firstMsg.senderName !== 'Priya Sharma') throw new Error(`Expected senderName Priya Sharma, got ${firstMsg.senderName}`);
    if (!firstMsg.text.includes('two debit notifications')) throw new Error('Message text mismatch');

    createdTicketId = res.data.data._id;
  });

  // 3. GET /api/v1/support/tickets - Query by user phone / user ID
  await assert('supportController.getUserTickets filters tickets by phone number', async () => {
    const req: any = { query: { phone: testPhone } };
    const res = createMockRes();
    await supportController.getUserTickets(req, res);

    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!res.data.success) throw new Error('Expected success true');
    if (!Array.isArray(res.data.data) || res.data.data.length === 0) throw new Error('Expected tickets for phone');
    const found = res.data.data.find((t: any) => t._id === createdTicketId);
    if (!found) throw new Error(`Created ticket ${createdTicketId} not found in phone query`);
  });

  await assert('supportController.getUserTickets filters tickets by userId', async () => {
    const req: any = { query: { userId: testUserId } };
    const res = createMockRes();
    await supportController.getUserTickets(req, res);

    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!res.data.success) throw new Error('Expected success true');
    const found = res.data.data.find((t: any) => t._id === createdTicketId);
    if (!found) throw new Error(`Created ticket ${createdTicketId} not found in userId query`);
  });

  // 4. GET /api/v1/support/tickets/:id - Get ticket details
  await assert('supportController.getTicketById returns full ticket details', async () => {
    const req: any = { params: { id: createdTicketId } };
    const res = createMockRes();
    await supportController.getTicketById(req, res);

    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!res.data.success || !res.data.data) throw new Error('Failed to retrieve ticket');
    if (res.data.data._id !== createdTicketId) throw new Error('Ticket id mismatch');
    if (res.data.data.subject !== 'Double charge on Utkarsh Garbh Sanskar scheme') throw new Error('Subject mismatch');
  });

  await assert('supportController.getTicketById returns 404 for non-existent ticket', async () => {
    const req: any = { params: { id: 'ticket_non_existent_999' } };
    const res = createMockRes();
    await supportController.getTicketById(req, res);

    if (res.statusCode !== 404) throw new Error(`Expected 404, got ${res.statusCode}`);
  });

  // 5. POST /api/v1/support/tickets/:id/reply - Add message from user
  await assert('supportController.addUserReply appends a customer follow-up message', async () => {
    const req: any = {
      params: { id: createdTicketId },
      body: {
        text: 'Here is my transaction reference ID: TXN_RAZORPAY_99182.',
        senderName: 'Priya Sharma',
      },
    };
    const res = createMockRes();
    await supportController.addUserReply(req, res);

    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!res.data.success) throw new Error('Expected success true');
    if (res.data.data.messages.length !== 2) throw new Error(`Expected 2 messages, got ${res.data.data.messages.length}`);

    const secondMsg = res.data.data.messages[1];
    if (secondMsg.sender !== 'user') throw new Error(`Expected sender user, got ${secondMsg.sender}`);
    if (!secondMsg.text.includes('TXN_RAZORPAY_99182')) throw new Error('Reply text missing');
  });

  await assert('supportController.addUserReply rejects empty text', async () => {
    const req: any = {
      params: { id: createdTicketId },
      body: { text: '' },
    };
    const res = createMockRes();
    await supportController.addUserReply(req, res);

    if (res.statusCode !== 400) throw new Error(`Expected 400, got ${res.statusCode}`);
  });

  // 6. GET /api/v1/admin/support/tickets - Admin list tickets with filters
  await assert('supportController.adminListTickets lists tickets with optional filters', async () => {
    const reqAll: any = { query: {} };
    const resAll = createMockRes();
    await supportController.adminListTickets(reqAll, resAll);

    if (resAll.statusCode !== 200) throw new Error(`Expected 200, got ${resAll.statusCode}`);
    if (!resAll.data.success || !Array.isArray(resAll.data.data)) throw new Error('Expected array of tickets');

    // Filter by category
    const reqCat: any = { query: { category: 'payment' } };
    const resCat = createMockRes();
    await supportController.adminListTickets(reqCat, resCat);
    if (!resCat.data.success) throw new Error('Expected success true on category filter');
    const allPayment = resCat.data.data.every((t: any) => t.category === 'payment');
    if (!allPayment) throw new Error('Category filter returned non-payment ticket');

    // Filter by status
    const reqStat: any = { query: { status: 'open' } };
    const resStat = createMockRes();
    await supportController.adminListTickets(reqStat, resStat);
    if (!resStat.data.success) throw new Error('Expected success true on status filter');
    const allOpen = resStat.data.data.every((t: any) => t.status === 'open');
    if (!allOpen) throw new Error('Status filter returned non-open ticket');
  });

  // 7. POST /api/v1/admin/support/tickets/:id/reply - Admin replies, sets status to in_progress
  await assert('supportController.adminReplyTicket sends admin message and updates status to in_progress', async () => {
    const req: any = {
      params: { id: createdTicketId },
      body: {
        text: 'Hello Priya, we checked the duplicate payment. The second charge has been reversed to your bank.',
        adminName: 'AstroBaby Billing Desk',
        assignedAdmin: 'AstroBaby Billing Desk',
      },
    };
    const res = createMockRes();
    await supportController.adminReplyTicket(req, res);

    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!res.data.success) throw new Error('Expected success true');
    if (res.data.data.status !== 'in_progress') {
      throw new Error(`Expected status to be updated to in_progress, got ${res.data.data.status}`);
    }

    const msgs = res.data.data.messages;
    if (msgs.length !== 3) throw new Error(`Expected 3 messages, got ${msgs.length}`);
    const adminMsg = msgs[msgs.length - 1];
    if (adminMsg.sender !== 'admin') throw new Error(`Expected sender admin, got ${adminMsg.sender}`);
    if (adminMsg.senderName !== 'AstroBaby Billing Desk') {
      throw new Error(`Expected admin senderName AstroBaby Billing Desk, got ${adminMsg.senderName}`);
    }
    if (res.data.data.assignedAdmin !== 'AstroBaby Billing Desk') {
      throw new Error(`Expected assignedAdmin AstroBaby Billing Desk, got ${res.data.data.assignedAdmin}`);
    }
  });

  // 8. PUT /api/v1/admin/support/tickets/:id/status - Admin updates status
  await assert('supportController.adminUpdateStatus updates ticket status to resolved', async () => {
    const req: any = {
      params: { id: createdTicketId },
      body: {
        status: 'resolved',
      },
    };
    const res = createMockRes();
    await supportController.adminUpdateStatus(req, res);

    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!res.data.success) throw new Error('Expected success true');
    if (res.data.data.status !== 'resolved') throw new Error(`Expected status resolved, got ${res.data.data.status}`);
  });

  await assert('supportController.adminUpdateStatus rejects invalid status value', async () => {
    const req: any = {
      params: { id: createdTicketId },
      body: {
        status: 'abandoned',
      },
    };
    const res = createMockRes();
    await supportController.adminUpdateStatus(req, res);

    if (res.statusCode !== 400) throw new Error(`Expected 400 for invalid status, got ${res.statusCode}`);
  });

  // 9. Reopening ticket when user sends another reply
  await assert('supportController.addUserReply reopens a resolved ticket to open', async () => {
    const req: any = {
      params: { id: createdTicketId },
      body: {
        text: 'Thank you team! The refund was credited back to my account.',
      },
    };
    const res = createMockRes();
    await supportController.addUserReply(req, res);

    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!res.data.success) throw new Error('Expected success true');
    if (res.data.data.status !== 'open') {
      throw new Error(`Expected ticket to reopen as open, got ${res.data.data.status}`);
    }
  });

  console.log(`\n========================================`);
  console.log(`🏁 Support System QA Tests Completed: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runSupportTests().catch((err) => {
  console.error('Fatal test execution failure:', err);
  process.exit(1);
});
