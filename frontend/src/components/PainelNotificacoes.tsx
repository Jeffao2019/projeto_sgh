import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  BellRing,
  Clock,
  Calendar,
  Video,
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  X,
  MailOpen,
  Archive,
  Trash2,
  Filter,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'agendamento' | 'telemedicina' | 'prontuario' | 'sistema' | 'emergencia';
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  lida: boolean;
  dataHora: Date;
  acoes?: {
    label: string;
    action: () => void;
    variant?: 'default' | 'outline' | 'destructive';
  }[];
  dados?: any;
}

interface PainelNotificacoesProps {
  className?: string;
  compact?: boolean;
}

export default function PainelNotificacoes({ className, compact = false }: PainelNotificacoesProps) {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [filtro, setFiltro] = useState<'todas' | 'nao-lidas' | 'importantes'>('todas');
  const [tipoFiltro, setTipoFiltro] = useState<string>('todos');
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(false);

  // Simular carregamento de notificações
  useEffect(() => {
    carregarNotificacoes();
    
    // Simular notificações em tempo real
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        adicionarNotificacaoSimulada();
      }
    }, 30000); // A cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const carregarNotificacoes = () => {
    // Simular notificações existentes
    const notificacoesSimuladas: Notificacao[] = [
      {
        id: '1',
        titulo: 'Nova Teleconsulta Agendada',
        mensagem: 'Maria Silva Santos - Dermatologia - 15:30',
        tipo: 'telemedicina',
        prioridade: 'alta',
        lida: false,
        dataHora: new Date(Date.now() - 300000), // 5 minutos atrás
        acoes: [
          {
            label: 'Ver Agendamento',
            action: () => console.log('Ver agendamento'),
          },
          {
            label: 'Iniciar Consulta',
            action: () => console.log('Iniciar consulta'),
          }
        ]
      },
      {
        id: '2',
        titulo: 'Lembrete: Consulta em 15 minutos',
        mensagem: 'João Santos - Cardiologia - Sala 203',
        tipo: 'agendamento',
        prioridade: 'media',
        lida: false,
        dataHora: new Date(Date.now() - 900000), // 15 minutos atrás
        acoes: [
          {
            label: 'Ver Prontuário',
            action: () => console.log('Ver prontuário'),
          }
        ]
      },
      {
        id: '3',
        titulo: 'Prontuário Atualizado',
        mensagem: 'Ana Costa - Exames laboratoriais adicionados',
        tipo: 'prontuario',
        prioridade: 'baixa',
        lida: true,
        dataHora: new Date(Date.now() - 1800000), // 30 minutos atrás
        acoes: [
          {
            label: 'Revisar',
            action: () => console.log('Revisar prontuário'),
          }
        ]
      },
      {
        id: '4',
        titulo: 'Backup do Sistema Concluído',
        mensagem: 'Backup automático realizado com sucesso às 02:00',
        tipo: 'sistema',
        prioridade: 'baixa',
        lida: true,
        dataHora: new Date(Date.now() - 3600000), // 1 hora atrás
      },
      {
        id: '5',
        titulo: 'EMERGÊNCIA: Código Azul',
        mensagem: 'UTI - Leito 12 - Parada cardiorrespiratória',
        tipo: 'emergencia',
        prioridade: 'critica',
        lida: false,
        dataHora: new Date(Date.now() - 7200000), // 2 horas atrás
        acoes: [
          {
            label: 'Ver Protocolo',
            action: () => console.log('Ver protocolo emergência'),
            variant: 'destructive' as const
          }
        ]
      }
    ];

    setNotificacoes(notificacoesSimuladas);
  };

  const adicionarNotificacaoSimulada = () => {
    const tiposSimulados = [
      {
        titulo: 'Nova Mensagem no Chat',
        mensagem: 'Dr. Pedro Silva enviou uma mensagem',
        tipo: 'sistema' as const,
        prioridade: 'baixa' as const
      },
      {
        titulo: 'Agendamento Cancelado',
        mensagem: 'Carlos Santos - Oftalmologia - 16:00',
        tipo: 'agendamento' as const,
        prioridade: 'media' as const
      },
      {
        titulo: 'Teleconsulta Iniciada',
        mensagem: 'Marina Costa entrou na sala de telemedicina',
        tipo: 'telemedicina' as const,
        prioridade: 'alta' as const
      }
    ];

    const notificacaoAleatoria = tiposSimulados[Math.floor(Math.random() * tiposSimulados.length)];
    
    const novaNotificacao: Notificacao = {
      id: Date.now().toString(),
      ...notificacaoAleatoria,
      lida: false,
      dataHora: new Date(),
    };

    setNotificacoes(prev => [novaNotificacao, ...prev]);
  };

  const marcarComoLida = (id: string) => {
    setNotificacoes(prev => prev.map(notif => 
      notif.id === id ? { ...notif, lida: true } : notif
    ));
  };

  const marcarComoNaoLida = (id: string) => {
    setNotificacoes(prev => prev.map(notif => 
      notif.id === id ? { ...notif, lida: false } : notif
    ));
  };

  const arquivarNotificacao = (id: string) => {
    setNotificacoes(prev => prev.filter(notif => notif.id !== id));
  };

  const marcarTodasComoLidas = () => {
    setNotificacoes(prev => prev.map(notif => ({ ...notif, lida: true })));
  };

  const getTipoIcon = (tipo: string) => {
    const icons = {
      agendamento: Calendar,
      telemedicina: Video,
      prontuario: Stethoscope,
      sistema: Bell,
      emergencia: AlertTriangle
    };
    return icons[tipo as keyof typeof icons] || Bell;
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

  const getTipoColor = (tipo: string) => {
    const colors = {
      agendamento: 'bg-blue-100 text-blue-800',
      telemedicina: 'bg-green-100 text-green-800',
      prontuario: 'bg-purple-100 text-purple-800',
      sistema: 'bg-gray-100 text-gray-800',
      emergencia: 'bg-red-100 text-red-800'
    };
    return colors[tipo as keyof typeof colors] || colors.sistema;
  };

  const notificacoesFiltradas = notificacoes.filter(notif => {
    const matchesFiltro = 
      filtro === 'todas' || 
      (filtro === 'nao-lidas' && !notif.lida) ||
      (filtro === 'importantes' && ['alta', 'critica'].includes(notif.prioridade));
    
    const matchesTipo = tipoFiltro === 'todos' || notif.tipo === tipoFiltro;
    
    const matchesBusca = 
      busca === '' ||
      notif.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      notif.mensagem.toLowerCase().includes(busca.toLowerCase());

    return matchesFiltro && matchesTipo && matchesBusca;
  });

  const notificacaoNaoLidas = notificacoes.filter(n => !n.lida).length;

  if (compact) {
    // Versão compacta para header
    return (
      <div className={`relative ${className}`}>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          {notificacaoNaoLidas > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 px-1 py-0 text-xs min-w-[16px] h-4"
            >
              {notificacaoNaoLidas > 9 ? '9+' : notificacaoNaoLidas}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BellRing className="w-5 h-5" />
              <CardTitle>Central de Notificações</CardTitle>
              {notificacaoNaoLidas > 0 && (
                <Badge variant="destructive">
                  {notificacaoNaoLidas} não lidas
                </Badge>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={marcarTodasComoLidas}
              disabled={notificacaoNaoLidas === 0}
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Marcar todas como lidas
            </Button>
          </div>
          <CardDescription>
            Acompanhe alertas, lembretes e atualizações do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Controles e Filtros */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Buscar notificações..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filtro} onValueChange={(value: any) => setFiltro(value)}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="nao-lidas">Não lidas</SelectItem>
                <SelectItem value="importantes">Importantes</SelectItem>
              </SelectContent>
            </Select>

            <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="agendamento">Agendamentos</SelectItem>
                <SelectItem value="telemedicina">Telemedicina</SelectItem>
                <SelectItem value="prontuario">Prontuários</SelectItem>
                <SelectItem value="sistema">Sistema</SelectItem>
                <SelectItem value="emergencia">Emergências</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lista de Notificações */}
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {notificacoesFiltradas.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhuma notificação encontrada</p>
                </div>
              ) : (
                notificacoesFiltradas.map(notificacao => {
                  const IconeTipo = getTipoIcon(notificacao.tipo);
                  
                  return (
                    <Card 
                      key={notificacao.id}
                      className={`transition-all ${
                        !notificacao.lida 
                          ? 'border-l-4 border-l-primary bg-blue-50/30' 
                          : 'bg-gray-50/30'
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          
                          {/* Ícone do tipo */}
                          <div className={`p-2 rounded-full ${getTipoColor(notificacao.tipo)}`}>
                            <IconeTipo className="w-4 h-4" />
                          </div>

                          {/* Conteúdo da notificação */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className={`font-medium ${
                                !notificacao.lida ? 'text-gray-900' : 'text-gray-600'
                              }`}>
                                {notificacao.titulo}
                              </h4>
                              <div className="flex items-center gap-2">
                                <Badge className={getPrioridadeColor(notificacao.prioridade)}>
                                  {notificacao.prioridade}
                                </Badge>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => 
                                      notificacao.lida 
                                        ? marcarComoNaoLida(notificacao.id)
                                        : marcarComoLida(notificacao.id)
                                    }
                                  >
                                    {notificacao.lida ? (
                                      <MailOpen className="w-3 h-3" />
                                    ) : (
                                      <CheckCircle2 className="w-3 h-3" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => arquivarNotificacao(notificacao.id)}
                                  >
                                    <Archive className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">
                              {notificacao.mensagem}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                {formatDistanceToNow(notificacao.dataHora, { 
                                  addSuffix: true,
                                  locale: ptBR 
                                })}
                              </div>

                              {/* Ações da notificação */}
                              {notificacao.acoes && (
                                <div className="flex gap-2">
                                  {notificacao.acoes.map((acao, index) => (
                                    <Button
                                      key={index}
                                      variant={acao.variant || "outline"}
                                      size="sm"
                                      onClick={acao.action}
                                    >
                                      {acao.label}
                                    </Button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
