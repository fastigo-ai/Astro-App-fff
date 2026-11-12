import { ISupportTicket, ISupportTicketMessage } from '../../shared/db/dbStore';
import { supportRepository } from './support.repository';

export const supportService = {
  async createTicket(params: {
    userId?: string;
    phone: string;
    userName?: string;
    category?: string;
    subject: string;
    priority?: string;
    messageText: string;
  }) {
    const allowedCategories: Array<ISupportTicket['category']> = [
      'payment',
      'medical',
      'classes',
      'general',
    ];
    const validCategory: ISupportTicket['category'] = allowedCategories.includes(
      params.category as any
    )
      ? (params.category as ISupportTicket['category'])
      : 'general';

    const allowedPriorities: Array<ISupportTicket['priority']> = ['normal', 'high', 'urgent'];
    const validPriority: ISupportTicket['priority'] = allowedPriorities.includes(
      params.priority as any
    )
      ? (params.priority as ISupportTicket['priority'])
      : 'normal';

    const now = new Date().toISOString();
    const senderDisplayName = (params.userName || 'Astro Parent').trim();

    const firstMsg: ISupportTicketMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sender: 'user',
      senderName: senderDisplayName,
      text: params.messageText,
      createdAt: now,
    };

    const ticketId = `ticket_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newTicket: ISupportTicket = {
      _id: ticketId,
      userId: (params.userId || `usr_${params.phone}`).trim(),
      userPhone: params.phone,
      userName: senderDisplayName,
      category: validCategory,
      subject: params.subject,
      status: 'open',
      priority: validPriority,
      messages: [firstMsg],
      assignedAdmin: null,
      createdAt: now,
      updatedAt: now,
    };

    return supportRepository.create(newTicket);
  },

  getUserTickets(targetPhone: string, targetUserId: string) {
    let userTickets = supportRepository.findAll();
    if (targetPhone || targetUserId) {
      userTickets = userTickets.filter((t) => {
        const matchPhone = targetPhone ? t.userPhone === targetPhone : false;
        const matchUser = targetUserId ? t.userId === targetUserId : false;
        return matchPhone || matchUser;
      });
    }

    return [...userTickets].sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt).getTime() -
        new Date(a.updatedAt || a.createdAt).getTime()
    );
  },

  getTicketById(ticketId: string) {
    return supportRepository.findTicketById(ticketId);
  },

  async addUserReply(ticketId: string, replyText: string, senderName?: string) {
    const ticket = supportRepository.findTicketById(ticketId);
    if (!ticket) return null;

    const now = new Date().toISOString();
    const userReply: ISupportTicketMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sender: 'user',
      senderName: (senderName || ticket.userName || 'Astro Parent').trim(),
      text: replyText,
      createdAt: now,
    };

    const updatedMessages = [...(ticket.messages || []), userReply];
    const nextStatus = ticket.status === 'resolved' ? 'open' : ticket.status;

    return supportRepository.updateById(ticket._id, {
      messages: updatedMessages,
      status: nextStatus,
      updatedAt: now,
    });
  },

  adminListTickets(status?: string, category?: string) {
    let filtered = supportRepository.findAll();
    if (status) filtered = filtered.filter((t) => t.status === status);
    if (category) filtered = filtered.filter((t) => t.category === category);

    return [...filtered].sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt).getTime() -
        new Date(a.updatedAt || a.createdAt).getTime()
    );
  },

  async adminReplyTicket(
    ticketId: string,
    replyText: string,
    effectiveAdminNameInput?: string
  ) {
    const ticket = supportRepository.findTicketById(ticketId);
    if (!ticket) return null;

    const now = new Date().toISOString();
    const effectiveAdminName = (
      effectiveAdminNameInput ||
      ticket.assignedAdmin ||
      'AstroBaby Specialist'
    ).trim();

    const adminMessage: ISupportTicketMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sender: 'admin',
      senderName: effectiveAdminName,
      text: replyText,
      createdAt: now,
    };

    return supportRepository.updateById(ticket._id, {
      messages: [...(ticket.messages || []), adminMessage],
      status: 'in_progress',
      assignedAdmin: effectiveAdminName,
      updatedAt: now,
    });
  },

  async adminUpdateStatus(
    ticketId: string,
    status: ISupportTicket['status'],
    assignedAdmin?: string | null
  ) {
    const ticket = supportRepository.findTicketById(ticketId);
    if (!ticket) return null;

    const updatePayload: Partial<ISupportTicket> = {
      status,
      updatedAt: new Date().toISOString(),
    };

    if (assignedAdmin !== undefined) {
      updatePayload.assignedAdmin = assignedAdmin ? String(assignedAdmin).trim() : null;
    }

    return supportRepository.updateById(ticket._id, updatePayload);
  },
};

