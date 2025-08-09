import { randomUUID } from 'crypto';

export class Paciente {
  public readonly id: string;
  public readonly nome: string;
  public readonly cpf: string;
  public readonly email: string;
  public readonly telefone: string;
  public readonly dataNascimento: Date;
  public readonly endereco: Endereco;
  public readonly convenio?: string;
  public readonly numeroConvenio?: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly isActive: boolean;

  constructor(
    id: string,
    nome: string,
    cpf: string,
    email: string,
    telefone: string,
    dataNascimento: Date,
    endereco: Endereco,
    convenio?: string,
    numeroConvenio?: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    isActive: boolean = true,
  ) {
    this.id = id;
    this.nome = nome;
    this.cpf = cpf;
    this.email = email;
    this.telefone = telefone;
    this.dataNascimento = dataNascimento;
    this.endereco = endereco;
    this.convenio = convenio;
    this.numeroConvenio = numeroConvenio;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isActive = isActive;
  }

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
      randomUUID(),
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
  public readonly cep: string;
  public readonly logradouro: string;
  public readonly numero: string;
  public readonly complemento: string;
  public readonly bairro: string;
  public readonly cidade: string;
  public readonly estado: string;

  constructor(
    cep: string,
    logradouro: string,
    numero: string,
    complemento: string,
    bairro: string,
    cidade: string,
    estado: string,
  ) {
    this.cep = cep;
    this.logradouro = logradouro;
    this.numero = numero;
    this.complemento = complemento;
    this.bairro = bairro;
    this.cidade = cidade;
    this.estado = estado;
  }
}
