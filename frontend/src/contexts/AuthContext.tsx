import { ReactNode, useEffect, useState } from 'react';
import { apiService } from '../lib/api-service';
import { AuthContext, AuthContextType, User } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // Carregar dados do usuário no primeiro load
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');

        if (storedToken && storedUser) {
          const userData = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(userData);
          
          // Configurar token no apiService
          apiService.setToken(storedToken);
          
          // Verificar se o token ainda é válido fazendo uma requisição
          try {
            await apiService.get('/auth/profile');
          } catch (error) {
            // Token inválido, limpar dados
            logout();
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados de autenticação:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      const response = await apiService.post('/auth/login', {
        email,
        password
      });

      const { token, user: userData } = response;

      // Armazenar dados
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      
      // Atualizar estado
      setToken(token);
      setUser(userData);
      
      // Configurar token no apiService
      apiService.setToken(token);
      
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Limpar localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    // Limpar estado
    setToken(null);
    setUser(null);
    
    // Limpar token do apiService
    apiService.setToken(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
