import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { apiService } from '@/lib/api-service';
import { 
  Database, 
  Download, 
  Upload, 
  HardDrive, 
  Calendar, 
  Clock, 
  Settings, 
  Trash2,
  Shield,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  Archive,
  CloudUpload,
  Server,
  History,
  FileText,
  Zap
} from 'lucide-react';

interface BackupConfig {
  automatico: boolean;
  frequencia: string;
  horario: string;
  retencao: number;
  local: string;
  compressao: boolean;
  criptografia: boolean;
}

interface StorageInfo {
  total: number;
  usado: number;
  disponivel: number;
  backups: number;
  logs: number;
  temp: number;
}

export default function DadosBackup() {
  const [backupConfig, setBackupConfig] = useState<BackupConfig>({
    automatico: true,
    frequencia: 'diario',
    horario: '02:00',
    retencao: 30,
    local: 'local',
    compressao: true,
    criptografia: true
  });

  const [storageInfo, setStorageInfo] = useState<StorageInfo>({
    total: 100,
    usado: 45,
    disponivel: 55,
    backups: 15,
    logs: 8,
    temp: 2
  });

  const [ultimoBackup, setUltimoBackup] = useState<string>('26/11/2025 02:00');
  const [proximoBackup, setProximoBackup] = useState<string>('27/11/2025 02:00');
  const [backupEmAndamento, setBackupEmAndamento] = useState<boolean>(false);
  const [progressoBackup, setProgressoBackup] = useState<number>(0);
  
  // Estado para notificações
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Fechar notificação automaticamente
  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => {
        setSnackbar(prev => ({ ...prev, open: false }));
      }, 4000); // 4 segundos

      return () => clearTimeout(timer);
    }
  }, [snackbar.open]);

  const historicoBackups = [
    { id: 1, data: '26/11/2025 02:00', tipo: 'Automático', tamanho: '2.3 GB', status: 'Sucesso' },
    { id: 2, data: '25/11/2025 02:00', tipo: 'Automático', tamanho: '2.1 GB', status: 'Sucesso' },
    { id: 3, data: '24/11/2025 14:30', tipo: 'Manual', tamanho: '2.0 GB', status: 'Sucesso' },
    { id: 4, data: '24/11/2025 02:00', tipo: 'Automático', tamanho: '1.9 GB', status: 'Sucesso' },
    { id: 5, data: '23/11/2025 02:00', tipo: 'Automático', tamanho: '1.8 GB', status: 'Falha' }
  ];

  const dadosPorCategoria = [
    { categoria: 'Pacientes', registros: '15.847', tamanho: '45.2 MB', ultimaAtualizacao: 'Há 2 minutos' },
    { categoria: 'Agendamentos', registros: '8.921', tamanho: '12.8 MB', ultimaAtualizacao: 'Há 5 minutos' },
    { categoria: 'Prontuários', registros: '42.153', tamanho: '1.2 GB', ultimaAtualizacao: 'Há 1 minuto' },
    { categoria: 'Exames', registros: '28.674', tamanho: '856 MB', ultimaAtualizacao: 'Há 3 minutos' },
    { categoria: 'Usuários', registros: '342', tamanho: '2.1 MB', ultimaAtualizacao: 'Há 10 minutos' },
    { categoria: 'Logs do Sistema', registros: '125.847', tamanho: '89.3 MB', ultimaAtualizacao: 'Agora' }
  ];

  const handleBackupManual = async () => {
    console.log('🔄 Iniciando backup manual...');
    setBackupEmAndamento(true);
    setProgressoBackup(0);
    
    try {
      // Simular progresso do backup
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProgressoBackup(i);
      }
      
      // Criar arquivo de backup
      const backupData = {
        timestamp: new Date().toISOString(),
        versao: '1.0.0',
        tipo: 'manual',
        dados: {
          pacientes: 12,
          agendamentos: 70,
          prontuarios: 41,
          usuarios: 5
        },
        tamanho: '2.3 GB',
        status: 'completo'
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { 
        type: 'application/json' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `backup_manual_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setTimeout(() => {
        setBackupEmAndamento(false);
        setProgressoBackup(0);
        setUltimoBackup(new Date().toLocaleString('pt-BR'));
        
        setSnackbar({
          open: true,
          message: 'Backup manual concluído com sucesso!',
          severity: 'success'
        });
        
        console.log('✅ Backup manual concluído!');
      }, 1000);
      
    } catch (error) {
      setBackupEmAndamento(false);
      setProgressoBackup(0);
      
      setSnackbar({
        open: true,
        message: 'Erro durante o backup. Tente novamente.',
        severity: 'error'
      });
      
      console.error('❌ Erro no backup:', error);
    }
  };

  const handleLimparCache = async () => {
    console.log('🔄 Limpando cache do sistema...');
    
    try {
      // Simular limpeza de cache
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSnackbar({
        open: true,
        message: 'Cache do sistema limpo com sucesso!',
        severity: 'success'
      });
      
      console.log('✅ Cache limpo com sucesso!');
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao limpar cache. Tente novamente.',
        severity: 'error'
      });
      
      console.error('❌ Erro ao limpar cache:', error);
    }
  };

  const handleExportarDados = async (categoria: string) => {
    console.log(`🔄 Iniciando exportação de ${categoria}...`);
    
    try {
      // Mostrar notificação de início
      setSnackbar({
        open: true,
        message: `Exportando dados de ${categoria}...`,
        severity: 'info'
      });

      // Fazer chamada real para a API
      const response: any = await apiService.post('/backup/exportar', { 
        categoria: categoria.toLowerCase() 
      });

      console.log(`✅ Resposta da API:`, response);

      if (response.success) {
        // Se a API retornou sucesso, criar download com dados reais
        const downloadData = {
          categoria,
          timestamp: new Date().toISOString(),
          usuario: 'admin@sgh.com',
          formato: 'JSON',
          resultado: response.message || 'Exportação realizada com sucesso',
          dados: response.data || {}
        };

        // Criar blob e fazer download
        const blob = new Blob([JSON.stringify(downloadData, null, 2)], { 
          type: 'application/json' 
        });
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `export_${categoria.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        setSnackbar({
          open: true,
          message: `${categoria} exportado com sucesso!`,
          severity: 'success'
        });
      } else {
        throw new Error(response.message || 'Erro na exportação');
      }

    } catch (error: any) {
      console.error(`❌ Erro ao exportar ${categoria}:`, error);
      
      // Fallback: criar exportação simulada em caso de erro
      const dadosExport = {
        categoria,
        timestamp: new Date().toISOString(),
        usuario: 'admin@sgh.com',
        formato: 'JSON',
        erro: error.message || 'Erro desconhecido',
        dados: `Dados de ${categoria} não puderam ser exportados - erro de conexão`
      };

      const blob = new Blob([JSON.stringify(dadosExport, null, 2)], { 
        type: 'application/json' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `export_${categoria.toLowerCase().replace(/\s+/g, '_')}_erro_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSnackbar({
        open: true,
        message: `Erro ao exportar ${categoria}. Arquivo de erro gerado.`,
        severity: 'error'
      });
    }
  };

  const handleImportarDados = async () => {
    console.log('🔄 Importando dados...');
    
    try {
      // Criar input file temporário
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json,.csv,.xlsx';
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          console.log(`📁 Arquivo selecionado: ${file.name}`);
          
          // Simular importação
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          setSnackbar({
            open: true,
            message: `Dados importados de ${file.name} com sucesso!`,
            severity: 'success'
          });
          
          console.log('✅ Importação concluída!');
        }
      };
      
      input.click();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro durante a importação. Tente novamente.',
        severity: 'error'
      });
      
      console.error('❌ Erro na importação:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Sucesso':
        return <Badge className="bg-green-100 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Sucesso
        </Badge>;
      case 'Falha':
        return <Badge variant="destructive">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Falha
        </Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header com Status Geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <HardDrive className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Armazenamento</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">{storageInfo.usado} GB</span>
                    <span className="text-sm text-muted-foreground">de {storageInfo.total} GB</span>
                  </div>
                  <Progress value={storageInfo.usado} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Archive className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Último Backup</p>
                <div>
                  <span className="text-lg font-bold">{ultimoBackup}</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Próximo: {proximoBackup}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total de Dados</p>
                <div>
                  <span className="text-lg font-bold">2.3 GB</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    147.829 registros
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configurações de Backup Automático */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <CardTitle>Configurações de Backup Automático</CardTitle>
          </div>
          <CardDescription>
            Configure os backups automáticos do sistema para proteger seus dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Backup Automático</Label>
                <Switch 
                  checked={backupConfig.automatico}
                  onCheckedChange={(checked) => 
                    setBackupConfig(prev => ({ ...prev, automatico: checked }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Frequência do Backup</Label>
                <Select 
                  value={backupConfig.frequencia}
                  onValueChange={(value) => 
                    setBackupConfig(prev => ({ ...prev, frequencia: value }))
                  }
                  disabled={!backupConfig.automatico}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diario">Diário</SelectItem>
                    <SelectItem value="semanal">Semanal</SelectItem>
                    <SelectItem value="mensal">Mensal</SelectItem>
                    <SelectItem value="personalizado">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Horário do Backup</Label>
                <Input 
                  type="time"
                  value={backupConfig.horario}
                  onChange={(e) => 
                    setBackupConfig(prev => ({ ...prev, horario: e.target.value }))
                  }
                  disabled={!backupConfig.automatico}
                />
              </div>

              <div className="space-y-2">
                <Label>Retenção (dias)</Label>
                <Input 
                  type="number"
                  value={backupConfig.retencao}
                  onChange={(e) => 
                    setBackupConfig(prev => ({ ...prev, retencao: parseInt(e.target.value) }))
                  }
                  min="1"
                  max="365"
                  disabled={!backupConfig.automatico}
                />
                <p className="text-xs text-muted-foreground">
                  Backups serão mantidos por {backupConfig.retencao} dias
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Local de Armazenamento</Label>
                <Select 
                  value={backupConfig.local}
                  onValueChange={(value) => 
                    setBackupConfig(prev => ({ ...prev, local: value }))
                  }
                  disabled={!backupConfig.automatico}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o local" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Armazenamento Local</SelectItem>
                    <SelectItem value="aws">Amazon S3</SelectItem>
                    <SelectItem value="azure">Azure Blob Storage</SelectItem>
                    <SelectItem value="gcp">Google Cloud Storage</SelectItem>
                    <SelectItem value="ftp">Servidor FTP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm">Compressão</Label>
                <Switch 
                  checked={backupConfig.compressao}
                  onCheckedChange={(checked) => 
                    setBackupConfig(prev => ({ ...prev, compressao: checked }))
                  }
                  disabled={!backupConfig.automatico}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm">Criptografia</Label>
                <Switch 
                  checked={backupConfig.criptografia}
                  onCheckedChange={(checked) => 
                    setBackupConfig(prev => ({ ...prev, criptografia: checked }))
                  }
                  disabled={!backupConfig.automatico}
                />
              </div>

              {backupConfig.automatico && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Configurações Ativas</AlertTitle>
                  <AlertDescription>
                    Backup automático configurado para executar {backupConfig.frequencia} às {backupConfig.horario}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button className="w-full md:w-auto">
              <Settings className="w-4 h-4 mr-2" />
              Salvar Configurações
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Backup Manual */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            <CardTitle>Backup Manual</CardTitle>
          </div>
          <CardDescription>
            Execute backups manuais quando necessário
          </CardDescription>
        </CardHeader>
        <CardContent>
          {backupEmAndamento ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                <span className="font-medium">Backup em andamento...</span>
              </div>
              <Progress value={progressoBackup} className="h-3" />
              <p className="text-sm text-muted-foreground">
                {progressoBackup}% - Processando dados do sistema...
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Criar Backup Completo</h4>
                <p className="text-sm text-muted-foreground">
                  Fazer backup de todos os dados do sistema agora
                </p>
              </div>
              <Button onClick={handleBackupManual}>
                <Download className="w-4 h-4 mr-2" />
                Iniciar Backup
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gerenciamento de Dados */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            <CardTitle>Gerenciamento de Dados</CardTitle>
          </div>
          <CardDescription>
            Visualize e gerencie os dados por categoria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dadosPorCategoria.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">{item.categoria}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.registros} registros • {item.tamanho} • Atualizado {item.ultimaAtualizacao}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExportarDados(item.categoria)}
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Exportar
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" onClick={handleImportarDados}>
              <CloudUpload className="w-4 h-4 mr-2" />
              Importar Dados
            </Button>
            <Button variant="outline" onClick={handleLimparCache}>
              <Zap className="w-4 h-4 mr-2" />
              Limpar Cache
            </Button>
            <Button variant="outline">
              <Trash2 className="w-4 h-4 mr-2" />
              Limpeza Automática
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Backups */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5" />
            <CardTitle>Histórico de Backups</CardTitle>
          </div>
          <CardDescription>
            Acompanhe o histórico dos backups realizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {historicoBackups.map((backup) => (
              <div key={backup.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{backup.data}</span>
                      <Badge variant="outline" className="text-xs">
                        {backup.tipo}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {backup.tamanho}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(backup.status)}
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 text-center">
            <Button variant="outline">
              <History className="w-4 h-4 mr-2" />
              Ver Histórico Completo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas de Armazenamento */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            <CardTitle>Uso de Armazenamento</CardTitle>
          </div>
          <CardDescription>
            Detalhes do uso de espaço em disco
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Dados do Sistema</span>
                <span className="text-sm">{storageInfo.usado - storageInfo.backups - storageInfo.logs} GB</span>
              </div>
              <Progress value={(storageInfo.usado - storageInfo.backups - storageInfo.logs) / storageInfo.total * 100} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Backups</span>
                <span className="text-sm">{storageInfo.backups} GB</span>
              </div>
              <Progress value={storageInfo.backups / storageInfo.total * 100} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Logs</span>
                <span className="text-sm">{storageInfo.logs} GB</span>
              </div>
              <Progress value={storageInfo.logs / storageInfo.total * 100} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Arquivos Temporários</span>
                <span className="text-sm">{storageInfo.temp} GB</span>
              </div>
              <Progress value={storageInfo.temp / storageInfo.total * 100} className="h-2" />
            </div>

            <Separator />

            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Espaço Disponível</span>
              <span className="text-green-600">{storageInfo.disponivel} GB</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notificações */}
      {snackbar.open && (
        <Alert className={`mt-4 ${
          snackbar.severity === 'success' ? 'border-green-200 bg-green-50' :
          snackbar.severity === 'error' ? 'border-red-200 bg-red-50' :
          snackbar.severity === 'warning' ? 'border-yellow-200 bg-yellow-50' :
          'border-blue-200 bg-blue-50'
        }`}>
          <AlertDescription className={`${
            snackbar.severity === 'success' ? 'text-green-700' :
            snackbar.severity === 'error' ? 'text-red-700' :
            snackbar.severity === 'warning' ? 'text-yellow-700' :
            'text-blue-700'
          }`}>
            {snackbar.message}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
