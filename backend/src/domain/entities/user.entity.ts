import { randomUUID } from 'crypto';

export class User {
  public readonly id: string;
  public readonly email: string;
  public readonly password: string;
  public readonly nome: string;
  public readonly role: UserRole;
  public readonly telefone: string | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly isActive: boolean;

  constructor(
    id: string,
    email: string,
    password: string,
    nome: string,
    role: UserRole,
    telefone: string | null,
    createdAt: Date,
    updatedAt: Date,
    isActive: boolean = true,
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.nome = nome;
    this.role = role;
    this.telefone = telefone;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isActive = isActive;
  }

  public static create(
    email: string,
    password: string,
    nome: string,
    role: UserRole,
    telefone?: string,
  ): User {
    return new User(
      randomUUID(),
      email,
      password,
      nome,
      role,
      telefone || null,
      new Date(),
      new Date(),
      true,
    );
  }

  public updatePassword(newPassword: string): User {
    return new User(
      this.id,
      this.email,
      newPassword,
      this.nome,
      this.role,
      this.telefone,
      this.createdAt,
      new Date(),
      this.isActive,
    );
  }

  public deactivate(): User {
    return new User(
      this.id,
      this.email,
      this.password,
      this.nome,
      this.role,
      this.telefone,
      this.createdAt,
      new Date(),
      false,
    );
  }
}

export const UserRole = {
  MEDICO: 'MEDICO',
  ENFERMEIRO: 'ENFERMEIRO', 
  RECEPCIONISTA: 'RECEPCIONISTA',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];
