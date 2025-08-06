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
  CreateProntuarioDto,
  UpdateProntuarioDto,
} from '../../application/dto/prontuario.dto';
import { ProntuarioUseCase } from '../../application/use-cases/prontuario.use-case';
import { Prontuario } from '../../domain/entities/prontuario.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Prontuários')
@ApiBearerAuth('JWT-auth')
@Controller('prontuarios')
@UseGuards(JwtAuthGuard)
export class ProntuarioController {
  constructor(private readonly prontuarioUseCase: ProntuarioUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createProntuarioDto: CreateProntuarioDto,
  ): Promise<Prontuario> {
    return await this.prontuarioUseCase.create(createProntuarioDto);
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<Prontuario[]> {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return await this.prontuarioUseCase.findAll(pageNumber, limitNumber);
  }

  @Get('paciente/:pacienteId')
  async findByPacienteId(
    @Param('pacienteId') pacienteId: string,
  ): Promise<Prontuario[]> {
    return await this.prontuarioUseCase.findByPacienteId(pacienteId);
  }

  @Get('medico/:medicoId')
  async findByMedicoId(
    @Param('medicoId') medicoId: string,
  ): Promise<Prontuario[]> {
    return await this.prontuarioUseCase.findByMedicoId(medicoId);
  }

  @Get('agendamento/:agendamentoId')
  async findByAgendamentoId(
    @Param('agendamentoId') agendamentoId: string,
  ): Promise<Prontuario | null> {
    return await this.prontuarioUseCase.findByAgendamentoId(agendamentoId);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Prontuario> {
    return await this.prontuarioUseCase.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateProntuarioDto: UpdateProntuarioDto,
  ): Promise<Prontuario> {
    return await this.prontuarioUseCase.update(id, updateProntuarioDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.prontuarioUseCase.delete(id);
  }
}
