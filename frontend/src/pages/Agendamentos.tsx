import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { CalendarDays, Clock, Users, AlertCircle, Plus, Search, X, RefreshCcw } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { apiService } from '@/lib/api-service';
import { 
  Agendamento, 
  StatusAgendamento, 
  TipoConsulta, 
  StatusAgendamentoLabels, 
  TipoConsultaLabels,
  StatusColors 
} from '@/types/agendamentos';
import { Paciente } from '@/types/pacientes';
import { Medico } from '@/types/medicos';

interface AgendamentoWithDetails extends Agendamento {
  paciente?: Paciente;
  medico?: Medico;
}

export default function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState<AgendamentoWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusAgendamento | 'all'>('all');
  const [tipoFilter, setTipoFilter] = useState<TipoConsulta | 'all'>('all');
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [agendamentosData, pacientesData, medicosData] = await Promise.all([
        apiService.getAgendamentos(),
        apiService.getPacientes(),
        apiService.getMedicos()
      ]);

      // Enriquecer agendamentos com dados de pacientes e médicos
      const agendamentosEnriquecidos = agendamentosData.map(agendamento => {
        const paciente = pacientesData.find(p => p.id === agendamento.pacienteId);
        const medico = medicosData.find(m => m.id === agendamento.medicoId);
        return {
          ...agendamento,
          paciente,
          medico
        };
      });

      setAgendamentos(agendamentosEnriquecidos);
      setPacientes(pacientesData);
      setMedicos(medicosData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredAgendamentos = agendamentos.filter(agendamento => {
    const matchesSearch = 
      agendamento.paciente?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agendamento.medico?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agendamento.observacoes?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || agendamento.status === statusFilter;
    const matchesTipo = tipoFilter === 'all' || agendamento.tipo === tipoFilter;

    return matchesSearch && matchesStatus && matchesTipo;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTipoFilter('all');
  };

  const getStatusCount = (status: StatusAgendamento) => {
    return agendamentos.filter(a => a.status === status).length;
  };

  const getTodayAgendamentos = () => {
    const today = new Date();
    return agendamentos.filter(a => {
      const agendamentoDate = new Date(a.dataHora);
      return agendamentoDate.toDateString() === today.toDateString();
    }).length;
  };

  const formatDateTime = (dateTime: string) => {
    try {
      const date = new Date(dateTime);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateTime;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCcw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Agendamentos</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os agendamentos de consultas e exames
            </p>
          </div>
          <Button asChild>
            <Link to="/agendamentos/novo">
              <Plus className="h-4 w-4 mr-2" />
              Novo Agendamento
            </Link>
          </Button>
        </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTodayAgendamentos()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getStatusCount(StatusAgendamento.CONFIRMADO)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendados</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getStatusCount(StatusAgendamento.AGENDADO)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelados</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getStatusCount(StatusAgendamento.CANCELADO)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre os agendamentos por paciente, médico ou observações</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por paciente, médico ou observações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={(value: StatusAgendamento | 'all') => setStatusFilter(value)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {Object.entries(StatusAgendamentoLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={tipoFilter} onValueChange={(value: TipoConsulta | 'all') => setTipoFilter(value)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {Object.entries(TipoConsultaLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(searchTerm || statusFilter !== 'all' || tipoFilter !== 'all') && (
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="w-full md:w-auto"
              >
                <X className="h-4 w-4 mr-2" />
                Limpar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Agendamentos */}
      <div className="space-y-4">
        {filteredAgendamentos.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <CalendarDays className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum agendamento encontrado</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' || tipoFilter !== 'all'
                  ? 'Tente ajustar os filtros para encontrar agendamentos.'
                  : 'Comece criando um novo agendamento.'}
              </p>
              <Button asChild>
                <Link to="/agendamentos/novo">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredAgendamentos.map((agendamento) => (
            <Card key={agendamento.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">
                        {agendamento.paciente?.nome || 'Paciente não encontrado'}
                      </h3>
                      <Badge className={StatusColors[agendamento.status]}>
                        {StatusAgendamentoLabels[agendamento.status]}
                      </Badge>
                      <Badge variant="outline">
                        {TipoConsultaLabels[agendamento.tipo]}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <strong>Médico:</strong> {agendamento.medico?.nome || 'Médico não encontrado'}
                      </p>
                      <p>
                        <strong>Data/Hora:</strong> {formatDateTime(agendamento.dataHora)}
                      </p>
                      {agendamento.observacoes && (
                        <p>
                          <strong>Observações:</strong> {agendamento.observacoes}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/agendamentos/${agendamento.id}`}>
                        Ver Detalhes
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

        {/* Paginação placeholder */}
        {filteredAgendamentos.length > 0 && (
          <Card>
            <CardContent className="p-4 text-center text-sm text-gray-500">
              Mostrando {filteredAgendamentos.length} de {agendamentos.length} agendamentos
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}