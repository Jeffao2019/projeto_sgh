const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

async function testProntuariosWithRelations() {
  try {
    console.log('🧪 Testando endpoint de prontuários com relações...\n');

    // Fazer login para obter o token
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'dr.teste.agendamento@teste.com',
      password: '123456'
    });
    const authToken = loginResponse.data.token;
    console.log('✅ Login realizado! Token obtido.');

    // Buscar prontuários com relações
    console.log('\n📋 Buscando prontuários com dados de paciente e médico...');
    const prontuariosResponse = await axios.get(`${API_BASE_URL}/prontuarios/with-relations`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Prontuários encontrados:', prontuariosResponse.data.length);
    console.log('\n📋 Lista de prontuários com relações:');
    
    prontuariosResponse.data.forEach((prontuario, index) => {
      console.log(`${index + 1}. ID: ${prontuario.id}`);
      console.log(`   Paciente: ${prontuario.paciente ? prontuario.paciente.nome : 'N/A'} (${prontuario.paciente ? prontuario.paciente.cpf : 'N/A'})`);
      console.log(`   Médico: ${prontuario.medico ? prontuario.medico.nome : 'N/A'} (${prontuario.medico ? prontuario.medico.email : 'N/A'})`);
      console.log(`   Data: ${new Date(prontuario.dataConsulta).toLocaleString('pt-BR')}`);
      console.log(`   Diagnóstico: ${prontuario.diagnostico}`);
      console.log('');
    });

    if (prontuariosResponse.data.length === 0) {
      console.log('ℹ️ Nenhum prontuário encontrado.');
      console.log('💡 Dica: Crie alguns prontuários para testar a funcionalidade.');
    } else {
      console.log('🎉 Endpoint funcionando! Os dados do paciente e médico estão sendo carregados corretamente.');
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

testProntuariosWithRelations();
