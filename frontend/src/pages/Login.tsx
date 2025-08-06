import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import React, { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpar erro quando usuário começar a digitar
    if (error) setError('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validação básica
      if (!formData.email || !formData.password) {
        setError('Por favor, preencha todos os campos.');
        setIsLoading(false);
        return;
      }

      // Fazer login usando o hook useAuth
      await login(formData.email, formData.password);
      
      // Se chegou até aqui, login foi bem-sucedido
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      // Mapear erros específicos do backend
      if (error.response?.status === 401) {
        setError('Email ou senha inválidos.');
      } else if (error.response?.status === 400) {
        setError('Dados inválidos. Verifique os campos preenchidos.');
      } else if (error.response?.status >= 500) {
        setError('Erro interno do servidor. Tente novamente mais tarde.');
      } else if (error.message?.includes('Network Error')) {
        setError('Erro de conexão. Verifique sua internet.');
      } else {
        setError(error.response?.data?.message || 'Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Fazer Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Entre na sua conta do Sistema de Gestão Hospitalar
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
            
            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="seu@email.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Digite sua senha"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>

            {/* Links */}
            <div className="text-center space-y-4">
              <div className="text-sm">
                <Link 
                  to="/cadastro" 
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Não tem uma conta? Cadastre-se
                </Link>
              </div>
              
              <div className="text-sm">
                <a 
                  href="#" 
                  className="text-gray-600 hover:text-gray-700 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Funcionalidade em desenvolvimento');
                  }}
                >
                  Esqueceu sua senha?
                </a>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          Sistema de Gestão Hospitalar © 2024
        </div>
      </div>
    </div>
  );
}

export default Login;
