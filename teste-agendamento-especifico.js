async function testarAgendamentoEspecifico() {
  console.log('🔍 TESTANDO AGENDAMENTO ESPECÍFICO');
  console.log('='.repeat(50));

  const baseURL = 'http://localhost:3000';
  const agendamentoId = '93b6b055-e1fa-4849-9cea-6ede434be0de';
  
  // Login
  const loginResponse = await fetch(`${baseURL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@sgh.com',
      password: '123456'
    })
  });

  const loginData = await loginResponse.json();
  const token = loginData.token;

  // Buscar agendamento específico
  console.log(`\n🔍 Buscando agendamento ${agendamentoId}...`);
  const response = await fetch(`${baseURL}/agendamentos/${agendamentoId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (response.ok) {
    const agendamento = await response.json();
    console.log('\n📋 DADOS DO AGENDAMENTO:');
    console.log(JSON.stringify(agendamento, null, 2));
    
    if (agendamento.paciente && agendamento.medico) {
      console.log('\n✅ SUCESSO! Dados carregados com relações:');
      console.log(`Paciente: ${agendamento.paciente.nome}`);
      console.log(`Médico: ${agendamento.medico.nome}`);
      
      console.log('\n🎯 TESTE DA SALA DE TELEMEDICINA:');
      console.log(`URL: http://localhost:8080/telemedicina/${agendamentoId}`);
    } else {
      console.log('\n❌ Relações não carregadas');
    }
  } else {
    console.log('❌ Erro ao buscar agendamento:', response.status);
  }
}

testarAgendamentoEspecifico().catch(console.error);