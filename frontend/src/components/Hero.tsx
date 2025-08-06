import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Activity, Users, Clock, Shield, Calendar } from "lucide-react";
import heroImage from "@/assets/medical-hero.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-subtle">
      {/* Hero Principal */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Conteúdo */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Gestão Hospitalar
                <span className="block bg-gradient-hero bg-clip-text text-transparent">
                  Inteligente
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Sistema completo de gestão para instituições de saúde. 
                Agendamentos, prontuários eletrônicos, telemedicina e muito mais 
                em uma plataforma segura e moderna.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="medical" size="lg" className="text-lg px-8 py-4">
                Começar Agora
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Agendar Demo
              </Button>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">Pacientes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">50+</div>
                <div className="text-sm text-muted-foreground">Médicos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">24/7</div>
                <div className="text-sm text-muted-foreground">Suporte</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>

          {/* Imagem */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-glow">
              <img 
                src={heroImage} 
                alt="Sistema VidaPlus - Gestão Hospitalar" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-primary/10"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Funcionalidades */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 text-center bg-card shadow-card hover:shadow-medical transition-all duration-200">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Agendamentos</h3>
            <p className="text-muted-foreground text-sm">Sistema inteligente de marcação de consultas</p>
          </Card>

          <Card className="p-6 text-center bg-card shadow-card hover:shadow-medical transition-all duration-200">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-lg mb-4">
              <Users className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Gestão de Pacientes</h3>
            <p className="text-muted-foreground text-sm">Cadastro completo e histórico médico</p>
          </Card>

          <Card className="p-6 text-center bg-card shadow-card hover:shadow-medical transition-all duration-200">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mb-4">
              <Activity className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Telemedicina</h3>
            <p className="text-muted-foreground text-sm">Consultas online seguras e eficientes</p>
          </Card>

          <Card className="p-6 text-center bg-card shadow-card hover:shadow-medical transition-all duration-200">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-success/10 rounded-lg mb-4">
              <Shield className="w-6 h-6 text-success" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Segurança LGPD</h3>
            <p className="text-muted-foreground text-sm">Proteção total dos dados dos pacientes</p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Hero;