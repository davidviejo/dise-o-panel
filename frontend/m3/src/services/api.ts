import { resolveApiUrl } from './apiUrlHelper';

interface AuthResponse {
  token: string;
  role: string;
  scope?: string;
  error?: string;
}

const API_URL = resolveApiUrl();
const DEFAULT_TIMEOUT_MS = 12000;

const fetchJson = async <T>(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(input, { ...init, signal: controller.signal });
    const data = await res.json();
    if (!res.ok) {
      throw new Error((data && data.error) || 'Request failed');
    }
    return data as T;
  } finally {
    window.clearTimeout(timeoutId);
  }
};

export const api = {
  getHeaders: () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = sessionStorage.getItem('portal_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  authClientsArea: async (password: string): Promise<AuthResponse> => {
    const data = await fetchJson<AuthResponse>(`${API_URL}/api/auth/clients-area`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (data.token) {
      sessionStorage.setItem('portal_token', data.token);
      sessionStorage.setItem('portal_role', data.role);
    }
    return data;
  },

  authProject: async (slug: string, password: string): Promise<AuthResponse> => {
    const data = await fetchJson<AuthResponse>(`${API_URL}/api/auth/project/${slug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (data.token) {
      sessionStorage.setItem('portal_token', data.token);
      sessionStorage.setItem('portal_role', data.role);
      sessionStorage.setItem('portal_scope', data.scope || '');
    }
    return data;
  },

  authOperator: async (password: string): Promise<AuthResponse> => {
    const data = await fetchJson<AuthResponse>(`${API_URL}/api/auth/operator`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (data.token) {
      sessionStorage.setItem('portal_token', data.token);
      sessionStorage.setItem('portal_role', data.role);
    }
    return data;
  },

  logout: () => {
    sessionStorage.removeItem('portal_token');
    sessionStorage.removeItem('portal_role');
    sessionStorage.removeItem('portal_scope');
    window.location.href = '/';
  },

  getClients: async () => fetchJson(`${API_URL}/api/clients`, { headers: api.getHeaders() }),

  getPublicClients: async () =>
    fetchJson(`${API_URL}/api/public/clients`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }),

  getProjectOverview: async (slug: string) =>
    fetchJson(`${API_URL}/api/${slug}/overview`, { headers: api.getHeaders() }),

  runOperatorTool: async (tool: string) =>
    fetchJson(`${API_URL}/api/tools/run/${tool}`, {
      method: 'POST',
      headers: api.getHeaders(),
    }),
};
