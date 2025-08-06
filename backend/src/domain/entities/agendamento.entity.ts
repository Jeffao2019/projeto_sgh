export class Agendamento {
  constructor(
    public readonly id: string,
    public readonly pacienteId: string,
    public readonly medicoId: string,
    public readonly dataHora: Date,
    public readonly tipo: TipoConsulta,
    public readonly status: StatusAgendamento,
    public readonly observacoes?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  public static create(
    pacienteId: string,
    medicoId: string,
    dataHora: Date,
    tipo: TipoConsulta,
    observacoes?: string,
  ): Agendamento {
    return new Agendamento(
      crypto.randomUUID(),
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
