const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

async function testLogin() {
  try {
    console.log('🧪 Testando login...\n');

    const loginData = {
      email: 'dr.teste.agendamento@teste.com',
      password: '123456'
    };

    console.log('Fazendo login com:', loginData);
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, loginData);
    
    console.log('✅ Login realizado com sucesso!');
    console.log('📋 Resposta completa do login:');
    console.log(JSON.stringify(loginResponse.data, null, 2));
    
    // Testar um endpoint que requer autenticação
    const token = loginResponse.data.access_token || loginResponse.data.token;
    console.log('\n🔑 Token extraído:', token);
    
    if (token) {
      console.log('\n📝 Testando endpoint protegido...');
      const pacientesResponse = await axios.get(`${API_BASE_URL}/pacientes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Endpoint protegido acessado com sucesso!');
      console.log('Total de pacientes:', pacientesResponse.data.length);
    }

  } catch (error) {
    console.error('❌ ERRO NO TESTE:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Erro:', error.message);
    }
  }
}

testLogin();
