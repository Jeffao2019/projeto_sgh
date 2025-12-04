const axios = require('axios');

async function testarCredenciaisExistentes() {
  const credenciais = [
    { email: 'admin@sgh.com', password: 'admin123' },
    { email: 'admin@sgh.com', password: '123456' },
    { email: 'admin@sgh.com', password: 'password' },
    { email: 'admin@sgh.com', password: 'admin' }
  ];

  for (const cred of credenciais) {
    try {
      console.log(`Testando: ${cred.email} / ${cred.password}`);
      const response = await axios.post('http://localhost:3000/auth/login', cred);
      console.log('✅ Credenciais encontradas!', cred);
      return { token: response.data.token, user: response.data.user };
    } catch (error) {
      console.log(`❌ Falhou: ${error.response?.data?.message}`);
    }
  }
  return null;
}

async function criarTelemedicinaTeste() {
  try {
    console.log('🧪 Testando credenciais existentes...');
    
    const auth = await testarCredenciaisExistentes();
    if (!auth) {
      console.log('❌ Nenhuma credencial válida encontrada');
      return;
    }

    console.log('✅ Autenticado como:', auth.user.email);
    const authHeaders = {
      'Authorization': `Bearer ${auth.token}`,
      'Content-Type': 'application/json'
    };

    // Buscar dados existentes
    console.log('\n📋 Buscando dados existentes...');
    
    const [pacientesResponse, medicosResponse, agendamentosResponse] = await Promise.all([
      axios.get('http://localhost:3000/pacientes', { headers: authHeaders }),
      axios.get('http://localhost:3000/auth/medicos', { headers: authHeaders }),
      axios.get('http://localhost:3000/agendamentos', { headers: authHeaders })
    ]);

    console.log(`📊 Dados encontrados:`);
    console.log(`   - Pacientes: ${pacientesResponse.data.length}`);
    console.log(`   - Médicos: ${medicosResponse.data.length}`);
    console.log(`   - Agendamentos: ${agendamentosResponse.data.length}`);

    if (pacientesResponse.data.length === 0 || medicosResponse.data.length === 0) {
      console.log('⚠️ Dados insuficientes para criar agendamento de telemedicina');
      return;
    }

    // Usar primeiro paciente e médico
    const paciente = pacientesResponse.data[0];
    const medico = medicosResponse.data[0];

    console.log(`\n👥 Usando:`);
    console.log(`   - Paciente: ${paciente.nome} (ID: ${paciente.id})`);
    console.log(`   - Médico: ${medico.nome} (ID: ${medico.id})`);

    // Verificar se já existe agendamento de telemedicina
    const telemedicina = agendamentosResponse.data.find(a => a.tipo === 'TELEMEDICINA' && a.status === 'CONFIRMADO');
    
    if (telemedicina) {
      console.log(`\n✅ Agendamento de telemedicina já existe!`);
      console.log(`📋 ID: ${telemedicina.id}`);
      console.log(`🎯 URL de teste: http://localhost:8080/telemedicina/${telemedicina.id}`);
      return telemedicina.id;
    }

    // Criar novo agendamento de telemedicina
    console.log('\n🆕 Criando agendamento de telemedicina...');
    const agendamentoData = {
      pacienteId: paciente.id,
      medicoId: medico.id,
      dataHora: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min no futuro
      tipo: 'TELEMEDICINA',
      status: 'CONFIRMADO',
      observacoes: 'Teste de videochamada - Sala de Telemedicina'
    };

    const novoAgendamento = await axios.post(
      'http://localhost:3000/agendamentos', 
      agendamentoData, 
      { headers: authHeaders }
    );

    console.log('✅ Agendamento criado com sucesso!');
    console.log('📋 Detalhes:');
    console.log(`   - ID: ${novoAgendamento.data.id}`);
    console.log(`   - Paciente: ${paciente.nome}`);
    console.log(`   - Médico: ${medico.nome}`);
    console.log(`   - Data/Hora: ${novoAgendamento.data.dataHora}`);
    console.log(`   - Tipo: ${novoAgendamento.data.tipo}`);
    console.log(`   - Status: ${novoAgendamento.data.status}`);

    console.log('\n🎯 Para testar a videochamada:');
    console.log(`1. Acesse: http://localhost:8080`);
    console.log(`2. Faça login com: ${auth.user.email}`);
    console.log(`3. Vá para Agendamentos`);
    console.log(`4. Encontre o agendamento de ${paciente.nome}`);
    console.log(`5. Clique em "Iniciar Videochamada"`);
    console.log(`6. URL direta: http://localhost:8080/telemedicina/${novoAgendamento.data.id}`);

    return novoAgendamento.data.id;

  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
    return null;
  }
}

criarTelemedicinaTeste();