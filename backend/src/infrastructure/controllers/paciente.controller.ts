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
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Pacientes')
@ApiBearerAuth('JWT-auth')
@Controller('pacientes')
@UseGuards(JwtAuthGuard)
export class PacienteController {
  constructor(private readonly pacienteUseCase: PacienteUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
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
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<Paciente[]> {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return await this.pacienteUseCase.findAll(pageNumber, limitNumber);
  }

  @Get('search')
  async search(@Query('term') term: string): Promise<Paciente[]> {
    return await this.pacienteUseCase.search(term);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Paciente> {
    return await this.pacienteUseCase.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updatePacienteDto: UpdatePacienteDto,
  ): Promise<Paciente> {
    return await this.pacienteUseCase.update(id, updatePacienteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.pacienteUseCase.delete(id);
  }
}
