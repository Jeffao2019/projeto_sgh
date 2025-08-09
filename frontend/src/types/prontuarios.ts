export interface Prontuario {
  id: string;
  pacienteId: string;
  medicoId: string;
  agendamentoId: string;
  dataConsulta: string;
  anamnese: string;
  exameFisico: string;
  diagnostico: string;
  prescricao: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
  // Dados relacionados que podem vir populados
  paciente?: {
    id: string;
    nome: string;
    cpf: string;
    email: string;
  };
  medico?: {
    id: string;
    nome: string;
    especialidade: string;
    crm: string;
  };
  agendamento?: {
    id: string;
    dataHora: string;
    status: string;
    tipo: string;
  };
}

export interface CreateProntuarioDTO {
  pacienteId: string;
  medicoId: string;
  agendamentoId: string;
  dataConsulta: string;
  anamnese: string;
  exameFisico: string;
  diagnostico: string;
  prescricao: string;
  observacoes?: string;
}

export interface UpdateProntuarioDTO {
  anamnese?: string;
  exameFisico?: string;
  diagnostico?: string;
  prescricao?: string;
  observacoes?: string;
}

export interface ProntuarioStats {
  total: number;
  concluidos: number;
  pendentes: number;
  emAndamento: number;
}
