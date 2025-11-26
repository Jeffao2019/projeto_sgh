import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LgpdService } from '../services/lgpd.service';

@Controller('lgpd')
@UseGuards(JwtAuthGuard)
export class LgpdController {
  constructor(private lgpdService: LgpdService) {}

  @Get('confirmacao')
  async confirmarTratamento(@Request() req) {
    return await this.lgpdService.confirmarTratamento(req.user.id);
  }

  @Get('meus-dados')
  async exportarMeusDados(@Request() req) {
    return await this.lgpdService.exportarDadosPaciente(req.user.id);
  }

  @Post('anonimizar')
  async anonimizarMeusDados(@Request() req) {
    return await this.lgpdService.anonimizarDados(req.user.id);
  }

  @Delete('eliminar')
  async eliminarMeusDados(
    @Request() req,
    @Body('motivo') motivo: string
  ) {
    return await this.lgpdService.eliminarDados(req.user.id, motivo);
  }

  @Post('revogar-consentimento')
  async revogarConsentimento(
    @Request() req,
    @Body('tipo') tipo: string
  ) {
    return await this.lgpdService.revogarConsentimento(req.user.id, tipo);
  }

  @Get('politica-privacidade')
  async obterPoliticaPrivacidade() {
    return {
      versao: '1.0',
      dataAtualizacao: '2024-01-01',
      conteudo: {
        responsavel: {
          nome: 'Sistema de Gestão Hospitalar',
          contato: 'lgpd@sgh.com.br',
          endereco: 'Endereço da instituição'
        },
        dadosColetados: [
          'Dados pessoais (nome, CPF, email, telefone)',
          'Dados de saúde (prontuários, exames, prescrições)',
          'Dados de contato (endereço, telefone)',
          'Dados de navegação (logs de acesso)'
        ],
        finalidadesTratamento: [
          'Prestação de serviços de saúde',
          'Cumprimento de obrigações legais',
          'Exercício regular de direitos',
          'Proteção da vida ou incolumidade física'
        ],
        basesLegais: [
          'Tutela da saúde (Art. 7º, VII)',
          'Cumprimento de obrigação legal (Art. 7º, II)',
          'Execução de contrato (Art. 7º, V)'
        ],
        compartilhamento: {
          interno: 'Profissionais de saúde autorizados',
          externo: 'Laboratórios conveniados, seguradoras (mediante consentimento)'
        },
        retencao: {
          dadosPessoais: '20 anos após último atendimento',
          prontuarios: 'Permanente (CFM Resolução 1.821/2007)',
          logs: '6 meses'
        },
        direitosTitular: [
          'Confirmação da existência de tratamento',
          'Acesso aos dados',
          'Correção de dados incompletos, inexatos ou desatualizados',
          'Anonimização, bloqueio ou eliminação',
          'Portabilidade dos dados',
          'Eliminação dos dados',
          'Informação sobre compartilhamento',
          'Revogação do consentimento'
        ]
      }
    };
  }
}