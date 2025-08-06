import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  async create(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async update(user: User): Promise<User> {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
    }
    return user;
  }

  async delete(id: string): Promise<void> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
  }

  async findAll(): Promise<User[]> {
    return this.users.filter((user) => user.isActive);
  }
}
