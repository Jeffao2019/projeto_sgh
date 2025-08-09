const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

async function testAgendamentosParaProntuario() {
  try {
    console.log('🧪 Testando endpoint de agendamentos para prontuário...\n');

    // Fazer login para obter o token
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'dr.teste.agendamento@teste.com',
      password: '123456'
    });
    const authToken = loginResponse.data.token;
    console.log('✅ Login realizado! Token obtido.');

    // Buscar agendamentos para prontuário
    console.log('\n📋 Buscando agendamentos disponíveis para prontuário...');
    const agendamentosResponse = await axios.get(`${API_BASE_URL}/agendamentos/para-prontuario`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Agendamentos encontrados:', agendamentosResponse.data.length);
    console.log('\n📋 Lista de agendamentos para prontuário:');
    
    agendamentosResponse.data.forEach((agendamento, index) => {
      console.log(`${index + 1}. ID: ${agendamento.id}`);
      console.log(`   Status: ${agendamento.status}`);
      console.log(`   Data: ${new Date(agendamento.dataHora).toLocaleString('pt-BR')}`);
      console.log(`   Tipo: ${agendamento.tipo}`);
      console.log('');
    });

    if (agendamentosResponse.data.length === 0) {
      console.log('ℹ️ Nenhum agendamento confirmado/finalizado encontrado.');
      console.log('💡 Dica: Confirme alguns agendamentos para que apareçam aqui.');
    }

    console.log('🎉 Endpoint funcionando corretamente!');

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

testAgendamentosParaProntuario();
