import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Download, Eye, FileText, Plus, Search, User, UserCheck, Shield, Stethoscope } from "lucide-react";
import { apiService } from "@/lib/api-service";
import { toast } from "sonner";
import { Prontuario } from "@/types/prontuarios";
import ProntuarioPDFGenerator from "@/utils/pdf-generator";
import ProntuarioLGPDPDFGenerator from "@/utils/pdf-generator-lgpd";

export default function Prontuarios() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prontuarios, setProntuarios] = useState<Prontuario[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pacienteInfo, setPacienteInfo] = useState<{ nome: string; cpf: string } | null>(null);
  
  // DEBUG: Log dos parâmetros da URL
  console.log('🔍 [PRONTUARIOS DEBUG] URL atual:', window.location.href);
  console.log('🔍 [PRONTUARIOS DEBUG] searchParams:', searchParams.toString());
  console.log('🔍 [PRONTUARIOS DEBUG] location.search:', window.location.search);
  console.log('🔍 [PRONTUARIOS DEBUG] URLSearchParams full:', Object.fromEntries(searchParams.entries()));
  
  // Função para formatar data de forma intuitiva
  const formatarDataConsulta = (dataConsulta: string | Date) => {
    const data = new Date(dataConsulta);
    const dataFormatada = data.toLocaleDateString('pt-BR');
    const horaFormatada = data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${dataFormatada} às ${horaFormatada}`;
  };
  
  // Pegar o ID do paciente da query string se existir - VERSÃO ROBUSTA
  const getPacienteIdRobust = () => {
    // Método 1: searchParams.get
    let pacienteId = searchParams.get('paciente');
    
    // Método 2: Fallback - parsing manual da URL
    if (!pacienteId) {
      const urlString = window.location.search;
      const match = urlString.match(/[?&]paciente=([^&]*)/);
      if (match) {
        pacienteId = decodeURIComponent(match[1]);
      }
    }
    
    // Método 3: Fallback - sessionStorage
    if (!pacienteId) {
      pacienteId = sessionStorage.getItem('currentPacienteFilter');
    }
    
    // Salvar no sessionStorage para backup
    if (pacienteId) {
      sessionStorage.setItem('currentPacienteFilter', pacienteId);
    } else {
      sessionStorage.removeItem('currentPacienteFilter');
    }
    
    return pacienteId;
  };
  
  const pacienteId = getPacienteIdRobust();
  console.log('🔍 [PRONTUARIOS DEBUG] pacienteId extraído:', pacienteId);
  console.log('🔍 [PRONTUARIOS DEBUG] Parâmetros disponíveis:', [...searchParams.keys()]);
  console.log('🔍 [PRONTUARIOS DEBUG] SessionStorage backup:', sessionStorage.getItem('currentPacienteFilter'));

  // Função para navegação robusta com preservação do filtro
  const navigateWithFilter = (path: string) => {
    const returnUrl = pacienteId ? `/prontuarios?paciente=${pacienteId}` : '/prontuarios';
    
    // Se há um termo de busca ativo mas não um pacienteId, preservar a busca
    let finalReturnUrl = returnUrl;
    if (!pacienteId && searchTerm.trim()) {
      finalReturnUrl = `/prontuarios?search=${encodeURIComponent(searchTerm.trim())}`;
    }
    
    const encodedReturnUrl = encodeURIComponent(finalReturnUrl);
    const finalUrl = `${path}?return=${encodedReturnUrl}`;
    
    console.log('🔧 [NAVEGAÇÃO ROBUSTA]', {
      pacienteId,
      searchTerm,
      returnUrl: finalReturnUrl,
      encodedReturnUrl,
      finalUrl
    });
    
    // Salvar no sessionStorage antes da navegação
    if (pacienteId) {
      sessionStorage.setItem('preNavigationFilter', pacienteId);
      sessionStorage.setItem('originalReturnUrl', finalReturnUrl);
    } else if (searchTerm.trim()) {
      sessionStorage.setItem('preNavigationSearch', searchTerm.trim());
      sessionStorage.setItem('originalReturnUrl', finalReturnUrl);
    }
    
    navigate(finalUrl);
  };

  useEffect(() => {
    console.log('🔄 [PRONTUARIOS DEBUG] useEffect disparado - pacienteId:', pacienteId);
    loadProntuarios();
    if (pacienteId) {
      loadPacienteInfo(pacienteId);
    } else {
      setPacienteInfo(null);
    }
  }, [pacienteId]); // Recarregar quando o pacienteId mudar

  // Novo useEffect para sincronizar o parâmetro search da URL com o estado searchTerm
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchFromUrl = searchParams.get('search');
    
    console.log('🔍 [SEARCH SYNC DEBUG] Sincronizando search da URL com estado');
    console.log('🔍 [SEARCH SYNC DEBUG] searchFromUrl:', searchFromUrl);
    console.log('🔍 [SEARCH SYNC DEBUG] searchTerm atual:', searchTerm);
    
    if (searchFromUrl && searchFromUrl !== searchTerm) {
      console.log('🔍 [SEARCH SYNC DEBUG] Aplicando searchTerm da URL:', searchFromUrl);
      setSearchTerm(searchFromUrl);
    } else if (!searchFromUrl && searchTerm) {
      console.log('🔍 [SEARCH SYNC DEBUG] Limpando searchTerm (sem parâmetro na URL)');
      setSearchTerm('');
    }
  }, [location.search]); // Executar quando a URL mudar

  const loadPacienteInfo = async (id: string) => {
    try {
      const paciente = await apiService.getPacienteById(id);
      setPacienteInfo({
        nome: paciente.nome,
        cpf: paciente.cpf
      });
    } catch (error) {
      console.error("Erro ao carregar informações do paciente:", error);
      setPacienteInfo(null);
    }
  };

  const loadProntuarios = async () => {
    setIsLoading(true);
    try {
      console.log('🔍 [LOAD PRONTUARIOS DEBUG] Iniciando carregamento...');
      console.log('🔍 [LOAD PRONTUARIOS DEBUG] Verificando autenticação...');
      console.log('🔍 [LOAD PRONTUARIOS DEBUG] pacienteId:', pacienteId);
      
      let data;
      if (pacienteId) {
        // Se há um paciente específico, buscar prontuários desse paciente
        console.log('🔍 [LOAD PRONTUARIOS DEBUG] Buscando por paciente:', pacienteId);
        data = await apiService.getProntuariosByPaciente(pacienteId);
      } else {
        // Caso contrário, buscar todos os prontuários
        console.log('🔍 [LOAD PRONTUARIOS DEBUG] Buscando todos os prontuários...');
        data = await apiService.getProntuarios();
      }
      
      console.log('🔍 [LOAD PRONTUARIOS DEBUG] Prontuários carregados:', data.length);
      setProntuarios(data);
    } catch (error: any) {
      console.error('🔍 [LOAD PRONTUARIOS DEBUG] Erro ao carregar:', error);
      console.error('🔍 [LOAD PRONTUARIOS DEBUG] Status:', error.response?.status);
      console.error('🔍 [LOAD PRONTUARIOS DEBUG] Message:', error.message);
      toast.error("Erro ao carregar prontuários");
    } finally {
      setIsLoading(false);
    }
  };

const handleGeneratePDF = async (prontuario) => {
  console.log("🔵 [PDF COMPLETO] Gerando PDF com TODAS as informações do prontuário...");
  console.log("📋 [PDF COMPLETO] Dados completos:", prontuario);
  
  try {
    toast.info("Gerando PDF completo com todas as informações...");
    
    const jsPDF = (await import('jspdf')).default;
    const doc = new jsPDF();
    let yPosition = 20;
    
    // CABEÇALHO
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('PRONTUÁRIO MÉDICO COMPLETO', 20, yPosition);
    yPosition += 15;
    
    // Linha separadora
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 15;
    
    // ===== DADOS DO PACIENTE =====
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('DADOS DO PACIENTE', 20, yPosition);
    yPosition += 12;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nome: ${prontuario.paciente?.nome || 'Não informado'}`, 20, yPosition); yPosition += 7;
    doc.text(`CPF: ${prontuario.paciente?.cpf || 'Não informado'}`, 20, yPosition); yPosition += 7;
    doc.text(`Email: ${prontuario.paciente?.email || 'Não informado'}`, 20, yPosition); yPosition += 7;
    doc.text(`Telefone: ${prontuario.paciente?.telefone || 'Não informado'}`, 20, yPosition); yPosition += 7;
    doc.text(`Data de Nascimento: ${prontuario.paciente?.dataNascimento ? new Date(prontuario.paciente.dataNascimento).toLocaleDateString('pt-BR') : 'Não informado'}`, 20, yPosition); yPosition += 7;
    
    // Endereço completo
    if (prontuario.paciente?.endereco) {
      const endereco = prontuario.paciente.endereco;
      const enderecoCompleto = `${endereco.logradouro || ''}, ${endereco.numero || ''} ${endereco.complemento ? '- ' + endereco.complemento : ''} - ${endereco.bairro || ''}, ${endereco.cidade || ''} - ${endereco.estado || ''} - CEP: ${endereco.cep || ''}`;
      doc.text(`Endereço: ${enderecoCompleto}`, 20, yPosition);
    } else {
      doc.text(`Endereço: Não informado`, 20, yPosition);
    }
    yPosition += 7;
    
    doc.text(`Convênio: ${prontuario.paciente?.convenio || 'Particular'}`, 20, yPosition); yPosition += 7;
    doc.text(`Número do Convênio: ${prontuario.paciente?.numeroConvenio || 'Não aplicável'}`, 20, yPosition); yPosition += 15;
    
    // ===== DADOS DO MÉDICO =====
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('DADOS DO MÉDICO', 20, yPosition);
    yPosition += 12;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nome: Dr(a). ${prontuario.medico?.nome || 'Não informado'}`, 20, yPosition); yPosition += 7;
    doc.text(`CRM: ${prontuario.medico?.crm || 'Não informado'}`, 20, yPosition); yPosition += 7;
    doc.text(`Especialidade: ${prontuario.medico?.especialidade || 'Não informado'}`, 20, yPosition); yPosition += 7;
    doc.text(`Email: ${prontuario.medico?.email || 'Não informado'}`, 20, yPosition); yPosition += 7;
    doc.text(`Telefone: ${prontuario.medico?.telefone || 'Não informado'}`, 20, yPosition); yPosition += 15;
    
    // ===== DADOS DA CONSULTA =====
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('DADOS DA CONSULTA', 20, yPosition);
    yPosition += 12;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Data/Hora da Consulta: ${formatarDataConsulta(prontuario.dataConsulta)}`, 20, yPosition); yPosition += 7;
    doc.text(`Status: ${getStatusFromDate(prontuario.dataConsulta)}`, 20, yPosition); yPosition += 7;
    doc.text(`ID do Prontuário: ${prontuario.id}`, 20, yPosition); yPosition += 7;
    doc.text(`Criado em: ${new Date(prontuario.createdAt).toLocaleString('pt-BR')}`, 20, yPosition); yPosition += 7;
    doc.text(`Última atualização: ${new Date(prontuario.updatedAt).toLocaleString('pt-BR')}`, 20, yPosition); yPosition += 15;
    
    // Verificar se precisa de nova página
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    // ===== DADOS CLÍNICOS COMPLETOS =====
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('DADOS CLÍNICOS COMPLETOS', 20, yPosition);
    yPosition += 12;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    // Anamnese
    if (prontuario.anamnese) {
      doc.setFont('helvetica', 'bold');
      doc.text('ANAMNESE:', 20, yPosition); yPosition += 7;
      doc.setFont('helvetica', 'normal');
      const anamneseLines = doc.splitTextToSize(prontuario.anamnese, 170);
      doc.text(anamneseLines, 20, yPosition);
      yPosition += anamneseLines.length * 7 + 10;
    }
    
    // Exame Físico
    if (prontuario.exameFisico) {
      if (yPosition > 250) { doc.addPage(); yPosition = 20; }
      doc.setFont('helvetica', 'bold');
      doc.text('EXAME FÍSICO:', 20, yPosition); yPosition += 7;
      doc.setFont('helvetica', 'normal');
      const exameLines = doc.splitTextToSize(prontuario.exameFisico, 170);
      doc.text(exameLines, 20, yPosition);
      yPosition += exameLines.length * 7 + 10;
    }
    
    // Diagnóstico
    if (yPosition > 250) { doc.addPage(); yPosition = 20; }
    doc.setFont('helvetica', 'bold');
    doc.text('DIAGNÓSTICO:', 20, yPosition); yPosition += 7;
    doc.setFont('helvetica', 'normal');
    const diagnosticoLines = doc.splitTextToSize(prontuario.diagnostico || 'Não informado', 170);
    doc.text(diagnosticoLines, 20, yPosition);
    yPosition += diagnosticoLines.length * 7 + 10;
    
    // Prescrição
    if (prontuario.prescricao) {
      if (yPosition > 250) { doc.addPage(); yPosition = 20; }
      doc.setFont('helvetica', 'bold');
      doc.text('PRESCRIÇÃO MÉDICA:', 20, yPosition); yPosition += 7;
      doc.setFont('helvetica', 'normal');
      const prescricaoLines = doc.splitTextToSize(prontuario.prescricao, 170);
      doc.text(prescricaoLines, 20, yPosition);
      yPosition += prescricaoLines.length * 7 + 10;
    }
    
    // Observações
    if (prontuario.observacoes) {
      if (yPosition > 250) { doc.addPage(); yPosition = 20; }
      doc.setFont('helvetica', 'bold');
      doc.text('OBSERVAÇÕES:', 20, yPosition); yPosition += 7;
      doc.setFont('helvetica', 'normal');
      const observacoesLines = doc.splitTextToSize(prontuario.observacoes, 170);
      doc.text(observacoesLines, 20, yPosition);
      yPosition += observacoesLines.length * 7 + 10;
    }
    
    // Rodapé em todas as páginas
    const currentPage = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= currentPage; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Documento gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, 285);
      doc.text(`Página ${i} de ${currentPage}`, 160, 285);
    }
    
    const nomeArquivo = `prontuario_completo_${prontuario.paciente?.nome?.replace(/\s+/g, '_') || 'paciente'}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(nomeArquivo);
    
    console.log("🎉 [PDF COMPLETO] PDF completo gerado com TODAS as informações!");
    toast.success("✅ PDF completo gerado com todas as informações do prontuário!");
    
  } catch (error) {
    console.error("❌ [PDF COMPLETO] Erro:", error);
    toast.error(`Erro: ${error.message}`);
  }
};

const handleGenerateLGPDPDF = async (prontuario) => {
  console.log("🔒 [LGPD COMPLETO] Gerando PDF LGPD com TODAS as informações anonimizadas...");
  console.log("📋 [LGPD COMPLETO] Dados completos:", prontuario);
  
  try {
    toast.info("Gerando PDF LGPD completo com todas as informações anonimizadas...");
    
    const jsPDF = (await import('jspdf')).default;
    const doc = new jsPDF();
    let yPosition = 20;
    
    // Funções de anonimização LGPD
    const anonimizarCPF = (cpf) => cpf ? `${cpf.substring(0, 3)}.XXX.XXX-${cpf.slice(-2)}` : 'XXX.XXX.XXX-XX';
    const anonimizarEmail = (email) => email ? `***@${email.split('@')[1] || 'domain.com'}` : '***@domain.com';
    const anonimizarTelefone = (tel) => tel ? `(XX) XXXX-${tel.slice(-4)}` : '(XX) XXXX-XXXX';
    const anonimizarEndereco = (endereco) => {
      if (!endereco) return 'Endereço restrito (LGPD)';
      return `${endereco.logradouro?.substring(0, 10) || 'XXX'}..., XXX - ${endereco.bairro?.substring(0, 8) || 'XXX'}..., ${endereco.cidade || 'XXX'} - ${endereco.estado || 'XX'}`;
    };
    
    // CABEÇALHO LGPD
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('PRONTUÁRIO MÉDICO - LGPD', 20, yPosition);
    yPosition += 12;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('DOCUMENTO ANONIMIZADO CONFORME LEI GERAL DE PROTEÇÃO DE DADOS', 20, yPosition);
    yPosition += 15;
    
    // Linha separadora
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 15;
    
    // ===== DADOS DO PACIENTE (ANONIMIZADOS) =====
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('DADOS DO PACIENTE (ANONIMIZADOS)', 20, yPosition);
    yPosition += 12;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nome: ${prontuario.paciente?.nome || 'Não informado'}`, 20, yPosition); yPosition += 7;
    doc.text(`CPF: ${anonimizarCPF(prontuario.paciente?.cpf)}`, 20, yPosition); yPosition += 7;
    doc.text(`Email: ${anonimizarEmail(prontuario.paciente?.email)}`, 20, yPosition); yPosition += 7;
    doc.text(`Telefone: ${anonimizarTelefone(prontuario.paciente?.telefone)}`, 20, yPosition); yPosition += 7;
    doc.text(`Data de Nascimento: ${prontuario.paciente?.dataNascimento ? 'XX/XX/XXXX (Restrito pela LGPD)' : 'Não informado'}`, 20, yPosition); yPosition += 7;
    doc.text(`Endereço: ${anonimizarEndereco(prontuario.paciente?.endereco)}`, 20, yPosition); yPosition += 7;
    doc.text(`Convênio: ${prontuario.paciente?.convenio || 'Particular'}`, 20, yPosition); yPosition += 7;
    doc.text(`Número do Convênio: ${prontuario.paciente?.numeroConvenio ? 'XXXX...XXXX (Restrito)' : 'Não aplicável'}`, 20, yPosition); yPosition += 15;
    
    // ===== DADOS DO MÉDICO =====
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('DADOS DO MÉDICO', 20, yPosition);
    yPosition += 12;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nome: Dr(a). ${prontuario.medico?.nome || 'Não informado'}`, 20, yPosition); yPosition += 7;
    doc.text(`CRM: ${prontuario.medico?.crm || 'Não informado'}`, 20, yPosition); yPosition += 7;
    doc.text(`Especialidade: ${prontuario.medico?.especialidade || 'Não informado'}`, 20, yPosition); yPosition += 7;
    doc.text(`Email: ${anonimizarEmail(prontuario.medico?.email)}`, 20, yPosition); yPosition += 7;
    doc.text(`Telefone: ${anonimizarTelefone(prontuario.medico?.telefone)}`, 20, yPosition); yPosition += 15;
    
    // ===== DADOS DA CONSULTA =====
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('DADOS DA CONSULTA', 20, yPosition);
    yPosition += 12;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Data/Hora da Consulta: ${formatarDataConsulta(prontuario.dataConsulta)}`, 20, yPosition); yPosition += 7;
    doc.text(`Status: ${getStatusFromDate(prontuario.dataConsulta)}`, 20, yPosition); yPosition += 7;
    doc.text(`ID do Prontuário: ${prontuario.id}`, 20, yPosition); yPosition += 7;
    doc.text(`Criado em: ${new Date(prontuario.createdAt).toLocaleString('pt-BR')}`, 20, yPosition); yPosition += 7;
    doc.text(`Última atualização: ${new Date(prontuario.updatedAt).toLocaleString('pt-BR')}`, 20, yPosition); yPosition += 15;
    
    // Verificar se precisa de nova página
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }
    
    // ===== DADOS CLÍNICOS COMPLETOS =====
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('DADOS CLÍNICOS COMPLETOS', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text('(Dados clínicos mantidos na íntegra pois são essenciais para continuidade do tratamento)', 20, yPosition);
    yPosition += 12;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    // Anamnese
    if (prontuario.anamnese) {
      if (yPosition > 240) { doc.addPage(); yPosition = 20; }
      doc.setFont('helvetica', 'bold');
      doc.text('ANAMNESE:', 20, yPosition); yPosition += 7;
      doc.setFont('helvetica', 'normal');
      const anamneseLines = doc.splitTextToSize(prontuario.anamnese, 170);
      doc.text(anamneseLines, 20, yPosition);
      yPosition += anamneseLines.length * 7 + 10;
    }
    
    // Exame Físico
    if (prontuario.exameFisico) {
      if (yPosition > 240) { doc.addPage(); yPosition = 20; }
      doc.setFont('helvetica', 'bold');
      doc.text('EXAME FÍSICO:', 20, yPosition); yPosition += 7;
      doc.setFont('helvetica', 'normal');
      const exameLines = doc.splitTextToSize(prontuario.exameFisico, 170);
      doc.text(exameLines, 20, yPosition);
      yPosition += exameLines.length * 7 + 10;
    }
    
    // Diagnóstico
    if (yPosition > 240) { doc.addPage(); yPosition = 20; }
    doc.setFont('helvetica', 'bold');
    doc.text('DIAGNÓSTICO:', 20, yPosition); yPosition += 7;
    doc.setFont('helvetica', 'normal');
    const diagnosticoLines = doc.splitTextToSize(prontuario.diagnostico || 'Não informado', 170);
    doc.text(diagnosticoLines, 20, yPosition);
    yPosition += diagnosticoLines.length * 7 + 10;
    
    // Prescrição
    if (prontuario.prescricao) {
      if (yPosition > 240) { doc.addPage(); yPosition = 20; }
      doc.setFont('helvetica', 'bold');
      doc.text('PRESCRIÇÃO MÉDICA:', 20, yPosition); yPosition += 7;
      doc.setFont('helvetica', 'normal');
      const prescricaoLines = doc.splitTextToSize(prontuario.prescricao, 170);
      doc.text(prescricaoLines, 20, yPosition);
      yPosition += prescricaoLines.length * 7 + 10;
    }
    
    // Observações
    if (prontuario.observacoes) {
      if (yPosition > 240) { doc.addPage(); yPosition = 20; }
      doc.setFont('helvetica', 'bold');
      doc.text('OBSERVAÇÕES:', 20, yPosition); yPosition += 7;
      doc.setFont('helvetica', 'normal');
      const observacoesLines = doc.splitTextToSize(prontuario.observacoes, 170);
      doc.text(observacoesLines, 20, yPosition);
      yPosition += observacoesLines.length * 7 + 10;
    }
    
    // Rodapé LGPD em todas as páginas
    const currentPage = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= currentPage; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Documento LGPD gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, 275);
      doc.text(`Este documento foi anonimizado conforme a Lei Geral de Proteção de Dados (LGPD)`, 20, 280);
      doc.text(`Página ${i} de ${currentPage}`, 160, 280);
    }
    
    const nomeArquivo = `prontuario_lgpd_completo_${prontuario.paciente?.nome?.replace(/\s+/g, '_') || 'paciente'}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(nomeArquivo);
    
    console.log("🎉 [LGPD COMPLETO] PDF LGPD completo gerado com TODAS as informações anonimizadas!");
    toast.success("✅ PDF LGPD completo gerado com todas as informações anonimizadas conforme LGPD!");
    
  } catch (error) {
    console.error("❌ [LGPD COMPLETO] Erro:", error);
    toast.error(`Erro LGPD: ${error.message}`);
  }
};

const handleGenerateReceitaDigital = async (prontuario) => {
  console.log("💊 [RECEITA DIGITAL] Gerando receita digital para profissional de saúde...");
  console.log("📋 [RECEITA DIGITAL] Dados do prontuário:", prontuario);
  
  try {
    // Verificar se existe pelo menos uma prescrição (uso interno ou externo)
    const temPrescricaoUsoInterno = prontuario.prescricaoUsoInterno && prontuario.prescricaoUsoInterno.trim() !== '';
    const temPrescricaoUsoExterno = prontuario.prescricaoUsoExterno && prontuario.prescricaoUsoExterno.trim() !== '';
    
    if (!temPrescricaoUsoInterno && !temPrescricaoUsoExterno) {
      toast.error("❌ Este prontuário não possui prescrições para gerar receita digital.");
      return;
    }
    
    toast.info("Gerando receita digital conforme normas LGPD...");
    
    const jsPDF = (await import('jspdf')).default;
    const doc = new jsPDF();
    let yPosition = 20;
    
    // CABEÇALHO DA RECEITA
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('RECEITA MÉDICA DIGITAL', 20, yPosition);
    
    // Data e hora da impressão no cabeçalho
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Impresso em: ${new Date().toLocaleString('pt-BR')}`, 120, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Documento gerado conforme Lei Geral de Proteção de Dados (LGPD)', 20, yPosition);
    yPosition += 15;
    
    // Linha separadora
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 15;
    
    // ===== DADOS DO MÉDICO (COMPLETOS) =====
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DADOS DO MÉDICO PRESCRITOR', 20, yPosition);
    yPosition += 12;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nome: Dr(a). ${prontuario.medico?.nome || 'Não informado'}`, 20, yPosition); yPosition += 7;
    doc.text(`CRM: ${prontuario.medico?.crm || 'Não informado'}`, 20, yPosition); yPosition += 7;
    doc.text(`Especialidade: ${prontuario.medico?.especialidade || 'Não informado'}`, 20, yPosition); yPosition += 7;
    doc.text(`Data da Consulta: ${formatarDataConsulta(prontuario.dataConsulta)}`, 20, yPosition); yPosition += 15;
    
    // ===== DADOS BÁSICOS DO PACIENTE (LGPD) =====
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DADOS DO PACIENTE', 20, yPosition);
    yPosition += 12;
    
    // Funções de anonimização específicas para receita
    const anonimizarCPFReceita = (cpf) => cpf ? `${cpf.substring(0, 3)}.XXX.XXX-${cpf.slice(-2)}` : 'XXX.XXX.XXX-XX';
    const calcularIdade = (dataNascimento) => {
      if (!dataNascimento) return 'Não informado';
      const nascimento = new Date(dataNascimento);
      const hoje = new Date();
      const idade = hoje.getFullYear() - nascimento.getFullYear();
      const m = hoje.getMonth() - nascimento.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
        return idade - 1;
      }
      return idade;
    };
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nome: ${prontuario.paciente?.nome || 'Não informado'}`, 20, yPosition); yPosition += 7;
    doc.text(`CPF: ${anonimizarCPFReceita(prontuario.paciente?.cpf)}`, 20, yPosition); yPosition += 15;
    
    // ===== PRESCRIÇÃO MÉDICA =====
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PRESCRIÇÃO MÉDICA', 20, yPosition);
    yPosition += 12;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    // Prescrições de Uso Interno
    if (prontuario.prescricaoUsoInterno && prontuario.prescricaoUsoInterno.trim() !== '') {
      doc.setFont('helvetica', 'bold');
      doc.text('MEDICAMENTOS DE USO INTERNO:', 20, yPosition);
      yPosition += 8;
      
      doc.setFont('helvetica', 'normal');
      const usoInternoLines = doc.splitTextToSize(prontuario.prescricaoUsoInterno, 170);
      doc.text(usoInternoLines, 20, yPosition);
      yPosition += usoInternoLines.length * 7 + 10;
    }
    
    // Prescrições de Uso Externo
    if (prontuario.prescricaoUsoExterno && prontuario.prescricaoUsoExterno.trim() !== '') {
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.text('MEDICAMENTOS DE USO EXTERNO:', 20, yPosition);
      yPosition += 8;
      
      doc.setFont('helvetica', 'normal');
      const usoExternoLines = doc.splitTextToSize(prontuario.prescricaoUsoExterno, 170);
      doc.text(usoExternoLines, 20, yPosition);
      yPosition += usoExternoLines.length * 7 + 10;
    }
    
    yPosition += 10;
    
    // ===== OBSERVAÇÕES MÉDICAS =====
    if (prontuario.observacoes && prontuario.observacoes.trim() !== '') {
      // Verificar se precisa de nova página
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('OBSERVAÇÕES MÉDICAS', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const observacoesLines = doc.splitTextToSize(prontuario.observacoes, 170);
      doc.text(observacoesLines, 20, yPosition);
      yPosition += observacoesLines.length * 6 + 15;
    }
    
    // Verificar se precisa de nova página
    if (yPosition > 230) {
      doc.addPage();
      yPosition = 20;
    }
    
    // ===== ORIENTAÇÕES DE SEGURANÇA =====
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('ORIENTAÇÕES DE SEGURANÇA', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('• Todo medicamento deve ser mantido fora do alcance de crianças', 20, yPosition); yPosition += 5;
    doc.text('• Conservar medicamentos em local seco, arejado e protegido da luz', 20, yPosition); yPosition += 5;
    doc.text('• Verificar sempre o prazo de validade antes do uso', 20, yPosition); yPosition += 5;
    doc.text('• Seguir rigorosamente a posologia prescrita pelo médico', 20, yPosition); yPosition += 5;
    doc.text('• Em caso de efeitos adversos, suspender o uso e procurar orientação médica', 20, yPosition); yPosition += 5;
    doc.text('• Não compartilhar medicamentos com outras pessoas', 20, yPosition); yPosition += 5;
    doc.text('• Descartar medicamentos vencidos conforme orientação farmacêutica', 20, yPosition); yPosition += 15;
    
    // Verificar se precisa de nova página
    if (yPosition > 230) {
      doc.addPage();
      yPosition = 20;
    }
    
    // ===== RODAPÉ DE IDENTIFICAÇÃO =====
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(`Receita digital gerada em: ${new Date().toLocaleString('pt-BR')}`, 20, yPosition); yPosition += 5;
    doc.text(`ID do Prontuário: ${prontuario.id}`, 20, yPosition); yPosition += 5;
    doc.text(`Sistema: SGH - Sistema de Gestão Hospitalar`, 20, yPosition); yPosition += 15;
    
    // Linha de assinatura digital
    doc.setLineWidth(0.3);
    doc.line(120, yPosition, 190, yPosition);
    yPosition += 5;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Dr(a). ${prontuario.medico?.nome || 'Nome do Médico'}`, 120, yPosition); yPosition += 4;
    doc.text(`CRM: ${prontuario.medico?.crm || 'CRM'}`, 120, yPosition);
    
    // Rodapé LGPD fixo na parte inferior da página
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'italic');
      doc.text('Dados pessoais tratados conforme LGPD - Lei 13.709/2018', 20, 280);
      doc.text('Receita digital válida conforme CFM Resolução 2.299/2021', 120, 280);
      
      // Numeração de páginas
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Página ${i}/${totalPages}`, 160, 285);
    }
    
    const nomeArquivo = `receita_digital_${prontuario.paciente?.nome?.replace(/\s+/g, '_') || 'paciente'}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(nomeArquivo);
    
    console.log("🎉 [RECEITA DIGITAL] Receita digital gerada com sucesso!");
    toast.success("✅ Receita digital gerada com sucesso conforme normas LGPD!");
    
  } catch (error) {
    console.error("❌ [RECEITA DIGITAL] Erro:", error);
    toast.error(`Erro ao gerar receita: ${error.message}`);
  }
};

  
  

  const getStatusFromDate = (dataConsulta: string): string => {
    const hoje = new Date();
    const dataConsultaDate = new Date(dataConsulta);
    
    if (dataConsultaDate > hoje) {
      return "agendado";
    } else if (dataConsultaDate.toDateString() === hoje.toDateString()) {
      return "em_andamento";
    } else {
      return "concluido";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluido":
        return "text-green-700 bg-green-100";
      case "agendado":
        return "text-blue-700 bg-blue-100";
      case "em_andamento":
        return "text-orange-700 bg-orange-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "concluido":
        return "Concluído";
      case "agendado":
        return "Agendado";
      case "em_andamento":
        return "Em Andamento";
      default:
        return "Desconhecido";
    }
  };

  const filteredProntuarios = prontuarios
    .map((prontuario) => ({
      ...prontuario,
      status: getStatusFromDate(prontuario.dataConsulta)
    }))
    .filter((prontuario) => {
      // Filtro de busca geral (searchTerm) - busca em paciente e médico
      const matchesSearch = !searchTerm || 
        (prontuario.paciente?.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (prontuario.medico?.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
        prontuario.diagnostico.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro de status
      const matchesStatus = !statusFilter || prontuario.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

  // Calcular estatísticas
  const stats = {
    total: prontuarios.length,
    concluidos: prontuarios.filter(p => getStatusFromDate(p.dataConsulta) === "concluido").length,
    agendados: prontuarios.filter(p => getStatusFromDate(p.dataConsulta) === "agendado").length,
    emAndamento: prontuarios.filter(p => getStatusFromDate(p.dataConsulta) === "em_andamento").length,
  };

  return (
    <DashboardLayout
      title={pacienteId ? "Prontuários do Paciente" : "Prontuários"}
      subtitle={pacienteId ? "Histórico médico específico do paciente" : "Histórico médico e documentos dos pacientes"}
    >
      {/* Banner informativo quando filtrado por paciente */}
      {pacienteId && (
        <Card className="mb-6 p-4 border-l-4 border-l-blue-500 bg-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <User className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900">
                  {pacienteInfo ? pacienteInfo.nome : "Carregando..."}
                </h3>
                <p className="text-sm text-blue-700">
                  {pacienteInfo ? `CPF: ${pacienteInfo.cpf}` : "Prontuários específicos do paciente"}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/prontuarios")}
              >
                Todos os Prontuários
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => navigate("/pacientes")}
              >
                ← Voltar para Pacientes
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Botão de ação */}
      <div className="flex justify-end mb-8">
        <Button variant="medical" onClick={() => {
          console.log('🔍 [NOVO PRONTUARIO DEBUG] pacienteId:', pacienteId);
          navigateWithFilter('/prontuarios/novo');
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Prontuário
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 bg-card shadow-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-card shadow-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.concluidos}</p>
              <p className="text-sm text-muted-foreground">Concluídos</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card shadow-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.agendados}</p>
              <p className="text-sm text-muted-foreground">Agendados</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card shadow-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.emAndamento}</p>
              <p className="text-sm text-muted-foreground">Em Andamento</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Busca e filtros */}
      <Card className="p-6 mb-6 bg-card shadow-card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              ref={searchInputRef}
              placeholder="Buscar por paciente, médico ou diagnóstico..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value === "TODOS" ? "" : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODOS">Todos os status</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="agendado">Agendado</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(searchTerm || statusFilter) && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("");
              }}
            >
              Limpar
            </Button>
          )}
          <Button variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </Card>

      {/* Lista de prontuários */}
      <Card className="bg-card shadow-card">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Lista de Prontuários
          </h2>
          <div className="space-y-4">
            {isLoading ? (
              <p>Carregando...</p>
            ) : filteredProntuarios.length === 0 ? (
              <div className="text-center py-8">
                {searchTerm || statusFilter ? (
                  <div>
                    <p className="text-muted-foreground mb-2">
                      Nenhum prontuário encontrado com os filtros aplicados
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("");
                      }}
                    >
                      Limpar filtros
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhum prontuário cadastrado</p>
                )}
              </div>
            ) : (
              filteredProntuarios.map((prontuario) => (
                <div
                  key={prontuario.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-foreground">
                        {prontuario.paciente?.nome || "Paciente não identificado"}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prontuario.status)}`}>
                        {getStatusLabel(prontuario.status)}
                      </span>
                    </div>
                    
                    {/* Linha com médico e data */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>Dr(a). {prontuario.medico?.nome || "Médico não identificado"}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatarDataConsulta(prontuario.dataConsulta)}</span>
                      </div>
                    </div>
                    
                    {/* Linha separada para o diagnóstico */}
                    <div className="flex items-start space-x-1 text-sm text-muted-foreground">
                      <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span className="break-words">{prontuario.diagnostico}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3 lg:mt-0">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        console.log('🔍 [VER PRONTUARIO DEBUG] pacienteId:', pacienteId);
                        console.log('🔍 [VER PRONTUARIO DEBUG] Histórico antes da navegação:', window.history.length);
                        navigateWithFilter(`/prontuarios/${prontuario.id}`);
                        console.log('🔍 [VER PRONTUARIO DEBUG] Navegação executada');
                      }}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Ver
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        console.log('🔍 [EDITAR PRONTUARIO DEBUG] pacienteId:', pacienteId);
                        navigateWithFilter(`/prontuarios/${prontuario.id}/editar`);
                      }}
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleGenerateReceitaDigital(prontuario)}
                      title="Gerar receita digital para profissional de saúde (LGPD)"
                      className="text-green-600 hover:text-green-700 border-green-300 hover:border-green-400"
                    >
                      <Stethoscope className="w-3 h-3 mr-1" />
                      Receita
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleGeneratePDF(prontuario)}
                      title="Exportar PDF completo"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      PDF
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleGenerateLGPDPDF(prontuario)}
                      title="Exportar PDF com dados anonimizados (LGPD)"
                      className="text-purple-600 hover:text-purple-700 border-purple-300 hover:border-purple-400"
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      LGPD
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
}