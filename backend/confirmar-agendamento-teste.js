const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const AGENDAMENTO_ID = '64a6a189-5998-4090-9b49-b271d48db39a';

async function confirmarAgendamentoParaTeste() {
  try {
    console.log('🔄 Confirmando agendamento para teste...');

    // 1. Fazer login
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'dr.teste.agendamento@teste.com',
      password: '123456'
    });

    const token = loginResponse.data.token;

    // 2. Confirmar o agendamento
    const confirmResponse = await axios.put(`${BASE_URL}/agendamentos/${AGENDAMENTO_ID}/confirmar`, {}, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log('✅ Agendamento confirmado!');
    console.log('Status:', confirmResponse.data.status);

    return AGENDAMENTO_ID;
  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
    return null;
  }
}

confirmarAgendamentoParaTeste();
