import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'usuario@exemplo.com',
    description: 'E-mail do usuário',
  })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @ApiProperty({
    example: 'minhasenha123',
    description: 'Senha do usuário',
  })
  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token JWT para autenticação',
  })
  token: string;

  @ApiProperty({
    description: 'Dados do usuário autenticado',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'usuario@exemplo.com',
      nome: 'João Silva',
      role: 'Médico',
    },
  })
  user: {
    id: string;
    email: string;
    nome: string;
    role: string;
  };
}

export class ChangePasswordDto {
  @ApiProperty({
    example: 'senhaatual123',
    description: 'Senha atual do usuário',
  })
  @IsString({ message: 'Senha atual deve ser uma string' })
  @IsNotEmpty({ message: 'Senha atual é obrigatória' })
  currentPassword: string;

  @ApiProperty({
    example: 'novasenha456',
    description: 'Nova senha do usuário',
  })
  @IsString({ message: 'Nova senha deve ser uma string' })
  @IsNotEmpty({ message: 'Nova senha é obrigatória' })
  newPassword: string;
}
