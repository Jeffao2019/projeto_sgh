import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bell, Database, Shield, User, Settings, Palette, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Configuracoes = () => {
  const navigate = useNavigate();
  
  const configuracoes = [
    {
      icon: User,
      title: "Perfil do Usuário",
      description: "Gerencie suas informações pessoais e preferências médicas",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      action: () => navigate("/perfil"),
      status: "Configurado"
    },
    {
      icon: Bell,
      title: "Notificações e Alertas",
      description: "Configure alertas, lembretes e notificações do sistema",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      action: () => navigate("/configuracoes-avancadas"),
      status: "Disponível",
      highlight: true
    },
    {
      icon: Shield,
      title: "Segurança e Privacidade",
      description: "Configurações de senha, 2FA e políticas de segurança",
      color: "text-green-600",
      bgColor: "bg-green-50",
      action: () => navigate("/configuracoes-avancadas"),
      status: "Configurado"
    },
    {
      icon: Settings,
      title: "Configurações Gerais",
      description: "Idioma, fuso horário e configurações básicas",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      action: () => navigate("/configuracoes-avancadas"),
      status: "Disponível"
    },
    {
      icon: Palette,
      title: "Aparência e Tema",
      description: "Personalização da interface e temas visuais",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      action: () => navigate("/configuracoes-avancadas"),
      status: "Disponível"
    },
    {
      icon: Database,
      title: "Sistema e Manutenção",
      description: "Backup automático, performance e manutenção",
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      action: () => navigate("/configuracoes-avancadas"),
      status: "Operacional"
    }
  ];

  return (
    <DashboardLayout
      title="Central de Configurações"
      subtitle="Acesse e configure todas as funcionalidades do sistema SGH"
    >
      <div className="space-y-8">
        
        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600">Configurações</p>
                <p className="text-xl font-bold text-blue-900">6 Módulos</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-600">Notificações</p>
                <p className="text-xl font-bold text-green-900">Sistema Ativo</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-orange-600">Segurança</p>
                <p className="text-xl font-bold text-orange-900">Nível Alto</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Cards de configurações principais */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Módulos de Configuração</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {configuracoes.map((config, index) => (
              <Card 
                key={index} 
                className={`p-6 bg-card shadow-card hover:shadow-lg transition-all duration-300 cursor-pointer group border-l-4 ${
                  config.highlight ? 'border-l-orange-500 bg-gradient-to-r from-orange-50/30 to-transparent' : 'border-l-gray-200'
                }`}
                onClick={config.action}
              >
                <div className="space-y-4">
                  {/* Header com ícone e status */}
                  <div className="flex items-start justify-between">
                    <div className={`flex-shrink-0 w-12 h-12 ${config.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <config.icon className={`w-6 h-6 ${config.color}`} />
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      config.status === 'Configurado' || config.status === 'Operacional' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {config.status}
                    </div>
                  </div>
                  
                  {/* Conteúdo */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {config.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {config.description}
                    </p>
                  </div>
                  
                  {/* Botão de ação */}
                  <Button 
                    variant={config.highlight ? "default" : "outline"}
                    size="sm" 
                    className={`w-full transition-colors ${
                      config.highlight 
                        ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                        : 'group-hover:border-primary group-hover:text-primary'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      config.action();
                    }}
                  >
                    {config.highlight ? '🔧 Configurar Agora' : 'Configurar'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Configurações Rápidas e Ações */}
        <Card className="p-6 bg-card shadow-card">
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configurações Rápidas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium text-foreground">Notificações por Email</h3>
                  <p className="text-sm text-muted-foreground">Receber alertas importantes por email</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  ✅ Ativo
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium text-foreground">Backup Automático</h3>
                  <p className="text-sm text-muted-foreground">Backup diário às 02:00</p>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => navigate("/configuracoes-avancadas")}
                >
                  ⚙️ Configurar
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium text-foreground">Autenticação 2FA</h3>
                  <p className="text-sm text-muted-foreground">Segurança avançada ativa</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  🔒 Ativo
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium text-foreground">Tema da Interface</h3>
                  <p className="text-sm text-muted-foreground">Modo claro ativo</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/configuracoes-avancadas")}
                >
                  🎨 Alterar
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium text-foreground">Sistema SGH</h3>
                  <p className="text-sm text-muted-foreground">Versão 2.1.4 - Operacional</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  ℹ️ Info
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium text-foreground">Performance</h3>
                  <p className="text-sm text-muted-foreground">98% - Sistema otimizado</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  📊 Ótimo
                </Button>
              </div>
            </div>
          </div>

          {/* Ações principais */}
          <div className="mt-8 pt-6 border-t">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="default"
                size="lg" 
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate("/configuracoes-avancadas")}
              >
                <Settings className="w-4 h-4" />
                Configurações Avançadas
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="flex items-center gap-2"
                onClick={() => navigate("/perfil")}
              >
                <User className="w-4 h-4" />
                Editar Perfil
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="flex items-center gap-2"
              >
                <Database className="w-4 h-4" />
                Exportar Dados
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Configuracoes;