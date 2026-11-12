import { ISupportTicket, SupportTicketsCollection } from '../../shared/db/dbStore';
import { BaseRepository } from '../../shared/repositories/baseRepository';

export class SupportRepository extends BaseRepository<ISupportTicket> {
  constructor() {
    super(SupportTicketsCollection);
  }

  findTicketById(ticketId: string): ISupportTicket | null {
    return (
      this.findAll().find((t) => t._id === ticketId || (t as any).id === ticketId) || null
    );
  }
}

export const supportRepository = new SupportRepository();

