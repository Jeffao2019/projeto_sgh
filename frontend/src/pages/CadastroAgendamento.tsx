import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { CalendarIcon, ArrowLeft, Save, RefreshCcw } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { apiService } from '@/lib/api-service';
import { 
  CreateAgendamentoDto, 
  UpdateAgendamentoDto, 
  TipoConsulta, 
  TipoConsultaLabels,
  StatusAgendamento,
  StatusAgendamentoLabels
} from '@/types/agendamentos';
import { Paciente } from '@/types/pacientes';
import { Medico } from '@/types/medicos';
import { useToast } from '@/hooks/use-toast';

interface AgendamentoFormData {
  pacienteId: string;
  medicoId: string;
  dataHora: string;
  tipo: TipoConsulta;
  status?: StatusAgendamento;
  observacoes?: string;
}

export default function CadastroAgendamento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<AgendamentoFormData>({
    pacienteId: '',
    medicoId: '',
    dataHora: '',
    tipo: TipoConsulta.CONSULTA_GERAL,
    observacoes: ''
  });

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const loadData = async () => {
    setLoadingData(true);
    try {
      const [pacientesData, medicosData] = await Promise.all([
        apiService.getPacientes(),
        apiService.getMedicos()
      ]);

      setPacientes(pacientesData);
      setMedicos(medicosData);

      // Se está editando, carregar dados do agendamento
      if (id) {
        const agendamento = await apiService.getAgendamentoById(id);
        // Formatar a data para datetime-local input
        const dataFormatada = new Date(agendamento.dataHora).toISOString().slice(0, 16);
        
        setFormData({
          pacienteId: agendamento.pacienteId,
          medicoId: agendamento.medicoId,
          dataHora: dataFormatada,
          tipo: agendamento.tipo,
          status: agendamento.status,
          observacoes: agendamento.observacoes || ''
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados necessários.",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleInputChange = (field: keyof AgendamentoFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.pacienteId || !formData.medicoId || !formData.dataHora) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (isEditMode && id) {
        const updateData: UpdateAgendamentoDto = {
          dataHora: formData.dataHora,
          tipo: formData.tipo,
          status: formData.status,
          observacoes: formData.observacoes
        };
        await apiService.updateAgendamento(id, updateData);
        toast({
          title: "Sucesso",
          description: "Agendamento atualizado com sucesso!",
        });
      } else {
        const createData: CreateAgendamentoDto = {
          pacienteId: formData.pacienteId,
          medicoId: formData.medicoId,
          dataHora: formData.dataHora,
          tipo: formData.tipo,
          observacoes: formData.observacoes
        };
        await apiService.createAgendamento(createData);
        toast({
          title: "Sucesso",
          description: "Agendamento criado com sucesso!",
        });
      }
      navigate('/agendamentos');
    } catch (error: any) {
      console.error('Erro ao salvar agendamento:', error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao salvar o agendamento.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <RefreshCcw className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/agendamentos')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditMode ? 'Editar Agendamento' : 'Novo Agendamento'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditMode 
              ? 'Atualize as informações do agendamento'
              : 'Preencha os dados para criar um novo agendamento'
            }
          </p>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Informações do Agendamento
            </CardTitle>
            <CardDescription>
              Dados principais do agendamento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Paciente */}
            <div className="space-y-2">
              <Label htmlFor="pacienteId">Paciente *</Label>
              <Select 
                value={formData.pacienteId} 
                onValueChange={(value) => handleInputChange('pacienteId', value)}
                disabled={isEditMode} // Não permitir alterar paciente na edição
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um paciente" />
                </SelectTrigger>
                <SelectContent>
                  {pacientes.map((paciente) => (
                    <SelectItem key={paciente.id} value={paciente.id}>
                      {paciente.nome} - {paciente.cpf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Médico */}
            <div className="space-y-2">
              <Label htmlFor="medicoId">Médico *</Label>
              <Select 
                value={formData.medicoId} 
                onValueChange={(value) => handleInputChange('medicoId', value)}
                disabled={isEditMode} // Não permitir alterar médico na edição
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um médico" />
                </SelectTrigger>
                <SelectContent>
                  {medicos.map((medico) => (
                    <SelectItem key={medico.id} value={medico.id}>
                      {medico.nome} - {medico.especialidade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Data e Hora */}
            <div className="space-y-2">
              <Label htmlFor="dataHora">Data e Hora *</Label>
              <Input
                id="dataHora"
                type="datetime-local"
                value={formData.dataHora}
                onChange={(e) => handleInputChange('dataHora', e.target.value)}
                required
              />
            </div>

            {/* Tipo de Consulta */}
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Consulta *</Label>
              <Select 
                value={formData.tipo} 
                onValueChange={(value: TipoConsulta) => handleInputChange('tipo', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TipoConsultaLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status (apenas para edição) */}
            {isEditMode && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: StatusAgendamento) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(StatusAgendamentoLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Observações */}
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Observações sobre o agendamento..."
                value={formData.observacoes}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Botões de ação */}
        <div className="flex gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/agendamentos')}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isEditMode ? 'Atualizar' : 'Criar'} Agendamento
          </Button>
        </div>
      </form>
      </div>
    </DashboardLayout>
  );
}
