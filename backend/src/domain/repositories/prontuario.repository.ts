import { Prontuario } from '../entities/prontuario.entity';

export const PRONTUARIO_REPOSITORY = Symbol('ProntuarioRepository');

export interface ProntuarioRepository {
  findById(id: string): Promise<Prontuario | null>;
  findByPacienteId(pacienteId: string): Promise<Prontuario[]>;
  findByMedicoId(medicoId: string): Promise<Prontuario[]>;
  findByAgendamentoId(agendamentoId: string): Promise<Prontuario | null>;
  create(prontuario: Prontuario): Promise<Prontuario>;
  update(prontuario: Prontuario): Promise<Prontuario>;
  delete(id: string): Promise<void>;
  findAll(page?: number, limit?: number): Promise<Prontuario[]>;
}
