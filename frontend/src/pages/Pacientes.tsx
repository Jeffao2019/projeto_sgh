import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, Phone, Plus, Search, Users } from "lucide-react";

const Pacientes = () => {
  const pacientes = [
    {
      id: 1,
      nome: "Maria Silva",
      email: "maria.silva@email.com",
      telefone: "(11) 99999-9999",
      idade: 45,
      ultimaConsulta: "2025-01-10",
      status: "ativo"
    },
    {
      id: 2,
      nome: "Pedro Oliveira",
      email: "pedro.oliveira@email.com",
      telefone: "(11) 88888-8888",
      idade: 32,
      ultimaConsulta: "2025-01-08",
      status: "ativo"
    },
    {
      id: 3,
      nome: "Carla Santos",
      email: "carla.santos@email.com",
      telefone: "(11) 77777-7777",
      idade: 28,
      ultimaConsulta: "2024-12-15",
      status: "inativo"
    }
  ];

  return (
    <DashboardLayout
      title="Pacientes"
      subtitle="Gerencie informações dos pacientes"
    >
      {/* Botão de ação */}
      <div className="flex justify-end mb-8">
        <Button variant="medical">
          <Plus className="w-4 h-4 mr-2" />
          Novo Paciente
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-card shadow-card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">1,234</p>
                <p className="text-sm text-muted-foreground">Total de Pacientes</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-card shadow-card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">1,156</p>
                <p className="text-sm text-muted-foreground">Pacientes Ativos</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card shadow-card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">45</p>
                <p className="text-sm text-muted-foreground">Novos este mês</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Busca e filtros */}
        <Card className="p-6 mb-6 bg-card shadow-card">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar pacientes..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              Filtros
            </Button>
          </div>
        </Card>

        {/* Lista de pacientes */}
        <Card className="bg-card shadow-card">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Lista de Pacientes</h2>
            <div className="space-y-4">
              {pacientes.map((paciente) => (
                <div
                  key={paciente.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-foreground">{paciente.nome}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        paciente.status === "ativo" 
                          ? "text-success bg-success/10" 
                          : "text-muted-foreground bg-muted"
                      }`}>
                        {paciente.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-3 h-3" />
                        <span>{paciente.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3 h-3" />
                        <span>{paciente.telefone}</span>
                      </div>
                      <div>
                        <span>Idade: {paciente.idade} anos</span>
                      </div>
                      <div>
                        <span>Última consulta: {new Date(paciente.ultimaConsulta).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3 lg:mt-0">
                    <Button variant="outline" size="sm">
                      Ver Prontuário
                    </Button>
                    <Button variant="secondary" size="sm">
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
    </DashboardLayout>
  );
};

export default Pacientes;