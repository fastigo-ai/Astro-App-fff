import { Request, Response } from 'express';
import { ISupportTicket } from '../../shared/db/dbStore';
import { supportService } from './support.service';

export const supportController = {
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

      const saved = await supportService.createTicket({
        userId,
        phone: effectivePhone,
        userName,
        category,
        subject: effectiveSubject,
        priority,
        messageText,
      });

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

  getUserTickets: async (req: Request, res: Response) => {
    try {
      const { userPhone, phone, userId } = req.query;
      const targetPhone = (userPhone || phone || '').toString().trim();
      const targetUserId = (userId || '').toString().trim();

      const userTickets = supportService.getUserTickets(targetPhone, targetUserId);
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

  getTicketById: async (req: Request, res: Response) => {
    try {
      const ticketId = req.params.id as string;
      const ticket = supportService.getTicketById(ticketId);

      if (!ticket) {
        return res.status(404).json({
          success: false,
          error: `Support ticket with ID '${ticketId}' not found`,
        });
      }

      return res.status(200).json({ success: true, data: ticket });
    } catch (error: any) {
      console.error('[SupportController] getTicketById error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to retrieve ticket details',
      });
    }
  },

  addUserReply: async (req: Request, res: Response) => {
    try {
      const ticketId = req.params.id as string;
      const { text, message, senderName } = req.body;
      const replyText = (text || message || '').toString().trim();

      if (!replyText) {
        return res.status(400).json({ success: false, error: 'Reply text is required' });
      }

      const updated = await supportService.addUserReply(ticketId, replyText, senderName);
      if (!updated) {
        return res.status(404).json({
          success: false,
          error: `Support ticket with ID '${ticketId}' not found`,
        });
      }

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

  adminListTickets: async (req: Request, res: Response) => {
    try {
      const { status, category } = req.query;
      const filtered = supportService.adminListTickets(
        status as string | undefined,
        category as string | undefined
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

      const updated = await supportService.adminReplyTicket(
        ticketId,
        replyText,
        adminName || senderName || assignedAdmin
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          error: `Support ticket with ID '${ticketId}' not found`,
        });
      }

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

      const updated = await supportService.adminUpdateStatus(ticketId, status, assignedAdmin);
      if (!updated) {
        return res.status(404).json({
          success: false,
          error: `Support ticket with ID '${ticketId}' not found`,
        });
      }

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

