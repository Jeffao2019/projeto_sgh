import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository';
import type { CryptographyService } from '../../domain/services/cryptography.service';
import {
  CRYPTOGRAPHY_SERVICE,
  USER_REPOSITORY,
} from '../../infrastructure/tokens/injection.tokens';
import { ChangePasswordDto, LoginDto, LoginResponseDto } from '../dto/auth.dto';
import { RegisterUserDto } from '../dto/register-user.dto';

@Injectable()
export class AuthUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(CRYPTOGRAPHY_SERVICE)
    private readonly cryptographyService: CryptographyService,
    private readonly jwtService: JwtService,
  ) {}

  async registerWithValidation(
    registerUserDto: RegisterUserDto,
  ): Promise<LoginResponseDto> {
    // Verificar se as senhas coincidem (redundante, mas garantimos dupla validação)
    if (registerUserDto.password !== registerUserDto.confirmPassword) {
      throw new ConflictException('As senhas não coincidem');
    }

    // Verificar se os termos foram aceitos
    if (!registerUserDto.acceptTerms) {
      throw new ConflictException('É necessário aceitar os termos de uso');
    }

    // Verificar se o usuário já existe
    const existingUser = await this.userRepository.findByEmail(
      registerUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    // Criptografar a senha
    const hashedPassword = await this.cryptographyService.hash(
      registerUserDto.password,
    );

    // Criar o usuário
    const user = User.create(
      registerUserDto.email,
      hashedPassword,
      registerUserDto.nome,
      registerUserDto.role,
      registerUserDto.telefone,
    );

    // Salvar no repositório
    const savedUser = await this.userRepository.create(user);

    // Gerar token JWT
    const token = this.generateToken(savedUser);

    return {
      token,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        nome: savedUser.nome,
        role: savedUser.role,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    // Buscar usuário pelo email
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verificar se o usuário está ativo
    if (!user.isActive) {
      throw new UnauthorizedException('Usuário inativo');
    }

    // Verificar a senha
    const isPasswordValid = await this.cryptographyService.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Gerar token JWT
    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        role: user.role,
      },
    };
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    // Buscar usuário
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Verificar senha atual
    const isCurrentPasswordValid = await this.cryptographyService.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    // Criptografar nova senha
    const hashedNewPassword = await this.cryptographyService.hash(
      changePasswordDto.newPassword,
    );

    // Atualizar usuário
    const updatedUser = user.updatePassword(hashedNewPassword);
    await this.userRepository.update(updatedUser);
  }

  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }
}
