import { HttpClient } from '@/src/infrastructure/http/httpClient';
import type { Ticket, PaginatedResponse, ApiSuccess } from '@/src/domain/entities';

export interface GetTicketsQuery {
  status?: string;
  gameType?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export class TicketService {
  static async getTickets(query?: GetTicketsQuery): Promise<PaginatedResponse<Ticket>> {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await HttpClient.get<PaginatedResponse<Ticket>>(`/tickets${queryString}`);
    return response;
  }

  static async getTicketById(id: string): Promise<Ticket> {
    const response = await HttpClient.get<ApiSuccess<Ticket>>(`/tickets/${id}`);
    return response.data;
  }

  static async createTicket(data: Partial<Ticket>): Promise<Ticket> {
    const response = await HttpClient.post<ApiSuccess<Ticket>>('/tickets', data);
    return response.data;
  }

  static async updateTicket(id: string, data: Partial<Ticket>): Promise<Ticket> {
    const response = await HttpClient.put<ApiSuccess<Ticket>>(`/tickets/${id}`, data);
    return response.data;
  }

  static async deleteTicket(id: string): Promise<void> {
    await HttpClient.delete(`/tickets/${id}`);
  }
}
