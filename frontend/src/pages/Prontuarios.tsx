import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { Calendar, Download, Eye, FileText, Plus, Search, User, UserCheck } from "lucide-react";
import { apiService } from "@/lib/api-service";
import { toast } from "sonner";
import { Prontuario } from "@/types/prontuarios";

export default function Prontuarios() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prontuarios, setProntuarios] = useState<Prontuario[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  // Pegar o ID do paciente da query string se existir
  const pacienteId = searchParams.get('paciente');

  useEffect(() => {
    loadProntuarios();
  }, [pacienteId]); // Recarregar quando o pacienteId mudar

  const loadProntuarios = async () => {
    setIsLoading(true);
    try {
      let data;
      if (pacienteId) {
        // Se há um paciente específico, buscar prontuários desse paciente
        data = await apiService.getProntuariosByPaciente(pacienteId);
      } else {
        // Caso contrário, buscar todos os prontuários
        data = await apiService.getProntuarios();
      }
      setProntuarios(data);
    } catch (error: any) {
      toast.error("Erro ao carregar prontuários");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusFromDate = (dataConsulta: string): string => {
    const hoje = new Date();
    const dataConsultaDate = new Date(dataConsulta);
    
    if (dataConsultaDate > hoje) {
      return "agendado";
    } else if (dataConsultaDate.toDateString() === hoje.toDateString()) {
      return "em_andamento";
    } else {
      return "concluido";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluido":
        return "text-green-700 bg-green-100";
      case "agendado":
        return "text-blue-700 bg-blue-100";
      case "em_andamento":
        return "text-orange-700 bg-orange-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "concluido":
        return "Concluído";
      case "agendado":
        return "Agendado";
      case "em_andamento":
        return "Em Andamento";
      default:
        return "Desconhecido";
    }
  };

  const filteredProntuarios = prontuarios
    .map((prontuario) => ({
      ...prontuario,
      status: getStatusFromDate(prontuario.dataConsulta)
    }))
    .filter((prontuario) => {
      // Filtro de busca geral (searchTerm) - busca em paciente e médico
      const matchesSearch = !searchTerm || 
        (prontuario.paciente?.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (prontuario.medico?.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
        prontuario.diagnostico.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro de status
      const matchesStatus = !statusFilter || prontuario.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

  // Calcular estatísticas
  const stats = {
    total: prontuarios.length,
    concluidos: prontuarios.filter(p => getStatusFromDate(p.dataConsulta) === "concluido").length,
    agendados: prontuarios.filter(p => getStatusFromDate(p.dataConsulta) === "agendado").length,
    emAndamento: prontuarios.filter(p => getStatusFromDate(p.dataConsulta) === "em_andamento").length,
  };

  return (
    <DashboardLayout
      title={pacienteId ? "Prontuários do Paciente" : "Prontuários"}
      subtitle={pacienteId ? "Histórico médico específico do paciente" : "Histórico médico e documentos dos pacientes"}
    >
      {/* Botão de ação */}
      <div className="flex justify-between items-center mb-8">
        {pacienteId && (
          <Button 
            variant="outline" 
            onClick={() => navigate("/prontuarios")}
          >
            ← Voltar para todos os prontuários
          </Button>
        )}
        <div className={pacienteId ? "" : "ml-auto"}>
          <Button variant="medical" onClick={() => navigate("/prontuarios/novo")}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Prontuário
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 bg-card shadow-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-card shadow-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.concluidos}</p>
              <p className="text-sm text-muted-foreground">Concluídos</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card shadow-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.agendados}</p>
              <p className="text-sm text-muted-foreground">Agendados</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card shadow-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.emAndamento}</p>
              <p className="text-sm text-muted-foreground">Em Andamento</p>
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
              placeholder="Buscar por paciente, médico ou diagnóstico..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value === "TODOS" ? "" : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODOS">Todos os status</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="agendado">Agendado</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(searchTerm || statusFilter) && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("");
              }}
            >
              Limpar
            </Button>
          )}
          <Button variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </Card>

      {/* Lista de prontuários */}
      <Card className="bg-card shadow-card">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Lista de Prontuários
          </h2>
          <div className="space-y-4">
            {isLoading ? (
              <p>Carregando...</p>
            ) : filteredProntuarios.length === 0 ? (
              <div className="text-center py-8">
                {searchTerm || statusFilter ? (
                  <div>
                    <p className="text-muted-foreground mb-2">
                      Nenhum prontuário encontrado com os filtros aplicados
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("");
                      }}
                    >
                      Limpar filtros
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhum prontuário cadastrado</p>
                )}
              </div>
            ) : (
              filteredProntuarios.map((prontuario) => (
                <div
                  key={prontuario.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-foreground">
                        {prontuario.paciente?.nome || "Paciente não identificado"}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prontuario.status)}`}>
                        {getStatusLabel(prontuario.status)}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>Dr(a). {prontuario.medico?.nome || "Médico não identificado"}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(prontuario.dataConsulta).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileText className="w-3 h-3" />
                        <span className="truncate">{prontuario.diagnostico}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3 lg:mt-0">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/prontuarios/${prontuario.id}`)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Ver
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/prontuarios/${prontuario.id}/editar`)}
                    >
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-3 h-3 mr-1" />
                      PDF
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