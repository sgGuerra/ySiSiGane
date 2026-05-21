import { HttpClient } from '@/src/infrastructure/http/httpClient';
import type { Ticket, PaginatedResponse, ApiSuccess } from '@/src/domain/entities';
import { GetTicketsQuery } from './TicketService';

export interface AdminGetTicketsQuery extends GetTicketsQuery {
  userId?: string;
}

export interface AdminStats {
  totalTickets: number;
  totalWon: number;
  totalLost: number;
  totalPending: number;
  totalRevenue: number;
  activeUsers: number;
}

export class AdminService {
  static async getAllTickets(query?: AdminGetTicketsQuery): Promise<PaginatedResponse<Ticket>> {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== '') params.append(key, String(value));
      });
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await HttpClient.get<PaginatedResponse<Ticket>>(`/admin/tickets${queryString}`);
    return response;
  }

  private static async getAllTicketsForFallback(): Promise<Ticket[]> {
    const pageSize = 100;
    let page = 1;
    let totalPages = 1;
    const allTickets: Ticket[] = [];

    do {
      const response = await this.getAllTickets({ page, pageSize });
      allTickets.push(...response.data);
      totalPages = response.meta.totalPages || Math.ceil(response.meta.total / pageSize) || 1;
      page += 1;
    } while (page <= totalPages);

    return allTickets;
  }

  static async getStats(): Promise<AdminStats> {
    try {
      const response = await HttpClient.get<ApiSuccess<AdminStats>>('/admin/stats');
      return response.data;
    } catch {
      const allTickets = await this.getAllTicketsForFallback();
      const activeUsers = new Set(allTickets.map(t => t.owner?.id).filter((id): id is string => Boolean(id))).size;
      const totalRevenue = allTickets.reduce((sum, ticket) => sum + (ticket.amount || 0), 0);

      return {
        totalTickets: allTickets.length,
        totalWon: allTickets.filter(t => t.status === 'Ganado').length,
        totalLost: allTickets.filter(t => t.status === 'Perdido').length,
        totalPending: allTickets.filter(t => t.status === 'Pendiente').length,
        totalRevenue,
        activeUsers,
      };
    }
  }

  static async getRecentActivity(limit = 8): Promise<Ticket[]> {
    try {
      const response = await HttpClient.get<ApiSuccess<Ticket[]>>(`/admin/recent-activity?limit=${limit}`);
      return response.data;
    } catch {
      const allTickets = await this.getAllTicketsForFallback();
      return allTickets
        .sort((a, b) => {
          const aDate = new Date(a.updatedAt || a.createdAt || a.gameDate).getTime();
          const bDate = new Date(b.updatedAt || b.createdAt || b.gameDate).getTime();
          return bDate - aDate;
        })
        .slice(0, limit);
    }
  }
}
