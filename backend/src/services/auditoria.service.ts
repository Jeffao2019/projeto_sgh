import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auditoria } from '../entities/auditoria.entity';

@Injectable()
export class AuditoriaService {
  constructor(
    @InjectRepository(Auditoria)
    private auditoriaRepository: Repository<Auditoria>,
  ) {}

  async registrarAcao(dadosAuditoria: {
    userId: string;
    userRole: string;
    action: string;
    resource: string;
    details?: any;
    ip: string;
    userAgent: string;
    success: boolean;
  }) {
    try {
      const auditoria = this.auditoriaRepository.create(dadosAuditoria);
      await this.auditoriaRepository.save(auditoria);
    } catch (error) {
      console.error('Erro ao registrar auditoria:', error);
    }
  }

  async buscarLogs(filtros: {
    userId?: string;
    action?: string;
    dataInicio?: Date;
    dataFim?: Date;
    limit?: number;
  }) {
    const query = this.auditoriaRepository.createQueryBuilder('audit');

    if (filtros.userId) {
      query.andWhere('audit.userId = :userId', { userId: filtros.userId });
    }

    if (filtros.action) {
      query.andWhere('audit.action = :action', { action: filtros.action });
    }

    if (filtros.dataInicio) {
      query.andWhere('audit.timestamp >= :dataInicio', { dataInicio: filtros.dataInicio });
    }

    if (filtros.dataFim) {
      query.andWhere('audit.timestamp <= :dataFim', { dataFim: filtros.dataFim });
    }

    query.orderBy('audit.timestamp', 'DESC');
    query.limit(filtros.limit || 100);

    return await query.getMany();
  }

  async gerarRelatorioSeguranca(periodo: { inicio: Date; fim: Date }) {
    const logs = await this.buscarLogs({
      dataInicio: periodo.inicio,
      dataFim: periodo.fim,
      limit: 1000
    });

    const tentativasLogin = logs.filter(log => log.action === 'LOGIN');
    const loginsFalhos = tentativasLogin.filter(log => !log.success);
    const acessosNegados = logs.filter(log => log.action === 'ACESSO_NEGADO');

    return {
      totalEventos: logs.length,
      tentativasLogin: tentativasLogin.length,
      loginsFalhos: loginsFalhos.length,
      taxaSucessoLogin: ((tentativasLogin.length - loginsFalhos.length) / tentativasLogin.length * 100).toFixed(2),
      acessosNegados: acessosNegados.length,
      usuariosMaisAtivos: this.obterUsuariosMaisAtivos(logs),
      alertasSeguranca: this.identificarAlertasSeguranca(logs)
    };
  }

  private obterUsuariosMaisAtivos(logs: Auditoria[]) {
    const contadorUsuarios = {};
    logs.forEach(log => {
      contadorUsuarios[log.userId] = (contadorUsuarios[log.userId] || 0) + 1;
    });

    return Object.entries(contadorUsuarios)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([userId, count]) => ({ userId, eventos: count }));
  }

  private identificarAlertasSeguranca(logs: Auditoria[]) {
    const alertas = [];

    // Alert para múltiplas tentativas de login falhadas
    const loginsFalhos = logs.filter(log => log.action === 'LOGIN' && !log.success);
    const tentativasPorIP = {};
    
    loginsFalhos.forEach(log => {
      tentativasPorIP[log.ip] = (tentativasPorIP[log.ip] || 0) + 1;
    });

    Object.entries(tentativasPorIP).forEach(([ip, tentativas]) => {
      if (tentativas >= 5) {
        alertas.push({
          tipo: 'TENTATIVAS_LOGIN_SUSPEITAS',
          descricao: `IP ${ip} com ${tentativas} tentativas de login falhas`,
          severidade: 'ALTA'
        });
      }
    });

    return alertas;
  }
}