export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string,
    public readonly nome: string,
    public readonly role: UserRole,
    public readonly telefone: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly isActive: boolean = true,
  ) {}

  public static create(
    email: string,
    password: string,
    nome: string,
    role: UserRole,
    telefone?: string,
  ): User {
    return new User(
      crypto.randomUUID(),
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

export enum UserRole {
  MEDICO = 'MEDICO',
  ENFERMEIRO = 'ENFERMEIRO',
  RECEPCIONISTA = 'RECEPCIONISTA',
  ADMIN = 'ADMIN',
}
