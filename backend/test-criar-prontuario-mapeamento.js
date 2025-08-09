const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function criarProntuarioTeste() {
  try {
    console.log('🔍 Criando prontuário de teste para analisar mapeamento...\n');

    // 1. Fazer login
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'dr.teste.agendamento@teste.com',
      password: '123456'
    });

    const token = loginResponse.data.token;
    console.log('✅ Login realizado com sucesso');

    // 2. Usar o agendamento recém-criado
    const agendamentoId = '64a6a189-5998-4090-9b49-b271d48db39a';
    
    // Buscar o agendamento específico
    const agendamentoResponse = await axios.get(`${BASE_URL}/agendamentos/${agendamentoId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const agendamento = agendamentoResponse.data;
    console.log(`📅 Usando agendamento: ${agendamento.id} (Status: ${agendamento.status})`);

    // 3. Criar prontuário com dados específicos para teste
    const prontuarioData = {
      pacienteId: agendamento.pacienteId,
      medicoId: agendamento.medicoId,
      agendamentoId: agendamento.id,
      dataConsulta: new Date().toISOString(),
      anamnese: "TESTE ANAMNESE - História da doença atual",
      exameFisico: "TESTE EXAME FÍSICO - Pressão arterial normal, ausculta cardíaca sem sopros",
      diagnostico: "TESTE DIAGNÓSTICO - Hipertensão leve",
      prescricao: "TESTE PRESCRIÇÃO - Enalapril 10mg 1x ao dia",
      observacoes: "TESTE OBSERVAÇÕES - Retorno em 30 dias"
    };

    console.log('\n📝 Dados do prontuário a ser criado:');
    console.log('Anamnese:', prontuarioData.anamnese);
    console.log('Exame Físico:', prontuarioData.exameFisico);
    console.log('Diagnóstico:', prontuarioData.diagnostico);
    console.log('Prescrição:', prontuarioData.prescricao);

    const createResponse = await axios.post(`${BASE_URL}/prontuarios`, prontuarioData, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('\n✅ Prontuário criado com sucesso!');
    console.log('ID:', createResponse.data.id);

    // 4. Buscar o prontuário recém-criado
    const prontuarioResponse = await axios.get(`${BASE_URL}/prontuarios/${createResponse.data.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log('\n📋 Dados do prontuário retornado:');
    console.log('Anamnese retornada:', prontuarioResponse.data.anamnese);
    console.log('Exame Físico retornado:', prontuarioResponse.data.exameFisico);
    console.log('Diagnóstico retornado:', prontuarioResponse.data.diagnostico);
    console.log('Prescrição retornada:', prontuarioResponse.data.prescricao);

    // 5. Verificar com relations
    const withRelationsResponse = await axios.get(`${BASE_URL}/prontuarios/with-relations`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const prontuarioWithRelations = withRelationsResponse.data.find(p => p.id === createResponse.data.id);
    if (prontuarioWithRelations) {
      console.log('\n📋 Dados com relations:');
      console.log('Anamnese (relations):', prontuarioWithRelations.anamnese);
      console.log('Exame Físico (relations):', prontuarioWithRelations.exameFisico);
      console.log('Diagnóstico (relations):', prontuarioWithRelations.diagnostico);
      console.log('Prescrição (relations):', prontuarioWithRelations.prescricao);
    }

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.response?.data || error.message);
  }
}

criarProntuarioTeste();
