import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, FileText, Heart, LogOut, Settings, UserCircle, Users } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header com Navegação */}
      <header className="bg-card shadow-medical border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo e Nome */}
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-full shadow-glow">
                <Heart className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">VidaPlus</h1>
                <p className="text-sm text-muted-foreground">Sistema de Gestão Hospitalar</p>
              </div>
            </Link>

            {/* Navegação */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/agendamentos">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendamentos
                </Button>
              </Link>
              <Link to="/prontuarios">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  <FileText className="w-4 h-4 mr-2" />
                  Prontuários
                </Button>
              </Link>
              <Link to="/pacientes">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  <UserCircle className="w-4 h-4 mr-2" />
                  Pacientes
                </Button>
              </Link>
              <Link to="/configuracoes">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </Button>
              </Link>
            </nav>

            {/* Área do Usuário */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground">
                Olá, <strong>{user.nome}</strong>
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Dashboard
          </h2>
          <p className="text-muted-foreground">
            Bem-vindo ao Sistema de Gestão Hospitalar. Selecione uma opção para começar.
          </p>
        </div>

        {/* Cards de Funcionalidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/pacientes">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer hover:scale-105">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Pacientes</h3>
                <p className="text-sm text-muted-foreground">
                  Gerenciar cadastro e informações dos pacientes
                </p>
              </div>
            </Card>
          </Link>

          <Link to="/agendamentos">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer hover:scale-105">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Agendamentos</h3>
                <p className="text-sm text-muted-foreground">
                  Consultas, exames e procedimentos
                </p>
              </div>
            </Card>
          </Link>

          <Link to="/prontuarios">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer hover:scale-105">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4">
                  <FileText className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Prontuários</h3>
                <p className="text-sm text-muted-foreground">
                  Histórico médico e anotações
                </p>
              </div>
            </Card>
          </Link>

          <Link to="/configuracoes">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer hover:scale-105">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4">
                  <Settings className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Configurações</h3>
                <p className="text-sm text-muted-foreground">
                  Ajustes do sistema e perfil
                </p>
              </div>
            </Card>
          </Link>
        </div>

        {/* Informações da Conta */}
        <div className="mt-12">
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-6">
              Informações da Conta
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-subtle p-4 rounded-lg">
                <span className="text-sm text-muted-foreground">Nome Completo</span>
                <p className="text-lg font-medium text-foreground">{user.nome}</p>
              </div>
              <div className="bg-gradient-subtle p-4 rounded-lg">
                <span className="text-sm text-muted-foreground">Email</span>
                <p className="text-lg font-medium text-foreground">{user.email}</p>
              </div>
              <div className="bg-gradient-subtle p-4 rounded-lg">
                <span className="text-sm text-muted-foreground">Perfil de Acesso</span>
                <p className="text-lg font-medium text-foreground">{user.role}</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
