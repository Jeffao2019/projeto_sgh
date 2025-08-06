import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';

export class EnderecoDto {
  @IsString({ message: 'CEP deve ser uma string' })
  @IsNotEmpty({ message: 'CEP é obrigatório' })
  @Matches(/^\d{5}-?\d{3}$/, {
    message: 'CEP deve ter o formato válido (XXXXX-XXX)',
  })
  cep: string;

  @IsString({ message: 'Logradouro deve ser uma string' })
  @IsNotEmpty({ message: 'Logradouro é obrigatório' })
  logradouro: string;

  @IsString({ message: 'Número deve ser uma string' })
  @IsNotEmpty({ message: 'Número é obrigatório' })
  numero: string;

  @IsString({ message: 'Complemento deve ser uma string' })
  @IsOptional()
  complemento?: string;

  @IsString({ message: 'Bairro deve ser uma string' })
  @IsNotEmpty({ message: 'Bairro é obrigatório' })
  bairro: string;

  @IsString({ message: 'Cidade deve ser uma string' })
  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  cidade: string;

  @IsString({ message: 'Estado deve ser uma string' })
  @IsNotEmpty({ message: 'Estado é obrigatório' })
  @Matches(/^[A-Z]{2}$/, {
    message: 'Estado deve ter 2 letras maiúsculas (ex: SP)',
  })
  estado: string;
}

export class CreatePacienteDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome: string;

  @IsString({ message: 'CPF deve ser uma string' })
  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @Matches(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, {
    message: 'CPF deve ter o formato válido',
  })
  cpf: string;

  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsString({ message: 'Telefone deve ser uma string' })
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @Matches(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/, {
    message: 'Telefone deve ter o formato válido (XX) XXXXX-XXXX',
  })
  telefone: string;

  @IsDateString({}, { message: 'Data de nascimento deve ser uma data válida' })
  @IsNotEmpty({ message: 'Data de nascimento é obrigatória' })
  dataNascimento: string;

  @ValidateNested()
  @Type(() => EnderecoDto)
  @IsNotEmpty({ message: 'Endereço é obrigatório' })
  endereco: EnderecoDto;

  @IsString({ message: 'Convênio deve ser uma string' })
  @IsOptional()
  convenio?: string;

  @IsString({ message: 'Número do convênio deve ser uma string' })
  @IsOptional()
  numeroConvenio?: string;
}

export class UpdatePacienteDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @IsOptional()
  nome?: string;

  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @IsOptional()
  email?: string;

  @IsString({ message: 'Telefone deve ser uma string' })
  @IsOptional()
  @Matches(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/, {
    message: 'Telefone deve ter o formato válido (XX) XXXXX-XXXX',
  })
  telefone?: string;

  @ValidateNested()
  @Type(() => EnderecoDto)
  @IsOptional()
  endereco?: EnderecoDto;

  @IsString({ message: 'Convênio deve ser uma string' })
  @IsOptional()
  convenio?: string;

  @IsString({ message: 'Número do convênio deve ser uma string' })
  @IsOptional()
  numeroConvenio?: string;
}
