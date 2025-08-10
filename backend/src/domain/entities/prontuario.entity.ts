import { randomUUID } from 'crypto';

export class Prontuario {
  public readonly id: string;
  public readonly pacienteId: string;
  public readonly medicoId: string;
  public readonly agendamentoId: string;
  public readonly dataConsulta: Date;
  public readonly anamnese: string;
  public readonly exameFisico: string;
  public readonly diagnostico: string;
  public readonly prescricao?: string; // Opcional - para uso interno do hospital
  public readonly prescricaoUsoInterno?: string; // Opcional - para ambiente domiciliar
  public readonly prescricaoUsoExterno?: string; // Opcional - para ambiente externo
  public readonly observacoes?: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(
    id: string,
    pacienteId: string,
    medicoId: string,
    agendamentoId: string,
    dataConsulta: Date,
    anamnese: string,
    exameFisico: string,
    diagnostico: string,
    prescricaoUsoInterno?: string,
    prescricaoUsoExterno?: string,
    prescricao?: string,
    observacoes?: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    this.id = id;
    this.pacienteId = pacienteId;
    this.medicoId = medicoId;
    this.agendamentoId = agendamentoId;
    this.dataConsulta = dataConsulta;
    this.anamnese = anamnese;
    this.exameFisico = exameFisico;
    this.diagnostico = diagnostico;
    this.prescricaoUsoInterno = prescricaoUsoInterno;
    this.prescricaoUsoExterno = prescricaoUsoExterno;
    this.prescricao = prescricao;
    this.observacoes = observacoes;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static create(
    pacienteId: string,
    medicoId: string,
    agendamentoId: string,
    dataConsulta: Date,
    anamnese: string,
    exameFisico: string,
    diagnostico: string,
    prescricaoUsoInterno?: string,
    prescricaoUsoExterno?: string,
    prescricao?: string,
    observacoes?: string,
  ): Prontuario {
    return new Prontuario(
      randomUUID(),
      pacienteId,
      medicoId,
      agendamentoId,
      dataConsulta,
      anamnese,
      exameFisico,
      diagnostico,
      prescricaoUsoInterno,
      prescricaoUsoExterno,
      prescricao,
      observacoes,
    );
  }

  public update(
    anamnese: string,
    exameFisico: string,
    diagnostico: string,
    prescricaoUsoInterno?: string,
    prescricaoUsoExterno?: string,
    prescricao?: string,
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
      prescricaoUsoInterno,
      prescricaoUsoExterno,
      prescricao,
      observacoes,
      this.createdAt,
      new Date(),
    );
  }
}
