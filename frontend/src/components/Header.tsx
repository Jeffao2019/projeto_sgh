import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-card shadow-medical border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo e Nome */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-full shadow-glow">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">VidaPlus</h1>
              <p className="text-sm text-muted-foreground">Sistema de Gestão Hospitalar</p>
            </div>
          </Link>

          {/* Navegação Pública */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Início
              </Button>
            </Link>
            <Link to="/#features">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Recursos
              </Button>
            </Link>
            <Link to="/#contact">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Contato
              </Button>
            </Link>
          </nav>

          {/* Área do Usuário */}
          <div className="flex items-center space-x-3">
            <Link to="/login">
              <Button variant="outline" size="sm">
                Entrar
              </Button>
            </Link>
            <Link to="/cadastro">
              <Button variant="medical" size="sm">
                Cadastrar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;