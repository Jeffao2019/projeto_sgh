import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Key, 
  Lock, 
  Eye, 
  EyeOff, 
  Smartphone,
  CheckCircle,
  AlertTriangle,
  Settings,
  Fingerprint,
  Timer,
  Globe,
  UserCheck
} from 'lucide-react';

export default function Seguranca() {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [alterandoSenha, setAlterandoSenha] = useState(false);

  // Estados de configuração de segurança
  const [configuracoes, setConfiguracoes] = useState({
    autenticacaoDoisFatores: true,
    biometria: false,
    sessaoSegura: true,
    logoutAutomatico: true,
    tempoLogout: 30, // minutos
    notificacaoLogin: true,
    verificacaoDispositivo: true,
    criptografiaAvancada: true,
    auditoriaSessao: true,
    restricaoIp: false,
    senhaComplexidade: 'alta'
  });

  const handleAlterarSenha = async () => {
    if (novaSenha !== confirmarSenha) {
      alert('Senhas não conferem!');
      return;
    }

    setAlterandoSenha(true);
    
    try {
      // Simulação da API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Senha alterada com sucesso!');
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
    } catch (error) {
      alert('Erro ao alterar senha. Tente novamente.');
    } finally {
      setAlterandoSenha(false);
    }
  };

  const handleConfiguracao = (chave: string, valor: any) => {
    setConfiguracoes(prev => ({
      ...prev,
      [chave]: valor
    }));
  };

  const nivelSeguranca = () => {
    const pontos = Object.values(configuracoes).filter(Boolean).length;
    if (pontos >= 8) return { nivel: 'Alto', cor: 'bg-green-500', pontos };
    if (pontos >= 5) return { nivel: 'Médio', cor: 'bg-yellow-500', pontos };
    return { nivel: 'Baixo', cor: 'bg-red-500', pontos };
  };

  const seguranca = nivelSeguranca();

  return (
    <div className="space-y-6">
      {/* Header com indicador de nível de segurança */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold">Segurança</h2>
            <p className="text-gray-600">Configure senha, autenticação e privacidade</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`${seguranca.cor} text-white`}>
            Nível: {seguranca.nivel}
          </Badge>
          <span className="text-sm text-gray-500">
            {seguranca.pontos}/11 configurações ativas
          </span>
        </div>
      </div>

      <Tabs defaultValue="senha" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="senha" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Senha
          </TabsTrigger>
          <TabsTrigger value="autenticacao" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Autenticação
          </TabsTrigger>
          <TabsTrigger value="privacidade" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Privacidade
          </TabsTrigger>
        </TabsList>

        {/* Aba Senha */}
        <TabsContent value="senha" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Alteração de Senha
              </CardTitle>
              <CardDescription>
                Mantenha sua senha forte e atualizada regularmente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="senha-atual">Senha Atual</Label>
                  <div className="relative">
                    <Input
                      id="senha-atual"
                      type={mostrarSenha ? 'text' : 'password'}
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                      placeholder="Digite sua senha atual"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                    >
                      {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nova-senha">Nova Senha</Label>
                  <Input
                    id="nova-senha"
                    type={mostrarSenha ? 'text' : 'password'}
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    placeholder="Digite a nova senha"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="confirmar-senha">Confirmar Nova Senha</Label>
                  <Input
                    id="confirmar-senha"
                    type={mostrarSenha ? 'text' : 'password'}
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    placeholder="Confirme a nova senha"
                  />
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Use no mínimo 8 caracteres com letras maiúsculas, minúsculas, números e símbolos.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={handleAlterarSenha}
                disabled={!senhaAtual || !novaSenha || !confirmarSenha || alterandoSenha}
                className="w-full md:w-auto"
              >
                {alterandoSenha ? 'Alterando...' : 'Alterar Senha'}
              </Button>
            </CardContent>
          </Card>

          {/* Política de Senhas */}
          <Card>
            <CardHeader>
              <CardTitle>Política de Senhas</CardTitle>
              <CardDescription>Configurações de complexidade e segurança</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="complexidade">Nível de Complexidade</Label>
                  <select 
                    id="complexidade"
                    value={configuracoes.senhaComplexidade}
                    onChange={(e) => handleConfiguracao('senhaComplexidade', e.target.value)}
                    className="border rounded px-3 py-1"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Logout Automático</Label>
                    <p className="text-sm text-gray-500">Sair automaticamente por inatividade</p>
                  </div>
                  <Switch
                    checked={configuracoes.logoutAutomatico}
                    onCheckedChange={(checked) => handleConfiguracao('logoutAutomatico', checked)}
                  />
                </div>

                {configuracoes.logoutAutomatico && (
                  <div className="flex items-center justify-between pl-4">
                    <Label htmlFor="tempo-logout">Tempo (minutos)</Label>
                    <Input
                      id="tempo-logout"
                      type="number"
                      value={configuracoes.tempoLogout}
                      onChange={(e) => handleConfiguracao('tempoLogout', parseInt(e.target.value))}
                      className="w-20"
                      min="5"
                      max="120"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Autenticação */}
        <TabsContent value="autenticacao" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Autenticação de Dois Fatores (2FA)
              </CardTitle>
              <CardDescription>
                Adicione uma camada extra de segurança à sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Autenticação de Dois Fatores</Label>
                  <p className="text-sm text-gray-500">Requer código do app ou SMS</p>
                </div>
                <Switch
                  checked={configuracoes.autenticacaoDoisFatores}
                  onCheckedChange={(checked) => handleConfiguracao('autenticacaoDoisFatores', checked)}
                />
              </div>

              {configuracoes.autenticacaoDoisFatores && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">2FA Ativado</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    Sua conta está protegida com autenticação de dois fatores
                  </p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Configurar App Autenticador
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Autenticação Biométrica</Label>
                  <p className="text-sm text-gray-500">Impressão digital ou reconhecimento facial</p>
                </div>
                <Switch
                  checked={configuracoes.biometria}
                  onCheckedChange={(checked) => handleConfiguracao('biometria', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Verificação de Dispositivo</Label>
                  <p className="text-sm text-gray-500">Solicitar confirmação em dispositivos novos</p>
                </div>
                <Switch
                  checked={configuracoes.verificacaoDispositivo}
                  onCheckedChange={(checked) => handleConfiguracao('verificacaoDispositivo', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Notificação de Login</Label>
                  <p className="text-sm text-gray-500">Avisar sobre novos acessos à conta</p>
                </div>
                <Switch
                  checked={configuracoes.notificacaoLogin}
                  onCheckedChange={(checked) => handleConfiguracao('notificacaoLogin', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Sessões Ativas */}
          <Card>
            <CardHeader>
              <CardTitle>Sessões Ativas</CardTitle>
              <CardDescription>Gerencie dispositivos conectados à sua conta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Globe className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Chrome - Windows (Atual)</p>
                      <p className="text-sm text-gray-500">IP: 192.168.1.100 • Agora</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Ativo</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Smartphone className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">App Mobile - Android</p>
                      <p className="text-sm text-gray-500">IP: 192.168.1.150 • 2h atrás</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Encerrar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Privacidade */}
        <TabsContent value="privacidade" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Configurações de Privacidade
              </CardTitle>
              <CardDescription>
                Controle como seus dados são utilizados e protegidos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Sessão Segura</Label>
                  <p className="text-sm text-gray-500">Usar HTTPS e criptografia avançada</p>
                </div>
                <Switch
                  checked={configuracoes.sessaoSegura}
                  onCheckedChange={(checked) => handleConfiguracao('sessaoSegura', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Criptografia Avançada</Label>
                  <p className="text-sm text-gray-500">Proteger dados com AES-256</p>
                </div>
                <Switch
                  checked={configuracoes.criptografiaAvancada}
                  onCheckedChange={(checked) => handleConfiguracao('criptografiaAvancada', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auditoria de Sessão</Label>
                  <p className="text-sm text-gray-500">Registrar atividades para segurança</p>
                </div>
                <Switch
                  checked={configuracoes.auditoriaSessao}
                  onCheckedChange={(checked) => handleConfiguracao('auditoriaSessao', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Restrição por IP</Label>
                  <p className="text-sm text-gray-500">Permitir acesso apenas de IPs autorizados</p>
                </div>
                <Switch
                  checked={configuracoes.restricaoIp}
                  onCheckedChange={(checked) => handleConfiguracao('restricaoIp', checked)}
                />
              </div>

              {configuracoes.restricaoIp && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <Label className="font-medium">IPs Autorizados</Label>
                  <div className="mt-2 space-y-2">
                    <Input placeholder="Ex: 192.168.1.0/24" />
                    <Button variant="outline" size="sm">
                      Adicionar IP
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* LGPD e Conformidade */}
          <Card>
            <CardHeader>
              <CardTitle>LGPD e Conformidade</CardTitle>
              <CardDescription>Configurações de proteção de dados pessoais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <UserCheck className="h-4 w-4" />
                <AlertDescription>
                  Seus dados são protegidos conforme a Lei Geral de Proteção de Dados (LGPD)
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Gerenciar Dados Pessoais
                </Button>
                
                <Button variant="outline" className="justify-start">
                  <Fingerprint className="h-4 w-4 mr-2" />
                  Relatório de Privacidade
                </Button>
                
                <Button variant="outline" className="justify-start">
                  <Timer className="h-4 w-4 mr-2" />
                  Histórico de Acessos
                </Button>
                
                <Button variant="outline" className="justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Política de Privacidade
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Botão de Configuração Principal */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Settings className="h-6 w-6 text-white" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">Configuração Avançada de Segurança</h3>
              <p className="text-gray-600">
                Acesse configurações detalhadas de segurança, auditoria e conformidade
              </p>
            </div>
            
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Settings className="h-4 w-4 mr-2" />
              Configurar Segurança Avançada
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
