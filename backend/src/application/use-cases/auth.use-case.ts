import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository';
import type { CryptographyService } from '../../domain/services/cryptography.service';
import {
  CRYPTOGRAPHY_SERVICE,
  USER_REPOSITORY,
} from '../../infrastructure/tokens/injection.tokens';
import { ChangePasswordDto, LoginDto, LoginResponseDto } from '../dto/auth.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
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

  async getMedicos() {
    const allUsers = await this.userRepository.findAll();
    
    // Se não há médicos, criar alguns de exemplo
    if (!allUsers.some(user => user.role === 'MEDICO')) {
      await this.createSampleMedicos();
      // Buscar novamente após criar os médicos
      const updatedUsers = await this.userRepository.findAll();
      return this.formatMedicos(updatedUsers);
    }
    
    return this.formatMedicos(allUsers);
  }

  private async createSampleMedicos() {
    const medicos = [
      {
        nome: 'Dr. João Silva',
        email: 'joao.silva@hospital.com',
        telefone: '(11) 99999-0001',
        especialidade: 'Cardiologia',
        crm: '123456'
      },
      {
        nome: 'Dra. Maria Santos',
        email: 'maria.santos@hospital.com',
        telefone: '(11) 99999-0002',
        especialidade: 'Dermatologia',
        crm: '234567'
      },
      {
        nome: 'Dr. Pedro Costa',
        email: 'pedro.costa@hospital.com',
        telefone: '(11) 99999-0003',
        especialidade: 'Neurologia',
        crm: '345678'
      },
      {
        nome: 'Dra. Ana Oliveira',
        email: 'ana.oliveira@hospital.com',
        telefone: '(11) 99999-0004',
        especialidade: 'Pediatria',
        crm: '456789'
      }
    ];

    for (const medico of medicos) {
      const hashedPassword = await this.cryptographyService.hash('123456');
      const user = User.create(
        medico.email,
        hashedPassword,
        medico.nome,
        UserRole.MEDICO,
        medico.telefone
      );
      await this.userRepository.create(user);
    }
  }

  async getProfile(userId: string): Promise<any> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      papel: user.role, // Mantém compatibilidade
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<any> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Verificar se o novo email já está em uso por outro usuário
    if (updateProfileDto.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(updateProfileDto.email);
      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException('Email já está em uso por outro usuário');
      }
    }

    // Criar nova instância com dados atualizados
    const updatedUser = new User(
      user.id,
      updateProfileDto.email,
      user.password,
      updateProfileDto.nome,
      user.role,
      user.telefone,
      user.createdAt,
      new Date(),
      user.isActive,
    );

    const savedUser = await this.userRepository.update(updatedUser);

    return {
      id: savedUser.id,
      nome: savedUser.nome,
      email: savedUser.email,
      papel: savedUser.role,
      isActive: savedUser.isActive,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };
  }

  private formatMedicos(users: any[]) {
    const especialidades = ['Cardiologia', 'Dermatologia', 'Neurologia', 'Pediatria', 'Clínica Geral'];
    const crms = ['123456', '234567', '345678', '456789', '567890'];
    
    return users
      .filter((user) => user.role === 'MEDICO')
      .map((user, index) => ({
        id: user.id,
        nome: user.nome,
        email: user.email,
        telefone: user.telefone,
        especialidade: especialidades[index % especialidades.length],
        crm: crms[index % crms.length],
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));
  }

  async getAllUsers() {
    const allUsers = await this.userRepository.findAll();
    return allUsers.map(user => ({
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
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
