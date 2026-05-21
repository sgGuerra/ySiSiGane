const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

const toHeaderObject = (input?: HeadersInit): Record<string, string> => {
  if (!input) {
    return {};
  }

  if (input instanceof Headers) {
    const result: Record<string, string> = {};
    input.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  if (Array.isArray(input)) {
    return Object.fromEntries(input);
  }

  return { ...input };
};

export class HttpClient {
  static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers = toHeaderObject(options.headers);
    headers['Content-Type'] = 'application/json';

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    let response: Response;

    try {
      response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });
    } catch {
      throw new Error('No se pudo conectar con el servidor. Verifica la API y tu conexión.');
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.error || response.statusText || 'Error en la petición';
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
      throw new Error(errorMessage);
    }

    return data as T;
  }

  static get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  static post<T>(endpoint: string, body: any) {
    return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) });
  }

  static put<T>(endpoint: string, body: any) {
    return this.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) });
  }

  static delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}
