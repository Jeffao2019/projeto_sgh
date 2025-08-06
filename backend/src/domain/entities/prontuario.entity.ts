export class Prontuario {
  constructor(
    public readonly id: string,
    public readonly pacienteId: string,
    public readonly medicoId: string,
    public readonly agendamentoId: string,
    public readonly dataConsulta: Date,
    public readonly anamnese: string,
    public readonly exameFisico: string,
    public readonly diagnostico: string,
    public readonly prescricao: string,
    public readonly observacoes?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  public static create(
    pacienteId: string,
    medicoId: string,
    agendamentoId: string,
    dataConsulta: Date,
    anamnese: string,
    exameFisico: string,
    diagnostico: string,
    prescricao: string,
    observacoes?: string,
  ): Prontuario {
    return new Prontuario(
      crypto.randomUUID(),
      pacienteId,
      medicoId,
      agendamentoId,
      dataConsulta,
      anamnese,
      exameFisico,
      diagnostico,
      prescricao,
      observacoes,
    );
  }

  public update(
    anamnese: string,
    exameFisico: string,
    diagnostico: string,
    prescricao: string,
    observacoes?: string,
  ): Prontuario {
    return new Prontuario(
      this.id,
      this.pacienteId,
      this.medicoId,
      this.agendamentoId,
      this.dataConsulta,
      anamnese,
      exameFisico,
      diagnostico,
      prescricao,
      observacoes,
      this.createdAt,
      new Date(),
    );
  }
}
