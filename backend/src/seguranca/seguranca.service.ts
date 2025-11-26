import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as crypto from 'crypto';

export interface ConfiguracaoSeguranca {
  autenticacaoDoisFatores: boolean;
  biometria: boolean;
  sessaoSegura: boolean;
  logoutAutomatico: boolean;
  tempoLogout: number;
  notificacaoLogin: boolean;
  verificacaoDispositivo: boolean;
  criptografiaAvancada: boolean;
  auditoriaSessao: boolean;
  restricaoIp: boolean;
  senhaComplexidade: 'baixa' | 'media' | 'alta';
}

export interface AlterarSenhaDto {
  senhaAtual: string;
  novaSenha: string;
}

export interface SessaoAtiva {
  id: string;
  dispositivo: string;
  navegador: string;
  ip: string;
  localizacao?: string;
  ultimaAtividade: Date;
  ativa: boolean;
}

export interface HistoricoLogin {
  id: string;
  data: Date;
  ip: string;
  dispositivo: string;
  navegador: string;
  sucesso: boolean;
  motivo?: string;
}

@Injectable()
export class SegurancaService {
  private readonly logger = new Logger(SegurancaService.name);

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Obtém configurações de segurança do usuário
   */
  async getConfiguracoes(userId: string): Promise<ConfiguracaoSeguranca> {
    try {
      // Por enquanto retorna configuração padrão
      // Em implementação real, buscar do banco de dados
      return {
        autenticacaoDoisFatores: true,
        biometria: false,
        sessaoSegura: true,
        logoutAutomatico: true,
        tempoLogout: 30,
        notificacaoLogin: true,
        verificacaoDispositivo: true,
        criptografiaAvancada: true,
        auditoriaSessao: true,
        restricaoIp: false,
        senhaComplexidade: 'alta'
      };
    } catch (error) {
      this.logger.error('Erro ao obter configurações de segurança', error.stack);
      throw error;
    }
  }

  /**
   * Atualiza configurações de segurança
   */
  async atualizarConfiguracoes(
    userId: string, 
    configuracoes: Partial<ConfiguracaoSeguranca>
  ): Promise<ConfiguracaoSeguranca> {
    try {
      this.logger.log(`Atualizando configurações de segurança para usuário: ${userId}`);
      
      // Simular atualização no banco
      await new Promise(resolve => setTimeout(resolve, 500));

      // Registrar alteração para auditoria
      await this.registrarEventoSeguranca(userId, 'configuracao_alterada', {
        configuracoes
      });

      // Retornar configurações atualizadas
      return await this.getConfiguracoes(userId);

    } catch (error) {
      this.logger.error('Erro ao atualizar configurações de segurança', error.stack);
      throw error;
    }
  }

  /**
   * Altera senha do usuário
   */
  async alterarSenha(
    userId: string, 
    dados: AlterarSenhaDto
  ): Promise<{ sucesso: boolean; mensagem: string }> {
    try {
      this.logger.log(`Alterando senha para usuário: ${userId}`);

      // Validar senha atual
      const senhaAtualValida = await this.validarSenhaAtual(userId, dados.senhaAtual);
      if (!senhaAtualValida) {
        return {
          sucesso: false,
          mensagem: 'Senha atual incorreta'
        };
      }

      // Validar complexidade da nova senha
      const complexidadeOk = this.validarComplexidadeSenha(dados.novaSenha);
      if (!complexidadeOk.valida) {
        return {
          sucesso: false,
          mensagem: complexidadeOk.mensagem
        };
      }

      // Hash da nova senha (usando crypto nativo)
      const salt = crypto.randomBytes(16).toString('hex');
      const hashSenha = crypto.pbkdf2Sync(dados.novaSenha, salt, 10000, 64, 'sha512').toString('hex');

      // Simular atualização no banco
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Registrar alteração
      await this.registrarEventoSeguranca(userId, 'senha_alterada', {
        dataAlteracao: new Date()
      });

      this.logger.log(`Senha alterada com sucesso para usuário: ${userId}`);

      return {
        sucesso: true,
        mensagem: 'Senha alterada com sucesso'
      };

    } catch (error) {
      this.logger.error('Erro ao alterar senha', error.stack);
      return {
        sucesso: false,
        mensagem: 'Erro interno. Tente novamente.'
      };
    }
  }

  /**
   * Obtém sessões ativas do usuário
   */
  async getSessoesAtivas(userId: string): Promise<SessaoAtiva[]> {
    try {
      // Simular dados de sessões ativas
      return [
        {
          id: 'session_1',
          dispositivo: 'Chrome - Windows',
          navegador: 'Chrome 119.0',
          ip: '192.168.1.100',
          localizacao: 'São Paulo, SP',
          ultimaAtividade: new Date(),
          ativa: true
        },
        {
          id: 'session_2',
          dispositivo: 'App Mobile - Android',
          navegador: 'App SGH 2.1.0',
          ip: '192.168.1.150',
          localizacao: 'São Paulo, SP',
          ultimaAtividade: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h atrás
          ativa: false
        }
      ];
    } catch (error) {
      this.logger.error('Erro ao obter sessões ativas', error.stack);
      throw error;
    }
  }

  /**
   * Encerra uma sessão específica
   */
  async encerrarSessao(userId: string, sessionId: string): Promise<boolean> {
    try {
      this.logger.log(`Encerrando sessão ${sessionId} para usuário: ${userId}`);

      // Simular encerramento da sessão
      await new Promise(resolve => setTimeout(resolve, 500));

      // Registrar evento
      await this.registrarEventoSeguranca(userId, 'sessao_encerrada', {
        sessionId,
        dataEncerramento: new Date()
      });

      return true;

    } catch (error) {
      this.logger.error('Erro ao encerrar sessão', error.stack);
      return false;
    }
  }

  /**
   * Obtém histórico de login do usuário
   */
  async getHistoricoLogin(userId: string, limite: number = 50): Promise<HistoricoLogin[]> {
    try {
      // Simular dados do histórico
      const historico: HistoricoLogin[] = [];
      
      for (let i = 0; i < limite; i++) {
        const data = new Date(Date.now() - i * 24 * 60 * 60 * 1000); // i dias atrás
        
        historico.push({
          id: `login_${i}`,
          data,
          ip: `192.168.1.${100 + (i % 50)}`,
          dispositivo: i % 3 === 0 ? 'Mobile' : 'Desktop',
          navegador: i % 2 === 0 ? 'Chrome' : 'Firefox',
          sucesso: i % 10 !== 0, // 90% sucesso
          motivo: i % 10 === 0 ? 'Senha incorreta' : undefined
        });
      }

      return historico;

    } catch (error) {
      this.logger.error('Erro ao obter histórico de login', error.stack);
      throw error;
    }
  }

  /**
   * Configura autenticação de dois fatores
   */
  async configurar2FA(userId: string, ativar: boolean): Promise<{
    sucesso: boolean;
    qrCode?: string;
    secret?: string;
    backupCodes?: string[];
  }> {
    try {
      this.logger.log(`${ativar ? 'Ativando' : 'Desativando'} 2FA para usuário: ${userId}`);

      if (ativar) {
        // Gerar secret para 2FA
        const secret = crypto.randomBytes(20).toString('hex');
        
        // Gerar códigos de backup
        const backupCodes = Array.from({ length: 8 }, () => 
          crypto.randomBytes(4).toString('hex').toUpperCase()
        );

        // Simular QR Code (seria gerado com uma biblioteca como qrcode)
        const qrCode = `data:image/svg+xml;base64,${Buffer.from(
          '<svg>QR Code placeholder</svg>'
        ).toString('base64')}`;

        // Registrar ativação
        await this.registrarEventoSeguranca(userId, '2fa_ativado', {
          data: new Date()
        });

        return {
          sucesso: true,
          qrCode,
          secret,
          backupCodes
        };
      } else {
        // Desativar 2FA
        await this.registrarEventoSeguranca(userId, '2fa_desativado', {
          data: new Date()
        });

        return { sucesso: true };
      }

    } catch (error) {
      this.logger.error('Erro ao configurar 2FA', error.stack);
      return { sucesso: false };
    }
  }

  /**
   * Valida senha atual do usuário
   */
  private async validarSenhaAtual(userId: string, senha: string): Promise<boolean> {
    try {
      // Em implementação real, buscar hash da senha do banco
      const hashArmazenado = '$2b$12$example.hash'; // Exemplo
      
      // Por enquanto, simular validação
      return senha === 'senha123'; // Para demonstração

    } catch (error) {
      this.logger.error('Erro ao validar senha atual', error.stack);
      return false;
    }
  }

  /**
   * Valida complexidade da senha
   */
  private validarComplexidadeSenha(senha: string): {
    valida: boolean;
    mensagem: string;
  } {
    if (senha.length < 8) {
      return {
        valida: false,
        mensagem: 'Senha deve ter pelo menos 8 caracteres'
      };
    }

    if (!/(?=.*[a-z])/.test(senha)) {
      return {
        valida: false,
        mensagem: 'Senha deve conter pelo menos uma letra minúscula'
      };
    }

    if (!/(?=.*[A-Z])/.test(senha)) {
      return {
        valida: false,
        mensagem: 'Senha deve conter pelo menos uma letra maiúscula'
      };
    }

    if (!/(?=.*\d)/.test(senha)) {
      return {
        valida: false,
        mensagem: 'Senha deve conter pelo menos um número'
      };
    }

    if (!/(?=.*[@$!%*?&])/.test(senha)) {
      return {
        valida: false,
        mensagem: 'Senha deve conter pelo menos um caractere especial'
      };
    }

    return {
      valida: true,
      mensagem: 'Senha válida'
    };
  }

  /**
   * Registra evento de segurança para auditoria
   */
  private async registrarEventoSeguranca(
    userId: string,
    evento: string,
    dados: any
  ): Promise<void> {
    try {
      const registro = {
        userId,
        evento,
        dados: JSON.stringify(dados),
        timestamp: new Date(),
        ip: '192.168.1.100' // Em implementação real, capturar IP real
      };

      // Simular registro no banco
      this.logger.log(`Evento de segurança registrado: ${evento} para usuário ${userId}`);

    } catch (error) {
      this.logger.error('Erro ao registrar evento de segurança', error.stack);
    }
  }

  /**
   * Calcula nível de segurança baseado nas configurações
   */
  async calcularNivelSeguranca(userId: string): Promise<{
    nivel: 'Baixo' | 'Médio' | 'Alto';
    pontuacao: number;
    recomendacoes: string[];
  }> {
    try {
      const config = await this.getConfiguracoes(userId);
      let pontuacao = 0;
      const recomendacoes: string[] = [];

      // Calcular pontuação
      if (config.autenticacaoDoisFatores) pontuacao += 20;
      else recomendacoes.push('Ativar autenticação de dois fatores');

      if (config.sessaoSegura) pontuacao += 15;
      else recomendacoes.push('Ativar sessão segura');

      if (config.senhaComplexidade === 'alta') pontuacao += 20;
      else if (config.senhaComplexidade === 'media') pontuacao += 10;
      else recomendacoes.push('Usar senha de alta complexidade');

      if (config.criptografiaAvancada) pontuacao += 15;
      else recomendacoes.push('Ativar criptografia avançada');

      if (config.auditoriaSessao) pontuacao += 10;
      else recomendacoes.push('Ativar auditoria de sessão');

      if (config.verificacaoDispositivo) pontuacao += 10;
      else recomendacoes.push('Ativar verificação de dispositivo');

      if (config.logoutAutomatico) pontuacao += 5;
      if (config.notificacaoLogin) pontuacao += 5;

      // Determinar nível
      let nivel: 'Baixo' | 'Médio' | 'Alto';
      if (pontuacao >= 80) nivel = 'Alto';
      else if (pontuacao >= 50) nivel = 'Médio';
      else nivel = 'Baixo';

      return { nivel, pontuacao, recomendacoes };

    } catch (error) {
      this.logger.error('Erro ao calcular nível de segurança', error.stack);
      throw error;
    }
  }
}
