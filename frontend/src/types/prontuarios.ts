export interface Prontuario {
  id: string;
  pacienteId: string;
  medicoId: string;
  agendamentoId: string;
  dataConsulta: string;
  anamnese: string;
  exameFisico: string;
  diagnostico: string;
  prescricao?: string; // Opcional - apenas para uso interno do hospital
  prescricaoUsoInterno?: string; // Opcional - para ambiente domiciliar
  prescricaoUsoExterno?: string; // Opcional - para ambiente externo
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
  // Dados relacionados que podem vir populados
  paciente?: {
    id: string;
    nome: string;
    cpf: string;
  };
  medico?: {
    id: string;
    nome: string;
    email: string;
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
  prescricao?: string; // Opcional - apenas para uso interno do hospital
  prescricaoUsoInterno?: string; // Opcional - para ambiente domiciliar
  prescricaoUsoExterno?: string; // Opcional - para ambiente externo
  observacoes?: string;
}

export interface UpdateProntuarioDTO {
  anamnese?: string;
  exameFisico?: string;
  diagnostico?: string;
  prescricao?: string;
  prescricaoUsoInterno?: string;
  prescricaoUsoExterno?: string;
  observacoes?: string;
}

export interface ProntuarioStats {
  total: number;
  concluidos: number;
  pendentes: number;
  emAndamento: number;
}
