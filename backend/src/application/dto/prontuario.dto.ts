import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateProntuarioDto {
  @IsUUID(4, { message: 'ID do paciente deve ser um UUID válido' })
  @IsNotEmpty({ message: 'ID do paciente é obrigatório' })
  pacienteId: string;

  @IsUUID(4, { message: 'ID do médico deve ser um UUID válido' })
  @IsNotEmpty({ message: 'ID do médico é obrigatório' })
  medicoId: string;

  @IsUUID(4, { message: 'ID do agendamento deve ser um UUID válido' })
  @IsNotEmpty({ message: 'ID do agendamento é obrigatório' })
  agendamentoId: string;

  @IsDateString({}, { message: 'Data da consulta deve ser uma data válida' })
  @IsNotEmpty({ message: 'Data da consulta é obrigatória' })
  dataConsulta: string;

  @IsString({ message: 'Anamnese deve ser uma string' })
  @IsNotEmpty({ message: 'Anamnese é obrigatória' })
  anamnese: string;

  @IsString({ message: 'Exame físico deve ser uma string' })
  @IsNotEmpty({ message: 'Exame físico é obrigatório' })
  exameFisico: string;

  @IsString({ message: 'Diagnóstico deve ser uma string' })
  @IsNotEmpty({ message: 'Diagnóstico é obrigatório' })
  diagnostico: string;

  @IsString({ message: 'Prescrição deve ser uma string' })
  @IsOptional()
  prescricao?: string; // Opcional - apenas para uso interno do hospital

  @IsString({ message: 'Prescrição de uso interno deve ser uma string' })
  @IsOptional()
  prescricaoUsoInterno?: string; // Opcional - para ambiente domiciliar

  @IsString({ message: 'Prescrição de uso externo deve ser uma string' })
  @IsOptional()
  prescricaoUsoExterno?: string; // Opcional - para ambiente externo

  @IsString({ message: 'Observações devem ser uma string' })
  @IsOptional()
  observacoes?: string;
}

export class UpdateProntuarioDto {
  @IsString({ message: 'Anamnese deve ser uma string' })
  @IsOptional()
  anamnese?: string;

  @IsString({ message: 'Exame físico deve ser uma string' })
  @IsOptional()
  exameFisico?: string;

  @IsString({ message: 'Diagnóstico deve ser uma string' })
  @IsOptional()
  diagnostico?: string;

  @IsString({ message: 'Prescrição deve ser uma string' })
  @IsOptional()
  prescricao?: string;

  @IsString({ message: 'Prescrição de uso interno deve ser uma string' })
  @IsOptional()
  prescricaoUsoInterno?: string;

  @IsString({ message: 'Prescrição de uso externo deve ser uma string' })
  @IsOptional()
  prescricaoUsoExterno?: string;

  @IsString({ message: 'Observações devem ser uma string' })
  @IsOptional()
  observacoes?: string;
}

export class ProntuarioResponseDto {
  id: string;
  pacienteId: string;
  medicoId: string;
  agendamentoId: string;
  dataConsulta: Date;
  anamnese: string;
  exameFisico: string;
  diagnostico: string;
  prescricao?: string; // Opcional - para uso interno do hospital
  prescricaoUsoInterno?: string; // Opcional - para ambiente domiciliar
  prescricaoUsoExterno?: string; // Opcional - para ambiente externo
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Dados relacionados
  paciente?: {
    id: string;
    nome: string;
    cpf: string;
  };
  medico?: {
    id: string;
    nome: string;
    email: string;
  };
}
