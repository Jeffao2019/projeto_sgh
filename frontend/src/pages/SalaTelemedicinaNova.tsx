import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  ArrowLeft,
  User,
  Stethoscope
} from 'lucide-react';

export default function SalaTelemedicinaNova() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  // Estados básicos
  const [agendamento, setAgendamento] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados da videochamada
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Carregamento simplificado
  useEffect(() => {
    console.log('🔄 NOVA SALA DE TELEMEDICINA - ID:', id);
    
    if (!id) {
      setError('ID não informado');
      setLoading(false);
      return;
    }
    
    // Simular carregamento com dados fixos para teste
    setTimeout(() => {
      const agendamentoTeste = {
        id: id,
        tipo: 'TELEMEDICINA',
        status: 'CONFIRMADO',
        dataHora: new Date().toISOString(),
        paciente: {
          id: '1',
          nome: 'JEFFERSON ALMEIDA DOS SANTOS',
          telefone: '(41) 99918-8633',
          email: 'jeffersonalmeidasantos@gmail.com'
        },
        medico: {
          id: '1',
          nome: 'Dr. Carlos Silva',
          crm: 'N/A',
          especialidade: 'Clínica Geral'
        }
      };
      
      console.log('✅ Dados carregados:', agendamentoTeste);
      setAgendamento(agendamentoTeste);
      setLoading(false);
      
      toast({
        title: "Sala de Telemedicina",
        description: "Sala carregada com sucesso!",
      });
    }, 1000);
  }, [id, toast]);

  const handleStartCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setIsCallActive(true);
      
      toast({
        title: "Videochamada iniciada",
        description: "Conectando com o paciente...",
      });
    } catch (err) {
      console.error('Erro ao acessar câmera:', err);
      toast({
        title: "Erro de mídia",
        description: "Não foi possível acessar a câmera",
        variant: "destructive",
      });
    }
  };

  const handleEndCall = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCallActive(false);
    
    toast({
      title: "Videochamada encerrada",
      description: "Consulta finalizada",
    });
  };

  if (loading) {
    return (
      <DashboardLayout title="Sala de Telemedicina" subtitle="Carregando...">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Preparando sala de videochamada...</p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Sala de Telemedicina" subtitle="Erro">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/agendamentos')}>
              Voltar aos Agendamentos
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  if (!agendamento) {
    return (
      <DashboardLayout title="Sala de Telemedicina" subtitle="Não encontrado">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="mb-4">Agendamento não encontrado</p>
            <Button onClick={() => navigate('/agendamentos')}>
              Voltar aos Agendamentos
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Sala de Telemedicina" subtitle="Videochamada ativa">
      <div className="space-y-6">
        
        {/* Botão Voltar */}
        <Button 
          variant="outline" 
          onClick={() => navigate('/agendamentos')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar aos Agendamentos
        </Button>
        
        {/* Informações da Consulta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              Teleconsulta #{agendamento.id}
            </CardTitle>
            <CardDescription>
              {new Date(agendamento.dataHora).toLocaleString('pt-BR')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Paciente
                </h4>
                <p className="font-medium">{agendamento.paciente?.nome}</p>
                <p className="text-sm text-muted-foreground">{agendamento.paciente?.telefone}</p>
                <p className="text-sm text-muted-foreground">{agendamento.paciente?.email}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  Médico
                </h4>
                <p className="font-medium">{agendamento.medico?.nome}</p>
                <p className="text-sm text-muted-foreground">CRM: {agendamento.medico?.crm}</p>
                <p className="text-sm text-muted-foreground">{agendamento.medico?.especialidade}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Área de Videochamada */}
        <Card>
          <CardHeader>
            <CardTitle>Videochamada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Vídeos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Vídeo Local */}
              <div className="relative bg-gray-100 rounded-lg aspect-video overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  Você (Dr. Carlos)
                </div>
                {!isVideoEnabled && (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <VideoOff className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>

              {/* Vídeo Remoto */}
              <div className="relative bg-gray-100 rounded-lg aspect-video overflow-hidden">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  {agendamento.paciente?.nome}
                </div>
                {!isCallActive && (
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <User className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500">Aguardando paciente...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Controles */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant={isVideoEnabled ? "default" : "destructive"}
                size="sm"
                onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                className="flex items-center gap-2"
              >
                {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                Câmera
              </Button>

              <Button
                variant={isAudioEnabled ? "default" : "destructive"}
                size="sm"
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                className="flex items-center gap-2"
              >
                {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                Microfone
              </Button>

              {!isCallActive ? (
                <Button
                  onClick={handleStartCall}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Phone className="w-4 h-4" />
                  Iniciar Chamada
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  onClick={handleEndCall}
                  className="flex items-center gap-2"
                >
                  <PhoneOff className="w-4 h-4" />
                  Encerrar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
}