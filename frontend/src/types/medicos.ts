export interface Medico {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  especialidade: string;
  crm: string;
  role: 'medico';
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicoDTO {
  nome: string;
  email: string;
  telefone: string;
  especialidade: string;
  crm: string;
  password: string;
}

export interface UpdateMedicoDTO {
  nome?: string;
  email?: string;
  telefone?: string;
  especialidade?: string;
  crm?: string;
}
