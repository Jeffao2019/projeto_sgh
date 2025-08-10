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
    const entity = this.repository.create({
      pacienteId: prontuario.pacienteId,
      medicoId: prontuario.medicoId,
      agendamentoId: prontuario.agendamentoId || null,
      dataConsulta: prontuario.dataConsulta,
      queixaPrincipal: prontuario.anamnese,
      historiaDoencaAtual: '', // Campo não usado no domínio atual
      exameFisico: prontuario.exameFisico,
      diagnostico: prontuario.diagnostico,
      prescricao: prontuario.prescricao,
      observacoes: prontuario.observacoes,
    });
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async findById(id: string): Promise<Prontuario | null> {
    const entity = await this.repository.findOne({ 
      where: { id, isActive: true },
      relations: ['paciente', 'medico', 'agendamento']
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<Prontuario[]> {
    const entities = await this.repository.find({ 
      where: { isActive: true },
      relations: ['paciente', 'medico', 'agendamento'],
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
    await this.repository.update(prontuario.id, {
      pacienteId: prontuario.pacienteId,
      medicoId: prontuario.medicoId,
      agendamentoId: prontuario.agendamentoId || null,
      dataConsulta: prontuario.dataConsulta,
      queixaPrincipal: prontuario.anamnese,
      historiaDoencaAtual: '', // Campo não usado no domínio atual
      exameFisico: prontuario.exameFisico,
      diagnostico: prontuario.diagnostico,
      prescricao: prontuario.prescricao,
      observacoes: prontuario.observacoes,
    });
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

  async findAllWithRelations(): Promise<any[]> {
    const entities = await this.repository.find({ 
      where: { isActive: true },
      relations: ['paciente', 'medico', 'agendamento'],
      order: { dataConsulta: 'DESC' }
    });
    return entities.map(entity => ({
      id: entity.id,
      pacienteId: entity.pacienteId,
      medicoId: entity.medicoId,
      agendamentoId: entity.agendamentoId || '',
      dataConsulta: entity.dataConsulta,
      anamnese: entity.queixaPrincipal || '',
      exameFisico: entity.exameFisico || '',
      diagnostico: entity.diagnostico || '',
      prescricao: entity.prescricao || '',
      observacoes: entity.observacoes || '',
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      paciente: entity.paciente ? {
        id: entity.paciente.id,
        nome: entity.paciente.nome,
        cpf: entity.paciente.cpf,
        email: entity.paciente.email,
        telefone: entity.paciente.telefone,
        dataNascimento: entity.paciente.dataNascimento,
        endereco: entity.paciente.endereco,
        convenio: entity.paciente.convenio,
        numeroConvenio: entity.paciente.numeroConvenio
      } : null,
      medico: entity.medico ? {
        id: entity.medico.id,
        nome: entity.medico.nome,
        email: entity.medico.email,
        papel: entity.medico.papel
      } : null,
      agendamento: entity.agendamento ? {
        id: entity.agendamento.id,
        dataHora: entity.agendamento.dataHora,
        tipo: entity.agendamento.tipo,
        status: entity.agendamento.status,
        observacoes: entity.agendamento.observacoes
      } : null
    }));
  }

  private toDomain(entity: ProntuarioEntity): Prontuario {
    return new Prontuario(
      entity.id,
      entity.pacienteId,
      entity.medicoId,
      entity.agendamentoId || '',
      entity.dataConsulta,
      entity.queixaPrincipal || '', // anamnese
      entity.exameFisico || '',
      entity.diagnostico || '',
      entity.prescricao || '',
      entity.observacoes || '',
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
