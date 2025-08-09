import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { apiService } from "@/lib/api-service";
import { toast } from "sonner";
import { CreatePacienteDTO } from "@/types/pacientes";
import { format } from 'date-fns';

export function PacienteForm() {
  const navigate = useNavigate();
  const { pacienteId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreatePacienteDTO>({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    dataNascimento: "",
    endereco: {
      cep: "",
      logradouro: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: ""
    }
  });

  useEffect(() => {
    if (pacienteId) {
      loadPaciente(pacienteId);
    }
  }, [pacienteId]);

  const loadPaciente = async (pacienteId: string) => {
    setIsLoading(true);
    try {
      const data = await apiService.getPacienteById(pacienteId);
      const {
        nome,
        cpf,
        email,
        telefone,
        dataNascimento,
        endereco,
        convenio,
        numeroConvenio,
      } = data;

      // Format the dataNascimento field to yyyy-MM-dd
      const formattedDataNascimento = dataNascimento ? format(new Date(dataNascimento), 'yyyy-MM-dd') : '';

      setFormData({
        nome,
        cpf,
        email,
        telefone,
        dataNascimento: formattedDataNascimento,
        endereco: {
          cep: endereco.cep || "",
          logradouro: endereco.logradouro || "",
          numero: endereco.numero || "",
          bairro: endereco.bairro || "",
          cidade: endereco.cidade || "",
          estado: endereco.estado || "",
        },
        convenio: convenio || "",
        numeroConvenio: numeroConvenio || "",
      });
    } catch (error) {
      toast.error("Erro ao carregar dados do paciente");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiService.createPaciente(formData);
      toast.success("Paciente cadastrado com sucesso!");
      navigate("/pacientes");
    } catch (error: any) {
      const message = error.response?.data?.message || "Erro ao cadastrar paciente";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  };

  const formatCEP = (value: string) => {
    return value.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2");
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
      let formattedValue = value;
      if (name === "cpf") formattedValue = formatCPF(value);
      if (name === "telefone") formattedValue = formatPhone(value);
      if (name === "endereco.cep") formattedValue = formatCEP(value);

      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    }
  };

  return (
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
            maxLength={14}
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
            onChange={handleInputChange}
            maxLength={15}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataNascimento">Data de Nascimento*</Label>
          <Input
            id="dataNascimento"
            name="dataNascimento"
            type="date"
            value={formData.dataNascimento}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endereco.cep">CEP*</Label>
          <Input
            id="endereco.cep"
            name="endereco.cep"
            value={formData.endereco.cep}
            onChange={handleInputChange}
            maxLength={9}
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
        <Button type="button" variant="outline" onClick={() => navigate("/pacientes")}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}