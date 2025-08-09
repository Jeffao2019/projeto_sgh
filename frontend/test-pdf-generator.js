// Teste simples para a geração de PDF
import { ProntuarioPDFGenerator } from '../src/utils/pdf-generator.js';

// Dados de teste simulando um prontuário
const prontuarioTeste = {
  id: "teste-123",
  pacienteId: "paciente-123",
  medicoId: "medico-123",
  agendamentoId: "agendamento-123",
  dataConsulta: "2025-08-09T10:00:00.000Z",
  anamnese: "Paciente relata dor de cabeça há 3 dias, iniciada após estresse no trabalho. Nega febre, náuseas ou vômitos. Histórico familiar de enxaqueca.",
  exameFisico: "PA: 120/80 mmHg, FC: 72 bpm, FR: 16 irpm, Temp: 36.5°C. Paciente consciente, orientado, sem sinais de irritação meníngea. Ausculta cardíaca e pulmonar sem alterações.",
  diagnostico: "Cefaléia tensional - Enxaqueca episódica",
  prescricao: "Paracetamol 750mg - 1 comprimido de 8/8h por 3 dias\\nDipirona 500mg - 1 comprimido se necessário para dor\\nRetorno em 7 dias se persistir",
  observacoes: "Orientado sobre técnicas de relaxamento e manejo de estresse. Evitar jejum prolongado e manter hidratação adequada.",
  createdAt: "2025-08-09T06:00:00.000Z",
  updatedAt: "2025-08-09T06:00:00.000Z",
  paciente: {
    id: "paciente-123",
    nome: "MARIA SILVA SANTOS",
    cpf: "123.456.789-00"
  },
  medico: {
    id: "medico-123",
    nome: "Dr. João Carlos Oliveira",
    email: "dr.joao@hospital.com"
  }
};

console.log('🧪 Testando geração de PDF...');

try {
  const pdfGenerator = new ProntuarioPDFGenerator();
  console.log('✅ PDF Generator criado com sucesso');
  
  // Tentar gerar o PDF
  pdfGenerator.generate(prontuarioTeste);
  console.log('✅ PDF gerado com sucesso!');
  console.log('📄 Arquivo salvo como: Prontuario_MARIA_SILVA_SANTOS_09-08-2025.pdf');
  
} catch (error) {
  console.error('❌ Erro ao gerar PDF:', error);
}
