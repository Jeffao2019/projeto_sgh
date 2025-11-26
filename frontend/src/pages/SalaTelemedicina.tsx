import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Users, 
  MessageCircle,
  FileText,
  Clock,
  User,
  Stethoscope
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useToast } from '@/hooks/use-toast';

interface Teleconsulta {
  id: string;
  paciente: {
    id: string;
    nome: string;
    idade: number;
    telefone: string;
    email: string;
  };
  medico: {
    id: string;
    nome: string;
    crm: string;
    especialidade: string;
  };
  dataHora: string;
  status: 'AGENDADO' | 'EM_ANDAMENTO' | 'FINALIZADO';
  observacoes?: string;
}

interface NotasConsulta {
  anamnese: string;
  exameFisico: string;
  diagnostico: string;
  prescricaoUsoInterno: string;
  prescricaoUsoExterno: string;
  observacoes: string;
}

export default function SalaTelemedicina() {
  const { toast } = useToast();
  
  // Estado da videochamada
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  
  // Estado do chat
  const [messages, setMessages] = useState<Array<{id: string, sender: string, message: string, time: string}>>([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Estado das notas da consulta
  const [notas, setNotas] = useState<NotasConsulta>({
    anamnese: '',
    exameFisico: '',
    diagnostico: '',
    prescricaoUsoInterno: '',
    prescricaoUsoExterno: '',
    observacoes: ''
  });
  
  // Referências para os elementos de vídeo
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  // Dados da teleconsulta atual (simulado)
  const teleconsulta: Teleconsulta = {
    id: '1',
    paciente: {
      id: '1',
      nome: 'Maria Silva Santos',
      idade: 45,
      telefone: '(11) 99999-9999',
      email: 'maria.silva@email.com'
    },
    medico: {
      id: '1',
      nome: 'Dr. Carlos Silva',
      crm: '234567',
      especialidade: 'Dermatologia'
    },
    dataHora: new Date().toISOString(),
    status: 'AGENDADO'
  };

  // Simulação de inicialização da câmera
  useEffect(() => {
    if (isCallActive && localVideoRef.current) {
      // Simulação de acesso à câmera
      navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          setIsConnected(true);
          toast({
            title: "Câmera conectada",
            description: "Sua câmera e microfone estão funcionando",
          });
        })
        .catch(err => {
          console.error('Erro ao acessar mídia:', err);
          toast({
            title: "Erro de mídia",
            description: "Não foi possível acessar câmera/microfone",
            variant: "destructive",
          });
        });
    }
  }, [isCallActive, toast]);

  // Timer da chamada
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive && isConnected) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive, isConnected]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = () => {
    setIsCallActive(true);
    toast({
      title: "Iniciando videochamada",
      description: "Conectando com o paciente...",
    });
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setIsConnected(false);
    setCallDuration(0);
    
    // Parar streams de vídeo
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    
    toast({
      title: "Videochamada finalizada",
      description: "Consulta encerrada com sucesso",
    });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        sender: 'Médico',
        message: newMessage,
        time: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const handleSaveNotes = () => {
    toast({
      title: "Notas salvas",
      description: "Prontuário da teleconsulta foi salvo com sucesso",
    });
  };

  const handleNotasChange = (field: keyof NotasConsulta, value: string) => {
    setNotas(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <DashboardLayout
      title="Sala de Telemedicina"
      subtitle="Videochamada segura para consultas online"
    >
      <div className="space-y-6">
        
        {/* Informações da Teleconsulta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              Teleconsulta #{teleconsulta.id}
            </CardTitle>
            <CardDescription>
              {new Date(teleconsulta.dataHora).toLocaleString('pt-BR')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Paciente
                </h4>
                <p className="font-medium">{teleconsulta.paciente.nome}</p>
                <p className="text-sm text-muted-foreground">
                  {teleconsulta.paciente.idade} anos
                </p>
                <p className="text-sm text-muted-foreground">
                  {teleconsulta.paciente.telefone}
                </p>
                <p className="text-sm text-muted-foreground">
                  {teleconsulta.paciente.email}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  Médico
                </h4>
                <p className="font-medium">{teleconsulta.medico.nome}</p>
                <p className="text-sm text-muted-foreground">
                  CRM: {teleconsulta.medico.crm}
                </p>
                <p className="text-sm text-muted-foreground">
                  {teleconsulta.medico.especialidade}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Área de Vídeo */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Videochamada
                  </span>
                  {isCallActive && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(callDuration)}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Status da Conexão */}
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    isConnected ? 'bg-green-500' : isCallActive ? 'bg-yellow-500' : 'bg-gray-400'
                  }`} />
                  <span className="text-sm font-medium">
                    {isConnected ? 'Conectado' : isCallActive ? 'Conectando...' : 'Desconectado'}
                  </span>
                </div>

                {/* Área de Vídeos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Vídeo Local (Médico) */}
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

                  {/* Vídeo Remoto (Paciente) */}
                  <div className="relative bg-gray-100 rounded-lg aspect-video overflow-hidden">
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                      {teleconsulta.paciente.nome}
                    </div>
                    {!isCallActive ? (
                      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                        <div className="text-center">
                          <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                          <p className="text-gray-500">Aguardando paciente...</p>
                        </div>
                      </div>
                    ) : !isConnected ? (
                      <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                          <p>Conectando...</p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Controles de Vídeo */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant={isVideoEnabled ? "default" : "destructive"}
                    size="sm"
                    onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                    className="flex items-center gap-2"
                  >
                    {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    {isVideoEnabled ? 'Câmera' : 'Câmera Off'}
                  </Button>

                  <Button
                    variant={isAudioEnabled ? "default" : "destructive"}
                    size="sm"
                    onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                    className="flex items-center gap-2"
                  >
                    {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    {isAudioEnabled ? 'Microfone' : 'Mudo'}
                  </Button>

                  {!isCallActive ? (
                    <Button
                      variant="default"
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

            {/* Chat */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Chat da Consulta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-32 overflow-y-auto border rounded p-2 space-y-2">
                  {messages.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Nenhuma mensagem ainda...</p>
                  ) : (
                    messages.map(msg => (
                      <div key={msg.id} className="text-sm">
                        <span className="font-medium">{msg.sender}</span>
                        <span className="text-muted-foreground text-xs ml-2">{msg.time}</span>
                        <p className="mt-1">{msg.message}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} size="sm">
                    Enviar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Painel de Notas */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Prontuário da Teleconsulta
                </CardTitle>
                <CardDescription>
                  Registre as informações da consulta online
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <div className="space-y-2">
                  <Label htmlFor="anamnese">Anamnese</Label>
                  <Textarea
                    id="anamnese"
                    placeholder="História clínica relatada pelo paciente via teleconsulta..."
                    value={notas.anamnese}
                    onChange={(e) => handleNotasChange('anamnese', e.target.value)}
                    className="min-h-20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exameFisico">Exame Físico (Limitado)</Label>
                  <Textarea
                    id="exameFisico"
                    placeholder="Observações visuais e limitações do exame remoto..."
                    value={notas.exameFisico}
                    onChange={(e) => handleNotasChange('exameFisico', e.target.value)}
                    className="min-h-20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diagnostico">Diagnóstico</Label>
                  <Textarea
                    id="diagnostico"
                    placeholder="Diagnóstico baseado na teleconsulta..."
                    value={notas.diagnostico}
                    onChange={(e) => handleNotasChange('diagnostico', e.target.value)}
                    className="min-h-16"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="prescricaoUsoInterno">Prescrição Digital - Uso Interno</Label>
                  <Textarea
                    id="prescricaoUsoInterno"
                    placeholder="Medicamentos prescritos via telemedicina..."
                    value={notas.prescricaoUsoInterno}
                    onChange={(e) => handleNotasChange('prescricaoUsoInterno', e.target.value)}
                    className="min-h-16"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prescricaoUsoExterno">Orientações de Autocuidado</Label>
                  <Textarea
                    id="prescricaoUsoExterno"
                    placeholder="Orientações e cuidados domiciliares..."
                    value={notas.prescricaoUsoExterno}
                    onChange={(e) => handleNotasChange('prescricaoUsoExterno', e.target.value)}
                    className="min-h-16"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações da Teleconsulta</Label>
                  <Textarea
                    id="observacoes"
                    placeholder="Qualidade da conexão, limitações técnicas, próximos passos..."
                    value={notas.observacoes}
                    onChange={(e) => handleNotasChange('observacoes', e.target.value)}
                    className="min-h-16"
                  />
                </div>

                <Button 
                  onClick={handleSaveNotes}
                  className="w-full"
                  variant="secondary"
                >
                  Salvar Prontuário
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
