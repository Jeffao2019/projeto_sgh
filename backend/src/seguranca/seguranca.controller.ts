import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SegurancaService, AlterarSenhaDto, ConfiguracaoSeguranca } from './seguranca.service';

@Controller('seguranca')
export class SegurancaController {
  constructor(private readonly segurancaService: SegurancaService) {}

  /**
   * Obtém configurações de segurança do usuário
   */
  @Get('configuracoes/:userId')
  async getConfiguracoes(@Param('userId') userId: string) {
    try {
      const configuracoes = await this.segurancaService.getConfiguracoes(userId);
      
      return {
        success: true,
        data: configuracoes,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Erro ao obter configurações de segurança',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Atualiza configurações de segurança
   */
  @Put('configuracoes/:userId')
  async atualizarConfiguracoes(
    @Param('userId') userId: string,
    @Body() configuracoes: Partial<ConfiguracaoSeguranca>
  ) {
    try {
      const resultado = await this.segurancaService.atualizarConfiguracoes(userId, configuracoes);
      
      return {
        success: true,
        message: 'Configurações atualizadas com sucesso',
        data: resultado,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Erro ao atualizar configurações',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Altera senha do usuário
   */
  @Post('alterar-senha/:userId')
  async alterarSenha(
    @Param('userId') userId: string,
    @Body() dados: AlterarSenhaDto
  ) {
    try {
      if (!dados.senhaAtual || !dados.novaSenha) {
        throw new HttpException(
          'Senha atual e nova senha são obrigatórias',
          HttpStatus.BAD_REQUEST,
        );
      }

      const resultado = await this.segurancaService.alterarSenha(userId, dados);
      
      return {
        success: resultado.sucesso,
        message: resultado.mensagem,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Erro ao alterar senha',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtém sessões ativas do usuário
   */
  @Get('sessoes/:userId')
  async getSessoesAtivas(@Param('userId') userId: string) {
    try {
      const sessoes = await this.segurancaService.getSessoesAtivas(userId);
      
      return {
        success: true,
        data: sessoes,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Erro ao obter sessões ativas',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Encerra uma sessão específica
   */
  @Post('encerrar-sessao/:userId/:sessionId')
  async encerrarSessao(
    @Param('userId') userId: string,
    @Param('sessionId') sessionId: string
  ) {
    try {
      const resultado = await this.segurancaService.encerrarSessao(userId, sessionId);
      
      return {
        success: resultado,
        message: resultado ? 'Sessão encerrada com sucesso' : 'Erro ao encerrar sessão',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Erro ao encerrar sessão',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtém histórico de login do usuário
   */
  @Get('historico-login/:userId')
  async getHistoricoLogin(
    @Param('userId') userId: string,
    @Body('limite') limite?: number
  ) {
    try {
      const historico = await this.segurancaService.getHistoricoLogin(userId, limite);
      
      return {
        success: true,
        data: historico,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Erro ao obter histórico de login',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Configura autenticação de dois fatores
   */
  @Post('configurar-2fa/:userId')
  async configurar2FA(
    @Param('userId') userId: string,
    @Body() dados: { ativar: boolean }
  ) {
    try {
      const resultado = await this.segurancaService.configurar2FA(userId, dados.ativar);
      
      return {
        success: resultado.sucesso,
        message: dados.ativar ? 
          'Autenticação de dois fatores ativada' : 
          'Autenticação de dois fatores desativada',
        data: resultado,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Erro ao configurar 2FA',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Calcula nível de segurança da conta
   */
  @Get('nivel-seguranca/:userId')
  async calcularNivelSeguranca(@Param('userId') userId: string) {
    try {
      const nivel = await this.segurancaService.calcularNivelSeguranca(userId);
      
      return {
        success: true,
        data: nivel,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Erro ao calcular nível de segurança',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
