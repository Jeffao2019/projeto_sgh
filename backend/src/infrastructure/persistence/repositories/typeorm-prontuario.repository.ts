import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProntuarioEntity } from '../entities/prontuario.entity';
import { ProntuarioRepository } from '../../../domain/repositories/prontuario.repository';
import { Prontuario } from '../../../domain/entities/prontuario.entity';

@Injectable()
export class TypeOrmProntuarioRepository implements ProntuarioRepository {
  constructor(
    @InjectRepository(ProntuarioEntity)
    private readonly repository: Repository<ProntuarioEntity>,
  ) {}

  async create(prontuario: Prontuario): Promise<Prontuario> {
    const entity = this.repository.create(prontuario);
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async findById(id: string): Promise<Prontuario | null> {
    const entity = await this.repository.findOne({ 
      where: { id, isActive: true },
      relations: ['paciente', 'medico']
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<Prontuario[]> {
    const entities = await this.repository.find({ 
      where: { isActive: true },
      relations: ['paciente', 'medico'],
      order: { dataConsulta: 'DESC' }
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async findByPacienteId(pacienteId: string): Promise<Prontuario[]> {
    const entities = await this.repository.find({
      where: { pacienteId, isActive: true },
      relations: ['paciente', 'medico'],
      order: { dataConsulta: 'DESC' }
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async findByMedicoId(medicoId: string): Promise<Prontuario[]> {
    const entities = await this.repository.find({
      where: { medicoId, isActive: true },
      relations: ['paciente', 'medico'],
      order: { dataConsulta: 'DESC' }
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async findByAgendamentoId(agendamentoId: string): Promise<Prontuario | null> {
    const entity = await this.repository.findOne({
      where: { agendamentoId, isActive: true },
      relations: ['paciente', 'medico']
    });
    return entity ? this.toDomain(entity) : null;
  }

  async update(prontuario: Prontuario): Promise<Prontuario> {
    await this.repository.update(prontuario.id, prontuario);
    const entity = await this.repository.findOne({ 
      where: { id: prontuario.id },
      relations: ['paciente', 'medico']
    });
    if (!entity) throw new Error('Prontuario not found');
    return this.toDomain(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.update(id, { isActive: false });
  }

  private toDomain(entity: ProntuarioEntity): Prontuario {
    return new Prontuario(
      entity.id,
      entity.pacienteId,
      entity.medicoId,
      entity.agendamentoId || '',
      entity.dataConsulta,
      entity.queixaPrincipal + ' - ' + entity.historiaDoencaAtual, // anamnese
      entity.exameFisico || '',
      entity.diagnostico || '',
      entity.prescricao || '',
      entity.observacoes || '',
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
