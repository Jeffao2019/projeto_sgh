import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../../domain/entities/user.entity';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async create(user: User): Promise<User> {
    const entity = this.repository.create({
      id: user.id,
      nome: user.nome,
      email: user.email,
      senha: user.password, // Mapeamento correto: password -> senha
      papel: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({ 
      where: { id, isActive: true } 
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({ 
      where: { email, isActive: true } 
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<User[]> {
    const entities = await this.repository.find({ 
      where: { isActive: true },
      order: { nome: 'ASC' }
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async update(user: User): Promise<User> {
    await this.repository.update(user.id, {
      nome: user.nome,
      email: user.email,
      senha: user.password, // Mapeamento correto: password -> senha
      papel: user.role,
      isActive: user.isActive,
      updatedAt: user.updatedAt,
    });
    const entity = await this.repository.findOne({ where: { id: user.id } });
    if (!entity) throw new Error('User not found');
    return this.toDomain(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.update(id, { isActive: false });
  }

  private toDomain(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.email,
      entity.senha, // password in domain
      entity.nome,
      entity.papel as any, // role in domain
      null, // telefone - not in current entity
      entity.createdAt,
      entity.updatedAt,
      entity.isActive,
    );
  }
}
