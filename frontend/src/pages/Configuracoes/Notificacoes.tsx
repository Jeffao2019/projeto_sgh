import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  BellRing, 
  Clock, 
  Calendar, 
  Mail, 
  MessageSquare,
  Phone,
  Settings,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Save,
  PlayCircle,
  AlertCircle,
  CheckCircle,
  Users,
  Stethoscope
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useToast } from '@/hooks/use-toast';

interface ConfiguracaoNotificacao {
  id: string;
  categoria: string;
  titulo: string;
  descricao: string;
  ativo: boolean;
  metodos: {
    push: boolean;
    email: boolean;
    sms: boolean;
    desktop: boolean;
  };
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  horarios?: {
    inicio: string;
    fim: string;
    diasSemana: number[];
  };
  antecedencia?: number; // minutos
}

interface PerfilNotificacao {
  id: string;
  nome: string;
  descricao: string;
  configuracoes: ConfiguracaoNotificacao[];
  ativo: boolean;
  padrao: boolean;
}

export default function ConfiguracoesNotificacoes() {
  const { toast } = useToast();
  
  // Estado das configurações
  const [configuracoes, setConfiguracoes] = useState<ConfiguracaoNotificacao[]>([]);
  const [perfisNotificacao, setPerfisNotificacao] = useState<PerfilNotificacao[]>([]);
  const [perfilAtivo, setPerfilAtivo] = useState<string>('padrao');
  const [loading, setLoading] = useState(false);
  
  // Estado de configurações gerais
  const [configuracaoGeral, setConfiguracaoGeral] = useState({
    notificacoesMaster: true,
    somNotificacoes: true,
    volumeNotificacoes: 70,
    modoDND: false,
    horarioDND: {
      inicio: '22:00',
      fim: '07:00'
    },
    emailResumo: true,
    frequenciaResumo: 'diario'
  });

  // Inicializar configurações padrão
  useEffect(() => {
    inicializarConfiguracoes();
  }, []);

  const inicializarConfiguracoes = () => {
    const configuracoesIniciais: ConfiguracaoNotificacao[] = [
      // Agendamentos
      {
        id: 'agend-novo',
        categoria: 'Agendamentos',
        titulo: 'Novo Agendamento',
        descricao: 'Quando um novo agendamento é criado',
        ativo: true,
        metodos: { push: true, email: true, sms: false, desktop: true },
        prioridade: 'alta',
        antecedencia: 15
      },
      {
        id: 'agend-cancelado',
        categoria: 'Agendamentos',
        titulo: 'Agendamento Cancelado',
        descricao: 'Quando um agendamento é cancelado',
        ativo: true,
        metodos: { push: true, email: true, sms: true, desktop: true },
        prioridade: 'alta',
        antecedencia: 0
      },
      {
        id: 'agend-lembrete',
        categoria: 'Agendamentos',
        titulo: 'Lembrete de Consulta',
        descricao: 'Lembrete antes da consulta',
        ativo: true,
        metodos: { push: true, email: false, sms: true, desktop: false },
        prioridade: 'media',
        antecedencia: 30
      },
      
      // Telemedicina
      {
        id: 'tele-inicio',
        categoria: 'Telemedicina',
        titulo: 'Teleconsulta Iniciada',
        descricao: 'Quando uma teleconsulta é iniciada',
        ativo: true,
        metodos: { push: true, email: false, sms: false, desktop: true },
        prioridade: 'critica',
        antecedencia: 0
      },
      {
        id: 'tele-convite',
        categoria: 'Telemedicina',
        titulo: 'Convite para Teleconsulta',
        descricao: 'Convite para entrar na sala de telemedicina',
        ativo: true,
        metodos: { push: true, email: true, sms: true, desktop: true },
        prioridade: 'critica',
        antecedencia: 5
      },
      
      // Prontuários
      {
        id: 'pront-novo',
        categoria: 'Prontuários',
        titulo: 'Novo Prontuário',
        descricao: 'Quando um novo prontuário é criado',
        ativo: true,
        metodos: { push: true, email: true, sms: false, desktop: false },
        prioridade: 'media',
        antecedencia: 0
      },
      {
        id: 'pront-atualizado',
        categoria: 'Prontuários',
        titulo: 'Prontuário Atualizado',
        descricao: 'Quando um prontuário é atualizado',
        ativo: false,
        metodos: { push: false, email: true, sms: false, desktop: false },
        prioridade: 'baixa',
        antecedencia: 0
      },
      
      // Sistema
      {
        id: 'sys-manutencao',
        categoria: 'Sistema',
        titulo: 'Manutenção Programada',
        descricao: 'Notificações de manutenção do sistema',
        ativo: true,
        metodos: { push: true, email: true, sms: false, desktop: true },
        prioridade: 'alta',
        antecedencia: 60
      },
      {
        id: 'sys-backup',
        categoria: 'Sistema',
        titulo: 'Backup Realizado',
        descricao: 'Confirmação de backup automático',
        ativo: false,
        metodos: { push: false, email: true, sms: false, desktop: false },
        prioridade: 'baixa',
        antecedencia: 0
      },
      
      // Emergências
      {
        id: 'emerg-alerta',
        categoria: 'Emergências',
        titulo: 'Alerta de Emergência',
        descricao: 'Situações de emergência no hospital',
        ativo: true,
        metodos: { push: true, email: true, sms: true, desktop: true },
        prioridade: 'critica',
        antecedencia: 0
      }
    ];

    const perfisIniciais: PerfilNotificacao[] = [
      {
        id: 'padrao',
        nome: 'Padrão',
        descricao: 'Configuração padrão balanceada',
        configuracoes: configuracoesIniciais,
        ativo: true,
        padrao: true
      },
      {
        id: 'minimo',
        nome: 'Mínimo',
        descricao: 'Apenas notificações críticas',
        configuracoes: configuracoesIniciais.map(c => ({
          ...c,
          ativo: c.prioridade === 'critica',
          metodos: { push: true, email: false, sms: false, desktop: false }
        })),
        ativo: false,
        padrao: false
      },
      {
        id: 'completo',
        nome: 'Completo',
        descricao: 'Todas as notificações ativas',
        configuracoes: configuracoesIniciais.map(c => ({
          ...c,
          ativo: true,
          metodos: { push: true, email: true, sms: true, desktop: true }
        })),
        ativo: false,
        padrao: false
      }
    ];

    setConfiguracoes(configuracoesIniciais);
    setPerfisNotificacao(perfisIniciais);
  };

  const handleSalvarConfiguracoes = async () => {
    setLoading(true);
    
    try {
      // Simular salvamento no backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Configurações salvas",
        description: "Suas preferências de notificação foram atualizadas com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestarNotificacao = (config: ConfiguracaoNotificacao) => {
    toast({
      title: "Teste de Notificação",
      description: `Testando: ${config.titulo}`,
    });
  };

  const handleAlterarPerfil = (perfilId: string) => {
    const perfil = perfisNotificacao.find(p => p.id === perfilId);
    if (perfil) {
      setPerfilAtivo(perfilId);
      setConfiguracoes(perfil.configuracoes);
      
      toast({
        title: "Perfil alterado",
        description: `Perfil "${perfil.nome}" ativado com sucesso`,
      });
    }
  };

  const handleToggleConfiguracao = (configId: string) => {
    setConfiguracoes(prev => prev.map(config => 
      config.id === configId 
        ? { ...config, ativo: !config.ativo }
        : config
    ));
  };

  const handleAlterarMetodo = (configId: string, metodo: keyof ConfiguracaoNotificacao['metodos']) => {
    setConfiguracoes(prev => prev.map(config => 
      config.id === configId 
        ? { 
            ...config, 
            metodos: { 
              ...config.metodos, 
              [metodo]: !config.metodos[metodo] 
            }
          }
        : config
    ));
  };

  const getPrioridadeColor = (prioridade: string) => {
    const colors = {
      baixa: 'bg-gray-100 text-gray-800',
      media: 'bg-yellow-100 text-yellow-800',
      alta: 'bg-orange-100 text-orange-800',
      critica: 'bg-red-100 text-red-800'
    };
    return colors[prioridade as keyof typeof colors] || colors.media;
  };

  const getCategoriaIcon = (categoria: string) => {
    const icons = {
      'Agendamentos': Calendar,
      'Telemedicina': Monitor,
      'Prontuários': Stethoscope,
      'Sistema': Settings,
      'Emergências': AlertCircle
    };
    return icons[categoria as keyof typeof icons] || Bell;
  };

  const categorias = Array.from(new Set(configuracoes.map(c => c.categoria)));

  return (
    <DashboardLayout
      title="Configurações de Notificações"
      subtitle="Configure alertas, lembretes e notificações do sistema"
    >
      <div className="space-y-6">
        
        {/* Configurações Gerais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configurações Gerais
            </CardTitle>
            <CardDescription>
              Configurações principais do sistema de notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Master Switch */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <BellRing className="w-5 h-5" />
                <div>
                  <Label className="text-base font-medium">Notificações Gerais</Label>
                  <p className="text-sm text-muted-foreground">
                    Ativar/desativar todas as notificações
                  </p>
                </div>
              </div>
              <Switch 
                checked={configuracaoGeral.notificacoesMaster}
                onCheckedChange={(checked) => 
                  setConfiguracaoGeral(prev => ({ ...prev, notificacoesMaster: checked }))
                }
              />
            </div>

            {/* Som e Volume */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {configuracaoGeral.somNotificacoes ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  <div>
                    <Label className="text-base font-medium">Som das Notificações</Label>
                    <p className="text-sm text-muted-foreground">
                      Reproduzir sons para notificações
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={configuracaoGeral.somNotificacoes}
                  onCheckedChange={(checked) => 
                    setConfiguracaoGeral(prev => ({ ...prev, somNotificacoes: checked }))
                  }
                />
              </div>

              <div className="p-4 border rounded-lg">
                <Label className="text-base font-medium">Volume</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Ajustar volume das notificações
                </p>
                <Input 
                  type="range"
                  min="0"
                  max="100"
                  value={configuracaoGeral.volumeNotificacoes}
                  onChange={(e) => 
                    setConfiguracaoGeral(prev => ({ 
                      ...prev, 
                      volumeNotificacoes: parseInt(e.target.value) 
                    }))
                  }
                  className="w-full"
                />
                <div className="text-center text-sm text-muted-foreground mt-1">
                  {configuracaoGeral.volumeNotificacoes}%
                </div>
              </div>
            </div>

            {/* Modo Não Perturbe */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" />
                  <div>
                    <Label className="text-base font-medium">Modo Não Perturbe</Label>
                    <p className="text-sm text-muted-foreground">
                      Silenciar notificações em horários específicos
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={configuracaoGeral.modoDND}
                  onCheckedChange={(checked) => 
                    setConfiguracaoGeral(prev => ({ ...prev, modoDND: checked }))
                  }
                />
              </div>
              
              {configuracaoGeral.modoDND && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dnd-inicio">Início</Label>
                    <Input 
                      id="dnd-inicio"
                      type="time"
                      value={configuracaoGeral.horarioDND.inicio}
                      onChange={(e) => 
                        setConfiguracaoGeral(prev => ({
                          ...prev,
                          horarioDND: { ...prev.horarioDND, inicio: e.target.value }
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="dnd-fim">Fim</Label>
                    <Input 
                      id="dnd-fim"
                      type="time"
                      value={configuracaoGeral.horarioDND.fim}
                      onChange={(e) => 
                        setConfiguracaoGeral(prev => ({
                          ...prev,
                          horarioDND: { ...prev.horarioDND, fim: e.target.value }
                        }))
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Perfis de Notificação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Perfis de Notificação
            </CardTitle>
            <CardDescription>
              Escolha um perfil pré-configurado ou personalize suas notificações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {perfisNotificacao.map(perfil => (
                <div 
                  key={perfil.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    perfilAtivo === perfil.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleAlterarPerfil(perfil.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{perfil.nome}</h4>
                    {perfilAtivo === perfil.id && (
                      <CheckCircle className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {perfil.descricao}
                  </p>
                  {perfil.padrao && (
                    <Badge variant="secondary" className="mt-2">
                      Padrão
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Configurações Detalhadas por Categoria */}
        {categorias.map(categoria => {
          const configsCategoria = configuracoes.filter(c => c.categoria === categoria);
          const IconeCategoria = getCategoriaIcon(categoria);
          
          return (
            <Card key={categoria}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconeCategoria className="w-5 h-5" />
                  {categoria}
                </CardTitle>
                <CardDescription>
                  Configure as notificações para {categoria.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {configsCategoria.map(config => (
                  <div key={config.id} className="p-4 border rounded-lg">
                    
                    {/* Cabeçalho da configuração */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Switch 
                          checked={config.ativo}
                          onCheckedChange={() => handleToggleConfiguracao(config.id)}
                        />
                        <div>
                          <h4 className="font-medium">{config.titulo}</h4>
                          <p className="text-sm text-muted-foreground">
                            {config.descricao}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPrioridadeColor(config.prioridade)}>
                          {config.prioridade}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleTestarNotificacao(config)}
                        >
                          <PlayCircle className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {config.ativo && (
                      <>
                        <Separator className="my-3" />
                        
                        {/* Métodos de notificação */}
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Métodos de Notificação:</Label>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center gap-2">
                                <Smartphone className="w-4 h-4" />
                                <span className="text-sm">Push</span>
                              </div>
                              <Switch 
                                checked={config.metodos.push}
                                onCheckedChange={() => handleAlterarMetodo(config.id, 'push')}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span className="text-sm">Email</span>
                              </div>
                              <Switch 
                                checked={config.metodos.email}
                                onCheckedChange={() => handleAlterarMetodo(config.id, 'email')}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-sm">SMS</span>
                              </div>
                              <Switch 
                                checked={config.metodos.sms}
                                onCheckedChange={() => handleAlterarMetodo(config.id, 'sms')}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center gap-2">
                                <Monitor className="w-4 h-4" />
                                <span className="text-sm">Desktop</span>
                              </div>
                              <Switch 
                                checked={config.metodos.desktop}
                                onCheckedChange={() => handleAlterarMetodo(config.id, 'desktop')}
                              />
                            </div>
                          </div>

                          {/* Antecedência (se aplicável) */}
                          {config.antecedencia !== undefined && config.antecedencia > 0 && (
                            <div className="flex items-center gap-2">
                              <Label className="text-sm">Antecedência:</Label>
                              <Input 
                                type="number"
                                value={config.antecedencia}
                                onChange={(e) => {
                                  const novaAntecedencia = parseInt(e.target.value);
                                  setConfiguracoes(prev => prev.map(c => 
                                    c.id === config.id 
                                      ? { ...c, antecedencia: novaAntecedencia }
                                      : c
                                  ));
                                }}
                                className="w-20"
                                min="0"
                              />
                              <span className="text-sm text-muted-foreground">minutos</span>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}

        {/* Resumo por Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Resumo por Email
            </CardTitle>
            <CardDescription>
              Configure o envio de resumos periódicos por email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Ativar Resumo</Label>
                <p className="text-sm text-muted-foreground">
                  Receber resumos das atividades por email
                </p>
              </div>
              <Switch 
                checked={configuracaoGeral.emailResumo}
                onCheckedChange={(checked) => 
                  setConfiguracaoGeral(prev => ({ ...prev, emailResumo: checked }))
                }
              />
            </div>

            {configuracaoGeral.emailResumo && (
              <div>
                <Label htmlFor="frequencia-resumo">Frequência</Label>
                <Select 
                  value={configuracaoGeral.frequenciaResumo}
                  onValueChange={(value) => 
                    setConfiguracaoGeral(prev => ({ ...prev, frequenciaResumo: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diario">Diário</SelectItem>
                    <SelectItem value="semanal">Semanal</SelectItem>
                    <SelectItem value="mensal">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex items-center justify-end gap-4">
          <Button variant="outline">
            Restaurar Padrões
          </Button>
          <Button 
            onClick={handleSalvarConfiguracoes}
            disabled={loading}
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
