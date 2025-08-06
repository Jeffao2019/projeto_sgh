import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { UserRole } from '../../domain/entities/user.entity';
import { IsPasswordMatch } from './validators/password-match.validator';

export class RegisterUserDto {
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
    example: 'senha123456',
    description: 'Confirmação da senha',
  })
  @IsString({ message: 'Confirmação de senha deve ser uma string' })
  @IsNotEmpty({ message: 'Confirmação de senha é obrigatória' })
  @IsPasswordMatch('password', { message: 'As senhas não coincidem' })
  confirmPassword: string;

  @ApiProperty({
    example: 'MEDICO',
    description: 'Perfil do usuário no sistema',
    enum: UserRole,
    enumName: 'UserRole',
    default: UserRole.MEDICO,
  })
  @IsEnum(UserRole, { message: 'Role deve ser um valor válido' })
  @IsNotEmpty({ message: 'Role é obrigatório' })
  role: UserRole = UserRole.MEDICO;

  @ApiProperty({
    example: true,
    description: 'Aceite dos termos de uso e política de privacidade',
  })
  @IsBoolean({ message: 'Aceite dos termos deve ser um valor booleano' })
  @ValidateIf((o) => o.acceptTerms !== true)
  @IsNotEmpty({ message: 'É obrigatório aceitar os termos de uso' })
  acceptTerms: boolean;
}
