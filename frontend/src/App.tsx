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
            
            {/* Rota de fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
