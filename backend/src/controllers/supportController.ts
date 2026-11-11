import { Request, Response } from 'express';
import {
  SupportTicketsCollection,
  ISupportTicket,
  ISupportTicketMessage,
} from '../services/dbStore';

export const supportController = {
  // POST /api/v1/support/tickets
  // Create new support ticket from user with initial message
  createTicket: async (req: Request, res: Response) => {
    try {
      const {
        userId,
        userPhone,
        phone,
        userName,
        category = 'general',
        subject,
        priority = 'normal',
        message,
        initialMessage,
      } = req.body;

      const effectivePhone = (userPhone || phone || '').toString().trim();
      const messageText = (message || initialMessage || '').toString().trim();
      const effectiveSubject = (subject || '').toString().trim();

      if (!effectivePhone) {
        return res.status(400).json({
          success: false,
          error: 'User phone number is required to create a ticket',
        });
      }

      if (!effectiveSubject) {
        return res.status(400).json({
          success: false,
          error: 'Ticket subject is required',
        });
      }

      if (!messageText) {
        return res.status(400).json({
          success: false,
          error: 'Initial message text is required',
        });
      }

      const allowedCategories: Array<ISupportTicket['category']> = [
        'payment',
        'medical',
        'classes',
        'general',
      ];
      const validCategory: ISupportTicket['category'] = allowedCategories.includes(category)
        ? category
        : 'general';

      const allowedPriorities: Array<ISupportTicket['priority']> = ['normal', 'high', 'urgent'];
      const validPriority: ISupportTicket['priority'] = allowedPriorities.includes(priority)
        ? priority
        : 'normal';

      const now = new Date().toISOString();
      const senderDisplayName = (userName || 'Astro Parent').toString().trim();

      const firstMsg: ISupportTicketMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        sender: 'user',
        senderName: senderDisplayName,
        text: messageText,
        createdAt: now,
      };

      const ticketId = `ticket_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newTicket: ISupportTicket = {
        _id: ticketId,
        userId: (userId || `usr_${effectivePhone}`).toString().trim(),
        userPhone: effectivePhone,
        userName: senderDisplayName,
        category: validCategory,
        subject: effectiveSubject,
        status: 'open',
        priority: validPriority,
        messages: [firstMsg],
        assignedAdmin: null,
        createdAt: now,
        updatedAt: now,
      };

      const saved = await SupportTicketsCollection.insert(newTicket);

      return res.status(201).json({
        success: true,
        message: 'Support ticket created successfully',
        data: saved,
      });
    } catch (error: any) {
      console.error('[SupportController] createTicket error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Internal server error creating support ticket',
      });
    }
  },

  // GET /api/v1/support/tickets
  // Get user's tickets (query by user phone or user ID)
  getUserTickets: async (req: Request, res: Response) => {
    try {
      const { userPhone, phone, userId } = req.query;
      const targetPhone = (userPhone || phone || '').toString().trim();
      const targetUserId = (userId || '').toString().trim();

      const allTickets = SupportTicketsCollection.read();

      let userTickets = allTickets;
      if (targetPhone || targetUserId) {
        userTickets = allTickets.filter(t => {
          const matchPhone = targetPhone ? t.userPhone === targetPhone : false;
          const matchUser = targetUserId ? t.userId === targetUserId : false;
          return matchPhone || matchUser;
        });
      }

      // Sort newest updated first
      userTickets.sort(
        (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
      );

      return res.status(200).json({
        success: true,
        count: userTickets.length,
        data: userTickets,
      });
    } catch (error: any) {
      console.error('[SupportController] getUserTickets error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to retrieve tickets',
      });
    }
  },

  // GET /api/v1/support/tickets/:id
  // Get ticket details with all messages
  getTicketById: async (req: Request, res: Response) => {
    try {
      const ticketId = req.params.id as string;
      const tickets = SupportTicketsCollection.read();
      const ticket = tickets.find(t => t._id === ticketId || (t as any).id === ticketId);

      if (!ticket) {
        return res.status(404).json({
          success: false,
          error: `Support ticket with ID '${ticketId}' not found`,
        });
      }

      return res.status(200).json({
        success: true,
        data: ticket,
      });
    } catch (error: any) {
      console.error('[SupportController] getTicketById error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to retrieve ticket details',
      });
    }
  },

  // POST /api/v1/support/tickets/:id/reply
  // Add a message from user
  addUserReply: async (req: Request, res: Response) => {
    try {
      const ticketId = req.params.id as string;
      const { text, message, senderName } = req.body;
      const replyText = (text || message || '').toString().trim();

      if (!replyText) {
        return res.status(400).json({
          success: false,
          error: 'Reply text is required',
        });
      }

      const tickets = SupportTicketsCollection.read();
      const ticket = tickets.find(t => t._id === ticketId || (t as any).id === ticketId);

      if (!ticket) {
        return res.status(404).json({
          success: false,
          error: `Support ticket with ID '${ticketId}' not found`,
        });
      }

      const now = new Date().toISOString();
      const userReply: ISupportTicketMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        sender: 'user',
        senderName: (senderName || ticket.userName || 'Astro Parent').toString().trim(),
        text: replyText,
        createdAt: now,
      };

      const updatedMessages = [...(ticket.messages || []), userReply];
      // If the ticket was previously resolved, customer reply reopens it
      const nextStatus = ticket.status === 'resolved' ? 'open' : ticket.status;

      const updated = await SupportTicketsCollection.update(ticket._id, {
        messages: updatedMessages,
        status: nextStatus,
        updatedAt: now,
      });

      return res.status(200).json({
        success: true,
        message: 'Reply sent successfully',
        data: updated,
      });
    } catch (error: any) {
      console.error('[SupportController] addUserReply error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to submit user reply',
      });
    }
  },

  // GET /api/v1/admin/support/tickets
  // List all tickets with optional status & category filter
  adminListTickets: async (req: Request, res: Response) => {
    try {
      const { status, category } = req.query;
      const tickets = SupportTicketsCollection.read();

      let filtered = tickets;
      if (status) {
        filtered = filtered.filter(t => t.status === status);
      }
      if (category) {
        filtered = filtered.filter(t => t.category === category);
      }

      filtered.sort(
        (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
      );

      return res.status(200).json({
        success: true,
        count: filtered.length,
        data: filtered,
      });
    } catch (error: any) {
      console.error('[SupportController] adminListTickets error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  // POST /api/v1/admin/support/tickets/:id/reply
  // Role-based admin reply, sets status to in_progress
  adminReplyTicket: async (req: Request, res: Response) => {
    try {
      const ticketId = req.params.id as string;
      const { text, message, adminName, senderName, assignedAdmin } = req.body;
      const replyText = (text || message || '').toString().trim();

      if (!replyText) {
        return res.status(400).json({
          success: false,
          error: 'Admin reply text is required',
        });
      }

      const tickets = SupportTicketsCollection.read();
      const ticket = tickets.find(t => t._id === ticketId || (t as any).id === ticketId);

      if (!ticket) {
        return res.status(404).json({
          success: false,
          error: `Support ticket with ID '${ticketId}' not found`,
        });
      }

      const now = new Date().toISOString();
      const effectiveAdminName = (
        adminName ||
        senderName ||
        assignedAdmin ||
        ticket.assignedAdmin ||
        'AstroBaby Specialist'
      ).toString().trim();

      const adminMessage: ISupportTicketMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        sender: 'admin',
        senderName: effectiveAdminName,
        text: replyText,
        createdAt: now,
      };

      const updated = await SupportTicketsCollection.update(ticket._id, {
        messages: [...(ticket.messages || []), adminMessage],
        status: 'in_progress',
        assignedAdmin: effectiveAdminName,
        updatedAt: now,
      });

      return res.status(200).json({
        success: true,
        message: 'Admin reply posted successfully',
        data: updated,
      });
    } catch (error: any) {
      console.error('[SupportController] adminReplyTicket error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  // PUT /api/v1/admin/support/tickets/:id/status
  // Admin updates status
  adminUpdateStatus: async (req: Request, res: Response) => {
    try {
      const ticketId = req.params.id as string;
      const { status, assignedAdmin } = req.body;

      const validStatuses: Array<ISupportTicket['status']> = ['open', 'in_progress', 'resolved'];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: `Invalid status '${status}'. Must be one of: open, in_progress, resolved`,
        });
      }

      const tickets = SupportTicketsCollection.read();
      const ticket = tickets.find(t => t._id === ticketId || (t as any).id === ticketId);

      if (!ticket) {
        return res.status(404).json({
          success: false,
          error: `Support ticket with ID '${ticketId}' not found`,
        });
      }

      const now = new Date().toISOString();
      const updatePayload: Partial<ISupportTicket> = {
        status,
        updatedAt: now,
      };

      if (assignedAdmin !== undefined) {
        updatePayload.assignedAdmin = assignedAdmin ? String(assignedAdmin).trim() : null;
      }

      const updated = await SupportTicketsCollection.update(ticket._id, updatePayload);

      return res.status(200).json({
        success: true,
        message: `Support ticket status updated to '${status}'`,
        data: updated,
      });
    } catch (error: any) {
      console.error('[SupportController] adminUpdateStatus error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  },
};
