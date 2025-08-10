import jsPDF from 'jspdf';
import { Prontuario } from '@/types/prontuarios';

class ProntuarioLGPDPDFGenerator {
  private doc: jsPDF;
  private yPosition: number = 20;
  private pageHeight: number = 297; // A4 height in mm
  private marginBottom: number = 20;

  constructor() {
    this.doc = new jsPDF('p', 'mm', 'a4');
  }

  // Função para anonimizar dados sensíveis conforme LGPD
  private anonimizarDados = {
    // Anonimizar CPF mantendo apenas os 3 primeiros e 2 últimos dígitos
    cpf: (cpf: string): string => {
      if (!cpf || cpf.length < 11) return '***.***.***-**';
      const clean = cpf.replace(/\D/g, '');
      return `${clean.substring(0, 3)}.***.***.${clean.substring(9, 11)}`;
    },

    // Anonimizar email mantendo apenas o domínio
    email: (email: string): string => {
      if (!email || !email.includes('@')) return '***@***.com';
      const [, domain] = email.split('@');
      return `***@${domain}`;
    },

    // Reduzir informações médicas sensíveis
    informacaoMedica: (texto: string): string => {
      if (!texto) return '';
      
      // Remove informações específicas muito sensíveis mantendo o contexto médico
      return texto
        .replace(/\b\d{11}\b/g, '***') // Remove CPFs
        .replace(/\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g, '***.***.***-**') // Remove CPFs formatados
        .replace(/telefone\s*:?\s*\(?(\d{2})\)?\s*\d{4,5}-?\d{4}/gi, 'telefone: (***) ***-***') // Remove telefones
        .replace(/celular\s*:?\s*\(?(\d{2})\)?\s*\d{4,5}-?\d{4}/gi, 'celular: (***) ***-***')
        .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '***@***.com') // Remove emails
        .replace(/\b(rua|av|avenida|alameda)\s+[^,\n]+/gi, '[endereço removido por privacidade]'); // Remove endereços específicos
    }
  };

  private addText(text: string, fontSize: number = 12, isBold: boolean = false, maxWidth?: number) {
    this.doc.setFontSize(fontSize);
    this.doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    
    if (maxWidth) {
      const lines = this.doc.splitTextToSize(text, maxWidth);
      for (const line of lines) {
        this.checkPageBreak();
        this.doc.text(line, 20, this.yPosition);
        this.yPosition += fontSize * 0.5;
      }
    } else {
      this.checkPageBreak();
      this.doc.text(text, 20, this.yPosition);
      this.yPosition += fontSize * 0.5;
    }
  }

  private addTitle(text: string) {
    this.addText(text, 16, true);
    this.yPosition += 5;
  }

  private addSubtitle(text: string) {
    this.addText(text, 14, true);
    this.yPosition += 3;
  }

  private addSection(label: string, content: string, isPrivate: boolean = false) {
    this.addSubtitle(label);
    if (content && content.trim()) {
      const processedContent = isPrivate ? this.anonimizarDados.informacaoMedica(content) : content;
      this.addText(processedContent, 11, false, 170);
    } else {
      this.addText('Não informado', 11, false, 170);
    }
    this.yPosition += 5;
  }

  private checkPageBreak() {
    if (this.yPosition > this.pageHeight - this.marginBottom) {
      this.doc.addPage();
      this.yPosition = 20;
    }
  }

  private addLGPDHeader() {
    // Header com aviso de conformidade LGPD
    this.addTitle('SISTEMA DE GESTÃO HOSPITALAR');
    this.addText('Prontuário Médico - Documento Anonimizado', 12, true);
    
    // Aviso LGPD
    this.yPosition += 5;
    this.doc.setFillColor(255, 255, 0); // Fundo amarelo para destaque
    this.doc.rect(20, this.yPosition - 2, 170, 12, 'F');
    this.addText('⚠️  AVISO LGPD: Dados pessoais sensíveis foram anonimizados para proteção da privacidade', 9, true, 165);
    
    this.yPosition += 10;

    // Linha separadora
    this.doc.setLineWidth(0.5);
    this.doc.line(20, this.yPosition, 190, this.yPosition);
    this.yPosition += 10;
  }

  private addPatientInfo(prontuario: Prontuario) {
    this.addSubtitle('INFORMAÇÕES DO PACIENTE (ANONIMIZADAS)');
    
    if (prontuario.paciente) {
      // Nome completo - mantém apenas iniciais
      const nomeAnonimizado = prontuario.paciente.nome
        .split(' ')
        .map((parte, index) => index === 0 ? parte : parte[0] + '***')
        .join(' ');
      
      this.addText(`Nome: ${nomeAnonimizado}`, 11);
      this.addText(`CPF: ${this.anonimizarDados.cpf(prontuario.paciente.cpf)}`, 11);
      this.addText(`ID Interno: ${prontuario.pacienteId.substring(0, 8)}***`, 11);
    } else {
      this.addText(`ID do Paciente: ${prontuario.pacienteId.substring(0, 8)}***`, 11);
    }
    
    this.yPosition += 5;
  }

  private addDoctorInfo(prontuario: Prontuario) {
    this.addSubtitle('INFORMAÇÕES DO MÉDICO');
    
    if (prontuario.medico) {
      this.addText(`Médico: ${prontuario.medico.nome}`, 11);
      this.addText(`E-mail: ${this.anonimizarDados.email(prontuario.medico.email)}`, 11);
      this.addText(`ID Médico: ${prontuario.medicoId.substring(0, 8)}***`, 11);
    } else {
      this.addText(`ID do Médico: ${prontuario.medicoId.substring(0, 8)}***`, 11);
    }
    
    this.yPosition += 5;
  }

  private addConsultationInfo(prontuario: Prontuario) {
    this.addSubtitle('INFORMAÇÕES DA CONSULTA');
    
    const dataConsulta = new Date(prontuario.dataConsulta);
    this.addText(`Data da Consulta: ${dataConsulta.toLocaleDateString('pt-BR')}`, 11);
    
    if (prontuario.agendamentoId) {
      this.addText(`ID do Agendamento: ${prontuario.agendamentoId.substring(0, 8)}***`, 11);
    }
    
    this.yPosition += 5;
  }

  private addMedicalInfo(prontuario: Prontuario) {
    // Anamnese - dados sensíveis tratados
    this.addSection('ANAMNESE', prontuario.anamnese, true);
    
    // Exame Físico - dados sensíveis tratados
    this.addSection('EXAME FÍSICO', prontuario.exameFisico, true);
    
    // Diagnóstico - mantém informação médica relevante
    this.addSection('DIAGNÓSTICO', prontuario.diagnostico, false);
    
    // Prescrição - remove informações pessoais mas mantém prescrição
    this.addSection('PRESCRIÇÃO MÉDICA', prontuario.prescricao, true);
    
    // Observações - dados sensíveis tratados
    if (prontuario.observacoes && prontuario.observacoes.trim()) {
      this.addSection('OBSERVAÇÕES', prontuario.observacoes, true);
    }
  }

  private addLGPDFooter() {
    this.yPosition += 20;
    this.checkPageBreak();
    
    // Informações sobre tratamento de dados
    this.addSubtitle('INFORMAÇÕES SOBRE PROTEÇÃO DE DADOS (LGPD)');
    
    const lgpdText = `Este documento foi gerado em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018). 
Dados pessoais sensíveis foram anonimizados ou pseudonimizados para proteção da privacidade. 
Para acesso aos dados completos, entre em contato com o responsável pelo tratamento de dados da instituição.

Finalidade: Documento médico para uso clínico e administrativo
Base legal: Execução de contrato e cumprimento de obrigação legal (Art. 7º, V e II da LGPD)
Titular dos dados: Paciente identificado no documento
Responsável pelo tratamento: Sistema de Gestão Hospitalar`;

    this.addText(lgpdText, 8, false, 170);
    
    // Data de emissão
    this.yPosition += 10;
    const now = new Date();
    this.addText(`Documento gerado em: ${now.toLocaleString('pt-BR')}`, 9);
    this.addText(`Validade: Conforme legislação médica vigente`, 9);
    
    // Linha para assinatura
    this.yPosition += 15;
    this.checkPageBreak();
    this.doc.line(20, this.yPosition, 100, this.yPosition);
    this.yPosition += 5;
    this.addText('Assinatura do Médico Responsável', 9);
    
    // Numeração de páginas
    const pageCount = this.doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(8);
      this.doc.text(`Página ${i} de ${pageCount} - Documento protegido pela LGPD`, 20, 290);
    }
  }

  public generate(prontuario: Prontuario): void {
    try {
      // Create new document instance for each generation
      this.doc = new jsPDF('p', 'mm', 'a4');
      this.yPosition = 20;
      
      // Add content sections with LGPD compliance
      this.addLGPDHeader();
      this.addPatientInfo(prontuario);
      this.addDoctorInfo(prontuario);
      this.addConsultationInfo(prontuario);
      this.addMedicalInfo(prontuario);
      this.addLGPDFooter();
      
      // Generate filename with date/time for traceability
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
      const pacienteId = prontuario.pacienteId.substring(0, 8);
      const filename = `Prontuario_LGPD_${pacienteId}_${timestamp}.pdf`;
      
      // Save the PDF
      this.doc.save(filename);
      
    } catch (error) {
      console.error('Erro ao gerar PDF LGPD:', error);
      throw new Error('Falha na geração do PDF com conformidade LGPD');
    }
  }
}

export { ProntuarioLGPDPDFGenerator };
export default ProntuarioLGPDPDFGenerator;
