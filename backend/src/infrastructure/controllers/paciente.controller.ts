import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreatePacienteDto,
  UpdatePacienteDto,
} from '../../application/dto/paciente.dto';
import { PacienteUseCase } from '../../application/use-cases/paciente.use-case';
import { Paciente } from '../../domain/entities/paciente.entity';
import { UserRole } from '../../domain/entities/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../guards/roles.guard';

@ApiTags('Pacientes')
@ApiBearerAuth('JWT-auth')
@Controller('pacientes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PacienteController {
  constructor(private readonly pacienteUseCase: PacienteUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.ENFERMEIRO)
  async create(
    @Body(ValidationPipe) createPacienteDto: CreatePacienteDto,
  ): Promise<Paciente> {
    try {
      console.log('Dados recebidos:', createPacienteDto);
      const result = await this.pacienteUseCase.create(createPacienteDto);
      console.log('Paciente criado com sucesso:', result.id);
      return result;
    } catch (error) {
      console.error('Erro ao criar paciente:', error);
      throw error;
    }
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.RECEPCIONISTA)
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<Paciente[]> {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return await this.pacienteUseCase.findAll(pageNumber, limitNumber);
  }

  @Get('search')
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.RECEPCIONISTA)
  async search(@Query('term') term: string): Promise<Paciente[]> {
    return await this.pacienteUseCase.search(term);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.RECEPCIONISTA)
  async findById(@Param('id') id: string): Promise<Paciente> {
    return await this.pacienteUseCase.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.ENFERMEIRO)
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updatePacienteDto: UpdatePacienteDto,
  ): Promise<Paciente> {
    return await this.pacienteUseCase.update(id, updatePacienteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.ADMIN)
  async delete(@Param('id') id: string): Promise<void> {
    await this.pacienteUseCase.delete(id);
  }
}
