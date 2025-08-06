import { Injectable } from '@nestjs/common';
import {
  Agendamento,
  StatusAgendamento,
} from '../../domain/entities/agendamento.entity';
import { AgendamentoRepository } from '../../domain/repositories/agendamento.repository';

@Injectable()
export class InMemoryAgendamentoRepository implements AgendamentoRepository {
  private agendamentos: Agendamento[] = [];

  async findById(id: string): Promise<Agendamento | null> {
    return (
      this.agendamentos.find((agendamento) => agendamento.id === id) || null
    );
  }

  async findByPacienteId(pacienteId: string): Promise<Agendamento[]> {
    return this.agendamentos.filter(
      (agendamento) => agendamento.pacienteId === pacienteId,
    );
  }

  async findByMedicoId(medicoId: string): Promise<Agendamento[]> {
    return this.agendamentos.filter(
      (agendamento) => agendamento.medicoId === medicoId,
    );
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<Agendamento[]> {
    return this.agendamentos.filter(
      (agendamento) =>
        agendamento.dataHora >= startDate && agendamento.dataHora <= endDate,
    );
  }

  async create(agendamento: Agendamento): Promise<Agendamento> {
    this.agendamentos.push(agendamento);
    return agendamento;
  }

  async update(agendamento: Agendamento): Promise<Agendamento> {
    const index = this.agendamentos.findIndex((a) => a.id === agendamento.id);
    if (index !== -1) {
      this.agendamentos[index] = agendamento;
    }
    return agendamento;
  }

  async delete(id: string): Promise<void> {
    const index = this.agendamentos.findIndex(
      (agendamento) => agendamento.id === id,
    );
    if (index !== -1) {
      this.agendamentos.splice(index, 1);
    }
  }

  async findAll(page = 1, limit = 10): Promise<Agendamento[]> {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return this.agendamentos.slice(startIndex, endIndex);
  }

  async checkAvailability(medicoId: string, dataHora: Date): Promise<boolean> {
    // Verifica se há algum agendamento no mesmo horário para o médico
    const conflictingAppointment = this.agendamentos.find(
      (agendamento) =>
        agendamento.medicoId === medicoId &&
        agendamento.dataHora.getTime() === dataHora.getTime() &&
        agendamento.status !== StatusAgendamento.CANCELADO,
    );

    return !conflictingAppointment;
  }
}
