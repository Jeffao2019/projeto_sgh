async function testeCarregamentoDados() {
  console.log('🔍 TESTE DE CARREGAMENTO DE DADOS - TELEMEDICINA');
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

  // 2. Buscar agendamentos com relações
  console.log('\n2. 📅 Buscando agendamentos com relações...');
  const agendamentosResponse = await fetch(`${baseURL}/agendamentos`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const agendamentos = await agendamentosResponse.json();
  console.log(`✅ Total de agendamentos encontrados: ${agendamentos.length}`);
  console.log('Tipos de agendamento:', agendamentos.map(a => a.tipo).join(', '));
  console.log('Status dos agendamentos:', agendamentos.map(a => a.status).join(', '));
  
  const telemedicina = agendamentos.filter(ag => ag.tipo === 'TELEMEDICINA' && ag.status === 'CONFIRMADO');
  
  console.log(`✅ Encontrados ${telemedicina.length} agendamentos de telemedicina`);
  
  if (telemedicina.length > 0) {
    const primeiro = telemedicina[0];
    console.log('\n📋 Dados do primeiro agendamento:');
    console.log('ID:', primeiro.id);
    console.log('Paciente na lista:', primeiro.paciente);
    console.log('Médico na lista:', primeiro.medico);
    
    // 3. Buscar agendamento específico por ID
    console.log(`\n3. 🔍 Buscando agendamento ${primeiro.id} individualmente...`);
    const individualResponse = await fetch(`${baseURL}/agendamentos/${primeiro.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const agendamentoIndividual = await individualResponse.json();
    console.log('\n📋 Dados do agendamento individual:');
    console.log('ID:', agendamentoIndividual.id);
    console.log('Paciente individual:', agendamentoIndividual.paciente);
    console.log('Médico individual:', agendamentoIndividual.medico);
    
    // 4. Se não tem relações, buscar dados separadamente
    if (!agendamentoIndividual.paciente || !agendamentoIndividual.medico) {
      console.log('\n4. 🔧 Buscando dados separadamente...');
      
      if (agendamentoIndividual.pacienteId) {
        console.log(`Buscando paciente ID: ${agendamentoIndividual.pacienteId}`);
        const pacienteResponse = await fetch(`${baseURL}/pacientes/${agendamentoIndividual.pacienteId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (pacienteResponse.ok) {
          const paciente = await pacienteResponse.json();
          console.log('✅ Paciente encontrado:', paciente.nome);
        }
      }
      
      if (agendamentoIndividual.medicoId) {
        console.log(`Buscando médico ID: ${agendamentoIndividual.medicoId}`);
        const medicoResponse = await fetch(`${baseURL}/auth/medicos`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (medicoResponse.ok) {
          const medicos = await medicoResponse.json();
          const medico = medicos.find(m => m.id === agendamentoIndividual.medicoId);
          if (medico) {
            console.log('✅ Médico encontrado:', medico.nome);
          }
        }
      }
    }
    
    console.log('\n🎯 TESTE ESPECÍFICO DO FRONTEND');
    console.log('URL para testar:', `http://localhost:8080/telemedicina/${primeiro.id}`);
    console.log('URL de debug:', `http://localhost:8080/telemedicina-teste/${primeiro.id}`);
    
    // 5. Verificar estrutura completa dos dados
    console.log('\n📊 ESTRUTURA COMPLETA DO AGENDAMENTO:');
    console.log(JSON.stringify(agendamentoIndividual, null, 2));
  }
}

testeCarregamentoDados().catch(console.error);