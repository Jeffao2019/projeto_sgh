# POLÍTICA DE SEGURANÇA - SGH

## 1. OBJETIVO
Esta política estabelece as diretrizes de segurança da informação para o Sistema de Gestão Hospitalar (SGH), garantindo a confidencialidade, integridade e disponibilidade dos dados de pacientes e informações médicas.

## 2. ESCOPO
Aplica-se a todos os usuários, sistemas, dados e processos relacionados ao SGH.

## 3. CLASSIFICAÇÃO DE DADOS

### 3.1 Dados Altamente Confidenciais
- Prontuários médicos completos
- Dados de saúde sensíveis
- Informações de diagnósticos
- Prescrições médicas

### 3.2 Dados Confidenciais
- Dados pessoais dos pacientes (CPF, RG, endereço)
- Informações de contato
- Dados de convênios médicos

### 3.3 Dados Internos
- Agendamentos
- Logs de sistema (anonimizados)
- Relatórios estatísticos

## 4. CONTROLES DE ACESSO

### 4.1 Autenticação
- Autenticação obrigatória via JWT
- Senhas com mínimo 8 caracteres
- Bloqueio após 5 tentativas falhadas
- Sessão expira em 8 horas

### 4.2 Autorização
- MÉDICO: Acesso total a pacientes e prontuários
- ENFERMEIRO: Acesso limitado a agendamentos e dados básicos
- ADMIN: Acesso administrativo e auditoria
- PACIENTE: Acesso apenas aos próprios dados

### 4.3 Controle de Sessão
- Token JWT com expiração automática
- Logout automático por inatividade
- Renovação de token segura

## 5. CRIPTOGRAFIA

### 5.1 Dados em Trânsito
- HTTPS obrigatório (TLS 1.3)
- Comunicação API sempre criptografada
- Certificados SSL válidos

### 5.2 Dados em Repouso
- Senhas hasheadas com bcrypt
- Dados sensíveis criptografados na base
- Backups criptografados

## 6. AUDITORIA E LOGS

### 6.1 Eventos Auditados
- Tentativas de login (sucesso e falha)
- Acesso a dados de pacientes
- Modificações em prontuários
- Criação/edição de usuários
- Exportação de dados

### 6.2 Retenção de Logs
- Logs de auditoria: 2 anos
- Logs de acesso: 6 meses
- Logs de erro: 1 ano

## 7. CONFORMIDADE LGPD

### 7.1 Bases Legais
- Tutela da saúde (Art. 7º, VII)
- Cumprimento de obrigação legal
- Execução de contrato

### 7.2 Direitos dos Titulares
- Confirmação de tratamento
- Acesso aos dados
- Correção de dados
- Anonimização/eliminação
- Portabilidade
- Revogação de consentimento

## 8. GESTÃO DE INCIDENTES

### 8.1 Classificação de Incidentes
- CRÍTICO: Vazamento de dados, invasão
- ALTO: Tentativa de acesso não autorizado
- MÉDIO: Falha de sistema, erro de configuração
- BAIXO: Tentativa de login falhada

### 8.2 Tempo de Resposta
- CRÍTICO: 1 hora
- ALTO: 4 horas
- MÉDIO: 24 horas
- BAIXO: 72 horas

## 9. MONITORAMENTO

### 9.1 Alertas Automáticos
- Múltiplas tentativas de login falhadas
- Acesso fora do horário
- Tentativas de acesso sem autenticação
- Acesso excessivo a dados

### 9.2 Relatórios
- Relatório diário de segurança
- Relatório semanal de auditoria
- Relatório mensal de conformidade LGPD

## 10. RESPONSABILIDADES

### 10.1 Administrador de Segurança
- Monitorar alertas de segurança
- Investigar incidentes
- Manter políticas atualizadas
- Treinar usuários

### 10.2 Desenvolvedores
- Implementar controles de segurança
- Revisar código para vulnerabilidades
- Aplicar correções de segurança
- Documentar mudanças

### 10.3 Usuários
- Proteger credenciais de acesso
- Reportar incidentes suspeitos
- Seguir política de senhas
- Fazer logout ao terminar

## 11. REVISÃO
Esta política deve ser revisada semestralmente ou após incidentes significativos.

Versão: 1.0
Data: 26/11/2025
Aprovado por: Administração SGH