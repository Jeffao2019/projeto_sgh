export interface Agendamento {
  id: string;
  pacienteId: string;
  medicoId: string;
  dataHora: string;
  tipo: TipoConsulta;
  status: StatusAgendamento;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAgendamentoDto {
  pacienteId: string;
  medicoId: string;
  dataHora: string;
  tipo: TipoConsulta;
  observacoes?: string;
}

export interface UpdateAgendamentoDto {
  dataHora?: string;
  tipo?: TipoConsulta;
  status?: StatusAgendamento;
  observacoes?: string;
}

export enum TipoConsulta {
  CONSULTA_GERAL = 'CONSULTA_GERAL',
  CONSULTA_ESPECIALISTA = 'CONSULTA_ESPECIALISTA',
  EXAME = 'EXAME',
  TELEMEDICINA = 'TELEMEDICINA',
  RETORNO = 'RETORNO',
}

export enum StatusAgendamento {
  AGENDADO = 'AGENDADO',
  CONFIRMADO = 'CONFIRMADO',
  CANCELADO = 'CANCELADO',
  FINALIZADO = 'FINALIZADO',
  REAGENDADO = 'REAGENDADO',
  FALTOU = 'FALTOU',
}

export const TipoConsultaLabels: Record<TipoConsulta, string> = {
  [TipoConsulta.CONSULTA_GERAL]: 'Consulta Geral',
  [TipoConsulta.CONSULTA_ESPECIALISTA]: 'Consulta Especialista',
  [TipoConsulta.EXAME]: 'Exame',
  [TipoConsulta.TELEMEDICINA]: 'Telemedicina',
  [TipoConsulta.RETORNO]: 'Retorno',
};

export const StatusAgendamentoLabels: Record<StatusAgendamento, string> = {
  [StatusAgendamento.AGENDADO]: 'Agendado',
  [StatusAgendamento.CONFIRMADO]: 'Confirmado',
  [StatusAgendamento.CANCELADO]: 'Cancelado',
  [StatusAgendamento.FINALIZADO]: 'Finalizado',
  [StatusAgendamento.REAGENDADO]: 'Reagendado',
  [StatusAgendamento.FALTOU]: 'Faltou',
};

export const StatusColors: Record<StatusAgendamento, string> = {
  [StatusAgendamento.AGENDADO]: 'bg-blue-100 text-blue-800',
  [StatusAgendamento.CONFIRMADO]: 'bg-green-100 text-green-800',
  [StatusAgendamento.CANCELADO]: 'bg-red-100 text-red-800',
  [StatusAgendamento.FINALIZADO]: 'bg-gray-100 text-gray-800',
  [StatusAgendamento.REAGENDADO]: 'bg-yellow-100 text-yellow-800',
  [StatusAgendamento.FALTOU]: 'bg-orange-100 text-orange-800',
};
