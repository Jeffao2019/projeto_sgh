import { Heart, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-full">
                <Heart className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold">VidaPlus</h3>
                <p className="text-sm text-background/70">Sistema de Gestão Hospitalar</p>
              </div>
            </div>
            <p className="text-background/80 text-sm leading-relaxed">
              Revolucionando a gestão hospitalar com tecnologia moderna e segura, 
              focada na melhor experiência para pacientes e profissionais de saúde.
            </p>
          </div>

          {/* Soluções */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Soluções</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Agendamento Online</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Prontuário Eletrônico</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Telemedicina</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Gestão Financeira</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Relatórios</a></li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Documentação</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Treinamentos</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Status do Sistema</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Política de Privacidade</a></li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contato</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-background/70" />
                <span className="text-background/80">(11) 3000-0000</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-background/70" />
                <span className="text-background/80">contato@vidaplus.com.br</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-background/70 mt-0.5" />
                <span className="text-background/80">
                  Av. Paulista, 1000<br />
                  São Paulo - SP, 01310-100
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Linha separadora e Copyright */}
        <div className="border-t border-background/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-background/70 text-sm">
              © 2025 VidaPlus. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-background/80 hover:text-background transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-background/80 hover:text-background transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-background/80 hover:text-background transition-colors">
                LGPD
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;