import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { PacienteEntity } from '../entities/paciente.entity';
import { PacienteRepository } from '../../../domain/repositories/paciente.repository';
import { Paciente } from '../../../domain/entities/paciente.entity';

@Injectable()
export class TypeOrmPacienteRepository implements PacienteRepository {
  constructor(
    @InjectRepository(PacienteEntity)
    private readonly repository: Repository<PacienteEntity>,
  ) {}

  async create(paciente: Paciente): Promise<Paciente> {
    const entity = this.repository.create(paciente);
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async findById(id: string): Promise<Paciente | null> {
    const entity = await this.repository.findOne({ 
      where: { id, isActive: true } 
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<Paciente | null> {
    const entity = await this.repository.findOne({ 
      where: { email, isActive: true } 
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findByCpf(cpf: string): Promise<Paciente | null> {
    const entity = await this.repository.findOne({ 
      where: { cpf, isActive: true } 
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<Paciente[]> {
    const entities = await this.repository.find({ 
      where: { isActive: true },
      order: { nome: 'ASC' }
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async update(paciente: Paciente): Promise<Paciente> {
    await this.repository.update(paciente.id, paciente);
    const entity = await this.repository.findOne({ where: { id: paciente.id } });
    if (!entity) throw new Error('Paciente not found');
    return this.toDomain(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.update(id, { isActive: false });
  }

  async search(term: string): Promise<Paciente[]> {
    const entities = await this.repository.find({
      where: [
        { nome: Like(`%${term}%`), isActive: true },
        { cpf: Like(`%${term}%`), isActive: true },
        { email: Like(`%${term}%`), isActive: true }
      ],
      order: { nome: 'ASC' }
    });
    return entities.map(entity => this.toDomain(entity));
  }

  private toDomain(entity: PacienteEntity): Paciente {
    return new Paciente(
      entity.id,
      entity.nome,
      entity.cpf,
      entity.email,
      entity.telefone,
      entity.dataNascimento,
      {
        cep: entity.endereco.cep,
        logradouro: entity.endereco.logradouro,
        numero: entity.endereco.numero,
        complemento: entity.endereco.complemento || '',
        bairro: entity.endereco.bairro,
        cidade: entity.endereco.cidade,
        estado: entity.endereco.estado,
      },
      entity.convenio,
      entity.numeroConvenio,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
