import { TicketRepository, TicketWithOwner } from '../../../domain/repositories/TicketRepository';

export class GetRecentActivity {
  constructor(private ticketRepository: TicketRepository) {}

  async execute(limit = 8): Promise<TicketWithOwner[]> {
    return this.ticketRepository.getRecentActivity(limit);
  }
}
