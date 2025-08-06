export class Paciente {
  constructor(
    public readonly id: string,
    public readonly nome: string,
    public readonly cpf: string,
    public readonly email: string,
    public readonly telefone: string,
    public readonly dataNascimento: Date,
    public readonly endereco: Endereco,
    public readonly convenio?: string,
    public readonly numeroConvenio?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly isActive: boolean = true,
  ) {}

  public static create(
    nome: string,
    cpf: string,
    email: string,
    telefone: string,
    dataNascimento: Date,
    endereco: Endereco,
    convenio?: string,
    numeroConvenio?: string,
  ): Paciente {
    return new Paciente(
      crypto.randomUUID(),
      nome,
      cpf,
      email,
      telefone,
      dataNascimento,
      endereco,
      convenio,
      numeroConvenio,
    );
  }

  public update(
    nome: string,
    email: string,
    telefone: string,
    endereco: Endereco,
    convenio?: string,
    numeroConvenio?: string,
  ): Paciente {
    return new Paciente(
      this.id,
      nome,
      this.cpf, // CPF não pode ser alterado
      email,
      telefone,
      this.dataNascimento, // Data de nascimento não pode ser alterada
      endereco,
      convenio,
      numeroConvenio,
      this.createdAt,
      new Date(),
      this.isActive,
    );
  }

  public deactivate(): Paciente {
    return new Paciente(
      this.id,
      this.nome,
      this.cpf,
      this.email,
      this.telefone,
      this.dataNascimento,
      this.endereco,
      this.convenio,
      this.numeroConvenio,
      this.createdAt,
      new Date(),
      false,
    );
  }

  public getIdade(): number {
    const today = new Date();
    const birthDate = new Date(this.dataNascimento);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }
}

export class Endereco {
  constructor(
    public readonly cep: string,
    public readonly logradouro: string,
    public readonly numero: string,
    public readonly complemento: string,
    public readonly bairro: string,
    public readonly cidade: string,
    public readonly estado: string,
  ) {}
}
