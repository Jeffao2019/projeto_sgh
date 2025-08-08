import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { apiService } from "@/lib/api-service";
import { formatPhoneNumber } from "@/utils/format";

const formatDateToISO = (date: string) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

const formatDateFromISO = (isoDate: string) => {
  if (!isoDate) return '';
  return isoDate.split('T')[0];
};

interface FormData {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  datanascimento: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  convenio?: string;
  numeroConvenio?: string;
}

export interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  datanascimento: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  convenio: string;
  numeroConvenio: string;
}

export default function CadastroPaciente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    datanascimento: "",
    endereco: {
      cep: "",
      logradouro: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
    },
    convenio: "",
    numeroConvenio: "",
  });

  useEffect(() => {
    if (id) {
      loadPaciente(id);
    }
  }, [id]);

  const loadPaciente = async (pacienteId: string) => {
    setIsLoading(true);
    try {
      const data = await apiService.getPacienteById(pacienteId);
      const {
        nome,
        cpf,
        email,
        telefone,
        datanascimento,
        endereco,
        convenio,
        numeroConvenio,
      } = data;

      setFormData({
        nome,
        cpf,
        email,
        telefone,
        datanascimento,
        endereco: {
          cep: endereco.cep || "",
          logradouro: endereco.logradouro || "",
          numero: endereco.numero || "",
          complemento: endereco.complemento || "",
          bairro: endereco.bairro || "",
          cidade: endereco.cidade || "",
          estado: endereco.estado || "",
        },
        convenio: convenio || "",
        numeroConvenio: numeroConvenio || "",
      });
    } catch (error) {
      toast.error("Erro ao carregar dados do paciente");
      navigate("/pacientes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submissionData = {
        nome: formData.nome,
        cpf: formData.cpf,
        email: formData.email,
        telefone: formData.telefone,
        datanascimento: formatDateToISO(formData.datanascimento),
        endereco: formData.endereco,
        convenio: formData.convenio || undefined,
        numeroConvenio: formData.numeroConvenio || undefined,
      };

      if (id) {
        await apiService.updatePaciente(id, submissionData);
        toast.success("Paciente atualizado com sucesso!");
      } else {
        await apiService.createPaciente(submissionData);
        toast.success("Paciente cadastrado com sucesso!");
      }
      navigate("/pacientes");
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar paciente");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.includes("endereco.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, telefone: formattedPhone }));
  };

  return (
    <DashboardLayout
      title={id ? "Editar Paciente" : "Novo Paciente"}
      subtitle={id ? "Altere as informações do paciente" : "Cadastre um novo paciente no sistema"}
    >
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo*</Label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF*</Label>
              <Input
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone*</Label>
              <Input
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handlePhoneChange}
                required
                placeholder="(99) 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="datanascimento">Data de Nascimento*</Label>
              <Input
                id="datanascimento"
                name="datanascimento"
                type="date"
                value={formData.datanascimento}
                onChange={handleInputChange}
                required
                max={new Date().toISOString().split('T')[0]} // Prevents future dates
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco.cep">CEP*</Label>
              <Input
                id="endereco.cep"
                name="endereco.cep"
                value={formData.endereco.cep}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco.logradouro">Logradouro*</Label>
              <Input
                id="endereco.logradouro"
                name="endereco.logradouro"
                value={formData.endereco.logradouro}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco.numero">Número*</Label>
              <Input
                id="endereco.numero"
                name="endereco.numero"
                value={formData.endereco.numero}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco.bairro">Bairro*</Label>
              <Input
                id="endereco.bairro"
                name="endereco.bairro"
                value={formData.endereco.bairro}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco.cidade">Cidade*</Label>
              <Input
                id="endereco.cidade"
                name="endereco.cidade"
                value={formData.endereco.cidade}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco.estado">Estado*</Label>
              <Input
                id="endereco.estado"
                name="endereco.estado"
                value={formData.endereco.estado}
                onChange={handleInputChange}
                maxLength={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="convenio">Convênio</Label>
              <Input
                id="convenio"
                name="convenio"
                value={formData.convenio || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numeroConvenio">Número do Convênio</Label>
              <Input
                id="numeroConvenio"
                name="numeroConvenio"
                value={formData.numeroConvenio || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/pacientes")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </Card>
    </DashboardLayout>
  );
}