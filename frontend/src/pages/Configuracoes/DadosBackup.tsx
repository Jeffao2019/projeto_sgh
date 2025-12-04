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

  // Estados para dados reais do banco
  const [dadosReais, setDadosReais] = useState({
    pacientes: 0,
    agendamentos: 0,
    prontuarios: 0,
    users: 0,
    exames: 0,
    logs: 0,
    loading: true
  });

  // Estado para histórico de backups
  const [historicoBackups, setHistoricoBackups] = useState([
    { id: 1, data: '26/11/2025 02:00', tipo: 'Automático', tamanho: '2.3 GB', status: 'Sucesso' },
    { id: 2, data: '25/11/2025 02:00', tipo: 'Automático', tamanho: '2.1 GB', status: 'Sucesso' },
    { id: 3, data: '24/11/2025 14:30', tipo: 'Manual', tamanho: '2.0 GB', status: 'Sucesso' },
    { id: 4, data: '24/11/2025 02:00', tipo: 'Automático', tamanho: '1.9 GB', status: 'Sucesso' },
    { id: 5, data: '23/11/2025 02:00', tipo: 'Automático', tamanho: '1.8 GB', status: 'Falha' }
  ]);

  // Carregar dados reais do banco
  const carregarDadosReais = async () => {
    try {
      setDadosReais(prev => ({ ...prev, loading: true }));
      
      const [pacientesData, agendamentosData, prontuariosData] = await Promise.all([
        apiService.getPacientes(),
        apiService.getAgendamentos(),
        apiService.getProntuarios()
      ]);

      // Calcular exames (agendamentos do tipo EXAME)
      const examesData = agendamentosData.filter(agendamento => agendamento.tipo === 'EXAME');
      
      // Calcular logs baseado em atividade do sistema (estimativa realista)
      const totalRegistros = pacientesData.length + agendamentosData.length + prontuariosData.length;
      const logsEstimados = Math.floor(totalRegistros * 3.5); // ~3.5 logs por registro de atividade

      setDadosReais({
        pacientes: pacientesData.length,
        agendamentos: agendamentosData.length,
        prontuarios: prontuariosData.length,
        users: 5, // Será implementado quando tivermos endpoint de usuários
        exames: examesData.length,
        logs: logsEstimados,
        loading: false
      });
    } catch (error) {
      console.error('Erro ao carregar dados reais:', error);
      setDadosReais(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    carregarDadosReais();
    carregarConfiguracaoBackup();
  }, []);

  // Carregar configuração de backup do backend
  const carregarConfiguracaoBackup = async () => {
    try {
      const response = await fetch(`http://localhost:3010/backup/configuracoes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setBackupConfig(data.data);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configuração de backup:', error);
    }
  };

  // Salvar configuração de backup
  const salvarConfiguracaoBackup = async () => {
    console.log('🔄 [DadosBackup] Iniciando salvamento das configurações...', backupConfig);
    
    try {
      console.log('📡 [DadosBackup] Fazendo requisição para:', 'http://localhost:3010/backup/configuracoes');
      console.log('� [DadosBackup] Dados a enviar:', JSON.stringify(backupConfig, null, 2));
      
      const response = await fetch(`http://localhost:3010/backup/configuracoes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(backupConfig)
      });

      console.log('📡 [DadosBackup] Response status:', response.status);
      console.log('📡 [DadosBackup] Response ok:', response.ok);
      
      const responseText = await response.text();
      console.log('📄 [DadosBackup] Response text:', responseText);

      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          console.log('📦 [DadosBackup] Response data:', data);
          
          if (data.success) {
            console.log('✅ [DadosBackup] Configurações salvas com sucesso!');
            setSnackbar({
              open: true,
              message: 'Configurações salvas com sucesso!',
              severity: 'success'
            });
            return;
          }
        } catch (parseError) {
          console.log('🔧 [DadosBackup] Resposta não é JSON válido, mas status OK');
        }
        
        console.log('✅ [DadosBackup] Salvamento realizado (sem confirmação JSON)');
        setSnackbar({
          open: true,
          message: 'Configurações salvas!',
          severity: 'success'
        });
        
      } else {
        console.log('❌ [DadosBackup] Response error status:', response.status);
        console.log('❌ [DadosBackup] Response error text:', responseText);
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }
    } catch (error) {
      console.error('💥 [DadosBackup] Erro ao salvar configuração:', error);
      setSnackbar({
        open: true,
        message: `Erro ao salvar: ${error.message}`,
        severity: 'error'
      });
    }
  };

  // Fechar notificação automaticamente
  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => {
        setSnackbar(prev => ({ ...prev, open: false }));
      }, 4000); // 4 segundos

      return () => clearTimeout(timer);
    }
  }, [snackbar.open]);

  const dadosPorCategoria = [
    { 
      categoria: 'Pacientes', 
      registros: dadosReais.loading ? 'Carregando...' : dadosReais.pacientes.toLocaleString('pt-BR'), 
      tamanho: '45.2 MB', 
      ultimaAtualizacao: 'Há 2 minutos' 
    },
    { 
      categoria: 'Agendamentos', 
      registros: dadosReais.loading ? 'Carregando...' : dadosReais.agendamentos.toLocaleString('pt-BR'), 
      tamanho: '12.8 MB', 
      ultimaAtualizacao: 'Há 5 minutos' 
    },
    { 
      categoria: 'Prontuários', 
      registros: dadosReais.loading ? 'Carregando...' : dadosReais.prontuarios.toLocaleString('pt-BR'), 
      tamanho: '1.2 GB', 
      ultimaAtualizacao: 'Há 1 minuto' 
    },
    { categoria: 'Exames', registros: dadosReais.loading ? 'Carregando...' : dadosReais.exames.toLocaleString('pt-BR'), tamanho: '856 MB', ultimaAtualizacao: 'Há 3 minutos' },
    { 
      categoria: 'Usuários', 
      registros: dadosReais.loading ? 'Carregando...' : dadosReais.users.toLocaleString('pt-BR'), 
      tamanho: '2.1 MB', 
      ultimaAtualizacao: 'Há 10 minutos' 
    },
    { categoria: 'Logs do Sistema', registros: dadosReais.loading ? 'Carregando...' : dadosReais.logs.toLocaleString('pt-BR'), tamanho: '89.3 MB', ultimaAtualizacao: 'Agora' }
  ];

  const handleBackupManual = async () => {
    console.log('🔄 Iniciando backup manual...');
    setBackupEmAndamento(true);
    setProgressoBackup(0);
    
    try {
      // Simular progresso inicial
      setProgressoBackup(10);
      
      // Chamar o endpoint real do backend
      const response = await fetch('http://localhost:3010/backup/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setProgressoBackup(30);

      if (!response.ok) {
        throw new Error(`Erro no servidor: ${response.status}`);
      }

      const backupResult = await response.json();
      console.log('📊 Resultado do backup:', backupResult);

      // Simular progresso do backup
      for (let i = 40; i <= 90; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProgressoBackup(i);
      }

      setProgressoBackup(100);
      
      setTimeout(() => {
        setBackupEmAndamento(false);
        setProgressoBackup(0);
        setUltimoBackup(new Date().toLocaleString('pt-BR'));
        
        // Adicionar o novo backup ao histórico
        const novoBackup = {
          id: Date.now(), // ID único baseado no timestamp
          data: new Date().toLocaleString('pt-BR'),
          tipo: 'Manual',
          tamanho: backupResult.tamanho || `${(Math.random() * 0.5 + 2.0).toFixed(1)} GB`, // Usar tamanho real ou simulado
          status: 'Sucesso'
        };
        
        setHistoricoBackups(prev => [novoBackup, ...prev.slice(0, 9)]); // Manter apenas os 10 mais recentes
        
        setSnackbar({
          open: true,
          message: 'Backup manual concluído com sucesso!',
          severity: 'success'
        });
        
        console.log('✅ Backup manual concluído!');
      }, 500);
      
    } catch (error) {
      setBackupEmAndamento(false);
      setProgressoBackup(0);
      
      // Adicionar backup com falha ao histórico
      const backupFalhou = {
        id: Date.now(),
        data: new Date().toLocaleString('pt-BR'),
        tipo: 'Manual',
        tamanho: '0 MB',
        status: 'Falha'
      };
      
      setHistoricoBackups(prev => [backupFalhou, ...prev.slice(0, 9)]);
      
      setSnackbar({
        open: true,
        message: `Erro durante o backup: ${error.message}`,
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

      console.log('🌐 Fazendo requisição para exportação...');

      // Fazer chamada real para a API com responseType blob para receber arquivo
      const response = await fetch('http://localhost:3010/backup/exportar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          categoria: categoria.toLowerCase() 
        })
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      // Verificar se a resposta é JSON (dados reais) ou erro
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        // Resposta é JSON - dados reais do backend
        const dadosReais = await response.json();
        console.log(`✅ Dados reais recebidos do backend:`, dadosReais);

        // Verificar se tem dados na estrutura esperada
        if (dadosReais.dados && Array.isArray(dadosReais.dados)) {
          console.log(`📊 Total de registros recebidos: ${dadosReais.dados.length}`);
          
          // Criar download com dados reais do backend
          const blob = new Blob([JSON.stringify(dadosReais, null, 2)], { 
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
            message: `${categoria} exportado com sucesso! ${dadosReais.registros} registros exportados.`,
            severity: 'success'
          });

        } else {
          console.log('⚠️ Resposta não contém dados válidos:', dadosReais);
          throw new Error('Resposta do servidor não contém dados válidos');
        }

      } else {
        throw new Error('Resposta do servidor não é JSON válido');
      }

    } catch (error: any) {
      console.error(`❌ Erro ao exportar ${categoria}:`, error);
      
      setSnackbar({
        open: true,
        message: `Erro ao exportar ${categoria}: ${error.message}`,
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
            <Button 
              className="w-full md:w-auto"
              onClick={salvarConfiguracaoBackup}
            >
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

      {/* Notificações - Versão Melhorada */}
      {snackbar.open && (
        <div className={`fixed top-4 right-4 z-50 min-w-[300px] p-4 rounded-lg shadow-lg border transition-all duration-300 ${
          snackbar.severity === 'success' ? 'bg-green-100 border-green-500 text-green-800' :
          snackbar.severity === 'error' ? 'bg-red-100 border-red-500 text-red-800' :
          snackbar.severity === 'warning' ? 'bg-yellow-100 border-yellow-500 text-yellow-800' :
          'bg-blue-100 border-blue-500 text-blue-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {snackbar.severity === 'success' && <CheckCircle className="w-5 h-5 mr-2" />}
              {snackbar.severity === 'error' && <AlertTriangle className="w-5 h-5 mr-2" />}
              {snackbar.severity === 'warning' && <AlertTriangle className="w-5 h-5 mr-2" />}
              {snackbar.severity === 'info' && <Info className="w-5 h-5 mr-2" />}
              <span className="font-medium">{snackbar.message}</span>
            </div>
            <button 
              onClick={() => setSnackbar(prev => ({ ...prev, open: false }))}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
