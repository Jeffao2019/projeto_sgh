const axios = require('axios');

async function testarAPITelemedicina() {
  try {
    console.log('🧪 Testando API da sala de telemedicina...');

    // Login
    const loginResponse = await axios.post('http://localhost:3000/auth/login', {
      email: 'admin@sgh.com',
      password: '123456'
    });

    const token = loginResponse.data.token;
    const authHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const agendamentoId = '7955ab03-c9eb-4fee-af8e-0364944d2ce2';

    console.log(`\n1. Testando getAgendamentoById(${agendamentoId})...`);
    
    try {
      const agendamentoResponse = await axios.get(
        `http://localhost:3000/agendamentos/${agendamentoId}`, 
        { headers: authHeaders }
      );
      console.log('✅ Agendamento encontrado:', agendamentoResponse.data);
    } catch (error) {
      console.error('❌ Erro ao buscar agendamento:', error.response?.data || error.message);
      return;
    }

    console.log('\n2. Testando getPacientes()...');
    try {
      const pacientesResponse = await axios.get('http://localhost:3000/pacientes', { headers: authHeaders });
      console.log(`✅ ${pacientesResponse.data.length} pacientes encontrados`);
    } catch (error) {
      console.error('❌ Erro ao buscar pacientes:', error.response?.data || error.message);
      return;
    }

    console.log('\n3. Testando getMedicos()...');
    try {
      const medicosResponse = await axios.get('http://localhost:3000/auth/medicos', { headers: authHeaders });
      console.log(`✅ ${medicosResponse.data.length} médicos encontrados`);
    } catch (error) {
      console.error('❌ Erro ao buscar médicos:', error.response?.data || error.message);
      return;
    }

    console.log('\n✅ Todas as APIs estão funcionando corretamente!');
    console.log('\n🔍 Possíveis causas do problema na telemedicina:');
    console.log('1. Usuário não está autenticado no frontend');
    console.log('2. Token expirado no localStorage');
    console.log('3. CORS ou problema de rede');
    console.log('4. Erro no console do navegador (F12)');

    console.log('\n🎯 Para resolver:');
    console.log('1. Acesse: http://localhost:8080/login');
    console.log('2. Faça login com: admin@sgh.com / 123456');
    console.log('3. Vá para Agendamentos');
    console.log('4. Clique em "Iniciar Videochamada"');
    console.log('5. Verifique o console do navegador (F12)');

  } catch (error) {
    console.error('❌ Erro geral:', error.response?.data || error.message);
  }
}

testarAPITelemedicina();