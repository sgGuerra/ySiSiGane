export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export type GameType = 'Lotería' | 'Rifa' | 'Sorteo' | 'Boleta' | 'Juego ocasional';
export type TicketStatus = 'Pendiente' | 'Ganado' | 'Perdido';

export interface Ticket {
  id: string;
  title: string;
  gameType: GameType;
  gameNumber?: string;
  gameDate: string;
  amount?: number;
  place?: string;
  status: TicketStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  owner?: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ApiSuccess<T> {
  data: T;
  meta?: any;
}
