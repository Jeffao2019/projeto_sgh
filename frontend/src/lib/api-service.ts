import { API_CONFIG } from "./api-config";

// Tipos para as requisições
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    nome: string;
    role: string;
    especialidade?: string;
    crm?: string;
  };
}

export interface RegisterRequest {
  nome: string;
  email: string;
  telefone: string;
  password: string;
  confirmPassword: string;
  role: string;
  acceptTerms: boolean;
}

export interface ApiError {
  message: string | string[];
  statusCode: number;
}

// Classe para gerenciar as chamadas da API
class ApiService {
  private token: string | null = null;

  constructor() {
    // Carregar token do localStorage se existir
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("auth_token", token);
      } else {
        localStorage.removeItem("auth_token");
      }
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || "Erro na requisição");
      (error as any).response = {
        status: response.status,
        data: errorData,
      };
      throw error;
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  // Métodos de autenticação específicos
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.post<LoginResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials
    );
  }

  async register(userData: RegisterRequest): Promise<LoginResponse> {
    return this.post<LoginResponse>(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      userData
    );
  }

  async getProfile(): Promise<LoginResponse["user"]> {
    return this.get<LoginResponse["user"]>(API_CONFIG.ENDPOINTS.AUTH.PROFILE);
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    return this.put<void>(API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
  }

  // Métodos auxiliares para autenticação
  saveAuthData(data: LoginResponse): void {
    this.setToken(data.token);
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_user", JSON.stringify(data.user));
    }
  }

  getUser(): LoginResponse["user"] | null {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("auth_user");
      if (userData) {
        try {
          return JSON.parse(userData);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout(): void {
    this.setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_user");
    }
  }

  // Métodos para Pacientes
  async getPacientes() {
    return this.get<Paciente[]>(API_CONFIG.ENDPOINTS.PACIENTES.LIST);
  }

  async getPacienteById(id: string) {
    return this.get<Paciente>(API_CONFIG.ENDPOINTS.PACIENTES.BY_ID(id));
  }

  async createPaciente(data: CreatePacienteDTO) {
    return this.post(API_CONFIG.ENDPOINTS.PACIENTES.CREATE, data);
  }

  async updatePaciente(id: string, data: Partial<CreatePacienteDTO>) {
    return this.put<Paciente>(API_CONFIG.ENDPOINTS.PACIENTES.UPDATE(id), data);
  }

  async deletePaciente(id: string) {
    return this.delete<void>(API_CONFIG.ENDPOINTS.PACIENTES.DELETE(id));
  }

  async getPacientesStats() {
    return this.get<PacienteStats>(API_CONFIG.ENDPOINTS.PACIENTES.STATS);
  }
}

// Instância única do serviço
export const apiService = new ApiService();

// Interfaces necessárias
interface Paciente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  convenio?: string;
  numeroConvenio?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreatePacienteDTO {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  convenio?: string;
  numeroConvenio?: string;
}

interface PacienteStats {
  total: number;
  ativos: number;
  novos: number;
}
