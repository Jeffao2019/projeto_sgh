import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { apiService } from "@/lib/api-service";
import { User, Mail, Lock, UserCircle, Save, Edit3, Eye, EyeOff } from "lucide-react";

interface UserProfile {
  id: string;
  nome: string;
  email: string;
  papel: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PerfilUsuario() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    nome: '',
    email: ''
  });

  // Password form states
  const [passwordData, setPasswordData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    atual: false,
    nova: false,
    confirmar: false
  });

  // Buscar dados do perfil
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.get('/auth/profile') as UserProfile;
        setProfile(response);
        setFormData({
          nome: response.nome,
          email: response.email
        });
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do perfil",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  // Atualizar dados do perfil
  const handleUpdateProfile = async () => {
    if (!formData.nome.trim() || !formData.email.trim()) {
      toast({
        title: "Erro",
        description: "Nome e email são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSaving(true);
      const response = await apiService.put('/auth/profile', {
        nome: formData.nome.trim(),
        email: formData.email.trim()
      }) as UserProfile;

      setProfile(response);
      setIsEditing(false);
      
      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!"
      });
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao atualizar perfil",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Alterar senha
  const handleChangePassword = async () => {
    if (!passwordData.senhaAtual || !passwordData.novaSenha || !passwordData.confirmarSenha) {
      toast({
        title: "Erro",
        description: "Todos os campos de senha são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.novaSenha !== passwordData.confirmarSenha) {
      toast({
        title: "Erro",
        description: "A nova senha e a confirmação não coincidem",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.novaSenha.length < 6) {
      toast({
        title: "Erro",
        description: "A nova senha deve ter pelo menos 6 caracteres",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSaving(true);
      await apiService.post('/auth/change-password', {
        currentPassword: passwordData.senhaAtual,
        newPassword: passwordData.novaSenha
      });

      setShowPasswordForm(false);
      setPasswordData({
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
      });
      
      toast({
        title: "Sucesso",
        description: "Senha alterada com sucesso!"
      });
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao alterar senha",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({
      nome: profile?.nome || '',
      email: profile?.email || ''
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return "default";
      case 'medico':
        return "secondary";
      case 'enfermeiro':
        return "outline";
      default:
        return "secondary";
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return "Administrador";
      case 'medico':
        return "Médico";
      case 'enfermeiro':
        return "Enfermeiro";
      default:
        return role;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Perfil do Usuário">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando perfil...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Perfil do Usuário" 
      subtitle="Gerencie suas informações pessoais e configurações de conta"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                Suas informações básicas de perfil
              </CardDescription>
            </div>
            <Button
              variant={isEditing ? "outline" : "default"}
              size="sm"
              onClick={() => isEditing ? cancelEdit() : setIsEditing(true)}
            >
              {isEditing ? (
                <>Cancelar</>
              ) : (
                <>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Editar
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                {isEditing ? (
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Digite seu nome completo"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{profile?.nome}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Digite seu email"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{profile?.email}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Função</Label>
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                  <Badge variant={getRoleBadgeVariant(profile?.papel || '')}>
                    {getRoleDisplayName(profile?.papel || '')}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                  <Badge variant={profile?.isActive ? "default" : "secondary"}>
                    {profile?.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleUpdateProfile} 
                  disabled={isSaving}
                  className="flex-1"
                >
                  {isSaving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={cancelEdit}
                  disabled={isSaving}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Segurança
            </CardTitle>
            <CardDescription>
              Gerencie sua senha e configurações de segurança
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!showPasswordForm ? (
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <h4 className="font-medium">Senha</h4>
                  <p className="text-sm text-muted-foreground">
                    Última alteração: {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString('pt-BR') : 'Não disponível'}
                  </p>
                </div>
                <Button onClick={() => setShowPasswordForm(true)}>
                  Alterar Senha
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="senhaAtual">Senha Atual</Label>
                  <div className="relative">
                    <Input
                      id="senhaAtual"
                      type={showPasswords.atual ? "text" : "password"}
                      value={passwordData.senhaAtual}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, senhaAtual: e.target.value }))}
                      placeholder="Digite sua senha atual"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPasswords(prev => ({ ...prev, atual: !prev.atual }))}
                    >
                      {showPasswords.atual ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="novaSenha">Nova Senha</Label>
                  <div className="relative">
                    <Input
                      id="novaSenha"
                      type={showPasswords.nova ? "text" : "password"}
                      value={passwordData.novaSenha}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, novaSenha: e.target.value }))}
                      placeholder="Digite a nova senha (mín. 6 caracteres)"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPasswords(prev => ({ ...prev, nova: !prev.nova }))}
                    >
                      {showPasswords.nova ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                  <div className="relative">
                    <Input
                      id="confirmarSenha"
                      type={showPasswords.confirmar ? "text" : "password"}
                      value={passwordData.confirmarSenha}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmarSenha: e.target.value }))}
                      placeholder="Confirme a nova senha"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirmar: !prev.confirmar }))}
                    >
                      {showPasswords.confirmar ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    onClick={handleChangePassword} 
                    disabled={isSaving}
                    className="flex-1"
                  >
                    {isSaving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {isSaving ? 'Salvando...' : 'Alterar Senha'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordData({
                        senhaAtual: '',
                        novaSenha: '',
                        confirmarSenha: ''
                      });
                    }}
                    disabled={isSaving}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informações da Conta */}
        <Card>
          <CardHeader>
            <CardTitle>Informações da Conta</CardTitle>
            <CardDescription>
              Detalhes técnicos da sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>ID da Conta</Label>
                <div className="p-2 bg-muted/50 rounded-md">
                  <code className="text-sm">{profile?.id}</code>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Conta Criada</Label>
                <div className="p-2 bg-muted/50 rounded-md">
                  <span className="text-sm">
                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleString('pt-BR') : 'Não disponível'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
