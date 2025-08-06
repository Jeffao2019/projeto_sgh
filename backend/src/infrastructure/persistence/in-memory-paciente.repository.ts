import { Injectable } from '@nestjs/common';
import { Paciente } from '../../domain/entities/paciente.entity';
import { PacienteRepository } from '../../domain/repositories/paciente.repository';

@Injectable()
export class InMemoryPacienteRepository implements PacienteRepository {
  private pacientes: Paciente[] = [];

  async findById(id: string): Promise<Paciente | null> {
    return (
      this.pacientes.find(
        (paciente) => paciente.id === id && paciente.isActive,
      ) || null
    );
  }

  async findByCpf(cpf: string): Promise<Paciente | null> {
    return (
      this.pacientes.find(
        (paciente) => paciente.cpf === cpf && paciente.isActive,
      ) || null
    );
  }

  async findByEmail(email: string): Promise<Paciente | null> {
    return (
      this.pacientes.find(
        (paciente) => paciente.email === email && paciente.isActive,
      ) || null
    );
  }

  async create(paciente: Paciente): Promise<Paciente> {
    this.pacientes.push(paciente);
    return paciente;
  }

  async update(paciente: Paciente): Promise<Paciente> {
    const index = this.pacientes.findIndex((p) => p.id === paciente.id);
    if (index !== -1) {
      this.pacientes[index] = paciente;
    }
    return paciente;
  }

  async delete(id: string): Promise<void> {
    const index = this.pacientes.findIndex((paciente) => paciente.id === id);
    if (index !== -1) {
      this.pacientes.splice(index, 1);
    }
  }

  async findAll(page = 1, limit = 10): Promise<Paciente[]> {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return this.pacientes
      .filter((paciente) => paciente.isActive)
      .slice(startIndex, endIndex);
  }

  async search(term: string): Promise<Paciente[]> {
    const lowerTerm = term.toLowerCase();
    return this.pacientes.filter(
      (paciente) =>
        paciente.isActive &&
        (paciente.nome.toLowerCase().includes(lowerTerm) ||
          paciente.cpf.includes(term) ||
          paciente.email.toLowerCase().includes(lowerTerm)),
    );
  }
}
