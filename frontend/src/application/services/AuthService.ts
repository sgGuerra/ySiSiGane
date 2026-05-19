import { HttpClient } from '@/src/infrastructure/http/httpClient';
import type { User, ApiSuccess } from '@/src/domain/entities';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export class AuthService {
  static async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await HttpClient.post<ApiSuccess<AuthResponse>>('/auth/login', data);
    return response.data;
  }

  static async register(data: RegisterRequest): Promise<User> {
    const response = await HttpClient.post<ApiSuccess<User>>('/auth/register', data);
    return response.data;
  }
}
