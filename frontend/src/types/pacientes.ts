export interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  endereco: Endereco;
  convenio?: string;
  numeroConvenio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePacienteDTO {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  endereco: Endereco;
  convenio?: string;
  numeroConvenio?: string;
}