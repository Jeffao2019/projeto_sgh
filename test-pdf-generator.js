// Teste direto do PDF generator no navegador
console.log('🧪 Teste direto do PDF Generator');

// Dados de teste simulando um prontuário real
const prontuarioTeste = {
  id: '176dc082-a9ce-4c29-bd2e-ad9141a556f0',
  paciente: {
    id: '0669e24a-19b9-4a9f-99fe-82706c5d116c',
    nome: 'Gabriela Santos Pereira',
    cpf: '26481880106',
    email: 'gabriela.santos.pereira@email.com',
    telefone: '(11) 99999-9999',
    dataNascimento: '1990-05-15',
    endereco: 'Rua das Flores, 123'
  },
  medico: {
    id: '8d39054c-87e9-458b-a44a-9fc4b266776c',
    nome: 'Dr. Teste Agendamento',
    especialidade: 'Clínica Geral',
    crm: '123456'
  },
  dataConsulta: '2025-10-08T18:30:00.000Z',
  diagnostico: 'Cefaleia tensional',
  anamnese: 'Paciente relata dor de cabeça frequente há 2 semanas, principalmente no período vespertino. Nega febre, náuseas ou vômitos. Histórico de estresse no trabalho.',
  exameFisico: 'Paciente consciente, orientada, sem alterações ao exame físico geral. Sinais vitais estáveis. Ausência de sinais neurológicos focais.',
  prescricao: 'Dipirona 500mg - 1 comprimido a cada 6 horas se dor. Orientações sobre manejo do estresse. Retorno em 7 dias.',
  observacoes: 'Paciente orientada sobre sinais de alerta. Agendar retorno se sintomas persistirem.'
};

console.log('📋 Dados do prontuário para teste:', prontuarioTeste);

// Instruções para teste no navegador
console.log('\n🌐 TESTE NO NAVEGADOR:');
console.log('1. Abra o Console do navegador (F12)');
console.log('2. Cole o código abaixo:');
console.log('\n--- INÍCIO DO CÓDIGO ---');
console.log(`
// Dados de teste
const prontuario = ${JSON.stringify(prontuarioTeste, null, 2)};

// Teste PDF Regular
try {
  console.log('🔵 Testando PDF Regular...');
  const ProntuarioPDFGenerator = (await import('/src/utils/pdf-generator.ts')).default;
  const generator = new ProntuarioPDFGenerator();
  generator.generate(prontuario);
  console.log('✅ PDF Regular gerado com sucesso!');
} catch (error) {
  console.error('❌ Erro PDF Regular:', error);
}

// Teste PDF LGPD
try {
  console.log('🔒 Testando PDF LGPD...');
  const ProntuarioLGPDPDFGenerator = (await import('/src/utils/pdf-generator-lgpd.ts')).default;
  const generatorLGPD = new ProntuarioLGPDPDFGenerator();
  generatorLGPD.generate(prontuario);
  console.log('✅ PDF LGPD gerado com sucesso!');
} catch (error) {
  console.error('❌ Erro PDF LGPD:', error);
}
`);
console.log('--- FIM DO CÓDIGO ---');

console.log('\n🎯 O que verificar:');
console.log('✅ Se aparecer "PDF gerado com sucesso" = funcionando');
console.log('❌ Se aparecer erro em vermelho = problema encontrado');
console.log('📁 Se o download começar = exportação OK');

console.log('\n📝 Problemas comuns:');
console.log('• "Cannot read properties" = dados incompletos');
console.log('• "jsPDF is not defined" = biblioteca não carregada');
console.log('• "Module not found" = arquivo não existe');
console.log('• Nenhuma mensagem = código não executou');
