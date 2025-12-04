import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';

export default function SalaTelemedicinaTeste() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  console.log('🧪 Sala de Telemedicina Teste carregada!');
  console.log('📋 ID recebido:', id);

  return (
    <DashboardLayout
      title="Sala de Telemedicina - TESTE"
      subtitle="Versão simplificada para debugging"
    >
      <div className="space-y-6">
        
        {/* Botão Voltar */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/agendamentos')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar aos Agendamentos
          </Button>
        </div>
        
        {/* Card de Teste */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">✅ Sala de Telemedicina Funcionando!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-lg">Esta é uma versão de teste da sala de telemedicina.</p>
              <div className="bg-gray-50 p-4 rounded">
                <h4 className="font-semibold mb-2">Informações de Debug:</h4>
                <ul className="space-y-1 text-sm">
                  <li><strong>ID do Agendamento:</strong> {id || 'Não informado'}</li>
                  <li><strong>URL Atual:</strong> {window.location.href}</li>
                  <li><strong>Status:</strong> Página carregada com sucesso</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded">
                <h4 className="font-semibold mb-2 text-blue-800">🎯 Se você está vendo esta tela:</h4>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• A navegação do React Router está funcionando</li>
                  <li>• O componente está sendo renderizado corretamente</li>
                  <li>• O problema pode estar na lógica de carregamento dos dados</li>
                  <li>• Ou na autenticação/API calls</li>
                </ul>
              </div>

              <div className="space-x-4">
                <Button onClick={() => window.location.reload()}>
                  Recarregar Página
                </Button>
                <Button variant="outline" onClick={() => console.log('Teste de console funcionando!')}>
                  Testar Console
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}