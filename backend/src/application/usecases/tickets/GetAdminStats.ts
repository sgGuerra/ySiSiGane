import { AdminStats, TicketRepository } from '../../../domain/repositories/TicketRepository';
import { UserRepository } from '../../../domain/repositories/UserRepository';

export class GetAdminStats {
  constructor(
    private ticketRepository: TicketRepository,
    private userRepository: UserRepository
  ) {}

  async execute(): Promise<AdminStats> {
    const [ticketStats, activeUsers] = await Promise.all([
      this.ticketRepository.getAdminStats(),
      this.userRepository.countAll(),
    ]);

    return {
      ...ticketStats,
      activeUsers,
    };
  }
}
