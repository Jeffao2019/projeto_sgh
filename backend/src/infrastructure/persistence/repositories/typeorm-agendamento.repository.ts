import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AgendamentoEntity } from '../entities/agendamento.entity';
import { AgendamentoRepository } from '../../../domain/repositories/agendamento.repository';
import { Agendamento } from '../../../domain/entities/agendamento.entity';

@Injectable()
export class TypeOrmAgendamentoRepository implements AgendamentoRepository {
  constructor(
    @InjectRepository(AgendamentoEntity)
    private readonly repository: Repository<AgendamentoEntity>,
  ) {}

  async create(agendamento: Agendamento): Promise<Agendamento> {
    const entity = this.repository.create({
      pacienteId: agendamento.pacienteId,
      medicoId: agendamento.medicoId,
      dataHora: agendamento.dataHora,
      tipo: agendamento.tipo,
      status: agendamento.status,
      observacoes: agendamento.observacoes,
      isActive: true,
    });
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async findById(id: string): Promise<Agendamento | null> {
    const entity = await this.repository.findOne({ 
      where: { id, isActive: true },
      relations: ['paciente', 'medico']
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(page = 1, limit = 50): Promise<Agendamento[]> {
    const entities = await this.repository.find({ 
      where: { isActive: true },
      relations: ['paciente', 'medico'],
      order: { createdAt: 'DESC', dataHora: 'DESC' },
      skip: (page - 1) * limit,
      take: limit
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async findByPacienteId(pacienteId: string): Promise<Agendamento[]> {
    const entities = await this.repository.find({
      where: { pacienteId, isActive: true },
      relations: ['paciente', 'medico'],
      order: { dataHora: 'DESC' }
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async findByMedicoId(medicoId: string): Promise<Agendamento[]> {
    const entities = await this.repository.find({
      where: { medicoId, isActive: true },
      relations: ['paciente', 'medico'],
      order: { dataHora: 'ASC' }
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Agendamento[]> {
    const entities = await this.repository.find({
      where: { 
        dataHora: Between(startDate, endDate),
        isActive: true 
      },
      relations: ['paciente', 'medico'],
      order: { dataHora: 'ASC' }
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async update(agendamento: Agendamento): Promise<Agendamento> {
    await this.repository.update(agendamento.id, {
      pacienteId: agendamento.pacienteId,
      medicoId: agendamento.medicoId,
      dataHora: agendamento.dataHora,
      tipo: agendamento.tipo,
      status: agendamento.status,
      observacoes: agendamento.observacoes,
      updatedAt: new Date(),
    });
    const entity = await this.repository.findOne({ 
      where: { id: agendamento.id },
      relations: ['paciente', 'medico']
    });
    if (!entity) throw new Error('Agendamento not found');
    return this.toDomain(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.update(id, { isActive: false });
  }

  async checkAvailability(medicoId: string, dataHora: Date): Promise<boolean> {
    const existing = await this.repository.findOne({
      where: { 
        medicoId, 
        dataHora,
        isActive: true 
      }
    });
    return !existing;
  }

  private toDomain(entity: AgendamentoEntity): Agendamento {
    const agendamento = new Agendamento(
      entity.id,
      entity.pacienteId,
      entity.medicoId,
      entity.dataHora,
      entity.tipo as any,
      entity.status as any,
      entity.observacoes,
      entity.createdAt,
      entity.updatedAt,
    );

    // Adicionar relações se disponíveis
    if (entity.paciente) {
      (agendamento as any).paciente = {
        id: entity.paciente.id,
        nome: entity.paciente.nome,
        cpf: entity.paciente.cpf,
        telefone: entity.paciente.telefone,
        email: entity.paciente.email
      };
    }

    if (entity.medico) {
      (agendamento as any).medico = {
        id: entity.medico.id,
        nome: entity.medico.nome,
        email: entity.medico.email,
        crm: (entity.medico as any).crm || 'N/A'
      };
    }

    return agendamento;
  }
}
