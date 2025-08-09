import jsPDF from 'jspdf';
import { Prontuario } from '@/types/prontuarios';

export class ProntuarioPDFGenerator {
  private doc: jsPDF;
  private yPosition: number = 20;
  private pageHeight: number = 297; // A4 height in mm
  private marginBottom: number = 20;

  constructor() {
    this.doc = new jsPDF('p', 'mm', 'a4');
  }

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

  private addSection(label: string, content: string) {
    this.addSubtitle(label);
    if (content && content.trim()) {
      this.addText(content, 11, false, 170);
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

  private addHeader() {
    // Logo ou nome da clínica
    this.addTitle('SISTEMA DE GESTÃO HOSPITALAR');
    this.addText('Prontuário Médico', 12, true);
    this.yPosition += 10;

    // Linha separadora
    this.doc.setLineWidth(0.5);
    this.doc.line(20, this.yPosition, 190, this.yPosition);
    this.yPosition += 10;
  }

  private addPatientInfo(prontuario: Prontuario) {
    this.addSubtitle('INFORMAÇÕES DO PACIENTE');
    
    if (prontuario.paciente) {
      this.addText(`Nome: ${prontuario.paciente.nome}`, 11);
      this.addText(`CPF: ${prontuario.paciente.cpf}`, 11);
    } else {
      this.addText(`ID do Paciente: ${prontuario.pacienteId}`, 11);
    }
    
    this.yPosition += 5;
  }

  private addDoctorInfo(prontuario: Prontuario) {
    this.addSubtitle('INFORMAÇÕES DO MÉDICO');
    
    if (prontuario.medico) {
      this.addText(`Médico: ${prontuario.medico.nome}`, 11);
      this.addText(`E-mail: ${prontuario.medico.email}`, 11);
    } else {
      this.addText(`ID do Médico: ${prontuario.medicoId}`, 11);
    }
    
    this.yPosition += 5;
  }

  private addConsultationInfo(prontuario: Prontuario) {
    this.addSubtitle('INFORMAÇÕES DA CONSULTA');
    
    const dataConsulta = new Date(prontuario.dataConsulta);
    this.addText(`Data da Consulta: ${dataConsulta.toLocaleDateString('pt-BR')}`, 11);
    
    if (prontuario.agendamentoId) {
      this.addText(`ID do Agendamento: ${prontuario.agendamentoId}`, 11);
    }
    
    this.yPosition += 5;
  }

  private addMedicalInfo(prontuario: Prontuario) {
    // Anamnese
    this.addSection('ANAMNESE', prontuario.anamnese);
    
    // Exame Físico
    this.addSection('EXAME FÍSICO', prontuario.exameFisico);
    
    // Diagnóstico
    this.addSection('DIAGNÓSTICO', prontuario.diagnostico);
    
    // Prescrição
    this.addSection('PRESCRIÇÃO MÉDICA', prontuario.prescricao);
    
    // Observações
    if (prontuario.observacoes && prontuario.observacoes.trim()) {
      this.addSection('OBSERVAÇÕES', prontuario.observacoes);
    }
  }

  private addFooter() {
    this.yPosition += 20;
    this.checkPageBreak();
    
    // Data de emissão
    const now = new Date();
    this.addText(`Documento gerado em: ${now.toLocaleString('pt-BR')}`, 9);
    
    // Linha para assinatura
    this.yPosition += 15;
    this.checkPageBreak();
    this.doc.line(20, this.yPosition, 100, this.yPosition);
    this.yPosition += 5;
    this.addText('Assinatura do Médico', 9);
  }

  public generate(prontuario: Prontuario): void {
    try {
      // Create new document instance for each generation
      this.doc = new jsPDF('p', 'mm', 'a4');
      this.yPosition = 20;
      
      // Add content sections
      this.addHeader();
      this.addPatientInfo(prontuario);
      this.addDoctorInfo(prontuario);
      this.addConsultationInfo(prontuario);
      this.addMedicalInfo(prontuario);
      this.addFooter();
      
      // Generate filename
      const pacienteNome = prontuario.paciente?.nome || 'Paciente';
      const dataConsulta = new Date(prontuario.dataConsulta).toLocaleDateString('pt-BR').replace(/\//g, '-');
      const filename = `Prontuario_${pacienteNome.replace(/\s+/g, '_')}_${dataConsulta}.pdf`;
      
      // Save the PDF
      this.doc.save(filename);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw new Error('Falha na geração do PDF');
    }
  }
}

// Export class directly
export default ProntuarioPDFGenerator;
