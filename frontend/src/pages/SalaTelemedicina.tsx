import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { apiService } from '@/lib/api-service';
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
  Stethoscope,
  ArrowLeft
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import { Agendamento } from '@/types/agendamentos';
import { Paciente } from '@/types/pacientes';
import { Medico } from '@/types/medicos';

interface AgendamentoWithDetails extends Agendamento {
  paciente?: Paciente;
  medico?: Medico;
}

export default function SalaTelemedicina() {
  // Wrapper com try-catch para capturar erros de renderização
  try {
    console.log('🔄 SalaTelemedicina: Iniciando componente');
    
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { toast } = useToast();
    
    console.log('🔄 SalaTelemedicina: Hooks inicializados', { id });
    
    // Estados básicos
    const [agendamento, setAgendamento] = useState<AgendamentoWithDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Estados da videochamada
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isCallActive, setIsCallActive] = useState(false);
    
    // Referências para os elementos de vídeo
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    
    console.log('🔄 SalaTelemedicina: Estados inicializados');
  
  // Carregar dados do agendamento
  useEffect(() => {
    console.log('🔄 useEffect: Iniciando', { id });
    
    if (!id) {
      console.log('🔄 useEffect: ID não fornecido');
      setError('ID do agendamento não informado');
      setLoading(false);
      return;
    }

    // Função async dentro do useEffect
    const loadData = async () => {
      try {
        console.log('🔄 useEffect: Carregando agendamento...');
        setLoading(true);
        setError(null);
        
        const response = await apiService.getAgendamentoById(id);
        console.log('🔄 useEffect: Agendamento carregado', response);
        
        if (!response) {
          throw new Error('Agendamento não encontrado');
        }
        
        setAgendamento(response);
        console.log('🔄 useEffect: Agendamento definido no estado');
        
      } catch (err) {
        console.error('🔄 useEffect: Erro capturado', err);
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        setError('Erro ao carregar agendamento: ' + errorMessage);
      } finally {
        setLoading(false);
        console.log('🔄 useEffect: Loading finalizado');
      }
    };

    // Executar a função async
    loadData();
  }, [id]);
  
  // Mostrar loading enquanto carrega dados
  if (loading) {
    return (
      <DashboardLayout
        title="Sala de Telemedicina"
        subtitle="Preparando sala virtual..."
      >
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Carregando Sala de Telemedicina</h3>
                <p className="text-muted-foreground">Preparando os dados da consulta...</p>
                <p className="text-sm text-muted-foreground mt-2">ID: {id}</p>
              </div>
              <div className="text-xs text-gray-400">
                <p>Se esta tela persistir, verifique:</p>
                <p>• Conexão com a internet</p>
                <p>• Se você está logado no sistema</p>
                <p>• Console do navegador (F12) para erros</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout
        title="Sala de Telemedicina"
        subtitle="Erro no carregamento"
      >
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="text-red-600 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-red-600">Erro ao Carregar Sala</h3>
              <p className="text-muted-foreground">{error}</p>
              <div className="space-x-4">
                <Button onClick={() => window.location.reload()}>
                  Tentar Novamente
                </Button>
                <Button variant="outline" onClick={() => navigate('/agendamentos')}>
                  Voltar aos Agendamentos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  if (!agendamento) {
    return (
      <DashboardLayout
        title="Sala de Telemedicina"
        subtitle="Agendamento não encontrado"
      >
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="text-yellow-600 text-4xl mb-4">❓</div>
              <h3 className="text-lg font-semibold">Agendamento Não Encontrado</h3>
              <p className="text-muted-foreground">O agendamento solicitado não foi localizado.</p>
              <Button onClick={() => navigate('/agendamentos')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar aos Agendamentos
              </Button>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

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
      console.error('Erro ao acessar mídia:', err);
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

  return (
    <DashboardLayout
      title="Sala de Telemedicina"
      subtitle="Videochamada segura para consultas online"
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
        
        {/* Informações da Teleconsulta */}
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
                <p className="font-medium">{agendamento.paciente?.nome || 'Paciente não encontrado'}</p>
                <p className="text-sm text-muted-foreground">
                  {agendamento.paciente?.dataNascimento ? 
                    `${new Date().getFullYear() - new Date(agendamento.paciente.dataNascimento).getFullYear()} anos` : 
                    'Idade não informada'
                  }
                </p>
                <p className="text-sm text-muted-foreground">
                  {agendamento.paciente?.telefone || 'Telefone não informado'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {agendamento.paciente?.email || 'Email não informado'}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  Médico
                </h4>
                <p className="font-medium">{agendamento.medico?.nome || 'Médico não encontrado'}</p>
                <p className="text-sm text-muted-foreground">
                  CRM: {agendamento.medico?.crm || 'Não informado'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {agendamento.medico?.especialidade || 'Especialidade não informada'}
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
                      {agendamento.paciente?.nome || 'Paciente'}
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
                  <Label htmlFor="prescricaoUsoExterno">Prescrição Digital - Uso Externo</Label>
                  <Textarea
                    id="prescricaoUsoExterno"
                    placeholder="Medicamentos e orientações para uso externo/domiciliar..."
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

                <div className="flex gap-3">
                  <Button 
                    onClick={handleSaveNotes}
                    className="flex-1"
                    variant="secondary"
                  >
                    Salvar Prontuário
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      handleSaveNotes();
                      navigate('/agendamentos');
                    }}
                    className="flex-1"
                    variant="default"
                  >
                    Finalizar e Voltar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
  
  } catch (error) {
    console.error('🔄 SalaTelemedicina: Erro de renderização capturado', error);
    
    return (
      <DashboardLayout title="Sala de Telemedicina" subtitle="Erro no componente">
        <div className="p-8 text-center">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-600">Erro no Componente</h3>
          <p className="text-muted-foreground mb-4">
            Ocorreu um erro inesperado no componente de telemedicina.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            {error instanceof Error ? error.message : 'Erro desconhecido'}
          </p>
          <div className="space-x-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Recarregar Página
            </button>
            <button 
              onClick={() => window.location.href = '/agendamentos'}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Voltar aos Agendamentos
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }
}
