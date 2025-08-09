import { randomUUID } from 'crypto';

export class Agendamento {
  public readonly id: string;
  public readonly pacienteId: string;
  public readonly medicoId: string;
  public readonly dataHora: Date;
  public readonly tipo: TipoConsulta;
  public readonly status: StatusAgendamento;
  public readonly observacoes?: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(
    id: string,
    pacienteId: string,
    medicoId: string,
    dataHora: Date,
    tipo: TipoConsulta,
    status: StatusAgendamento,
    observacoes?: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    this.id = id;
    this.pacienteId = pacienteId;
    this.medicoId = medicoId;
    this.dataHora = dataHora;
    this.tipo = tipo;
    this.status = status;
    this.observacoes = observacoes;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static create(
    pacienteId: string,
    medicoId: string,
    dataHora: Date,
    tipo: TipoConsulta,
    observacoes?: string,
  ): Agendamento {
    return new Agendamento(
      randomUUID(),
      pacienteId,
      medicoId,
      dataHora,
      tipo,
      StatusAgendamento.AGENDADO,
      observacoes,
    );
  }

  public confirmar(): Agendamento {
    return new Agendamento(
      this.id,
      this.pacienteId,
      this.medicoId,
      this.dataHora,
      this.tipo,
      StatusAgendamento.CONFIRMADO,
      this.observacoes,
      this.createdAt,
      new Date(),
    );
  }

  public cancelar(): Agendamento {
    return new Agendamento(
      this.id,
      this.pacienteId,
      this.medicoId,
      this.dataHora,
      this.tipo,
      StatusAgendamento.CANCELADO,
      this.observacoes,
      this.createdAt,
      new Date(),
    );
  }

  public finalizar(): Agendamento {
    return new Agendamento(
      this.id,
      this.pacienteId,
      this.medicoId,
      this.dataHora,
      this.tipo,
      StatusAgendamento.FINALIZADO,
      this.observacoes,
      this.createdAt,
      new Date(),
    );
  }

  public reagendar(novaDataHora: Date): Agendamento {
    return new Agendamento(
      this.id,
      this.pacienteId,
      this.medicoId,
      novaDataHora,
      this.tipo,
      StatusAgendamento.REAGENDADO,
      this.observacoes,
      this.createdAt,
      new Date(),
    );
  }
}

export const TipoConsulta = {
  CONSULTA_GERAL: 'CONSULTA_GERAL',
  CONSULTA_ESPECIALISTA: 'CONSULTA_ESPECIALISTA',
  EXAME: 'EXAME',
  TELEMEDICINA: 'TELEMEDICINA',
  RETORNO: 'RETORNO',
} as const;

export type TipoConsulta = typeof TipoConsulta[keyof typeof TipoConsulta];

export const StatusAgendamento = {
  AGENDADO: 'AGENDADO',
  CONFIRMADO: 'CONFIRMADO',
  CANCELADO: 'CANCELADO',
  FINALIZADO: 'FINALIZADO',
  REAGENDADO: 'REAGENDADO',
  FALTOU: 'FALTOU',
} as const;

export type StatusAgendamento = typeof StatusAgendamento[keyof typeof StatusAgendamento];
