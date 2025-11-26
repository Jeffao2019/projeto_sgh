import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bell, Database, Shield, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Configuracoes = () => {
  const navigate = useNavigate();
  const configuracoes = [
    {
      icon: User,
      title: "Perfil do Usuário",
      description: "Gerencie suas informações pessoais e preferências",
      color: "text-primary",
      bgColor: "bg-primary/10",
      action: () => navigate("/perfil")
    },
    {
      icon: Shield,
      title: "Segurança",
      description: "Configurações de senha, autenticação e privacidade",
      color: "text-success",
      bgColor: "bg-success/10",
      action: () => navigate("/perfil")
    },
    {
      icon: Bell,
      title: "Notificações",
      description: "Configure alertas, lembretes e notificações",
      color: "text-accent",
      bgColor: "bg-accent/10",
      action: () => console.log("Notificações - Em desenvolvimento")
    },
    {
      icon: Database,
      title: "Dados e Backup",
      description: "Backup automático e gerenciamento de dados",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      action: () => console.log("Backup - Em desenvolvimento")
    }
  ];

  return (
    <DashboardLayout
      title="Configurações"
      subtitle="Gerencie as configurações do sistema e sua conta"
    >
      {/* Cards de configurações */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {configuracoes.map((config, index) => (
          <Card 
            key={index} 
            className="p-6 bg-card shadow-card hover:shadow-medical transition-all duration-200 cursor-pointer group"
            onClick={config.action}
          >
            <div className="flex items-start space-x-4">
              <div className={`flex-shrink-0 w-12 h-12 ${config.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                <config.icon className={`w-6 h-6 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {config.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {config.description}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="group-hover:border-primary group-hover:text-primary transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    config.action();
                  }}
                >
                  Configurar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Configurações rápidas */}
      <Card className="p-6 bg-card shadow-card">
        <h2 className="text-xl font-semibold text-foreground mb-6">Configurações Rápidas</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">Notificações por email</h3>
              <p className="text-sm text-muted-foreground">Receber notificações importantes por email</p>
            </div>
            <Button variant="outline" size="sm">
              Ativado
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">Backup automático</h3>
              <p className="text-sm text-muted-foreground">Backup diário dos dados do sistema</p>
            </div>
            <Button variant="secondary" size="sm">
              Configurar
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">Autenticação dois fatores</h3>
              <p className="text-sm text-muted-foreground">Adicionar camada extra de segurança</p>
            </div>
            <Button variant="outline" size="sm">
              Desativado
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">Tema escuro</h3>
              <p className="text-sm text-muted-foreground">Alternar entre tema claro e escuro</p>
            </div>
            <Button variant="outline" size="sm">
              Claro
            </Button>
          </div>
        </div>

        {/* Ações do sistema */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button variant="medical">
            Salvar Configurações
          </Button>
          <Button variant="outline">
            Restaurar Padrões
          </Button>
          <Button variant="destructive">
            Exportar Dados
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default Configuracoes;