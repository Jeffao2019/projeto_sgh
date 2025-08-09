import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone, Plus, Search, Users } from "lucide-react";
import { apiService } from "@/lib/api-service";
import { toast } from "sonner";
import { Paciente } from "@/types/pacientes";
import { formatPhoneNumber } from "@/utils/format";

export default function Pacientes() {
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [convenioFilter, setConvenioFilter] = useState("");

  useEffect(() => {
    loadPacientes();
  }, []);

  const loadPacientes = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getPacientes();
      // Ensure all required Paciente properties are present
      const pacientesData: Paciente[] = data.map((item: any) => ({
        id: item.id,
        nome: item.nome,
        cpf: item.cpf,
        email: item.email,
        telefone: item.telefone,
        dataNascimento: item.dataNascimento,
        endereco: item.endereco,
        convenio: item.convenio,
        numeroConvenio: item.numeroConvenio,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
      setPacientes(pacientesData);
    } catch (error: any) {
      toast.error("Erro ao carregar pacientes");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPacientes = pacientes
    .map(
      ({ id, nome, cpf, email, telefone, endereco, convenio, numeroConvenio }) => ({
        id,
        nome,
        cpf,
        email,
        telefone,
        endereco,
        convenio,
        numeroConvenio,
      })
    )
    .filter((paciente) => {
      // Filtro de busca geral (searchTerm) - busca em nome, CPF e email
      const matchesSearch = !searchTerm || 
        paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paciente.cpf.includes(searchTerm) ||
        paciente.email.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro de convênio
      const matchesConvenio = !convenioFilter || 
        (paciente.convenio && 
         paciente.convenio.toUpperCase() === convenioFilter.toUpperCase());

      return matchesSearch && matchesConvenio;
    });



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
              placeholder="Buscar por nome, CPF ou email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              value={convenioFilter}
              onValueChange={(value) => setConvenioFilter(value === "TODOS" ? "" : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por convênio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODOS">Todos os convênios</SelectItem>
                <SelectItem value="PARTICULAR">Particular</SelectItem>
                <SelectItem value="UNIMED">Unimed</SelectItem>
                <SelectItem value="AMIL">Amil</SelectItem>
                <SelectItem value="BRADESCO">Bradesco</SelectItem>
                <SelectItem value="SULAMERICA">SulAmérica</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(searchTerm || convenioFilter) && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setConvenioFilter("");
              }}
            >
              Limpar
            </Button>
          )}
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
              <div className="text-center py-8">
                {searchTerm || convenioFilter ? (
                  <div>
                    <p className="text-muted-foreground mb-2">
                      Nenhum paciente encontrado com os filtros aplicados
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSearchTerm("");
                        setConvenioFilter("");
                      }}
                    >
                      Limpar filtros
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhum paciente cadastrado</p>
                )}
              </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-3 h-3" />
                        <span>{paciente.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3 h-3" />
                        <span>{formatPhoneNumber(paciente.telefone)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {paciente.convenio || "Particular"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3 lg:mt-0">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/prontuarios?paciente=${paciente.id}`)}
                    >
                      Ver Prontuário
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/pacientes/${paciente.id}/editar`)}
                    >
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