import React from 'react';
import { useSearchParams } from 'react-router-dom';

export default function TesteSimples() {
  const [searchParams] = useSearchParams();
  
  const inviteId = searchParams.get('invite');
  const agendamentoId = searchParams.get('agendamento');

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1>🧪 Teste Simples - Funcionou!</h1>
      
      <div style={{
        padding: '15px',
        backgroundColor: '#d4edda',
        border: '1px solid #c3e6cb',
        borderRadius: '5px',
        marginBottom: '20px'
      }}>
        <h2>✅ Rota funcionando!</h2>
        <p>Se você está vendo esta página, a rota está configurada corretamente.</p>
      </div>

      <h3>📋 Parâmetros recebidos:</h3>
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '5px',
        fontFamily: 'monospace'
      }}>
        <p><strong>invite:</strong> {inviteId || 'não fornecido'}</p>
        <p><strong>agendamento:</strong> {agendamentoId || 'não fornecido'}</p>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '5px'
      }}>
        <h4>🔗 URL Completa:</h4>
        <p style={{ 
          wordBreak: 'break-all',
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          {window.location.href}
        </p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h4>🚀 Próximos passos:</h4>
        <ol>
          <li>Se esta página carregou, a rota básica funciona</li>
          <li>O problema pode estar no componente PacienteVideochamada</li>
          <li>Verifique o console do navegador (F12) para erros</li>
          <li>Teste com o componente principal</li>
        </ol>
      </div>
    </div>
  );
}