import React from 'react';
import { useParams } from 'react-router-dom';

export default function TelemedicinaDirect() {
  const { id } = useParams<{ id: string }>();
  
  console.log('🔄 TelemedicinaDirect carregada');
  console.log('📋 ID:', id);
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ color: 'green' }}>✅ Telemedicina Funcionando!</h1>
      <p><strong>ID:</strong> {id}</p>
      <p><strong>URL:</strong> {window.location.href}</p>
      <p><strong>Data/Hora:</strong> {new Date().toLocaleString()}</p>
      <div style={{ 
        background: '#e8f5e8', 
        padding: '15px', 
        border: '1px solid #4caf50', 
        borderRadius: '5px',
        marginTop: '20px'
      }}>
        <p>Se você está vendo esta mensagem, o React está carregando corretamente!</p>
      </div>
    </div>
  );
}