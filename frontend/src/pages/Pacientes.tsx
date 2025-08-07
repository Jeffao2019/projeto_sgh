import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, Phone, Plus, Search, Users } from "lucide-react";
import { apiService } from "@/lib/api-service";
import { toast } from "sonner";
import { Paciente } from "@/types/paciente";
import { formatPhoneNumber } from "@/utils/format";
import { FilterPatientsDialog } from "@/components/dialogs/FilterPatientsDialog";

export default function Pacientes() {
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    nome: "",
    cpf: "",
    convenio: "",
  });

  useEffect(() => {
    loadPacientes();
  }, []);

  const loadPacientes = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getPacientes();
      setPacientes(data);
    } catch (error: any) {
      toast.error("Erro ao carregar pacientes");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPacientes = pacientes.filter((paciente) => {
    const matchesSearch = paciente.nome
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesNome =
      !filters.nome ||
      paciente.nome.toLowerCase().includes(filters.nome.toLowerCase());

    const matchesCpf = !filters.cpf || paciente.cpf.includes(filters.cpf);

    const matchesConvenio =
      !filters.convenio || paciente.convenio === filters.convenio;

    return matchesSearch && matchesNome && matchesCpf && matchesConvenio;
  });

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      nome: "",
      cpf: "",
      convenio: "",
    });
  };

  const handleOpenFilters = () => {
    if (pacientes.length === 0) {
      toast.error("Por favor, digite algo na busca primeiro");
      searchInputRef.current?.focus();
      return false;
    }
    return true;
  };

  return (
    <DashboardLayout
      title="Pacientes"
      subtitle="Gerencie informações dos pacientes"
    >
      {/* Botão de ação */}
      <div className="flex justify-end mb-8">
        <Button variant="medical" onClick={() => navigate("/pacientes/novo")}>
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
              <p className="text-2xl font-bold text-foreground">
                {pacientes.length}
              </p>
              <p className="text-sm text-muted-foreground">
                Total de Pacientes
              </p>
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
              ref={searchInputRef}
              placeholder="Buscar pacientes..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <FilterPatientsDialog
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onOpenChange={handleOpenFilters}
          />
        </div>
      </Card>

      {/* Lista de pacientes */}
      <Card className="bg-card shadow-card">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Lista de Pacientes
          </h2>
          <div className="space-y-4">
            {isLoading ? (
              <p>Carregando...</p>
            ) : filteredPacientes.length === 0 ? (
              <p>Nenhum paciente encontrado</p>
            ) : (
              filteredPacientes.map((paciente) => (
                <div
                  key={paciente.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-foreground">
                        {paciente.nome}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-3 h-3" />
                        <span>{paciente.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3 h-3" />
                        <span>{formatPhoneNumber(paciente.telefone)}</span>
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
              ))
            )}
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
}