import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  FileText, 
  Video, 
  Users, 
  BarChart3, 
  Shield,
  Smartphone,
  Clock,
  Heart
} from "lucide-react";

const Features = () => {
  const mainFeatures = [
    {
      icon: Calendar,
      title: "Agendamento Inteligente",
      description: "Sistema automatizado de marcação de consultas com notificações e lembretes",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: FileText,
      title: "Prontuário Eletrônico",
      description: "Histórico médico completo e seguro, acessível em tempo real",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      icon: Video,
      title: "Telemedicina",
      description: "Consultas online com qualidade profissional e total segurança",
      color: "text-accent",
      bgColor: "bg-accent/10"
    }
  ];

  const additionalFeatures = [
    {
      icon: Users,
      title: "Gestão de Equipe",
      description: "Controle completo de profissionais e suas especialidades"
    },
    {
      icon: BarChart3,
      title: "Relatórios Avançados",
      description: "Analytics e insights para otimizar a gestão hospitalar"
    },
    {
      icon: Shield,
      title: "Conformidade LGPD",
      description: "Proteção total dos dados seguindo todas as normas"
    },
    {
      icon: Smartphone,
      title: "App Mobile",
      description: "Acesso completo via aplicativo iOS e Android"
    },
    {
      icon: Clock,
      title: "Disponibilidade 24/7",
      description: "Sistema sempre online com suporte técnico integral"
    },
    {
      icon: Heart,
      title: "Foco no Paciente",
      description: "Interface pensada para melhor experiência do usuário"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Funcionalidades Completas para
            <span className="block text-primary">Gestão Hospitalar</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Tudo que sua instituição de saúde precisa em uma única plataforma integrada
          </p>
        </div>

        {/* Funcionalidades Principais */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <Card key={index} className="p-8 bg-card shadow-card hover:shadow-medical transition-all duration-300 group">
              <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.bgColor} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-200`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">{feature.description}</p>
              <Button variant="outline" className="w-full">
                Saiba Mais
              </Button>
            </Card>
          ))}
        </div>

        {/* Funcionalidades Adicionais */}
        <div className="bg-muted/30 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-foreground text-center mb-8">
            E muito mais funcionalidades
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-card rounded-lg shadow-card">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button variant="medical" size="lg" className="text-lg px-8 py-4">
            Solicitar Demonstração
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;