const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testarEstruturaProntuarios() {
  try {
    console.log('🔍 Testando estrutura dos dados retornados...\n');

    // 1. Fazer login
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'dr.teste.agendamento@teste.com',
      password: '123456'
    });

    const token = loginResponse.data.token;
    console.log('✅ Login realizado com sucesso');

    // 2. Buscar prontuários com relations
    const response = await axios.get(`${BASE_URL}/prontuarios/with-relations`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log('\n📋 Estrutura completa do primeiro prontuário:');
    console.log(JSON.stringify(response.data[0], null, 2));

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.response?.data || error.message);
  }
}

testarEstruturaProntuarios();
