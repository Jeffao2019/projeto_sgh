import { API_CONFIG } from "./api-config";
import { Paciente, CreatePacienteDTO } from "@/types/pacientes";
import { Prontuario, CreateProntuarioDTO, UpdateProntuarioDTO, ProntuarioStats } from "@/types/prontuarios";
import { Medico } from "@/types/medicos";
import { Agendamento, CreateAgendamentoDto, UpdateAgendamentoDto } from "@/types/agendamentos";

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
    return this.post<Paciente>(API_CONFIG.ENDPOINTS.PACIENTES.CREATE, data);
  }

  async updatePaciente(id: string, data: Partial<CreatePacienteDTO>) {
    return this.put<Paciente>(API_CONFIG.ENDPOINTS.PACIENTES.UPDATE(id), data);
  }

  async deletePaciente(id: string) {
    return this.delete<void>(API_CONFIG.ENDPOINTS.PACIENTES.DELETE(id));
  }

  // Métodos para Médicos
  async getMedicos() {
    return this.get<Medico[]>(API_CONFIG.ENDPOINTS.MEDICOS.LIST);
  }

  // Método temporariamente comentado até implementar endpoint específico
  // async getMedicoById(id: string) {
  //   return this.get<Medico>(API_CONFIG.ENDPOINTS.MEDICOS.BY_ID(id));
  // }

  // Métodos para Prontuários
  async getProntuarios() {
    return this.get<Prontuario[]>(API_CONFIG.ENDPOINTS.PRONTUARIOS.WITH_RELATIONS);
  }

  async getProntuarioById(id: string) {
    return this.get<Prontuario>(API_CONFIG.ENDPOINTS.PRONTUARIOS.BY_ID(id));
  }

  async getProntuariosByPaciente(pacienteId: string) {
    return this.get<Prontuario[]>(API_CONFIG.ENDPOINTS.PRONTUARIOS.BY_PACIENTE_WITH_RELATIONS(pacienteId));
  }

  async getProntuariosByMedico(medicoId: string) {
    return this.get<Prontuario[]>(API_CONFIG.ENDPOINTS.PRONTUARIOS.BY_MEDICO(medicoId));
  }

  async getProntuarioByAgendamento(agendamentoId: string) {
    return this.get<Prontuario>(API_CONFIG.ENDPOINTS.PRONTUARIOS.BY_AGENDAMENTO(agendamentoId));
  }

  async createProntuario(data: CreateProntuarioDTO) {
    return this.post<Prontuario>(API_CONFIG.ENDPOINTS.PRONTUARIOS.BASE, data);
  }

  async updateProntuario(id: string, data: UpdateProntuarioDTO) {
    return this.put<Prontuario>(API_CONFIG.ENDPOINTS.PRONTUARIOS.BY_ID(id), data);
  }

  async deleteProntuario(id: string) {
    return this.delete<void>(API_CONFIG.ENDPOINTS.PRONTUARIOS.BY_ID(id));
  }

  // Métodos para Agendamentos
  async getAgendamentos() {
    return this.get<Agendamento[]>(API_CONFIG.ENDPOINTS.AGENDAMENTOS.BASE);
  }

  async getAgendamentoById(id: string) {
    return this.get<Agendamento>(API_CONFIG.ENDPOINTS.AGENDAMENTOS.BY_ID(id));
  }

  async getAgendamentosByPaciente(pacienteId: string) {
    return this.get<Agendamento[]>(API_CONFIG.ENDPOINTS.AGENDAMENTOS.BY_PACIENTE(pacienteId));
  }

  async getAgendamentosByMedico(medicoId: string) {
    return this.get<Agendamento[]>(API_CONFIG.ENDPOINTS.AGENDAMENTOS.BY_MEDICO(medicoId));
  }

  async getAgendamentosParaProntuario() {
    return this.get<Agendamento[]>(API_CONFIG.ENDPOINTS.AGENDAMENTOS.PARA_PRONTUARIO);
  }

  async createAgendamento(data: CreateAgendamentoDto) {
    return this.post<Agendamento>(API_CONFIG.ENDPOINTS.AGENDAMENTOS.BASE, data);
  }

  async updateAgendamento(id: string, data: UpdateAgendamentoDto) {
    return this.put<Agendamento>(API_CONFIG.ENDPOINTS.AGENDAMENTOS.BY_ID(id), data);
  }

  async confirmarAgendamento(id: string) {
    return this.put<Agendamento>(API_CONFIG.ENDPOINTS.AGENDAMENTOS.CONFIRMAR(id));
  }

  async cancelarAgendamento(id: string) {
    return this.put<Agendamento>(API_CONFIG.ENDPOINTS.AGENDAMENTOS.CANCELAR(id));
  }

  async finalizarAgendamento(id: string) {
    return this.put<Agendamento>(API_CONFIG.ENDPOINTS.AGENDAMENTOS.FINALIZAR(id));
  }

  async deleteAgendamento(id: string) {
    return this.delete<void>(API_CONFIG.ENDPOINTS.AGENDAMENTOS.BY_ID(id));
  }
}

// Instância única do serviço
export const apiService = new ApiService();

