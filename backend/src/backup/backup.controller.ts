import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BackupService } from './backup.service';

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
  async exportarDados(@Body() body: { categoria: string }) {
    try {
      const { categoria } = body;
      
      if (!categoria) {
        throw new HttpException(
          'Categoria é obrigatória',
          HttpStatus.BAD_REQUEST,
        );
      }

      const caminho = await this.backupService.exportarDados(categoria);
      
      return {
        success: true,
        message: `Dados da categoria ${categoria} exportados com sucesso`,
        data: { caminho, categoria },
      };
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
}
