import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../domain/entities/user.entity';

export class CreateUserDto {
  @ApiProperty({
    example: 'Dr. João Silva',
    description: 'Nome completo do usuário',
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome: string;

  @ApiProperty({
    example: 'usuario@hospital.com',
    description: 'E-mail do usuário',
  })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @ApiProperty({
    example: '(11) 99999-9999',
    description: 'Telefone do usuário',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Telefone deve ser uma string' })
  @Matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, {
    message: 'Telefone deve ter o formato (XX) XXXXX-XXXX',
  })
  telefone?: string;

  @ApiProperty({
    example: 'senha123456',
    description: 'Senha do usuário (mínimo 6 caracteres)',
    minLength: 6,
  })
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  password: string;

  @ApiProperty({
    example: 'MEDICO',
    description: 'Perfil do usuário no sistema',
    enum: UserRole,
    enumName: 'UserRole',
  })
  @IsEnum(UserRole, { message: 'Role deve ser um valor válido' })
  @IsNotEmpty({ message: 'Role é obrigatório' })
  role: UserRole;
}
