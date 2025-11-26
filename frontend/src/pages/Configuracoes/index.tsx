import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Bell, 
  User, 
  Shield, 
  Database,
  Palette,
  Globe,
  HardDrive,
  Activity,
  Mail,
  Smartphone,
  Monitor,
  Wifi,
  Lock,
  Eye,
  Download,
  Upload
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import ConfiguracoesNotificacoes from './Notificacoes';
import PainelNotificacoes from '@/components/PainelNotificacoes';

export default function Configuracoes() {
  const [abaAtiva, setAbaAtiva] = useState('geral');

  const configuracoesCategorias = [
    {
      id: 'geral',
      titulo: 'Configurações Gerais',
      descricao: 'Configurações básicas do sistema',
      icone: Settings,
      itens: [
        { nome: 'Idioma do Sistema', valor: 'Português (Brasil)', tipo: 'select' },
        { nome: 'Fuso Horário', valor: 'America/Sao_Paulo', tipo: 'select' },
        { nome: 'Formato de Data', valor: 'DD/MM/AAAA', tipo: 'select' },
        { nome: 'Formato de Hora', valor: '24 horas', tipo: 'select' },
        { nome: 'Tema da Interface', valor: 'Claro', tipo: 'select' }
      ]
    },
    {
      id: 'perfil',
      titulo: 'Perfil do Usuário',
      descricao: 'Informações pessoais e preferências',
      icone: User,
      itens: [
        { nome: 'Nome Completo', valor: 'Dr. Carlos Silva', tipo: 'text' },
        { nome: 'Email', valor: 'dr.carlos@sgh.com', tipo: 'email' },
        { nome: 'CRM', valor: '234567', tipo: 'text' },
        { nome: 'Especialidade', valor: 'Cardiologia', tipo: 'select' },
        { nome: 'Telefone', valor: '(11) 99999-9999', tipo: 'tel' }
      ]
    },
    {
      id: 'seguranca',
      titulo: 'Segurança',
      descricao: 'Configurações de segurança e privacidade',
      icone: Shield,
      itens: [
        { nome: 'Autenticação de Dois Fatores', valor: 'Ativada', tipo: 'toggle' },
        { nome: 'Sessão Automática', valor: '30 minutos', tipo: 'select' },
        { nome: 'Histórico de Login', valor: 'Ativo', tipo: 'toggle' },
        { nome: 'Notificação de Login', valor: 'Ativo', tipo: 'toggle' }
      ]
    },
    {
      id: 'aparencia',
      titulo: 'Aparência',
      descricao: 'Personalização da interface',
      icone: Palette,
      itens: [
        { nome: 'Tema Principal', valor: 'Azul Médico', tipo: 'color' },
        { nome: 'Modo Escuro', valor: 'Desativado', tipo: 'toggle' },
        { nome: 'Densidade da Interface', valor: 'Padrão', tipo: 'select' },
        { nome: 'Sidebar Compacta', valor: 'Desativado', tipo: 'toggle' }
      ]
    },
    {
      id: 'sistema',
      titulo: 'Sistema',
      descricao: 'Configurações técnicas e performance',
      icone: Database,
      itens: [
        { nome: 'Cache do Sistema', valor: '2.3 GB', tipo: 'info' },
        { nome: 'Logs de Auditoria', valor: 'Ativo', tipo: 'toggle' },
        { nome: 'Backup Automático', valor: 'Diário às 02:00', tipo: 'select' },
        { nome: 'Limpeza Automática', valor: 'Semanal', tipo: 'select' }
      ]
    }
  ];

  const estatisticasSistema = {
    notificacoes: {
      total: 127,
      naoLidas: 12,
      importantes: 3,
      hoje: 23
    },
    usuario: {
      ultimoLogin: '26/11/2025 14:32',
      sessaoAtiva: '2h 15min',
      permissoes: 'Médico',
      status: 'Online'
    },
    sistema: {
      versao: '2.1.4',
      uptime: '15 dias, 8h',
      performance: '98%',
      storage: '45% usado'
    }
  };

  return (
    <DashboardLayout
      title="Configurações do Sistema"
      subtitle="Gerencie suas preferências e configurações"
    >
      <div className="space-y-6">
        
        {/* Resumo de Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Bell className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Notificações</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">{estatisticasSistema.notificacoes.naoLidas}</span>
                    <Badge variant="destructive" className="text-xs">
                      Não lidas
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <User className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">Online</span>
                    <Badge variant="secondary" className="text-xs">
                      {estatisticasSistema.usuario.sessaoAtiva}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Segurança</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">Alto</span>
                    <Badge variant="default" className="text-xs">
                      2FA Ativo
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Activity className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Performance</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">98%</span>
                    <Badge variant="secondary" className="text-xs">
                      Ótima
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configurações Principais */}
        <Tabs value={abaAtiva} onValueChange={setAbaAtiva}>
          <TabsList className="grid grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="geral" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="notificacoes" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="perfil" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="seguranca" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Segurança
            </TabsTrigger>
            <TabsTrigger value="aparencia" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Aparência
            </TabsTrigger>
            <TabsTrigger value="sistema" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Sistema
            </TabsTrigger>
          </TabsList>

          {/* Aba de Configurações Gerais */}
          <TabsContent value="geral">
            <div className="grid gap-6">
              {configuracoesCategorias
                .filter(cat => cat.id === 'geral')
                .map(categoria => (
                  <Card key={categoria.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <categoria.icone className="w-5 h-5" />
                        {categoria.titulo}
                      </CardTitle>
                      <CardDescription>
                        {categoria.descricao}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {categoria.itens.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <Label className="font-medium">{item.nome}</Label>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {item.valor}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* Aba de Notificações */}
          <TabsContent value="notificacoes">
            <div className="space-y-6">
              {/* Painel de Notificações Ativas */}
              <Card>
                <CardHeader>
                  <CardTitle>Central de Notificações Ativa</CardTitle>
                  <CardDescription>
                    Visualize suas notificações em tempo real
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PainelNotificacoes />
                </CardContent>
              </Card>

              {/* Configurações Detalhadas */}
              <ConfiguracoesNotificacoes />
            </div>
          </TabsContent>

          {/* Outras Abas - Perfil */}
          <TabsContent value="perfil">
            {configuracoesCategorias
              .filter(cat => cat.id === 'perfil')
              .map(categoria => (
                <Card key={categoria.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <categoria.icone className="w-5 h-5" />
                      {categoria.titulo}
                    </CardTitle>
                    <CardDescription>
                      {categoria.descricao}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categoria.itens.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <Label className="font-medium">{item.nome}</Label>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.valor}
                        </div>
                      </div>
                    ))}
                    <Button className="mt-4">
                      Editar Perfil
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          {/* Aba de Segurança */}
          <TabsContent value="seguranca">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Configurações de Segurança
                  </CardTitle>
                  <CardDescription>
                    Gerencie a segurança da sua conta e dados
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Lock className="w-5 h-5 text-green-600" />
                          <div>
                            <h4 className="font-medium">2FA Ativo</h4>
                            <p className="text-sm text-muted-foreground">
                              Autenticação em duas etapas ativada
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-blue-200 bg-blue-50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Eye className="w-5 h-5 text-blue-600" />
                          <div>
                            <h4 className="font-medium">Audit Log</h4>
                            <p className="text-sm text-muted-foreground">
                              Rastreamento de atividades ativo
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label className="font-medium">Timeout de Sessão</Label>
                        <p className="text-sm text-muted-foreground">
                          Tempo limite para sessão inativa
                        </p>
                      </div>
                      <div className="text-sm font-medium">30 minutos</div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label className="font-medium">Histórico de Senhas</Label>
                        <p className="text-sm text-muted-foreground">
                          Lembrar últimas 5 senhas
                        </p>
                      </div>
                      <div className="text-sm font-medium text-green-600">Ativo</div>
                    </div>
                  </div>

                  <Button variant="outline">
                    Alterar Senha
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba de Aparência */}
          <TabsContent value="aparencia">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Personalização da Interface
                </CardTitle>
                <CardDescription>
                  Ajuste a aparência do sistema às suas preferências
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Temas Disponíveis */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Tema Principal</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 border rounded-lg cursor-pointer border-blue-500 bg-blue-50">
                        <div className="w-full h-8 bg-blue-600 rounded mb-2"></div>
                        <span className="text-sm font-medium">Azul Médico</span>
                      </div>
                      <div className="p-3 border rounded-lg cursor-pointer hover:border-green-500">
                        <div className="w-full h-8 bg-green-600 rounded mb-2"></div>
                        <span className="text-sm font-medium">Verde Saúde</span>
                      </div>
                    </div>
                  </div>

                  {/* Densidade */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Densidade da Interface</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 border rounded cursor-pointer border-blue-500 bg-blue-50">
                        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                        <span className="text-sm">Padrão</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:border-gray-400">
                        <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                        <span className="text-sm">Compacta</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:border-gray-400">
                        <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                        <span className="text-sm">Espaçosa</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button>
                  Aplicar Mudanças
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba do Sistema */}
          <TabsContent value="sistema">
            <div className="grid gap-6">
              
              {/* Informações do Sistema */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="w-5 h-5" />
                    Informações do Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <Database className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <p className="text-sm text-muted-foreground">Versão</p>
                      <p className="font-semibold">{estatisticasSistema.sistema.versao}</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Activity className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <p className="text-sm text-muted-foreground">Uptime</p>
                      <p className="font-semibold">{estatisticasSistema.sistema.uptime}</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <HardDrive className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                      <p className="text-sm text-muted-foreground">Storage</p>
                      <p className="font-semibold">{estatisticasSistema.sistema.storage}</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Wifi className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                      <p className="text-sm text-muted-foreground">Performance</p>
                      <p className="font-semibold">{estatisticasSistema.sistema.performance}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Manutenção */}
              <Card>
                <CardHeader>
                  <CardTitle>Manutenção do Sistema</CardTitle>
                  <CardDescription>
                    Ferramentas para manutenção e otimização
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label className="font-medium">Limpeza de Cache</Label>
                      <p className="text-sm text-muted-foreground">
                        Liberar espaço removendo arquivos temporários
                      </p>
                    </div>
                    <Button variant="outline">
                      Limpar Cache
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label className="font-medium">Backup Manual</Label>
                      <p className="text-sm text-muted-foreground">
                        Criar backup dos dados do sistema
                      </p>
                    </div>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Fazer Backup
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label className="font-medium">Exportar Logs</Label>
                      <p className="text-sm text-muted-foreground">
                        Baixar logs de auditoria para análise
                      </p>
                    </div>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
