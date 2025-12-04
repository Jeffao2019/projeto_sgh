async function testarGravacaoAgendamento() {
  console.log('🧪 TESTE DE GRAVAÇÃO DE AGENDAMENTO');
  console.log('='.repeat(50));

  const baseURL = 'http://localhost:3000';
  
  try {
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

    if (!loginResponse.ok) {
      console.log('❌ Erro no login:', loginResponse.status);
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login realizado com sucesso');

    // 2. Listar agendamentos antes
    console.log('\n2. 📋 Listando agendamentos antes da criação...');
    const antesResponse = await fetch(`${baseURL}/agendamentos`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const agendamentosAntes = await antesResponse.json();
    console.log(`✅ Encontrados ${agendamentosAntes.length} agendamentos`);

    // 3. Buscar dados para criar agendamento
    console.log('\n3. 🔍 Buscando dados para criar agendamento...');
    
    // Buscar pacientes
    const pacientesResponse = await fetch(`${baseURL}/pacientes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const pacientes = await pacientesResponse.json();
    console.log(`✅ ${pacientes.length} pacientes encontrados`);
    
    // Buscar médicos
    const medicosResponse = await fetch(`${baseURL}/auth/medicos`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const medicos = await medicosResponse.json();
    console.log(`✅ ${medicos.length} médicos encontrados`);

    if (pacientes.length === 0 || medicos.length === 0) {
      console.log('❌ Dados insuficientes para criar agendamento');
      return;
    }

    // 4. Criar agendamento
    console.log('\n4. 📅 Criando novo agendamento...');
    const agendamentoData = {
      pacienteId: pacientes[0].id,
      medicoId: medicos[0].id,
      dataHora: new Date(2025, 11, 5, 10, 0).toISOString(), // 5 de dezembro de 2025, 10:00
      tipo: 'CONSULTA_GERAL',
      observacoes: 'Teste de gravação de agendamento'
    };

    console.log('Dados do agendamento:', JSON.stringify(agendamentoData, null, 2));

    const createResponse = await fetch(`${baseURL}/agendamentos`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(agendamentoData)
    });

    console.log('Status da resposta:', createResponse.status);
    const responseText = await createResponse.text();
    console.log('Resposta do servidor:', responseText);

    if (!createResponse.ok) {
      console.log('❌ Erro ao criar agendamento');
      return;
    }

    const agendamentoCriado = JSON.parse(responseText);
    console.log('✅ Agendamento criado com ID:', agendamentoCriado.id);

    // 5. Verificar se foi realmente gravado
    console.log('\n5. 🔍 Verificando se o agendamento foi gravado...');
    const verificarResponse = await fetch(`${baseURL}/agendamentos/${agendamentoCriado.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (verificarResponse.ok) {
      const agendamentoVerificado = await verificarResponse.json();
      console.log('✅ Agendamento encontrado no banco:');
      console.log('- ID:', agendamentoVerificado.id);
      console.log('- Paciente:', agendamentoVerificado.paciente?.nome || 'N/A');
      console.log('- Médico:', agendamentoVerificado.medico?.nome || 'N/A');
      console.log('- Data:', agendamentoVerificado.dataHora);
      console.log('- Status:', agendamentoVerificado.status);
    } else {
      console.log('❌ Agendamento NÃO foi encontrado no banco!');
    }

    // 6. Listar agendamentos depois
    console.log('\n6. 📋 Listando agendamentos após criação...');
    const depoisResponse = await fetch(`${baseURL}/agendamentos`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const agendamentosDepois = await depoisResponse.json();
    console.log(`✅ Agora temos ${agendamentosDepois.length} agendamentos`);
    
    if (agendamentosDepois.length > agendamentosAntes.length) {
      console.log('✅ SUCESSO: Agendamento foi gravado com sucesso!');
    } else {
      console.log('❌ PROBLEMA: Número de agendamentos não aumentou!');
    }

  } catch (error) {
    console.log('❌ Erro no teste:', error.message);
  }
}

testarGravacaoAgendamento().catch(console.error);