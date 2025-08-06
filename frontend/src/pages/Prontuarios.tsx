import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Download, Eye, FileText, Search } from "lucide-react";

const Prontuarios = () => {
  const prontuarios = [
    {
      id: 1,
      paciente: "Maria Silva",
      medico: "Dr. João Santos",
      data: "2025-01-12",
      tipo: "Consulta",
      especialidade: "Cardiologia",
      status: "concluido"
    },
    {
      id: 2,
      paciente: "Pedro Oliveira",
      medico: "Dra. Ana Costa",
      data: "2025-01-10",
      tipo: "Exame",
      especialidade: "Dermatologia", 
      status: "pendente"
    },
    {
      id: 3,
      paciente: "Carla Santos",
      medico: "Dr. Roberto Lima",
      data: "2025-01-08",
      tipo: "Procedimento",
      especialidade: "Neurologia",
      status: "concluido"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluido":
        return "text-success bg-success/10";
      case "pendente":
        return "text-warning bg-warning/10";
      case "em_andamento":
        return "text-primary bg-primary/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <DashboardLayout
      title="Prontuários"
      subtitle="Histórico médico e documentos dos pacientes"
    >
      {/* Botão de ação */}
      <div className="flex justify-end mb-8">
        <Button variant="medical">
          <FileText className="w-4 h-4 mr-2" />
          Novo Prontuário
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-card shadow-card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">2,456</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-card shadow-card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">2,234</p>
                <p className="text-sm text-muted-foreground">Concluídos</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card shadow-card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">156</p>
                <p className="text-sm text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card shadow-card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">66</p>
                <p className="text-sm text-muted-foreground">Em andamento</p>
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
                placeholder="Buscar prontuários por paciente ou médico..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              Filtros
            </Button>
            <Button variant="secondary">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </Card>

        {/* Lista de prontuários */}
        <Card className="bg-card shadow-card">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Prontuários Recentes</h2>
            <div className="space-y-4">
              {prontuarios.map((prontuario) => (
                <div
                  key={prontuario.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-foreground">{prontuario.paciente}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prontuario.status)}`}>
                        {prontuario.status}
                      </span>
                      <span className="px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                        {prontuario.tipo}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div>
                        <span>Médico: {prontuario.medico}</span>
                      </div>
                      <div>
                        <span>Especialidade: {prontuario.especialidade}</span>
                      </div>
                      <div>
                        <span>Data: {new Date(prontuario.data).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3 lg:mt-0">
                    <Button variant="outline" size="sm">
                      <Eye className="w-3 h-3 mr-1" />
                      Ver
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Download className="w-3 h-3 mr-1" />
                      Download
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

export default Prontuarios;