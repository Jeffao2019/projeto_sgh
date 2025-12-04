async function testeSimpleTelemedicina() {
  console.log('🔧 TESTE SIMPLES - SALA DE TELEMEDICINA');
  console.log('='.repeat(50));

  const baseURL = 'http://localhost:3000';
  const agendamentoId = '497f102f-d557-42a4-a723-a3cba277cb64';
  
  try {
    // 1. Login
    console.log('1. 🔑 Fazendo login...');
    const loginResponse = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@sgh.com',
        password: '123456'
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Login falhou: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login realizado com sucesso');

    // 2. Buscar agendamento específico
    console.log(`2. 🔍 Buscando agendamento ${agendamentoId}...`);
    const agendamentoResponse = await fetch(`${baseURL}/agendamentos/${agendamentoId}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`Status da resposta: ${agendamentoResponse.status} ${agendamentoResponse.statusText}`);

    if (!agendamentoResponse.ok) {
      const errorText = await agendamentoResponse.text();
      throw new Error(`Erro ao buscar agendamento: ${agendamentoResponse.status} - ${errorText}`);
    }

    const agendamento = await agendamentoResponse.json();
    
    console.log('✅ Agendamento encontrado:');
    console.log('- ID:', agendamento.id);
    console.log('- Tipo:', agendamento.tipo);
    console.log('- Status:', agendamento.status);
    console.log('- Tem paciente:', !!agendamento.paciente);
    console.log('- Tem médico:', !!agendamento.medico);
    
    if (agendamento.paciente) {
      console.log('- Nome do paciente:', agendamento.paciente.nome);
    }
    
    if (agendamento.medico) {
      console.log('- Nome do médico:', agendamento.medico.nome);
    }

    // 3. Verificar estrutura dos dados
    console.log('\n3. 📊 Estrutura dos dados para o frontend:');
    const dadosParaFrontend = {
      id: agendamento.id,
      tipo: agendamento.tipo,
      status: agendamento.status,
      dataHora: agendamento.dataHora,
      paciente: agendamento.paciente || null,
      medico: agendamento.medico || null
    };
    
    console.log(JSON.stringify(dadosParaFrontend, null, 2));

    // 4. Simular o que o frontend deveria fazer
    console.log('\n4. ✅ SIMULAÇÃO DO FRONTEND:');
    console.log('- Loading: false');
    console.log('- Error: null');
    console.log('- Agendamento carregado: true');
    console.log('- Pode renderizar sala: true');
    
    console.log('\n🎯 URLs para testar no navegador:');
    console.log(`- Sala principal: http://localhost:8080/telemedicina/${agendamentoId}`);
    console.log(`- Sala de teste: http://localhost:8080/telemedicina-teste/${agendamentoId}`);
    
    console.log('\n✅ API funcionando corretamente! O problema está no frontend.');

  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    console.error('Stack:', error.stack);
  }
}

testeSimpleTelemedicina().catch(console.error);