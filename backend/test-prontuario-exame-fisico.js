const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testProntuarioExameFisico() {
  try {
    console.log('🔍 Testando carregamento do exame físico nos prontuários...\n');

    // 1. Fazer login
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'dr.teste.agendamento@teste.com',
      password: '123456'
    });

    if (loginResponse.status !== 200) {
      throw new Error('Falha no login');
    }

    const token = loginResponse.data.token;
    console.log('✅ Login realizado com sucesso');

    // 2. Buscar prontuários existentes
    const prontuariosResponse = await axios.get(`${BASE_URL}/prontuarios`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (prontuariosResponse.data.length === 0) {
      console.log('❌ Nenhum prontuário encontrado para testar');
      return;
    }

    console.log(`📋 Prontuários encontrados: ${prontuariosResponse.data.length}`);
    
    // 3. Verificar cada prontuário
    for (const prontuario of prontuariosResponse.data) {
      console.log(`\n--- Prontuário ID: ${prontuario.id} ---`);
      console.log(`Data: ${new Date(prontuario.dataConsulta).toLocaleDateString('pt-BR')}`);
      console.log(`Anamnese: "${prontuario.anamnese}"`);
      console.log(`Exame Físico: "${prontuario.exameFisico}"`);
      console.log(`Diagnóstico: "${prontuario.diagnostico}"`);
      console.log(`Prescrição: "${prontuario.prescricao}"`);
      
      // 4. Buscar prontuário individual para comparar
      const prontuarioIndividual = await axios.get(`${BASE_URL}/prontuarios/${prontuario.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log(`\n--- Busca Individual do Prontuário ${prontuario.id} ---`);
      console.log(`Anamnese Individual: "${prontuarioIndividual.data.anamnese}"`);
      console.log(`Exame Físico Individual: "${prontuarioIndividual.data.exameFisico}"`);
      console.log(`Diagnóstico Individual: "${prontuarioIndividual.data.diagnostico}"`);
    }

    // 5. Verificar dados direto da entidade com relations
    const prontuariosWithRelations = await axios.get(`${BASE_URL}/prontuarios/with-relations`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log(`\n--- Prontuários com Relations ---`);
    for (const prontuario of prontuariosWithRelations.data) {
      console.log(`ID: ${prontuario.id}`);
      console.log(`Anamnese (Relations): "${prontuario.anamnese}"`);
      console.log(`Exame Físico (Relations): "${prontuario.exameFisico}"`);
      console.log(`Diagnóstico (Relations): "${prontuario.diagnostico}"`);
      console.log('---');
    }

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.response?.data || error.message);
  }
}

testProntuarioExameFisico();
