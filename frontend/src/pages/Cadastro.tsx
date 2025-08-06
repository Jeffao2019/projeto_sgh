import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Heart, Lock, Mail, Phone, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiService } from "../lib/api-service";

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  password: string;
  confirmPassword: string;
  role: string;
  acceptTerms: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const Cadastro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    telefone: '',
    password: '',
    confirmPassword: '',
    role: 'RECEPCIONISTA', 
    acceptTerms: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const formatPhone = (value: string): string => {
    // Remove tudo que não for número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a formatação (XX) XXXXX-XXXX
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    let newValue = value;
    
    // Formatação especial para telefone
    if (name === 'telefone') {
      newValue = formatPhone(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : newValue
    }));

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email deve ter um formato válido';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(formData.telefone)) {
      newErrors.telefone = 'Telefone deve ter o formato (XX) XXXXX-XXXX';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Você deve aceitar os termos de uso';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const data = await apiService.register({
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role,
        acceptTerms: formData.acceptTerms
      });

      // Sucesso - mostrar mensagem e redirecionar
      setSuccessMessage('Conta criada com sucesso! Redirecionando...');
      
      // Salvar dados de autenticação
      apiService.saveAuthData(data);

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Erro no cadastro:', error);
      
      // Verificar se é um erro da API
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response: { status: number; data: any } };
        
        if (apiError.response.status === 400 && apiError.response.data?.message) {
          // Erros de validação do backend
          const errorMessage = apiError.response.data.message;
          if (Array.isArray(errorMessage)) {
            const backendErrors: FormErrors = {};
            errorMessage.forEach((errorMsg: string) => {
              if (errorMsg.includes('email')) {
                backendErrors.email = errorMsg;
              } else if (errorMsg.includes('senha') || errorMsg.includes('password')) {
                backendErrors.password = errorMsg;
              } else if (errorMsg.includes('nome')) {
                backendErrors.nome = errorMsg;
              } else if (errorMsg.includes('telefone')) {
                backendErrors.telefone = errorMsg;
              } else {
                backendErrors.general = errorMsg;
              }
            });
            setErrors(backendErrors);
          } else {
            setErrors({ general: errorMessage as string });
          }
        } else if (apiError.response.status === 409) {
          setErrors({ email: 'Este email já está cadastrado' });
        } else {
          setErrors({ general: 'Erro interno do servidor. Tente novamente.' });
        }
      } else {
        // Erro de rede ou outro tipo de erro
        setErrors({ general: 'Erro de conexão. Verifique sua internet e tente novamente.' });
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-full shadow-glow">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-foreground">VidaPlus</h1>
              <p className="text-sm text-muted-foreground">Sistema de Gestão Hospitalar</p>
            </div>
          </Link>
        </div>

        {/* Card de Cadastro */}
        <Card className="p-8 bg-card shadow-medical">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Criar sua conta</h2>
            <p className="text-muted-foreground">Preencha os dados para começar</p>
          </div>

          {/* Mensagem de Sucesso */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-green-800 text-sm">{successMessage}</span>
            </div>
          )}

          {/* Mensagem de Erro Geral */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-red-800 text-sm">{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="nome"
                  name="nome"
                  type="text"
                  placeholder="Seu nome completo"
                  className={`pl-10 ${errors.nome ? 'border-red-500' : ''}`}
                  value={formData.nome}
                  onChange={handleInputChange}
                />
              </div>
              {errors.nome && (
                <p className="text-red-500 text-sm flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.nome}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  className={`pl-10 ${errors.telefone ? 'border-red-500' : ''}`}
                  value={formData.telefone}
                  onChange={handleInputChange}
                  maxLength={15}
                />
              </div>
              {errors.telefone && (
                <p className="text-red-500 text-sm flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.telefone}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Perfil</Label>
              <select
                id="role"
                name="role"
                className={`w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.role ? 'border-red-500' : ''}`}
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="RECEPCIONISTA">Recepcionista</option>
                <option value="MEDICO">Médico</option>
                <option value="ENFERMEIRO">Enfermeiro</option>
                <option value="ADMIN">Administrativo</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.role}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className={`pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.confirmPassword}</span>
                </p>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                className={`w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary mt-0.5 ${errors.terms ? 'border-red-500' : ''}`}
                checked={formData.acceptTerms}
                onChange={handleInputChange}
              />
              <div className="flex-1">
                <Label htmlFor="acceptTerms" className="text-sm leading-relaxed">
                  Eu concordo com os{" "}
                  <Link to="/termos" className="text-primary hover:underline">
                    Termos de Uso
                  </Link>{" "}
                  e{" "}
                  <Link to="/privacidade" className="text-primary hover:underline">
                    Política de Privacidade
                  </Link>
                </Label>
                {errors.acceptTerms && (
                  <p className="text-red-500 text-sm flex items-center space-x-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.terms}</span>
                  </p>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              variant="medical" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Entre aqui
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Cadastro;