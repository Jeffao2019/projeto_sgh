import { Injectable } from '@nestjs/common';
import { Prontuario } from '../../domain/entities/prontuario.entity';
import { ProntuarioRepository } from '../../domain/repositories/prontuario.repository';

@Injectable()
export class InMemoryProntuarioRepository implements ProntuarioRepository {
  private prontuarios: Prontuario[] = [];

  async findById(id: string): Promise<Prontuario | null> {
    return this.prontuarios.find((prontuario) => prontuario.id === id) || null;
  }

  async findByPacienteId(pacienteId: string): Promise<Prontuario[]> {
    return this.prontuarios.filter(
      (prontuario) => prontuario.pacienteId === pacienteId,
    );
  }

  async findByMedicoId(medicoId: string): Promise<Prontuario[]> {
    return this.prontuarios.filter(
      (prontuario) => prontuario.medicoId === medicoId,
    );
  }

  async findByAgendamentoId(agendamentoId: string): Promise<Prontuario | null> {
    return (
      this.prontuarios.find(
        (prontuario) => prontuario.agendamentoId === agendamentoId,
      ) || null
    );
  }

  async create(prontuario: Prontuario): Promise<Prontuario> {
    this.prontuarios.push(prontuario);
    return prontuario;
  }

  async update(prontuario: Prontuario): Promise<Prontuario> {
    const index = this.prontuarios.findIndex((p) => p.id === prontuario.id);
    if (index !== -1) {
      this.prontuarios[index] = prontuario;
    }
    return prontuario;
  }

  async delete(id: string): Promise<void> {
    const index = this.prontuarios.findIndex(
      (prontuario) => prontuario.id === id,
    );
    if (index !== -1) {
      this.prontuarios.splice(index, 1);
    }
  }

  async findAll(page = 1, limit = 10): Promise<Prontuario[]> {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return this.prontuarios.slice(startIndex, endIndex);
  }
}
