import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  StatusAgendamento,
  TipoConsulta,
} from '../../domain/entities/agendamento.entity';

export class CreateAgendamentoDto {
  @IsUUID(4, { message: 'ID do paciente deve ser um UUID válido' })
  @IsNotEmpty({ message: 'ID do paciente é obrigatório' })
  pacienteId: string;

  @IsUUID(4, { message: 'ID do médico deve ser um UUID válido' })
  @IsNotEmpty({ message: 'ID do médico é obrigatório' })
  medicoId: string;

  @IsDateString({}, { message: 'Data e hora devem ser uma data válida' })
  @IsNotEmpty({ message: 'Data e hora são obrigatórias' })
  dataHora: string;

  @IsEnum(TipoConsulta, {
    message: 'Tipo de consulta deve ser um valor válido',
  })
  @IsNotEmpty({ message: 'Tipo de consulta é obrigatório' })
  tipo: TipoConsulta;

  @IsString({ message: 'Observações devem ser uma string' })
  @IsOptional()
  observacoes?: string;
}

export class UpdateAgendamentoDto {
  @IsDateString({}, { message: 'Data e hora devem ser uma data válida' })
  @IsOptional()
  dataHora?: string;

  @IsEnum(TipoConsulta, {
    message: 'Tipo de consulta deve ser um valor válido',
  })
  @IsOptional()
  tipo?: TipoConsulta;

  @IsEnum(StatusAgendamento, { message: 'Status deve ser um valor válido' })
  @IsOptional()
  status?: StatusAgendamento;

  @IsString({ message: 'Observações devem ser uma string' })
  @IsOptional()
  observacoes?: string;
}

export class AgendamentoResponseDto {
  id: string;
  pacienteId: string;
  medicoId: string;
  dataHora: Date;
  tipo: TipoConsulta;
  status: StatusAgendamento;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}
