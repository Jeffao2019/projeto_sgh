import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, FileText, Heart, LogOut, Settings, UserCircle, ChevronDown, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 hover:bg-muted">
                    <UserCircle className="w-5 h-5" />
                    <span className="hidden md:inline">{user?.nome || user?.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.nome || user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/perfil" className="flex items-center space-x-2 cursor-pointer">
                      <User className="w-4 h-4" />
                      <span>Meu Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/configuracoes" className="flex items-center space-x-2 cursor-pointer">
                      <Settings className="w-4 h-4" />
                      <span>Configurações</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {(title || subtitle) && (
          <div className="mb-8">
            {title && (
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
