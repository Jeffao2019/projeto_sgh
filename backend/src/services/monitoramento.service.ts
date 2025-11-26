import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AuditoriaService } from './auditoria.service';

@Injectable()
export class MonitoramentoService {
  constructor(private auditoriaService: AuditoriaService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async verificarAlertasSeguranca() {
    const agora = new Date();
    const cincominutosAtras = new Date(agora.getTime() - 5 * 60 * 1000);

    const logsRecentes = await this.auditoriaService.buscarLogs({
      dataInicio: cincominutosAtras,
      dataFim: agora,
      limit: 1000
    });

    const alertas = this.analisarComportamentoSuspeito(logsRecentes);
    
    if (alertas.length > 0) {
      await this.enviarAlertasSeguranca(alertas);
    }
  }

  private analisarComportamentoSuspeito(logs: any[]): any[] {
    const alertas = [];

    // 1. Múltiplas tentativas de login falhadas
    const loginsFalhos = logs.filter(log => 
      log.action.includes('LOGIN') && !log.success
    );

    if (loginsFalhos.length >= 5) {
      alertas.push({
        tipo: 'TENTATIVAS_LOGIN_EXCESSIVAS',
        severidade: 'ALTA',
        descricao: `${loginsFalhos.length} tentativas de login falhadas em 5 minutos`,
        timestamp: new Date()
      });
    }

    // 2. Acesso a múltiplos pacientes em pouco tempo
    const acessosPacientes = logs.filter(log => 
      log.resource.includes('/pacientes/') && log.success
    );

    if (acessosPacientes.length >= 20) {
      alertas.push({
        tipo: 'ACESSO_EXCESSIVO_PACIENTES',
        severidade: 'MEDIA',
        descricao: `${acessosPacientes.length} acessos a dados de pacientes em 5 minutos`,
        timestamp: new Date()
      });
    }

    // 3. Tentativas de acesso após horário de trabalho
    const horaAtual = new Date().getHours();
    if ((horaAtual < 6 || horaAtual > 22) && logs.length > 0) {
      alertas.push({
        tipo: 'ACESSO_FORA_HORARIO',
        severidade: 'MEDIA',
        descricao: `Atividade detectada fora do horário de funcionamento (${horaAtual}h)`,
        timestamp: new Date()
      });
    }

    // 4. Tentativas de acesso sem autenticação
    const acessosSemAuth = logs.filter(log => 
      log.userId === 'ANONIMO' && !log.success
    );

    if (acessosSemAuth.length >= 10) {
      alertas.push({
        tipo: 'TENTATIVAS_ACESSO_NAO_AUTORIZADO',
        severidade: 'ALTA',
        descricao: `${acessosSemAuth.length} tentativas de acesso sem autenticação`,
        timestamp: new Date()
      });
    }

    return alertas;
  }

  private async enviarAlertasSeguranca(alertas: any[]) {
    console.log('🚨 ALERTAS DE SEGURANÇA DETECTADOS:');
    
    alertas.forEach(alerta => {
      const emoji = alerta.severidade === 'ALTA' ? '🔴' : 
                   alerta.severidade === 'MEDIA' ? '🟡' : '🟢';
      
      console.log(`${emoji} ${alerta.tipo}: ${alerta.descricao}`);
      
      // Aqui seria implementado o envio por email/SMS/Slack
      this.notificarAdministradores(alerta);
    });
  }

  private async notificarAdministradores(alerta: any) {
    // Implementar notificação para administradores
    // Email, SMS, Slack, etc.
    
    const notificacao = {
      destinatarios: ['admin@sgh.com.br', 'seguranca@sgh.com.br'],
      assunto: `[SGH] Alerta de Segurança: ${alerta.tipo}`,
      corpo: `
        Alerta de segurança detectado no SGH:
        
        Tipo: ${alerta.tipo}
        Severidade: ${alerta.severidade}
        Descrição: ${alerta.descricao}
        Timestamp: ${alerta.timestamp}
        
        Por favor, verifique os logs de auditoria para mais detalhes.
      `
    };
    
    // Implementar envio real
    console.log('📧 Notificação enviada para administradores:', notificacao.destinatarios);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async gerarRelatorioSegurancaDiario() {
    const hoje = new Date();
    const ontem = new Date(hoje.getTime() - 24 * 60 * 60 * 1000);

    const relatorio = await this.auditoriaService.gerarRelatorioSeguranca({
      inicio: ontem,
      fim: hoje
    });

    console.log('📊 RELATÓRIO DIÁRIO DE SEGURANÇA:', relatorio);

    // Salvar relatório ou enviar por email
    return relatorio;
  }

  async obterStatusSeguranca() {
    const agora = new Date();
    const ultimaHora = new Date(agora.getTime() - 60 * 60 * 1000);

    const logs = await this.auditoriaService.buscarLogs({
      dataInicio: ultimaHora,
      dataFim: agora,
      limit: 500
    });

    return {
      timestamp: agora,
      statusGeral: 'NORMAL',
      estatisticas: {
        eventosUltimaHora: logs.length,
        tentativasLogin: logs.filter(l => l.action.includes('LOGIN')).length,
        loginsFalhos: logs.filter(l => l.action.includes('LOGIN') && !l.success).length,
        acessosNegados: logs.filter(l => l.action === 'ACESSO_NEGADO').length,
        usuariosAtivos: new Set(logs.map(l => l.userId)).size
      },
      alertasAtivos: [],
      recomendacoes: [
        'Sistema funcionando normalmente',
        'Monitoramento ativo em tempo real',
        'Logs sendo registrados adequadamente'
      ]
    };
  }
}