const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000").replace(/\/$/, "");

interface ApiErrorPayload {
  message?: string;
  error?: string;
}

async function request<TResponse>(path: string, init?: RequestInit): Promise<TResponse> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    let errorMessage = `Erro ${response.status}`;
    try {
      const data: ApiErrorPayload = await response.json();
      if (data?.message) {
        errorMessage = data.message;
      } else if (data?.error) {
        errorMessage = data.error;
      }
    } catch {
      // Ignora se não conseguir interpretar o corpo como JSON
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  const json = (await response.json()) as TResponse;
  return json;
}

export async function loginRequest(email: string, senha: string) {
  return request<{ token: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  });
}

export interface RegisterPayload {
  nomeCompleto: string;
  email: string;
  senha: string;
  telefone?: string;
}

export async function registerRequest(payload: RegisterPayload) {
  return request<{ id: string; nomeCompleto: string; email: string }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export interface ProfileResponse {
  id: string;
  nomeCompleto: string;
  email: string;
  telefone?: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export async function getProfileRequest(token: string) {
  return request<ProfileResponse>('/api/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export interface ServicoResponse {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  duracao: number;
}

export function listServicosRequest() {
  return request<ServicoResponse[]>('/api/servicos', {
    method: 'GET',
  });
}

export interface AgendamentoResponse {
  id: string;
  data: string;
  status: string;
  clienteId: string;
  servicoId: string;
  createdAt: string;
  updatedAt: string;
  servico: ServicoResponse;
}

export interface CreateAgendamentoPayload {
  servicoId: string;
  data: string;
}

export function listAgendamentosRequest(token: string) {
  return request<AgendamentoResponse[]>('/api/agendamentos', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function createAgendamentoRequest(token: string, payload: CreateAgendamentoPayload) {
  return request<AgendamentoResponse>('/api/agendamentos', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}
