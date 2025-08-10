// Teste específico para debug do botão exportar
const axios = require('axios');

const API_BASE = 'http://localhost:3000';

async function debugBotaoExportar() {
  console.log('🔍 DEBUG: Investigando problema do botão exportar...\n');

  try {
    // 1. Login
    console.log('1️⃣ Fazendo login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'dr.teste.agendamento@teste.com',
      password: '123456'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login OK');

    // 2. Buscar prontuário específico com dados completos
    console.log('\n2️⃣ Buscando prontuário específico...');
    const prontuariosResponse = await axios.get(`${API_BASE}/prontuarios/with-relations`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const prontuarios = prontuariosResponse.data;
    console.log(`📋 Total de prontuários: ${prontuarios.length}`);

    if (prontuarios.length === 0) {
      console.log('❌ Nenhum prontuário encontrado');
      return;
    }

    // 3. Pegar um prontuário para teste detalhado
    const prontuario = prontuarios[0];
    console.log('\n3️⃣ Dados do prontuário selecionado:');
    console.log('📋 ID:', prontuario.id);
    console.log('👤 Paciente:', {
      id: prontuario.paciente?.id,
      nome: prontuario.paciente?.nome,
      cpf: prontuario.paciente?.cpf,
      email: prontuario.paciente?.email,
      telefone: prontuario.paciente?.telefone
    });
    console.log('👨‍⚕️ Médico:', {
      id: prontuario.medico?.id,
      nome: prontuario.medico?.nome
    });
    console.log('📅 Data Consulta:', prontuario.dataConsulta);
    console.log('🏥 Diagnóstico:', prontuario.diagnostico);
    console.log('📝 Anamnese:', prontuario.anamnese ? 'Presente' : 'Ausente');
    console.log('🔍 Exame Físico:', prontuario.exameFisico ? 'Presente' : 'Ausente');
    console.log('💊 Prescrição:', prontuario.prescricao ? 'Presente' : 'Ausente');

    // 4. Testar se falta algum dado essencial
    console.log('\n4️⃣ Verificando integridade dos dados:');
    
    const problemas = [];
    if (!prontuario.paciente) problemas.push('❌ Paciente não carregado');
    if (!prontuario.medico) problemas.push('❌ Médico não carregado');
    if (!prontuario.paciente?.nome) problemas.push('❌ Nome do paciente ausente');
    if (!prontuario.paciente?.cpf) problemas.push('❌ CPF do paciente ausente');
    if (!prontuario.diagnostico) problemas.push('❌ Diagnóstico ausente');
    
    if (problemas.length > 0) {
      console.log('🚨 PROBLEMAS ENCONTRADOS:');
      problemas.forEach(p => console.log(p));
    } else {
      console.log('✅ Dados completos para exportação');
    }

    // 5. Simular chamada da API individual se necessário
    console.log('\n5️⃣ Testando busca individual do prontuário...');
    try {
      const prontuarioIndividual = await axios.get(`${API_BASE}/prontuarios/${prontuario.id}/with-relations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Busca individual com relações OK');
      console.log('🔍 Dados individuais:', {
        temPaciente: !!prontuarioIndividual.data.paciente,
        temMedico: !!prontuarioIndividual.data.medico,
        nomePaciente: prontuarioIndividual.data.paciente?.nome,
        nomeMedico: prontuarioIndividual.data.medico?.nome,
        emailPaciente: prontuarioIndividual.data.paciente?.email
      });
    } catch (error) {
      console.log('❌ Erro na busca individual:', error.message);
    }

    // 6. Verificar se jsPDF está disponível no ambiente
    console.log('\n6️⃣ Simulando geração de PDF...');
    console.log('🔧 Dados que seriam passados para o PDF generator:');
    console.log({
      id: prontuario.id,
      paciente: {
        nome: prontuario.paciente?.nome || 'Nome não disponível',
        cpf: prontuario.paciente?.cpf || 'CPF não disponível',
        email: prontuario.paciente?.email || 'Email não disponível'
      },
      medico: {
        nome: prontuario.medico?.nome || 'Médico não disponível'
      },
      dataConsulta: prontuario.dataConsulta,
      diagnostico: prontuario.diagnostico || 'Diagnóstico não disponível'
    });

    console.log('\n🎯 POSSÍVEIS CAUSAS DO PROBLEMA:');
    console.log('1. jsPDF não carregado no frontend');
    console.log('2. Erro de console no navegador');
    console.log('3. Dados incompletos sendo passados');
    console.log('4. Problema no contexto de execução');
    
    console.log('\n🔧 PRÓXIMOS PASSOS PARA DEBUG:');
    console.log('1. Abrir DevTools (F12) no navegador');
    console.log('2. Ir para Console');
    console.log('3. Clicar no botão exportar');
    console.log('4. Verificar erros em vermelho');
    console.log('5. Verificar se há mensagens sobre jsPDF');

  } catch (error) {
    console.error('❌ Erro no debug:', error.message);
    if (error.response) {
      console.error('📝 Detalhes:', error.response.data);
    }
  }
}

debugBotaoExportar();
