const axios = require('axios');

async function testeCompletoTelemedicina() {
  try {
    console.log('🧪 TESTE COMPLETO DA SALA DE TELEMEDICINA');
    console.log('=' .repeat(50));

    // 1. Verificar se backend está funcionando
    console.log('\n1. 🔍 Verificando backend...');
    try {
      const healthCheck = await axios.get('http://localhost:3000/auth/debug');
      console.log('✅ Backend online e funcionando');
    } catch (error) {
      console.log('❌ Backend offline ou com problemas');
      console.log('   Inicie o backend com: cd backend && npm run start:dev');
      return;
    }

    // 2. Login
    console.log('\n2. 🔐 Fazendo login...');
    const loginResponse = await axios.post('http://localhost:3000/auth/login', {
      email: 'admin@sgh.com',
      password: '123456'
    });
    console.log('✅ Login realizado com sucesso');
    console.log('   Token:', loginResponse.data.token.substring(0, 30) + '...');

    const authHeaders = {
      'Authorization': `Bearer ${loginResponse.data.token}`,
      'Content-Type': 'application/json'
    };

    // 3. Testar API do agendamento específico
    const agendamentoId = '7955ab03-c9eb-4fee-af8e-0364944d2ce2';
    console.log(`\n3. 📋 Testando API do agendamento ${agendamentoId}...`);
    
    try {
      const agendamento = await axios.get(
        `http://localhost:3000/agendamentos/${agendamentoId}`, 
        { headers: authHeaders }
      );
      console.log('✅ Agendamento encontrado:', agendamento.data.id);
    } catch (error) {
      console.log('❌ Agendamento não encontrado:', error.response?.data);
      return;
    }

    // 4. Testar APIs relacionadas
    console.log('\n4. 👥 Testando APIs relacionadas...');
    const [pacientes, medicos] = await Promise.all([
      axios.get('http://localhost:3000/pacientes', { headers: authHeaders }),
      axios.get('http://localhost:3000/auth/medicos', { headers: authHeaders })
    ]);
    console.log(`✅ ${pacientes.data.length} pacientes e ${medicos.data.length} médicos encontrados`);

    console.log('\n🎯 INSTRUÇÕES PARA TESTAR:');
    console.log('=' .repeat(50));
    console.log('1. Abra: http://localhost:8081/login');
    console.log('2. Faça login com: admin@sgh.com / 123456');
    console.log('3. Vá para Agendamentos');
    console.log('4. Procure por um agendamento de TELEMEDICINA');
    console.log('5. Clique em "Iniciar Videochamada"');
    console.log('\n📝 URLS DE TESTE DIRETO:');
    console.log(`- Teste simples: http://localhost:8081/telemedicina-teste/${agendamentoId}`);
    console.log(`- Sala real: http://localhost:8081/telemedicina/${agendamentoId}`);
    
    console.log('\n🐛 SE CONTINUAR EM BRANCO, VERIFIQUE:');
    console.log('- Console do navegador (F12)');
    console.log('- Se você está logado no frontend');
    console.log('- Rede/CORS entre frontend e backend');
    console.log('- Se o token está sendo enviado corretamente');

  } catch (error) {
    console.error('❌ Erro geral:', error.response?.data || error.message);
  }
}

testeCompletoTelemedicina();