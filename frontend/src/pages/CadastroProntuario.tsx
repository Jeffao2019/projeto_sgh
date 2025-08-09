import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { apiService } from "@/lib/api-service";
import { CreateProntuarioDTO, Prontuario } from "@/types/prontuarios";
import { Paciente } from "@/types/pacientes";
import { Medico } from "@/types/medicos";
import { Agendamento } from "@/types/agendamentos";

interface FormData {
  pacienteId: string;
  medicoId: string;
  agendamentoId: string;
  dataConsulta: string;
  anamnese: string;
  exameFisico: string;
  diagnostico: string;
  prescricao: string;
  observacoes: string;
}

export default function CadastroProntuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  
  // Determinar se está em modo de visualização ou edição
  const isViewMode = id && id !== 'novo' && !location.pathname.includes('/editar');
  const isEditMode = id && id !== 'novo' && location.pathname.includes('/editar');
  const isCreateMode = !id || id === 'novo';
  
  const [formData, setFormData] = useState<FormData>({
    pacienteId: "",
    medicoId: "",
    agendamentoId: "",
    dataConsulta: "",
    anamnese: "",
    exameFisico: "",
    diagnostico: "",
    prescricao: "",
    observacoes: "",
  });

  useEffect(() => {
    loadPacientes();
    loadMedicos();
    loadAgendamentos();
    if (id) {
      loadProntuario(id);
    }
  }, [id]);

  const loadPacientes = async () => {
    try {
      const data = await apiService.getPacientes();
      setPacientes(data);
    } catch (error) {
      toast.error("Erro ao carregar pacientes");
    }
  };

  const loadMedicos = async () => {
    try {
      const data = await apiService.getMedicos();
      setMedicos(data);
    } catch (error) {
      toast.error("Erro ao carregar médicos");
    }
  };

  const loadAgendamentos = async () => {
    try {
      const data = await apiService.getAgendamentosParaProntuario();
      setAgendamentos(data);
    } catch (error) {
      toast.error("Erro ao carregar agendamentos");
    }
  };

  const loadProntuario = async (prontuarioId: string) => {
    setIsLoading(true);
    try {
      const data = await apiService.getProntuarioById(prontuarioId);
      setFormData({
        pacienteId: data.pacienteId,
        medicoId: data.medicoId,
        agendamentoId: data.agendamentoId,
        dataConsulta: data.dataConsulta.split('T')[0], // Formato YYYY-MM-DD
        anamnese: data.anamnese,
        exameFisico: data.exameFisico,
        diagnostico: data.diagnostico,
        prescricao: data.prescricao,
        observacoes: data.observacoes || "",
      });
    } catch (error) {
      toast.error("Erro ao carregar dados do prontuário");
      navigate("/prontuarios");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submissionData: CreateProntuarioDTO = {
        pacienteId: formData.pacienteId,
        medicoId: formData.medicoId,
        agendamentoId: formData.agendamentoId,
        dataConsulta: new Date(formData.dataConsulta).toISOString(),
        anamnese: formData.anamnese,
        exameFisico: formData.exameFisico,
        diagnostico: formData.diagnostico,
        prescricao: formData.prescricao,
        observacoes: formData.observacoes || undefined,
      };

      if (id) {
        await apiService.updateProntuario(id, {
          anamnese: submissionData.anamnese,
          exameFisico: submissionData.exameFisico,
          diagnostico: submissionData.diagnostico,
          prescricao: submissionData.prescricao,
          observacoes: submissionData.observacoes,
        });
        toast.success("Prontuário atualizado com sucesso!");
      } else {
        await apiService.createProntuario(submissionData);
        toast.success("Prontuário cadastrado com sucesso!");
      }
      navigate("/prontuarios");
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar prontuário");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <DashboardLayout
      title={
        isViewMode 
          ? "Visualizar Prontuário" 
          : isEditMode 
            ? "Editar Prontuário" 
            : "Novo Prontuário"
      }
      subtitle={
        isViewMode 
          ? "Visualize as informações do prontuário" 
          : isEditMode 
            ? "Altere as informações do prontuário" 
            : "Cadastre um novo prontuário no sistema"
      }
    >
      <Card className="p-6">
        <form onSubmit={isViewMode ? (e) => e.preventDefault() : handleSubmit} className="space-y-6">
          {/* Informações básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="pacienteId">Paciente*</Label>
              <Select
                value={formData.pacienteId}
                onValueChange={handleSelectChange("pacienteId")}
                disabled={isViewMode || isEditMode} // Não permite alterar paciente em edição/visualização
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o paciente" />
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

            <div className="space-y-2">
              <Label htmlFor="dataConsulta">Data da Consulta*</Label>
              <Input
                id="dataConsulta"
                name="dataConsulta"
                type="date"
                value={formData.dataConsulta}
                onChange={handleInputChange}
                required
                disabled={isViewMode || isEditMode} // Não permite alterar data em edição/visualização
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicoId">Médico*</Label>
              <Select
                value={formData.medicoId}
                onValueChange={handleSelectChange("medicoId")}
                disabled={isViewMode || isEditMode} // Não permite alterar médico em edição/visualização
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o médico" />
                </SelectTrigger>
                <SelectContent>
                  {medicos.map((medico) => (
                    <SelectItem key={medico.id} value={medico.id}>
                      Dr(a). {medico.nome} - {medico.especialidade} (CRM: {medico.crm})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Campo de agendamento */}
            <div className="space-y-2">
              <Label htmlFor="agendamentoId">Agendamento*</Label>
              <Select
                value={formData.agendamentoId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, agendamentoId: value }))}
                disabled={isViewMode || isEditMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um agendamento" />
                </SelectTrigger>
                <SelectContent>
                  {agendamentos.map((agendamento) => (
                    <SelectItem key={agendamento.id} value={agendamento.id}>
                      {new Date(agendamento.dataHora).toLocaleString('pt-BR')} - {agendamento.tipo} - Status: {agendamento.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Informações médicas */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="anamnese">Anamnese*</Label>
              <Textarea
                id="anamnese"
                name="anamnese"
                value={formData.anamnese}
                onChange={handleInputChange}
                required
                disabled={isViewMode}
                rows={4}
                placeholder="Histórico da doença atual, antecedentes pessoais e familiares..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exameFisico">Exame Físico*</Label>
              <Textarea
                id="exameFisico"
                name="exameFisico"
                value={formData.exameFisico}
                onChange={handleInputChange}
                required
                disabled={isViewMode}
                rows={4}
                placeholder="Sinais vitais, exame físico geral e específico..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="diagnostico">Diagnóstico*</Label>
              <Textarea
                id="diagnostico"
                name="diagnostico"
                value={formData.diagnostico}
                onChange={handleInputChange}
                required
                disabled={isViewMode}
                rows={3}
                placeholder="Diagnóstico principal e diagnósticos secundários..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prescricao">Prescrição*</Label>
              <Textarea
                id="prescricao"
                name="prescricao"
                value={formData.prescricao}
                onChange={handleInputChange}
                required
                disabled={isViewMode}
                rows={4}
                placeholder="Medicamentos, dosagens, instruções de uso..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                name="observacoes"
                value={formData.observacoes}
                onChange={handleInputChange}
                disabled={isViewMode}
                rows={3}
                placeholder="Observações adicionais, recomendações..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            {isViewMode ? (
              // Modo visualização: apenas botão Voltar
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/prontuarios")}
              >
                Voltar
              </Button>
            ) : (
              // Modo criação/edição: botões Cancelar e Salvar
              <>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/prontuarios")}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar"}
                </Button>
              </>
            )}
          </div>
        </form>
      </Card>
    </DashboardLayout>
  );
}
