import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ChangePasswordDto,
  LoginDto,
  LoginResponseDto,
} from '../../application/dto/auth.dto';
import { UpdateProfileDto } from '../../application/dto/update-profile.dto';
import { RegisterUserDto } from '../../application/dto/register-user.dto';
import { AuthUseCase } from '../../application/use-cases/auth.use-case';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authUseCase: AuthUseCase,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar novo usuário via web (com validação de senha)',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'E-mail já cadastrado ou dados inválidos',
  })
  @ApiBody({ type: RegisterUserDto })
  async registerWeb(
    @Body(ValidationPipe) registerUserDto: RegisterUserDto,
  ): Promise<LoginResponseDto> {
    try {
      console.log('Dados de registro recebidos:', registerUserDto);
      const result = await this.authUseCase.registerWithValidation(registerUserDto);
      console.log('Usuário registrado com sucesso:', result.user.id);
      return result;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fazer login' })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
  })
  @ApiBody({ type: LoginDto })
  async login(
    @Body(ValidationPipe) loginDto: LoginDto,
  ): Promise<LoginResponseDto> {
    return await this.authUseCase.login(loginDto);
  }

  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Alterar senha do usuário' })
  @ApiResponse({
    status: 204,
    description: 'Senha alterada com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou expirado',
  })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(
    @Request() req: { user: { sub: string } },
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    await this.authUseCase.changePassword(req.user.sub, changePasswordDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obter perfil do usuário logado' })
  @ApiResponse({
    status: 200,
    description: 'Perfil do usuário',
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou expirado',
  })
  async getProfile(
    @Request()
    req: {
      user: { sub: string; email: string; role: string; nome: string };
    },
  ) {
    return await this.authUseCase.getProfile(req.user.sub);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualizar perfil do usuário logado' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({
    status: 200,
    description: 'Perfil atualizado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou expirado',
  })
  async updateProfile(
    @Request() req: { user: { sub: string } },
    @Body(ValidationPipe) updateProfileDto: UpdateProfileDto,
  ) {
    return await this.authUseCase.updateProfile(req.user.sub, updateProfileDto);
  }

  @Get('medicos')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar todos os médicos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de médicos',
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou expirado',
  })
  async getMedicos() {
    return await this.authUseCase.getMedicos();
  }

  @Get('debug')
  @ApiOperation({ summary: 'Debug endpoint - remover em produção' })
  async debug() {
    // Este endpoint é apenas para debug - remover em produção
    const allUsers = await this.authUseCase.getAllUsers();
    const adminUsers = allUsers.filter(user => user.role === 'ADMIN');
    
    return {
      message: 'Debug endpoint ativo',
      timestamp: new Date().toISOString(),
      jwtSecret: this.configService.get<string>('JWT_SECRET')
        ? 'Configurado'
        : 'Não configurado',
      totalUsers: allUsers.length,
      adminUsers: adminUsers.map(user => ({
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        // NOTA: Senhas não são expostas por segurança
        // Para recuperar senha, usar funcionalidade de reset
      })),
    };
  }
}
