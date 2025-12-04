import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function PacienteVideochamada() {
  const [searchParams] = useSearchParams();
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [meetLink, setMeetLink] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const inviteId = searchParams.get('invite');
  const agendamentoId = searchParams.get('agendamento');
  const meetUrl = searchParams.get('meet');

  useEffect(() => {
    if (meetUrl) {
      setMeetLink(decodeURIComponent(meetUrl));
    }
  }, [meetUrl]);

  const handleJoinGoogleMeet = () => {
    if (meetLink) {
      window.open(meetLink, '_self');
    } else {
      const link = prompt(
        '🎥 LINK DO GOOGLE MEET\n\n' +
        'Cole aqui o link do Google Meet enviado pelo seu médico:\n\n' +
        'Exemplo: https://meet.google.com/abc-defg-hij\n\n' +
        'Link da videochamada:'
      );
      
      if (link && link.includes('meet.google.com')) {
        setMeetLink(link);
        window.open(link, '_self');
      } else {
        alert('❌ Link inválido!\n\nO link deve ser do Google Meet\nExemplo: https://meet.google.com/abc-defg-hij');
      }
    }
  };

  const handleTestCamera = async () => {
    try {
      console.log('🧪 Testando câmera do paciente...');
      setIsConnecting(true);
      setError(null);
      
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              width: { ideal: 640 }, 
              height: { ideal: 480 },
              facingMode: 'user'
            }, 
            audio: true 
          });
          
          console.log('📹 Câmera do paciente acessada com sucesso');
          setMediaStream(stream);
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
          
          setConnected(true);
          setIsConnecting(false);
          
          alert('✅ CÂMERA FUNCIONANDO!\n\n📹 Sua câmera está ativa\n🎤 Seu microfone está funcionando\n\n💡 Agora você pode entrar no Google Meet\n🎥 Clique em "Entrar no Google Meet" quando estiver pronto');
          
        } catch (mediaError) {
          console.error('❌ Erro ao acessar câmera:', mediaError);
          setIsConnecting(false);
          setError('❌ Não foi possível acessar sua câmera. Verifique as permissões.');
        }
      } else {
        setIsConnecting(false);
        setError('❌ Seu navegador não suporta acesso à câmera');
      }
      
    } catch (error) {
      console.error('❌ Erro ao testar câmera:', error);
      setIsConnecting(false);
      setError('❌ Erro inesperado ao tentar acessar a câmera');
    }
  };

  const handleEndCall = () => {
    try {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => {
          track.stop();
        });
        setMediaStream(null);
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      setConnected(false);
      
    } catch (error) {
      console.error('❌ Erro ao sair:', error);
    }
  };

  useEffect(() => {
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
        <p style={{ color: '#6c757d', margin: '5px 0' }}>
          Sistema SGH - Videochamada com seu médico
        </p>
      </div>

      {meetLink && (
        <div style={{ 
          backgroundColor: '#e3f2fd',
          border: '2px solid #2196f3',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#1976d2', margin: '0 0 10px 0' }}>
            🎥 Google Meet Detectado
          </h3>
          <p style={{ color: '#1976d2', margin: '5px 0' }}>
            Link da videochamada já configurado!
          </p>
        </div>
      )}

      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ color: '#495057', marginBottom: '15px' }}>
          📹 Teste sua Câmera
        </h3>
        
        <div style={{ 
          position: 'relative',
          backgroundColor: '#000', 
          aspectRatio: '4/3', 
          borderRadius: '8px',
          overflow: 'hidden',
          marginBottom: '15px',
          border: connected ? '3px solid #28a745' : '1px solid #ddd'
        }}>
          <video 
            ref={videoRef}
            autoPlay 
            muted 
            playsInline
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              display: mediaStream ? 'block' : 'none'
            }}
          />
          {!mediaStream && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              flexDirection: 'column',
              backgroundColor: '#343a40'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>
                {isConnecting ? '⏳' : '📷'}
              </div>
              <div>
                {isConnecting ? 'Ativando câmera...' : 'Clique para testar sua câmera'}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleTestCamera}
          disabled={isConnecting}
          style={{ 
            width: '100%',
            padding: '12px', 
            backgroundColor: connected ? '#28a745' : isConnecting ? '#6c757d' : '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isConnecting ? 'not-allowed' : 'pointer',
            marginBottom: '10px'
          }}
        >
          {isConnecting ? '🔄 Ativando Câmera...' : connected ? '✅ Câmera Funcionando' : '📹 Testar Câmera'}
        </button>

        {error && (
          <div style={{ 
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            color: '#721c24',
            padding: '10px',
            borderRadius: '4px',
            fontSize: '14px',
            marginTop: '10px'
          }}>
            {error}
          </div>
        )}
      </div>

      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ color: '#495057', marginBottom: '15px' }}>
          🎥 Videochamada Google Meet
        </h3>
        
        <button
          onClick={handleJoinGoogleMeet}
          style={{ 
            width: '100%',
            padding: '15px', 
            backgroundColor: '#4285f4', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          🚀 Entrar no Google Meet
        </button>

        <p style={{ 
          fontSize: '12px', 
          color: '#6c757d', 
          textAlign: 'center',
          margin: '10px 0'
        }}>
          {meetLink ? 
            'Link já configurado - clique para entrar diretamente' : 
            'Você será solicitado a colar o link do Google Meet'
          }
        </p>
      </div>

      {connected && (
        <div style={{ 
          textAlign: 'center',
          marginTop: '20px'
        }}>
          <button 
            onClick={handleEndCall}
            style={{ 
              padding: '12px 24px', 
              backgroundColor: '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🔚 Sair da Videochamada
          </button>
        </div>
      )}

      <div style={{ 
        textAlign: 'center',
        marginTop: '30px',
        fontSize: '12px',
        color: '#6c757d',
        backgroundColor: '#f8f9fa',
        padding: '10px',
        borderRadius: '8px'
      }}>
        <p style={{ margin: '5px 0' }}>ID do Convite: {inviteId}</p>
        <p style={{ margin: '5px 0' }}>Agendamento: {agendamentoId}</p>
      </div>
    </div>
  );
}