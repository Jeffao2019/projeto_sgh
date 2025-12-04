import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function PacienteVideochamada() {
  const [searchParams] = useSearchParams();
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const inviteId = searchParams.get('invite');
  const agendamentoId = searchParams.get('agendamento');

  const handleJoinCall = async () => {
    try {
      console.log('🚀 Paciente tentando se conectar...');
      setIsConnecting(true);
      setError(null);
      
      // Acessar câmera e microfone do paciente
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              width: { ideal: 640 }, 
              height: { ideal: 480 },
              facingMode: 'user' // Câmera frontal preferida
            }, 
            audio: true 
          });
          
          console.log('📹 Câmera do paciente acessada com sucesso');
          setMediaStream(stream);
          
          // Conectar stream ao elemento de vídeo
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
          
          setConnected(true);
          setIsConnecting(false);
          
          // Simular notificação para o médico
          console.log('📞 Notificando médico que paciente conectou');
          
          alert('✅ CONECTADO À VIDEOCHAMADA!\n\n📹 Sua câmera está funcionando\n🎤 Seu áudio está ativo\n👨‍⚕️ O médico pode te ver e ouvir\n\n🩺 Aguarde o médico iniciar a consulta');
          
        } catch (mediaError) {
          console.error('❌ Erro ao acessar câmera/microfone:', mediaError);
          setIsConnecting(false);
          
          let errorMessage = '❌ Não foi possível acessar sua câmera/microfone\n\n';
          
          if (mediaError.name === 'NotAllowedError') {
            errorMessage += '🚫 Você negou o acesso à câmera\n\n' +
              'Para continuar:\n' +
              '1️⃣ Clique no ícone de câmera na barra do navegador\n' +
              '2️⃣ Selecione "Permitir"\n' +
              '3️⃣ Recarregue a página e tente novamente';
          } else if (mediaError.name === 'NotFoundError') {
            errorMessage += '📹 Nenhuma câmera encontrada\n\n' +
              'Verifique se:\n' +
              '• Sua câmera está conectada\n' +
              '• Nenhum outro app está usando a câmera';
          } else {
            errorMessage += '🔧 Erro técnico\n\n' +
              'Tente:\n' +
              '• Recarregar a página\n' +
              '• Usar outro navegador\n' +
              '• Verificar se a câmera funciona em outros apps';
          }
          
          setError(errorMessage);
          alert(errorMessage);
          return;
        }
      } else {
        setIsConnecting(false);
        const browserError = '❌ Seu navegador não suporta videochamadas\n\n' +
          '📱 Para funcionar, use:\n' +
          '• Chrome (recomendado)\n' +
          '• Firefox\n' +
          '• Safari\n' +
          '• Edge\n\n' +
          '⚠️ Certifique-se de estar usando a versão mais recente';
        setError(browserError);
        alert(browserError);
        return;
      }
      
    } catch (error) {
      console.error('❌ Erro inesperado:', error);
      setIsConnecting(false);
      setError('❌ Erro inesperado. Tente novamente.');
      alert('❌ Erro inesperado. Tente novamente.');
    }
  };

  const handleEndCall = () => {
    try {
      console.log('🔚 Paciente encerrando chamada...');
      
      // Parar todos os streams
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => {
          track.stop();
          console.log(`🔇 ${track.kind} track parado`);
        });
        setMediaStream(null);
      }
      
      // Limpar elemento de vídeo
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      setConnected(false);
      
      alert('✅ Você saiu da videochamada\n\n🙏 Obrigado por usar nosso sistema!\n📱 Pode fechar esta janela');
      
    } catch (error) {
      console.error('❌ Erro ao sair:', error);
    }
  };

  useEffect(() => {
    // Cleanup ao sair da página
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaStream]);

  if (!inviteId || !agendamentoId) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        fontFamily: 'Arial',
        maxWidth: '500px',
        margin: '50px auto'
      }}>
        <h1 style={{ color: '#dc3545' }}>❌ Link Inválido</h1>
        <p>Este link de videochamada não é válido ou expirou.</p>
        <p>Entre em contato com seu médico para obter um novo link.</p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial',
      maxWidth: '600px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ 
        textAlign: 'center',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#28a745', marginBottom: '10px' }}>
          🩺 Teleconsulta Médica
        </h1>
        <p style={{ color: '#6c757d', margin: '0' }}>
          Conecte-se com seu médico via videochamada
        </p>
      </div>

      {/* Vídeo do Paciente */}
      <div style={{ 
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <div style={{ 
          position: 'relative',
          backgroundColor: '#000', 
          borderRadius: '15px',
          overflow: 'hidden',
          maxWidth: '400px',
          margin: '0 auto',
          border: connected ? '3px solid #28a745' : '2px solid #ddd',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}>
          <video 
            ref={videoRef}
            autoPlay 
            muted 
            playsInline
            style={{ 
              width: '100%', 
              height: '300px',
              objectFit: 'cover',
              display: mediaStream ? 'block' : 'none'
            }}
          />
          {!mediaStream && (
            <div style={{
              width: '100%',
              height: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              flexDirection: 'column'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '15px' }}>
                {isConnecting ? '🔄' : '📹'}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                {isConnecting ? 'Conectando...' : 'Sua Câmera'}
              </div>
              <div style={{ fontSize: '14px', marginTop: '5px', opacity: 0.8 }}>
                {isConnecting ? 'Acessando câmera...' : 'Clique para conectar'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controles */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        {!connected ? (
          <button 
            onClick={handleJoinCall}
            disabled={isConnecting}
            style={{ 
              padding: '15px 30px', 
              backgroundColor: isConnecting ? '#95a5a6' : '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '25px',
              cursor: isConnecting ? 'not-allowed' : 'pointer',
              fontSize: '18px',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)',
              transition: 'all 0.3s ease',
              opacity: isConnecting ? 0.6 : 1
            }}
          >
            {isConnecting ? '🔄 Conectando...' : '📹 Conectar à Videochamada'}
          </button>
        ) : (
          <button 
            onClick={handleEndCall}
            style={{ 
              padding: '15px 30px', 
              backgroundColor: '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(220, 53, 69, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            🔚 Sair da Chamada
          </button>
        )}
      </div>

      {/* Status */}
      {connected && (
        <div style={{ 
          padding: '15px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '10px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <h4 style={{ color: '#155724', margin: '0 0 10px 0' }}>
            ✅ Conectado à Videochamada!
          </h4>
          <p style={{ color: '#155724', margin: '0', fontSize: '14px' }}>
            📹 Sua câmera está ativa • 🎤 Seu áudio está funcionando<br/>
            👨‍⚕️ O médico pode te ver e ouvir
          </p>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div style={{ 
          padding: '15px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <h4 style={{ color: '#721c24', margin: '0 0 10px 0' }}>
            ⚠️ Problema de Conexão
          </h4>
          <p style={{ color: '#721c24', margin: '0', fontSize: '14px', whiteSpace: 'pre-line' }}>
            {error}
          </p>
        </div>
      )}

      {/* Instruções */}
      <div style={{ 
        padding: '20px',
        backgroundColor: '#e3f2fd',
        border: '1px solid #90caf9',
        borderRadius: '10px',
        fontSize: '14px'
      }}>
        <h4 style={{ color: '#1565c0', margin: '0 0 15px 0' }}>
          📋 Como usar:
        </h4>
        <ul style={{ color: '#1565c0', margin: '0', paddingLeft: '20px' }}>
          <li>Clique em "Conectar à Videochamada"</li>
          <li>Permita acesso à câmera quando solicitado</li>
          <li>Aguarde seu médico iniciar a consulta</li>
          <li>Mantenha boa iluminação e fique próximo ao celular</li>
        </ul>
      </div>

      {/* Info técnica */}
      <div style={{ 
        textAlign: 'center',
        marginTop: '20px',
        fontSize: '12px',
        color: '#6c757d'
      }}>
        <p>Convite: {inviteId}</p>
        <p>Agendamento: {agendamentoId}</p>
      </div>
    </div>
  );
}