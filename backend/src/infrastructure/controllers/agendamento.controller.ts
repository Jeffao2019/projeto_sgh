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
  CreateAgendamentoDto,
  UpdateAgendamentoDto,
} from '../../application/dto/agendamento.dto';
import { AgendamentoUseCase } from '../../application/use-cases/agendamento.use-case';
import { Agendamento } from '../../domain/entities/agendamento.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Agendamentos')
@ApiBearerAuth('JWT-auth')
@Controller('agendamentos')
@UseGuards(JwtAuthGuard)
export class AgendamentoController {
  constructor(private readonly agendamentoUseCase: AgendamentoUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createAgendamentoDto: CreateAgendamentoDto,
  ): Promise<Agendamento> {
    return await this.agendamentoUseCase.create(createAgendamentoDto);
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<Agendamento[]> {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 50;
    return await this.agendamentoUseCase.findAll(pageNumber, limitNumber);
  }

  @Get('paciente/:pacienteId')
  async findByPacienteId(
    @Param('pacienteId') pacienteId: string,
  ): Promise<Agendamento[]> {
    return await this.agendamentoUseCase.findByPacienteId(pacienteId);
  }

  @Get('medico/:medicoId')
  async findByMedicoId(
    @Param('medicoId') medicoId: string,
  ): Promise<Agendamento[]> {
    return await this.agendamentoUseCase.findByMedicoId(medicoId);
  }

  @Get('date-range')
  async findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Agendamento[]> {
    return await this.agendamentoUseCase.findByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('para-prontuario')
  async findAgendamentosParaProntuario(): Promise<Agendamento[]> {
    return await this.agendamentoUseCase.findAgendamentosParaProntuario();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Agendamento> {
    return await this.agendamentoUseCase.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateAgendamentoDto: UpdateAgendamentoDto,
  ): Promise<Agendamento> {
    return await this.agendamentoUseCase.update(id, updateAgendamentoDto);
  }

  @Put(':id/confirmar')
  async confirmar(@Param('id') id: string): Promise<Agendamento> {
    return await this.agendamentoUseCase.confirmar(id);
  }

  @Put(':id/cancelar')
  async cancelar(@Param('id') id: string): Promise<Agendamento> {
    return await this.agendamentoUseCase.cancelar(id);
  }

  @Put(':id/finalizar')
  async finalizar(@Param('id') id: string): Promise<Agendamento> {
    return await this.agendamentoUseCase.finalizar(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.agendamentoUseCase.delete(id);
  }
}
