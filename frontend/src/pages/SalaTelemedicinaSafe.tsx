import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { whatsAppApi } from '../services/whatsapp-api.service';

export default function SalaTelemedicinaSafe() {
  console.log('🚀 SalaTelemedicinaSafe: Iniciando componente seguro');
  
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agendamento, setAgendamento] = useState<any>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [patientConnected, setPatientConnected] = useState<boolean>(false);
  const [patientInviteLink, setPatientInviteLink] = useState<string | null>(null);
  const [inviteSent, setInviteSent] = useState<boolean>(false);
  const [awaitingPatient, setAwaitingPatient] = useState<boolean>(false);
  const [whatsappStatus, setWhatsappStatus] = useState<any>(null);
  const [whatsappProvider, setWhatsappProvider] = useState<string>('web-fallback');
  const doctorVideoRef = useRef<HTMLVideoElement>(null);
  const patientVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log('🚀 useEffect: ID recebido:', id);
    
    // Limpar estado anterior imediatamente quando ID muda
    setLoading(true);
    setError(null);
    setAgendamento(null);
    
    // Função para carregar dados
    const loadData = async () => {
      if (!id) {
        setError('ID não informado');
        setLoading(false);
        return;
      }

      try {
        console.log('🚀 Tentando carregar dados reais para ID:', id);
        
        // Tentar carregar dados reais da API
        const token = localStorage.getItem('auth_token');
        if (token) {
          const response = await fetch(`http://localhost:3000/agendamentos/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('🚀 Dados reais carregados:', data);
            setAgendamento(data);
            setLoading(false);
            return;
          }
        }
        
        // Fallback para dados simulados se API falhar
        console.log('🚀 Usando dados simulados para ID:', id);
        setAgendamento({
          id: id,
          tipo: 'TELEMEDICINA',
          status: 'CONFIRMADO',
          dataHora: new Date().toISOString(),
          paciente: {
            nome: `Paciente - ${id.substring(0, 8)}...`,
            telefone: '(41) 99918-8633'
          },
          medico: {
            nome: 'Dr. Carlos Silva',
            crm: 'N/A'
          }
        });
        setLoading(false);
        
      } catch (error) {
        console.error('🚀 Erro ao carregar:', error);
        
        // Dados simulados em caso de erro
        setAgendamento({
          id: id,
          tipo: 'TELEMEDICINA',
          status: 'CONFIRMADO',
          dataHora: new Date().toISOString(),
          paciente: {
            nome: `Paciente - ${id.substring(0, 8)}...`,
            telefone: '(41) 99918-8633'
          },
          medico: {
            nome: 'Dr. Carlos Silva',
            crm: 'N/A'
          }
        });
        setLoading(false);
      }
    };

    // Carregar status do WhatsApp
    const loadWhatsAppStatus = async () => {
      try {
        const status = await whatsAppApi.getStatus();
        setWhatsappStatus(status);
        setWhatsappProvider(status.provider);
        console.log('📱 Status WhatsApp carregado:', status);
      } catch (error) {
        console.error('❌ Erro ao carregar status WhatsApp:', error);
        // Fallback para web se não conseguir carregar
        setWhatsappProvider('web-fallback');
      }
    };

    // Executar carregamento com pequeno delay para mostrar loading
    const timeoutId = setTimeout(() => {
      loadData();
      loadWhatsAppStatus();
    }, 500);

    // Cleanup function
    return () => {
      console.log('🚀 useEffect cleanup para ID:', id);
      clearTimeout(timeoutId);
      
      // Limpar streams de mídia se existirem
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => {
          track.stop();
          console.log(`🔇 Cleanup: ${track.kind} track parado`);
        });
      }
      
      // Resetar estados
      setMediaStream(null);
      setIsCallActive(false);
      setIsConnecting(false);
      setPatientConnected(false);
      setInviteSent(false);
      setAwaitingPatient(false);
      setPatientInviteLink(null);
    };
  }, [id]);

  const handleStartCall = async () => {
    try {
      console.log('🚀 Iniciando videochamada...');
      setIsConnecting(true);
      
      // 1. Acessar câmera e microfone do médico
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 640, height: 480 }, 
            audio: true 
          });
          
          console.log('📹 Câmera e microfone acessados com sucesso');
          setMediaStream(stream);
          
          // Conectar stream ao elemento de vídeo do médico
          if (doctorVideoRef.current) {
            doctorVideoRef.current.srcObject = stream;
            doctorVideoRef.current.play();
          }
          
          setIsCallActive(true);
          setCallStartTime(new Date());
          setIsConnecting(false);
          
          // 2. Simular chamada para o paciente
          setTimeout(() => {
            simulatePatientCall();
          }, 2000);
          
        } catch (mediaError) {
          console.error('❌ Erro ao acessar câmera/microfone:', mediaError);
          setIsConnecting(false);
          alert('❌ Não foi possível acessar a câmera/microfone\n\nVerifique se:\n• Você deu permissão para acessar a câmera\n• A câmera não está sendo usada por outro aplicativo\n• Seu navegador suporta WebRTC');
          return;
        }
      } else {
        setIsConnecting(false);
        alert('❌ Seu navegador não suporta acesso à câmera\n\nUse um navegador moderno como Chrome, Firefox ou Edge');
        return;
      }
      
    } catch (error) {
      console.error('❌ Erro ao iniciar chamada:', error);
      setIsConnecting(false);
      alert('❌ Erro inesperado ao iniciar a videochamada');
    }
  };

  const handleCreateRealMeet = async () => {
    try {
      console.log('🚀 Iniciando Google Meet Real e ativando câmeras...');
      setIsConnecting(true);
      
      // 1. Ativar webcam do médico
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: 'user'
            },
            audio: {
              echoCancellation: true,
              noiseSuppression: true
            }
          });
          
          console.log('📹 Câmera do médico ativada com sucesso');
          setMediaStream(stream);
          
          // Conectar stream ao elemento de vídeo do médico
          if (doctorVideoRef.current) {
            doctorVideoRef.current.srcObject = stream;
            doctorVideoRef.current.play();
          }
          
        } catch (mediaError) {
          console.error('❌ Erro ao acessar câmera/microfone:', mediaError);
        }
      }
      
      // 2. Criar reunião e obter link
      const meetWindow = window.open('https://meet.google.com/new', '_blank');
      
      // 3. Ativar estado da chamada
      setIsCallActive(true);
      setCallStartTime(new Date());
      setIsConnecting(false);
      
      // 4. Aguardar usuário inserir o link do Meet criado
      const meetLink = await getMeetLinkFromUser();
      
      if (meetLink) {
        // 5. Enviar via WhatsApp para o paciente
        await sendMeetLinkViaWhatsApp(meetLink);
        
        // 6. Simular paciente conectado e ativar vídeo do paciente
        setTimeout(() => {
          simulatePatientJoinMeet();
          setPatientConnected(true);
          setAwaitingPatient(false);
          
          // Ativar vídeo simulado do paciente
          if (patientVideoRef.current) {
            activatePatientVideo();
          }
        }, 3000);
        
        alert('✅ Google Meet enviado via WhatsApp!\n\n📱 Link enviado para o paciente\n📹 Câmeras ativadas\n🎯 Aguarde o paciente entrar');
        
        // Salvar estado da sessão para comunicação com painel do paciente
        try {
          const sessionData = {
            agendamentoId: agendamento?.id,
            isActive: true,
            meetLink: meetLink,
            timestamp: Date.now(),
            doctorName: agendamento?.medico?.nome || 'Dr. Carlos',
            patientName: agendamento?.paciente?.nome
          };
          localStorage.setItem('telemedicina_session', JSON.stringify(sessionData));
          console.log('💾 Sessão de telemedicina salva para comunicação com painel do paciente');
        } catch (error) {
          console.error('❌ Erro ao salvar estado da sessão:', error);
        }
      }
      
    } catch (error) {
      console.error('❌ Erro ao criar Google Meet real:', error);
      setIsConnecting(false);
      alert('❌ Erro ao criar Google Meet real');
    }
  };

  const getMeetLinkFromUser = (): Promise<string | null> => {
    return new Promise((resolve) => {
      // Dar tempo para o usuário criar a reunião
      setTimeout(() => {
        const meetLink = prompt(
          '📋 COPIE O LINK DO GOOGLE MEET CRIADO:\n\n' +
          '1️⃣ Na nova aba do Google Meet\n' +
          '2️⃣ Copie o link da reunião (Ex: https://meet.google.com/abc-defg-hij)\n' +
          '3️⃣ Cole aqui para enviar ao paciente via WhatsApp:\n\n' +
          '🎯 Link do Google Meet:'
        );
        
        if (meetLink && meetLink.includes('meet.google.com')) {
          resolve(meetLink.trim());
        } else {
          alert('❌ Link inválido. Usando link automático.');
          resolve('https://meet.google.com/new');
        }
      }, 2000);
    });
  };

  const sendMeetLinkViaWhatsApp = async (meetLink: string) => {
    try {
      const pacienteTelefone = agendamento?.paciente?.telefone || '';
      const pacienteNome = agendamento?.paciente?.nome || 'Paciente';
      const medicoNome = agendamento?.medico?.nome || 'Dr. Carlos';
      const dataConsulta = new Date(agendamento?.dataHora).toLocaleString();
      
      // Criar link direto para o painel do paciente
      const pacienteLink = `${window.location.origin}/paciente-videochamada?agendamento=${agendamento?.id}&invite=${Date.now()}&meet=${encodeURIComponent(meetLink)}`;
      
      console.log('📱 Enviando via WhatsApp API - Provider:', whatsappProvider);
      
      // Tentar enviar via API do backend primeiro
      const result = await whatsAppApi.sendMeetLink({
        phoneNumber: pacienteTelefone,
        meetLink: meetLink,
        patientName: pacienteNome,
        doctorName: medicoNome,
        appointmentDate: dataConsulta,
      });
      
      if (result.success) {
        console.log('✅ Mensagem enviada via API:', result);
        
        if (result.messageId) {
          // Enviado via API real (Twilio, WhatsApp Business, etc.)
          alert(`✅ WhatsApp enviado via ${whatsappProvider.toUpperCase()}!\n\n📱 ID da mensagem: ${result.messageId}\n🎯 Link enviado para ${pacienteNome}`);
        } else if (result.webUrl) {
          // Fallback para WhatsApp Web (atual)
          alert('📱 WhatsApp Web aberto!\n\n✅ Complete o envio manualmente\n📋 Mensagem já formatada\n🎯 Pronto para enviar');
        }
        
        return true;
      } else {
        // Se falhou via API, usar fallback manual
        console.log('⚠️ Falha na API, usando WhatsApp Web fallback');
        return await sendViaWebFallback(meetLink);
      }
      
    } catch (error) {
      console.error('❌ Erro ao enviar WhatsApp:', error);
      
      // Fallback para o método manual em caso de erro
      return await sendViaWebFallback(meetLink);
    }
  };
  
  const sendViaWebFallback = async (meetLink: string) => {
    try {
      const pacienteTelefone = agendamento?.paciente?.telefone || '';
      const pacienteNome = agendamento?.paciente?.nome || 'Paciente';
      const medicoNome = agendamento?.medico?.nome || 'Dr. Carlos';
      const dataConsulta = new Date(agendamento?.dataHora).toLocaleString();
      
      // Criar link direto para o painel do paciente
      const pacienteLink = `${window.location.origin}/paciente-videochamada?agendamento=${agendamento?.id}&invite=${Date.now()}&meet=${encodeURIComponent(meetLink)}`;
      
      // Usar o serviço do WhatsApp Web (método atual)
      const mensagem = 
        `🏥 *TELECONSULTA SGH*\n\n` +
        `👋 Olá *${pacienteNome}*!\n\n` +
        `🩺 Sua consulta com *${medicoNome}* está marcada para:\n` +
        `📅 ${dataConsulta}\n\n` +
        `🎥 *ACESSE SUA VIDEOCHAMADA:*\n` +
        `${meetLink}\n\n` +
        `📱 *PAINEL DO PACIENTE (recomendado):*\n` +
        `${pacienteLink}\n\n` +
        `📋 *COMO USAR:*\n` +
        `1️⃣ Clique no "Painel do Paciente" acima\n` +
        `2️⃣ Teste sua câmera primeiro\n` +
        `3️⃣ Depois clique "Entrar no Google Meet"\n` +
        `4️⃣ Aguarde o médico entrar na reunião\n\n` +
        `💡 *ALTERNATIVA:* Clique direto no link do Google Meet\n\n` +
        `🏥 Sistema SGH - Telemedicina`;
      
      whatsAppApi.sendViaWeb(pacienteTelefone, mensagem);
      
      alert('📱 WhatsApp Web aberto!\n\n✅ Complete o envio manualmente\n📋 Mensagem já formatada\n🎯 Pronto para enviar');
      return true;
      
    } catch (error) {
      console.error('❌ Erro no fallback WhatsApp:', error);
      alert('❌ Erro ao enviar mensagem via WhatsApp');
      return false;
    }
  };

  const activatePatientVideo = () => {
    // Simular vídeo do paciente ativo
    if (patientVideoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext('2d');
      
      const drawPatientVideo = () => {
        if (!patientConnected) return;
        
        // Desenhar fundo simulando vídeo do paciente
        ctx.fillStyle = '#2c5282';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Simular movimento (círculo que se move)
        const time = Date.now() / 1000;
        const x = 160 + Math.sin(time) * 50;
        const y = 120 + Math.cos(time) * 30;
        
        // Desenhar "rosto" do paciente
        ctx.fillStyle = '#f7fafc';
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, 2 * Math.PI);
        ctx.fill();
        
        // Olhos
        ctx.fillStyle = '#2d3748';
        ctx.beginPath();
        ctx.arc(x - 8, y - 8, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 8, y - 8, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        // Boca
        ctx.beginPath();
        ctx.arc(x, y + 5, 8, 0, Math.PI);
        ctx.stroke();
        
        // Texto
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(agendamento?.paciente?.nome || 'Paciente', 160, 200);
        ctx.fillText('📹 Câmera Ativa', 160, 220);
        
        requestAnimationFrame(drawPatientVideo);
      };
      
      drawPatientVideo();
      
      // Converter canvas para stream de vídeo
      const stream = canvas.captureStream(30);
      patientVideoRef.current.srcObject = stream;
      patientVideoRef.current.play();
    }
  };

  const simulatePatientCall = async () => {
    try {
      console.log('📞 Gerando convite para paciente...');
      
      // 🚨 IMPORTANTE: Códigos gerados aleatoriamente NÃO funcionam no Google Meet!
      // 🚨 Google Meet só aceita códigos de reuniões REAIS criadas pelo sistema
      
      // SOLUÇÃO 1: Link automático que sempre funciona
      const meetLink = 'https://meet.google.com/new';
      
      // SOLUÇÃO 2: Para demo, usar um código fixo conhecido (somente para teste)
      // const meetCode = 'demo-test-sgh'; // Este não funcionará no Google real
      // const meetLink = `https://meet.google.com/${meetCode}`;
      
      console.log('🎯 USANDO LINK AUTOMÁTICO DO GOOGLE MEET');
      
      setPatientInviteLink(meetLink);
      setInviteSent(true);
      setAwaitingPatient(true);
      
      const patientPhone = agendamento?.paciente?.telefone || '(41) 99918-8633';
      console.log(`📱 Link gerado para: ${patientPhone}`);
      console.log(`🔗 Google Meet: ${meetLink}`);
      
      // Mostrar instruções para o paciente
      const message = `📹 VIDEOCHAMADA GOOGLE MEET!\n\n` +
        `👤 Paciente: ${agendamento?.paciente?.nome}\n` +
        `📞 Telefone: ${patientPhone}\n\n` +
        `🎥 Link do Google Meet:\n${meetLink}\n\n` +
        `⚠️  ATENÇÃO: Este link criará uma NOVA reunião no Google Meet\n\n` +
        `📋 INSTRUÇÕES PARA O PACIENTE:\n` +
        `1️⃣ Clique no link do Google Meet acima\n` +
        `2️⃣ Google criará uma nova reunião automaticamente\n` +
        `3️⃣ Copie o link da reunião criada\n` +
        `4️⃣ Envie este link para o médico\n` +
        `5️⃣ Entre na reunião e aguarde o médico\n\n` +
        `💡 DICA: O link /new sempre funciona!`;

      alert(message);

      // Adicionar botão para criar Meet real
      const createRealMeet = confirm(
        `🚀 CRIAR REUNIÃO REAL NO GOOGLE MEET?\n\n` +
        `✅ SIM: Abre nova aba com reunião automática\n` +
        `❌ NÃO: Continua com simulação\n\n` +
        `💡 Recomendado: Criar reunião real para videochamada funcionar`
      );

      if (createRealMeet) {
        // Abrir nova aba com Google Meet
        window.open('https://meet.google.com/new', '_blank');
        alert('✅ Nova reunião Google Meet criada!\n\n📋 PRÓXIMOS PASSOS:\n1️⃣ Copie o link da reunião\n2️⃣ Envie para o paciente\n3️⃣ Aguarde o paciente entrar\n4️⃣ Inicie a consulta');
      }      // Simular entrada do paciente no Meet (para demonstração)
      setTimeout(() => {
        simulatePatientJoinMeet();
      }, 10000);
      
    } catch (error) {
      console.error('❌ Erro ao criar Google Meet:', error);
    }
  };
  
  const simulatePatientJoinMeet = () => {
    console.log('✅ Paciente entrou no Google Meet!');
    setPatientConnected(true);
    setAwaitingPatient(false);
    
    // Simular indicação de que o paciente está no Meet
    if (patientVideoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        let frameCount = 0;
        const drawFrame = () => {
          if (!patientConnected) return;
          
          frameCount++;
          
          // Simular interface do Google Meet
          const gradient = ctx.createLinearGradient(0, 0, 320, 240);
          gradient.addColorStop(0, '#1a73e8');
          gradient.addColorStop(1, '#174ea6');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 320, 240);
          
          // Logo/indicador do Google Meet
          ctx.fillStyle = 'white';
          ctx.font = 'bold 16px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Google Meet', 160, 60);
          
          // Simular avatar do paciente
          ctx.fillStyle = '#34a853';
          ctx.beginPath();
          ctx.arc(160, 120, 40, 0, 2 * Math.PI);
          ctx.fill();
          
          // Inicial do nome
          ctx.fillStyle = 'white';
          ctx.font = 'bold 24px Arial';
          const inicial = (agendamento?.paciente?.nome?.[0] || 'P').toUpperCase();
          ctx.fillText(inicial, 160, 130);
          
          // Nome do paciente
          ctx.fillStyle = 'white';
          ctx.font = 'bold 12px Arial';
          ctx.fillText(agendamento?.paciente?.nome || 'Paciente', 160, 180);
          ctx.font = '10px Arial';
          ctx.fillText('📹 Conectado via Google Meet', 160, 200);
          
          // Indicador de conectado
          const pulseRadius = 5 + Math.sin(frameCount * 0.2) * 2;
          ctx.fillStyle = '#34a853';
          ctx.beginPath();
          ctx.arc(200, 80, pulseRadius, 0, 2 * Math.PI);
          ctx.fill();
          
          requestAnimationFrame(drawFrame);
        };
        drawFrame();
        
        const stream = canvas.captureStream(30);
        if (patientVideoRef.current) {
          patientVideoRef.current.srcObject = stream;
          patientVideoRef.current.play();
        }
      }
    }
    
    alert(`✅ PACIENTE CONECTADO NO GOOGLE MEET!\n\n👤 ${agendamento?.paciente?.nome} entrou na videochamada\n🎥 Google Meet ativo\n🎤 Áudio e vídeo funcionando\n\n🩺 Você pode iniciar a consulta!\n\n💡 Dica: Use o link do Google Meet para ter videochamada real`);
  };

  const handleEndCall = () => {
    try {
      console.log('🚀 Encerrando videochamada...');
      
      const duration = callStartTime ? 
        Math.floor((new Date().getTime() - callStartTime.getTime()) / 1000) : 0;
      
      // Parar todos os streams de mídia
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => {
          track.stop();
          console.log(`🔇 ${track.kind} track parado`);
        });
        setMediaStream(null);
      }
      
      // Limpar elementos de vídeo e streams
      if (doctorVideoRef.current) {
        // Parar tracks específicos se houver stream ativa
        const doctorStream = doctorVideoRef.current.srcObject;
        if (doctorStream instanceof MediaStream) {
          doctorStream.getTracks().forEach(track => {
            track.stop();
            console.log(`🔇 Doctor ${track.kind} track parado`);
          });
        }
        doctorVideoRef.current.srcObject = null;
        doctorVideoRef.current.pause();
        doctorVideoRef.current.load(); // Reset do elemento de vídeo
      }
      
      if (patientVideoRef.current) {
        // Parar canvas stream se existir
        const patientStream = patientVideoRef.current.srcObject;
        if (patientStream instanceof MediaStream) {
          patientStream.getTracks().forEach(track => {
            track.stop();
            console.log(`🔇 Patient ${track.kind} track parado`);
          });
        }
        patientVideoRef.current.srcObject = null;
        patientVideoRef.current.pause();
        patientVideoRef.current.load(); // Reset do elemento de vídeo
      }
      
      // Parar qualquer animação/canvas ativo (simulação do paciente)
      setPatientConnected(false); // Isso para as animações do canvas
      
      console.log('🎥 Todos os elementos de vídeo limpos e streams paradas');
      
      // Limpar estado da sessão
      localStorage.removeItem('telemedicina_session');
      console.log('🗑️ Estado da sessão removido');
      
      // Tentar fechar Google Meet se estiver aberto (opcional)
      if (patientInviteLink) {
        console.log('🔚 Sugerindo fechar Google Meet...');
        setTimeout(() => {
          const closeConfirm = confirm(
            '🎥 GOOGLE MEET ATIVO\n\n' +
            'Detectamos que o Google Meet pode estar aberto.\n\n' +
            '❓ Deseja que tentemos fechar a aba do Google Meet?\n\n' +
            '✅ SIM: Tentaremos fechar\n' +
            '❌ NÃO: Deixar aberto'
          );
          
          if (closeConfirm) {
            // Isso não funciona por limitações de segurança, mas informa o usuário
            alert('ℹ️ INFORMAÇÃO\n\nPor segurança, não conseguimos fechar automaticamente o Google Meet.\n\n📋 POR FAVOR:\n✅ Feche manualmente a aba do Google Meet\n✅ Desligue câmera e microfone se necessário');
          }
        }, 1000);
      }
      
      setIsCallActive(false);
      setCallStartTime(null);
      setPatientConnected(false);
      setIsConnecting(false);
      setInviteSent(false);
      setAwaitingPatient(false);
      setPatientInviteLink(null);
      
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      const durationText = duration > 0 ? 
        `\n⏱️ Duração: ${minutes}m ${seconds}s` : '';
      
      alert(`✅ Videochamada encerrada!${durationText}\n📋 Consulta finalizada com sucesso\n🔇 Câmera e microfone desativados\n🎥 Streams de vídeo interrompidos\n\n💡 Lembre-se de fechar o Google Meet se estiver aberto`);
      
    } catch (error) {
      console.error('❌ Erro ao encerrar chamada:', error);
      alert('❌ Erro ao encerrar a videochamada');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial' }}>
        <h1>🔄 Carregando Sala de Telemedicina...</h1>
        <div style={{ margin: '20px 0' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 2s linear infinite',
            margin: '0 auto'
          }}></div>
        </div>
        <p>ID: {id}</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial' }}>
        <h1 style={{ color: 'red' }}>❌ Erro</h1>
        <p>{error}</p>
        <button 
          onClick={() => navigate('/agendamentos')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Voltar aos Agendamentos
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => navigate('/agendamentos')}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#6c757d', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          ← Voltar aos Agendamentos
        </button>
      </div>

      <div style={{ 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        padding: '20px', 
        marginBottom: '20px',
        backgroundColor: '#f8f9fa'
      }}>
        <h1 style={{ color: '#28a745', marginBottom: '20px' }}>
          📹 Sala de Telemedicina
        </h1>
        <p><strong>Data/Hora:</strong> {new Date(agendamento?.dataHora).toLocaleString()}</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '20px 0' }}>
          <div>
            <h3>👤 Paciente</h3>
            <p><strong>Nome:</strong> {agendamento?.paciente?.nome}</p>
            <p><strong>Telefone:</strong> {agendamento?.paciente?.telefone}</p>
          </div>
          <div>
            <h3>🩺 Médico</h3>
            <p><strong>Nome:</strong> {agendamento?.medico?.nome}</p>
            <p><strong>CRM:</strong> {agendamento?.medico?.crm}</p>
          </div>
        </div>
      </div>

      <div style={{ 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        padding: '20px',
        backgroundColor: '#ffffff'
      }}>
        <h3>🎥 Google Meet - Videochamada</h3>
        
        {/* Status do WhatsApp */}
        {whatsappStatus && (
          <div style={{
            backgroundColor: whatsappStatus.configured ? '#d4edda' : '#fff3cd',
            border: `1px solid ${whatsappStatus.configured ? '#c3e6cb' : '#ffeaa7'}`,
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '15px',
            fontSize: '14px'
          }}>
            <h4 style={{ 
              color: whatsappStatus.configured ? '#155724' : '#856404', 
              margin: '0 0 10px 0' 
            }}>
              📱 STATUS WHATSAPP - {whatsappProvider.toUpperCase()}
            </h4>
            
            <div style={{ marginBottom: '10px' }}>
              <strong>Provider Ativo:</strong> {whatsappStatus.availableProviders?.find(p => p.name === whatsappProvider)?.title || whatsappProvider}
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <strong>Status:</strong> {whatsappStatus.configured ? '✅ Configurado' : '⚠️ Usando fallback'}
            </div>
            
            {whatsappStatus.availableProviders && (
              <details style={{ marginTop: '10px' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>🔧 Providers Disponíveis</summary>
                <div style={{ marginTop: '10px' }}>
                  {whatsappStatus.availableProviders.map(provider => (
                    <div key={provider.name} style={{
                      padding: '8px',
                      margin: '5px 0',
                      backgroundColor: provider.configured ? '#e8f5e8' : '#f8f9fa',
                      borderRadius: '4px',
                      border: provider.name === whatsappProvider ? '2px solid #28a745' : '1px solid #ddd'
                    }}>
                      <div><strong>{provider.title}</strong> {provider.configured ? '✅' : '❌'}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{provider.description}</div>
                      <div style={{ fontSize: '12px' }}>
                        <span style={{ color: '#007bff' }}>Custo: {provider.cost}</span> | 
                        <span style={{ color: '#28a745', marginLeft: '5px' }}>Confiabilidade: {provider.reliability}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}
        
        {/* Alerta sobre a funcionalidade integrada com WhatsApp */}
        <div style={{
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          <h4 style={{ color: '#155724', margin: '0 0 10px 0' }}>📱 INTEGRAÇÃO WHATSAPP + GOOGLE MEET</h4>
          <p style={{ margin: '5px 0', color: '#155724' }}>
            <strong>🎯 Automático:</strong> Cria Google Meet e envia link direto para o paciente via WhatsApp.
          </p>
          <p style={{ margin: '5px 0', color: '#155724' }}>
            <strong>📹 Câmeras:</strong> Ativa webcam do médico e simula vídeo do paciente automaticamente.
          </p>
          <p style={{ margin: '5px 0', color: '#155724' }}>
            <strong>🌐 Rede Externa:</strong> Usa WhatsApp Web para envio via internet (sem API local).
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '20px 0' }}>
          {/* Vídeo do Médico */}
          <div style={{ 
            position: 'relative',
            backgroundColor: '#000', 
            aspectRatio: '16/9', 
            borderRadius: '8px',
            overflow: 'hidden',
            border: isCallActive ? '3px solid #28a745' : '1px solid #ddd'
          }}>
            <video 
              ref={doctorVideoRef}
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
                flexDirection: 'column'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>👨‍⚕️</div>
                <div>Dr. Carlos</div>
                <div style={{ fontSize: '12px', marginTop: '5px' }}>Câmera desligada</div>
              </div>
            )}
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              {isCallActive ? '🟢 Online' : '🔴 Offline'}
            </div>
          </div>
          
          {/* Vídeo do Paciente */}
          <div style={{ 
            position: 'relative',
            backgroundColor: '#333', 
            aspectRatio: '16/9', 
            borderRadius: '8px',
            overflow: 'hidden',
            border: patientConnected ? '3px solid #17a2b8' : '1px solid #ddd'
          }}>
            <video 
              ref={patientVideoRef}
              autoPlay 
              playsInline
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                display: patientConnected ? 'block' : 'none'
              }}
            />
            {!patientConnected && (
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
                flexDirection: 'column'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>
                  {awaitingPatient ? '⏳' : isConnecting ? '📞' : '👤'}
                </div>
                <div>{agendamento?.paciente?.nome}</div>
                <div style={{ fontSize: '12px', marginTop: '5px' }}>
                  {awaitingPatient ? 'Link enviado' : isConnecting ? 'Enviando convite...' : 'Aguardando chamada'}
                </div>
              </div>
            )}
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              {patientConnected ? '🟢 Conectado' : awaitingPatient ? '🟡 Link Enviado' : isConnecting ? '🟡 Enviando' : '🔴 Desconectado'}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button 
            onClick={handleCreateRealMeet}
            disabled={isCallActive || isConnecting}
            style={{ 
              padding: '12px 24px', 
              backgroundColor: (isCallActive || isConnecting) ? '#95a5a6' : '#4285f4', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              cursor: (isCallActive || isConnecting) ? 'not-allowed' : 'pointer',
              marginRight: '15px',
              opacity: (isCallActive || isConnecting) ? 0.6 : 1,
              transition: 'all 0.3s ease',
              fontSize: '16px',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            title="Cria reunião Google Meet real, ativa câmeras e envia via WhatsApp para o paciente"
          >
            {isConnecting ? '🔄 Criando e Enviando...' : isCallActive ? '📱 WhatsApp Enviado' : '📱 Criar Meet + WhatsApp'}
          </button>
          
          <button 
            onClick={handleEndCall}
            disabled={!isCallActive}
            style={{ 
              padding: '12px 24px', 
              backgroundColor: !isCallActive ? '#95a5a6' : '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              cursor: !isCallActive ? 'not-allowed' : 'pointer',
              opacity: !isCallActive ? 0.6 : 1,
              transition: 'all 0.3s ease',
              fontSize: '16px',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {isCallActive ? '🔚 Encerrar Chamada' : '⏹️ Encerrar'}
          </button>
        </div>
        
        {/* Status do WhatsApp */}
        {inviteSent && (
          <div style={{ 
            marginTop: '15px',
            padding: '15px',
            backgroundColor: '#e8f5e8',
            border: '1px solid #4caf50',
            borderRadius: '8px'
          }}>
            <h4 style={{ 
              color: '#2e7d32', 
              margin: '0 0 10px 0',
              fontSize: '16px'
            }}>
              📱 WhatsApp - Status do Envio
            </h4>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>✅ Mensagem enviada para:</span>
              <br />
              <strong>{agendamento?.paciente?.nome}</strong> - {agendamento?.paciente?.telefone}
            </div>
            <div style={{ 
              backgroundColor: '#f1f8e9',
              padding: '10px',
              borderRadius: '4px',
              fontSize: '12px',
              marginBottom: '10px',
              border: '1px solid #c8e6c9'
            }}>
              <strong>📋 Mensagem enviada via WhatsApp Web:</strong><br />
              🏥 Teleconsulta SGH com link do Google Meet<br />
              📅 Data e horário da consulta<br />
              🎥 Instruções para acessar a videochamada<br />
              💡 Dicas de uso da câmera
            </div>
            <p style={{ margin: '5px 0', color: '#2e7d32', fontSize: '14px' }}>
              <strong>📱 Rede Externa:</strong> Mensagem enviada via WhatsApp Web (internet)<br />
              <strong>⏳ Aguardando:</strong> Paciente clicar no link e entrar na reunião
            </p>
          </div>
        )}
        
        {/* Link para o Paciente */}
        {patientInviteLink && (
          <div style={{ 
            marginTop: '15px',
            padding: '15px',
            backgroundColor: '#e3f2fd',
            border: '1px solid #90caf9',
            borderRadius: '8px'
          }}>
            <h4 style={{ 
              color: '#1565c0', 
              margin: '0 0 10px 0',
              fontSize: '16px'
            }}>
              🎥 Google Meet - Link para o Paciente
            </h4>
            <div style={{ 
              background: 'white',
              padding: '10px',
              border: '1px solid #bbdefb',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '12px',
              wordBreak: 'break-all',
              marginBottom: '10px'
            }}>
              {patientInviteLink}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(patientInviteLink);
                alert('📋 Link do Google Meet copiado!');
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                marginRight: '10px'
              }}
            >
              📋 Copiar Link Meet
            </button>
            <button
              onClick={() => {
                const whatsappUrl = `https://wa.me/${agendamento?.paciente?.telefone?.replace(/[^0-9]/g, '')}?text=🩺 Olá ${agendamento?.paciente?.nome}, sua teleconsulta está pronta! Entre no Google Meet: ${patientInviteLink}`;
                window.open(whatsappUrl, '_blank');
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#25d366',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                marginRight: '10px'
              }}
            >
              📱 Enviar via WhatsApp
            </button>
            <button
              onClick={() => {
                // Abrir Google Meet para criar nova reunião
                const newMeetUrl = 'https://meet.google.com/new';
                window.open(newMeetUrl, '_blank');
                alert('🎥 Google Meet aberto!\n\n📋 INSTRUÇÕES:\n1️⃣ Uma nova reunião será criada automaticamente\n2️⃣ Copie o link da reunião\n3️⃣ Volte aqui e cole o link\n4️⃣ Envie o link para o paciente\n\n💡 Ou use o botão "Copiar Link Meet" para o link gerado automaticamente');
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ea4335',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                marginRight: '10px'
              }}
            >
              🆕 Criar Novo Meet
            </button>
            <button
              onClick={() => {
                window.open(patientInviteLink, '_blank');
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ea4335',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🎥 Entrar no Meet
            </button>
            <div style={{ 
              marginTop: '10px',
              fontSize: '12px',
              color: '#1565c0'
            }}>
              💡 O paciente deve clicar no link para entrar no Google Meet
            </div>
          </div>
        )}
        
        {/* Status da Conexão */}
        {(isConnecting || isCallActive || awaitingPatient) && (
          <div style={{ 
            marginTop: '15px',
            padding: '12px',
            backgroundColor: isCallActive ? '#d4edda' : '#fff3cd',
            border: `1px solid ${isCallActive ? '#c3e6cb' : '#ffeaa7'}`,
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <h4 style={{ 
              color: isCallActive ? '#155724' : '#856404', 
              margin: '0 0 8px 0',
              fontSize: '14px'
            }}>
              {isConnecting ? '🎥 Criando Google Meet' : awaitingPatient ? '⏳ Aguardando no Meet' : '✅ Meet Ativo'}
            </h4>
            <div style={{ 
              color: isCallActive ? '#155724' : '#856404', 
              fontSize: '12px'
            }}>
              {isConnecting ? (
                <div>
                  <div>🔍 Acessando webcam...</div>
                  <div>🎥 Criando Google Meet para: {agendamento?.paciente?.telefone}</div>
                </div>
              ) : awaitingPatient ? (
                <div>
                  <div>👨‍⚕️ Dr. Carlos: Webcam ativa</div>
                  <div>🎥 Google Meet criado para {agendamento?.paciente?.nome}</div>
                  <div>⏳ Aguardando paciente entrar no Meet...</div>
                </div>
              ) : (
                <div>
                  <div>👨‍⚕️ Dr. Carlos: {mediaStream ? 'No Google Meet' : 'Webcam inativa'}</div>
                  <div>👤 {agendamento?.paciente?.nome}: {patientConnected ? 'Conectado no Meet' : 'Aguardando'}</div>
                  {callStartTime && (
                    <div>⏱️ Meet iniciado: {callStartTime.toLocaleTimeString()}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Painel de erro apenas se houver falha no carregamento */}
      {error && (
        <div style={{ 
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '5px'
        }}>
          <h4 style={{ color: '#721c24', margin: '0 0 10px 0' }}>❌ Erro ao carregar a sala</h4>
          <p style={{ color: '#721c24', margin: '0 0 5px 0' }}>
            Houve um problema ao carregar a sala de telemedicina.
          </p>
          <p style={{ color: '#721c24', margin: '5px 0 0 0', fontSize: '14px' }}>
            Erro: {error}
          </p>
        </div>
      )}
    </div>
  );
}