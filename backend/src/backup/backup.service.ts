import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export interface BackupConfig {
  automatico: boolean;
  frequencia: string;
  horario: string;
  retencao: number;
  local: string;
  compressao: boolean;
  criptografia: boolean;
}

export interface BackupInfo {
  id: string;
  data: Date;
  tipo: 'automatico' | 'manual';
  tamanho: number;
  status: 'sucesso' | 'falha' | 'em_andamento';
  erro?: string;
  localizacao: string;
  hash?: string;
}

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);
  private backupEmAndamento = false;

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Executa backup manual
   */
  async backupManual(): Promise<BackupInfo> {
    this.logger.log('Iniciando backup manual...');
    return await this.executarBackup('manual');
  }

  /**
   * Executa o processo de backup
   */
  private async executarBackup(tipo: 'automatico' | 'manual'): Promise<BackupInfo> {
    if (this.backupEmAndamento) {
      throw new Error('Backup já em andamento');
    }

    this.backupEmAndamento = true;
    const backupId = this.gerarIdBackup();
    const dataBackup = new Date();

    try {
      this.logger.log(`Iniciando backup ${tipo} - ID: ${backupId}`);

      // Simular processo de backup
      const backupPath = await this.criarBackupSimulado(backupId);
      const hash = await this.calcularHash(backupPath);
      const stats = fs.statSync(backupPath);
      
      const backupInfo: BackupInfo = {
        id: backupId,
        data: dataBackup,
        tipo,
        tamanho: stats.size,
        status: 'sucesso',
        localizacao: backupPath,
        hash
      };

      await this.salvarInfoBackup(backupInfo);
      await this.limparBackupsAntigos();

      this.logger.log(`Backup ${tipo} concluído com sucesso - ID: ${backupId}`);
      return backupInfo;

    } catch (error) {
      this.logger.error(`Erro no backup ${tipo} - ID: ${backupId}`, error.stack);
      
      const backupInfo: BackupInfo = {
        id: backupId,
        data: dataBackup,
        tipo,
        tamanho: 0,
        status: 'falha',
        erro: error.message,
        localizacao: ''
      };

      await this.salvarInfoBackup(backupInfo);
      throw error;

    } finally {
      this.backupEmAndamento = false;
    }
  }

  /**
   * Cria um backup simulado para demonstração
   */
  private async criarBackupSimulado(backupId: string): Promise<string> {
    const backupDir = this.getBackupDirectory();
    const backupPath = path.join(backupDir, `${backupId}_backup.json`);

    // Simular dados de backup
    const backupData = {
      id: backupId,
      timestamp: new Date().toISOString(),
      database: 'SGH Hospital Management System',
      tables: ['usuarios', 'pacientes', 'agendamentos', 'prontuarios', 'exames'],
      recordCount: {
        usuarios: 342,
        pacientes: 15847,
        agendamentos: 8921,
        prontuarios: 42153,
        exames: 28674
      },
      metadata: {
        version: '2.1.4',
        created_by: 'BackupService',
        compression: true,
        encryption: true
      }
    };

    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
    this.logger.log(`Backup simulado criado: ${backupPath}`);
    
    return backupPath;
  }

  /**
   * Calcula hash do arquivo para verificação de integridade
   */
  private async calcularHash(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);

      stream.on('data', data => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  }

  /**
   * Salva informações do backup
   */
  private async salvarInfoBackup(backupInfo: BackupInfo): Promise<void> {
    const infoPath = path.join(this.getBackupDirectory(), 'backups.json');
    
    let backups: BackupInfo[] = [];
    if (fs.existsSync(infoPath)) {
      const data = fs.readFileSync(infoPath, 'utf8');
      backups = JSON.parse(data);
    }

    backups.push(backupInfo);
    fs.writeFileSync(infoPath, JSON.stringify(backups, null, 2));
  }

  /**
   * Remove backups antigos baseado na configuração de retenção
   */
  private async limparBackupsAntigos(): Promise<void> {
    const config = await this.getBackupConfig();
    const retencaoDias = config.retencao || 30;
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - retencaoDias);

    const infoPath = path.join(this.getBackupDirectory(), 'backups.json');
    
    if (!fs.existsSync(infoPath)) return;

    const data = fs.readFileSync(infoPath, 'utf8');
    const backups: BackupInfo[] = JSON.parse(data);

    const backupsParaManter = backups.filter(backup => {
      if (new Date(backup.data) < dataLimite) {
        if (fs.existsSync(backup.localizacao)) {
          fs.unlinkSync(backup.localizacao);
          this.logger.log(`Backup antigo removido: ${backup.localizacao}`);
        }
        return false;
      }
      return true;
    });

    fs.writeFileSync(infoPath, JSON.stringify(backupsParaManter, null, 2));
  }

  /**
   * Obtém configurações de backup
   */
  private async getBackupConfig(): Promise<BackupConfig> {
    return {
      automatico: true,
      frequencia: 'diario',
      horario: '02:00',
      retencao: 30,
      local: 'local',
      compressao: true,
      criptografia: true
    };
  }

  /**
   * Obtém diretório de backup
   */
  private getBackupDirectory(): string {
    const backupDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    return backupDir;
  }

  /**
   * Gera ID único para backup
   */
  private gerarIdBackup(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const random = Math.random().toString(36).substring(2, 8);
    return `backup_${timestamp}_${random}`;
  }

  /**
   * Obtém lista de backups
   */
  async listarBackups(): Promise<BackupInfo[]> {
    const infoPath = path.join(this.getBackupDirectory(), 'backups.json');
    
    if (!fs.existsSync(infoPath)) {
      return [];
    }

    const data = fs.readFileSync(infoPath, 'utf8');
    return JSON.parse(data);
  }

  /**
   * Obtém estatísticas de armazenamento
   */
  async getEstatisticasArmazenamento() {
    const backupDir = this.getBackupDirectory();
    let tamanhoBackups = 0;
    
    if (fs.existsSync(backupDir)) {
      const files = fs.readdirSync(backupDir);
      for (const file of files) {
        const filePath = path.join(backupDir, file);
        if (fs.statSync(filePath).isFile()) {
          const stats = fs.statSync(filePath);
          tamanhoBackups += stats.size;
        }
      }
    }

    return {
      total: 100,
      usado: 45,
      disponivel: 55,
      backups: Math.round(tamanhoBackups / (1024 * 1024)), // MB
      logs: 89, // MB
      temp: 2   // MB
    };
  }

  /**
   * Verifica se backup está em andamento
   */
  isBackupEmAndamento(): boolean {
    return this.backupEmAndamento;
  }

  /**
   * Exporta dados de uma categoria específica
   */
  async exportarDados(categoria: string): Promise<string> {
    this.logger.log(`Exportando dados da categoria: ${categoria}`);
    
    const exportDir = path.join(process.cwd(), 'exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const exportPath = path.join(exportDir, `${categoria}_${timestamp}.json`);

    // Simular exportação de dados
    const dadosExportados = {
      categoria,
      data_exportacao: new Date().toISOString(),
      total_registros: Math.floor(Math.random() * 50000) + 1000,
      formato: 'JSON',
      dados: `Dados simulados da categoria ${categoria}`
    };

    fs.writeFileSync(exportPath, JSON.stringify(dadosExportados, null, 2));
    
    return exportPath;
  }

  /**
   * Limpa cache do sistema
   */
  async limparCache(): Promise<void> {
    this.logger.log('Iniciando limpeza de cache...');
    
    const cacheDir = path.join(process.cwd(), 'cache');
    if (fs.existsSync(cacheDir)) {
      const files = fs.readdirSync(cacheDir);
      for (const file of files) {
        const filePath = path.join(cacheDir, file);
        fs.unlinkSync(filePath);
      }
      this.logger.log(`${files.length} arquivos de cache removidos`);
    }
  }
}
