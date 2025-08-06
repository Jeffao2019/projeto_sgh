import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, Plus, User } from "lucide-react";

const Agendamentos = () => {
  const proximosAgendamentos = [
    {
      id: 1,
      paciente: "Maria Silva",
      medico: "Dr. João Santos",
      especialidade: "Cardiologia",
      data: "2025-01-15",
      hora: "14:30",
      status: "confirmado"
    },
    {
      id: 2,
      paciente: "Pedro Oliveira",
      medico: "Dra. Ana Costa",
      especialidade: "Dermatologia",
      data: "2025-01-15",
      hora: "15:00",
      status: "pendente"
    },
    {
      id: 3,
      paciente: "Carla Santos",
      medico: "Dr. Roberto Lima",
      especialidade: "Neurologia",
      data: "2025-01-15",
      hora: "16:30",
      status: "confirmado"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmado":
        return "text-success bg-success/10";
      case "pendente":
        return "text-warning bg-warning/10";
      case "cancelado":
        return "text-destructive bg-destructive/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <DashboardLayout
      title="Agendamentos"
      subtitle="Gerencie consultas e procedimentos"
    >
      {/* Botão de ação */}
      <div className="flex justify-end mb-8">
        <Button variant="medical">
          <Plus className="w-4 h-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-card shadow-card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-sm text-muted-foreground">Hoje</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-card shadow-card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">5</p>
                <p className="text-sm text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card shadow-card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">7</p>
                <p className="text-sm text-muted-foreground">Confirmados</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card shadow-card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">45</p>
                <p className="text-sm text-muted-foreground">Esta semana</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Lista de agendamentos */}
        <Card className="bg-card shadow-card">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Próximos Agendamentos</h2>
            <div className="space-y-4">
              {proximosAgendamentos.map((agendamento) => (
                <div
                  key={agendamento.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-foreground">{agendamento.paciente}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agendamento.status)}`}>
                        {agendamento.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {agendamento.medico} • {agendamento.especialidade}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {new Date(agendamento.data).toLocaleDateString('pt-BR')} às {agendamento.hora}
                    </p>
                  </div>
                  <div className="flex space-x-2 mt-3 sm:mt-0">
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                    <Button variant="secondary" size="sm">
                      Confirmar
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

export default Agendamentos;