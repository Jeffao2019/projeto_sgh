import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import Agendamentos from "./pages/Agendamentos";
import Cadastro from "./pages/Cadastro";
import Configuracoes from "./pages/Configuracoes";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Pacientes from "./pages/Pacientes";
import Prontuarios from "./pages/Prontuarios";
import PerfilUsuario from "./pages/PerfilUsuario";
import CadastroPaciente from "./pages/CadastroPaciente";
import CadastroProntuario from "./pages/CadastroProntuario";
import CadastroAgendamento from "./pages/CadastroAgendamento";
import SalaTelemedicina from "./pages/SalaTelemedicina";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            
            {/* Rotas protegidas */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/agendamentos" element={
              <ProtectedRoute>
                <Agendamentos />
              </ProtectedRoute>
            } />
            <Route path="/pacientes" element={
              <ProtectedRoute>
                <Pacientes />
              </ProtectedRoute>
            } />
            <Route path="/prontuarios" element={
              <ProtectedRoute>
                <Prontuarios />
              </ProtectedRoute>
            } />
            <Route path="/configuracoes" element={
              <ProtectedRoute>
                <Configuracoes />
              </ProtectedRoute>
            } />
            <Route path="/perfil" element={
              <ProtectedRoute>
                <PerfilUsuario />
              </ProtectedRoute>
            } />
            
            {/* Rotas de Pacientes */}
            <Route 
              path="/pacientes/novo" 
              element={
                <ProtectedRoute>
                  <CadastroPaciente />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pacientes/:id/editar" 
              element={
                <ProtectedRoute>
                  <CadastroPaciente />
                </ProtectedRoute>
              } 
            />
            
            {/* Rotas de Prontuários */}
            <Route 
              path="/prontuarios/novo" 
              element={
                <ProtectedRoute>
                  <CadastroProntuario />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/prontuarios/:id/editar" 
              element={
                <ProtectedRoute>
                  <CadastroProntuario />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/prontuarios/:id" 
              element={
                <ProtectedRoute>
                  <CadastroProntuario />
                </ProtectedRoute>
              } 
            />
            
            {/* Rotas de Agendamentos */}
            <Route 
              path="/agendamentos/novo" 
              element={
                <ProtectedRoute>
                  <CadastroAgendamento />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agendamentos/:id/editar" 
              element={
                <ProtectedRoute>
                  <CadastroAgendamento />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agendamentos/:id" 
              element={
                <ProtectedRoute>
                  <CadastroAgendamento />
                </ProtectedRoute>
              } 
            />
            
            {/* Rota de Telemedicina */}
            <Route 
              path="/telemedicina/:id" 
              element={
                <ProtectedRoute>
                  <SalaTelemedicina />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/telemedicina" 
              element={
                <ProtectedRoute>
                  <SalaTelemedicina />
                </ProtectedRoute>
              } 
            />
            
            {/* Rota de fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
