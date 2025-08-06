import { Agendamento } from '../entities/agendamento.entity';

export interface AgendamentoRepository {
  findById(id: string): Promise<Agendamento | null>;
  findByPacienteId(pacienteId: string): Promise<Agendamento[]>;
  findByMedicoId(medicoId: string): Promise<Agendamento[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Agendamento[]>;
  create(agendamento: Agendamento): Promise<Agendamento>;
  update(agendamento: Agendamento): Promise<Agendamento>;
  delete(id: string): Promise<void>;
  findAll(page?: number, limit?: number): Promise<Agendamento[]>;
  checkAvailability(medicoId: string, dataHora: Date): Promise<boolean>;
}
