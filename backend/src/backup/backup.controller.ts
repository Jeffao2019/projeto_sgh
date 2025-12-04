import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Res,
  Header,
  Put,
} from '@nestjs/common';
import { Response } from 'express';
import { BackupService } from './backup.service';
import * as fs from 'fs';
import * as path from 'path';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  /**
   * Executa backup manual
   */
  @Post('manual')
  async executarBackupManual() {
    try {
      if (this.backupService.isBackupEmAndamento()) {
        throw new HttpException(
          'Backup já em andamento',
          HttpStatus.CONFLICT,
        );
      }

      const resultado = await this.backupService.backupManual();
      
      return {
        success: true,
        message: 'Backup manual executado com sucesso',
        data: resultado,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Erro ao executar backup manual',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Lista todos os backups
   */
  @Get('lista')
  async listarBackups() {
    try {
      const backups = await this.backupService.listarBackups();
      
      return {
        success: true,
        data: backups.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Erro ao listar backups',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtém estatísticas de armazenamento
   */
  @Get('estatisticas')
  async getEstatisticas() {
    try {
      const estatisticas = await this.backupService.getEstatisticasArmazenamento();
      
      return {
        success: true,
        data: estatisticas,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Erro ao obter estatísticas',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Exporta dados de uma categoria
   */
  @Post('exportar')
  @Header('Content-Type', 'application/json')
  async exportarDados(@Body() body: { categoria: string }, @Res() res: Response) {
    try {
      const { categoria } = body;
      
      if (!categoria) {
        throw new HttpException(
          'Categoria é obrigatória',
          HttpStatus.BAD_REQUEST,
        );
      }

      const caminhoArquivo = await this.backupService.exportarDados(categoria);
      
      // Verificar se arquivo existe
      if (!fs.existsSync(caminhoArquivo)) {
        throw new HttpException(
          'Arquivo de exportação não encontrado',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Ler conteúdo do arquivo
      const conteudoArquivo = fs.readFileSync(caminhoArquivo, 'utf8');
      const dadosExportados = JSON.parse(conteudoArquivo);
      
      // Configurar headers para download
      const nomeArquivo = path.basename(caminhoArquivo);
      res.setHeader('Content-Disposition', `attachment; filename="${nomeArquivo}"`);
      res.setHeader('Content-Type', 'application/json');
      
      // Retornar arquivo real para download
      return res.json(dadosExportados);
      
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Erro ao exportar dados',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Limpa cache do sistema
   */
  @Post('limpar-cache')
  async limparCache() {
    try {
      await this.backupService.limparCache();
      
      return {
        success: true,
        message: 'Cache limpo com sucesso',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Erro ao limpar cache',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Verifica status do backup
   */
  @Get('status')
  async getStatus() {
    try {
      const emAndamento = this.backupService.isBackupEmAndamento();
      
      return {
        success: true,
        data: {
          backup_em_andamento: emAndamento,
          ultimo_backup: emAndamento ? null : 'Disponível para execução',
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Erro ao verificar status',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtém configurações de backup
   */
  @Get('configuracoes')
  async obterConfiguracoes() {
    try {
      console.log('🔄 [BackupController] Obtendo configurações...');
      const config = await this.backupService.getBackupConfig();
      console.log('✅ [BackupController] Configurações obtidas:', config);
      
      return {
        success: true,
        data: config,
      };
    } catch (error) {
      console.error('❌ [BackupController] Erro ao obter configurações:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Erro ao obter configurações',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Salva configurações de backup
   */
  @Put('configuracoes')
  async salvarConfiguracoes(@Body() config: any) {
    try {
      console.log('🔄 [BackupController] Salvando configurações:', config);
      const configSalva = await this.backupService.salvarBackupConfig(config);
      console.log('✅ [BackupController] Configurações salvas:', configSalva);
      
      return {
        success: true,
        message: 'Configurações salvas com sucesso',
        data: configSalva,
      };
    } catch (error) {
      console.error('❌ [BackupController] Erro ao salvar configurações:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Erro ao salvar configurações',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
