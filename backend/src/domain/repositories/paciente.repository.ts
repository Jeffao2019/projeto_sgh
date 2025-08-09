import { Paciente } from '../entities/paciente.entity';

export const PACIENTE_REPOSITORY = Symbol('PacienteRepository');

export interface PacienteRepository {
  findById(id: string): Promise<Paciente | null>;
  findByCpf(cpf: string): Promise<Paciente | null>;
  findByEmail(email: string): Promise<Paciente | null>;
  create(paciente: Paciente): Promise<Paciente>;
  update(paciente: Paciente): Promise<Paciente>;
  delete(id: string): Promise<void>;
  findAll(page?: number, limit?: number): Promise<Paciente[]>;
  search(term: string): Promise<Paciente[]>;
}
