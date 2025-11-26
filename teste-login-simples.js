/**
 * Teste simples de login e acesso para profissionais de saúde
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

async function testeSimples() {
  try {
    console.log('🧪 Teste simples de login e acesso');
    
    // 1. Login
    console.log('\n1. Fazendo login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'dr.carlos@sgh.com',
      password: '123456'
    });
    
    console.log('✅ Login OK!');
    console.log('Response data:', loginResponse.data);
    
    const token = loginResponse.data.access_token || loginResponse.data.token;
    if (!token) {
      console.log('❌ Token não encontrado na resposta');
      return;
    }
    
    console.log('Token:', token.substring(0, 20) + '...');
    const headers = { Authorization: `Bearer ${token}` };
    
    // 2. Teste de médicos
    console.log('\n2. Buscando médicos...');
    const medicosResponse = await axios.get(`${API_BASE_URL}/auth/medicos`, { headers });
    console.log('✅ Médicos:', medicosResponse.data.length);
    
    // 3. Teste de pacientes
    console.log('\n3. Buscando pacientes...');
    const pacientesResponse = await axios.get(`${API_BASE_URL}/pacientes`, { headers });
    console.log('✅ Pacientes:', pacientesResponse.data.length);
    
    // 4. Teste de agendamentos
    console.log('\n4. Buscando agendamentos...');
    const agendamentosResponse = await axios.get(`${API_BASE_URL}/agendamentos`, { headers });
    console.log('✅ Agendamentos:', agendamentosResponse.data.length);
    
    // 5. Teste de prontuários
    console.log('\n5. Buscando prontuários...');
    const prontuariosResponse = await axios.get(`${API_BASE_URL}/prontuarios`, { headers });
    console.log('✅ Prontuários:', prontuariosResponse.data.length);
    
    console.log('\n🎉 Todos os endpoints funcionam!');
    
  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
  }
}

testeSimples();
