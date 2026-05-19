import { HttpClient } from '@/src/infrastructure/http/httpClient';
import type { Ticket, PaginatedResponse } from '@/src/domain/entities';
import { GetTicketsQuery } from './TicketService';

export interface AdminGetTicketsQuery extends GetTicketsQuery {
  userId?: string;
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
}
