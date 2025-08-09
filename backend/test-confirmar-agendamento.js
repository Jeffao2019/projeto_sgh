const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

async function confirmarAgendamento() {
  try {
    console.log('🧪 Confirmando um agendamento para teste...\n');

    // Fazer login
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'dr.teste.agendamento@teste.com',
      password: '123456'
    });
    const authToken = loginResponse.data.token;

    // Buscar todos os agendamentos
    const agendamentosResponse = await axios.get(`${API_BASE_URL}/agendamentos`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (agendamentosResponse.data.length > 0) {
      const agendamento = agendamentosResponse.data[0];
      console.log(`Confirmando agendamento ID: ${agendamento.id}`);
      
      // Confirmar o agendamento
      const confirmarResponse = await axios.put(`${API_BASE_URL}/agendamentos/${agendamento.id}/confirmar`, {}, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      console.log('✅ Agendamento confirmado com sucesso!');
      console.log(`Status anterior: ${agendamento.status}`);
      console.log(`Status novo: ${confirmarResponse.data.status}`);
      
      // Agora testar o endpoint de agendamentos para prontuário
      console.log('\n📋 Testando agendamentos para prontuário após confirmação...');
      const pararontuarioResponse = await axios.get(`${API_BASE_URL}/agendamentos/para-prontuario`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      console.log('✅ Agendamentos para prontuário:', pararontuarioResponse.data.length);
      if (pararontuarioResponse.data.length > 0) {
        console.log('🎉 SUCESSO! Agendamento confirmado aparece na lista para prontuário.');
      }
    } else {
      console.log('❌ Nenhum agendamento encontrado para confirmar.');
    }

  } catch (error) {
    console.error('❌ ERRO:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Erro:', error.message);
    }
  }
}

confirmarAgendamento();
