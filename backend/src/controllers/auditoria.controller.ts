import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { AuditoriaService } from '../services/auditoria.service';

@Controller('auditoria')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditoriaController {
  constructor(private auditoriaService: AuditoriaService) {}

  @Get('logs')
  @Roles('ADMIN')
  async buscarLogs(
    @Query('userId') userId?: string,
    @Query('action') action?: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
    @Query('limit') limit?: string,
  ) {
    const filtros = {
      userId,
      action,
      dataInicio: dataInicio ? new Date(dataInicio) : undefined,
      dataFim: dataFim ? new Date(dataFim) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    };

    return await this.auditoriaService.buscarLogs(filtros);
  }

  @Get('relatorio-seguranca')
  @Roles('ADMIN')
  async gerarRelatorioSeguranca(
    @Query('inicio') inicio: string,
    @Query('fim') fim: string,
  ) {
    const periodo = {
      inicio: new Date(inicio),
      fim: new Date(fim)
    };

    return await this.auditoriaService.gerarRelatorioSeguranca(periodo);
  }
}