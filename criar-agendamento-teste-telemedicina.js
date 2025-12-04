async function criarAgendamentoTelemedicina() {
  console.log('🎯 CRIANDO AGENDAMENTO DE TELEMEDICINA PARA TESTE');
  console.log('='.repeat(60));

  const baseURL = 'http://localhost:3000';
  
  // 1. Login
  console.log('\n1. 🔑 Fazendo login...');
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
  console.log('✅ Login realizado');

  // 2. Buscar médicos
  console.log('\n2. 👨‍⚕️ Buscando médicos...');
  const medicosResponse = await fetch(`${baseURL}/auth/medicos`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const medicos = await medicosResponse.json();
  console.log(`✅ Encontrados ${medicos.length} médicos`);
  
  if (medicos.length === 0) {
    console.log('❌ Nenhum médico encontrado!');
    return;
  }
  
  const medico = medicos[0];
  console.log(`   Usando médico: ${medico.nome} (${medico.id})`);

  // 3. Buscar pacientes
  console.log('\n3. 🧑‍🦱 Buscando pacientes...');
  const pacientesResponse = await fetch(`${baseURL}/pacientes`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const pacientes = await pacientesResponse.json();
  console.log(`✅ Encontrados ${pacientes.length} pacientes`);
  
  if (pacientes.length === 0) {
    console.log('❌ Nenhum paciente encontrado!');
    return;
  }
  
  const paciente = pacientes[0];
  console.log(`   Usando paciente: ${paciente.nome} (${paciente.id})`);

  // 4. Criar agendamento de telemedicina
  console.log('\n4. 📅 Criando agendamento de telemedicina...');
  const agora = new Date();
  agora.setHours(16, 0, 0, 0); // Hoje às 16:00
  
  const agendamentoData = {
    pacienteId: paciente.id,
    medicoId: medico.id,
    dataHora: agora.toISOString(),
    tipo: 'TELEMEDICINA',
    observacoes: 'Agendamento de telemedicina para teste da funcionalidade'
  };
  
  const agendamentoResponse = await fetch(`${baseURL}/agendamentos`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(agendamentoData)
  });

  if (!agendamentoResponse.ok) {
    const erro = await agendamentoResponse.json();
    console.log('❌ Erro ao criar agendamento:', erro);
    return;
  }

  const agendamento = await agendamentoResponse.json();
  console.log(`✅ Agendamento criado: ID ${agendamento.id}`);
  
  // 5. Confirmar o agendamento
  console.log('\n5. ✅ Confirmando agendamento...');
  const confirmarResponse = await fetch(`${baseURL}/agendamentos/${agendamento.id}/confirmar`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (confirmarResponse.ok) {
    console.log(`✅ Agendamento confirmado`);
    
    // 6. Buscar agendamento com dados completos
    console.log('\n6. 🔍 Verificando dados do agendamento...');
    const detalhesResponse = await fetch(`${baseURL}/agendamentos/${agendamento.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (detalhesResponse.ok) {
      const detalhes = await detalhesResponse.json();
      console.log('\n📋 DADOS COMPLETOS DO AGENDAMENTO:');
      console.log('ID:', detalhes.id);
      console.log('Tipo:', detalhes.tipo);
      console.log('Status:', detalhes.status);
      console.log('Data/Hora:', detalhes.dataHora);
      console.log('Paciente:', detalhes.paciente ? detalhes.paciente.nome : 'N/A');
      console.log('Médico:', detalhes.medico ? detalhes.medico.nome : 'N/A');
      
      console.log('\n🎯 TESTE PRONTO!');
      console.log(`   URL da sala: http://localhost:8080/telemedicina/${detalhes.id}`);
      console.log(`   URL de teste: http://localhost:8080/telemedicina-teste/${detalhes.id}`);
    }
  }
}

criarAgendamentoTelemedicina().catch(console.error);