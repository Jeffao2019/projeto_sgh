async function testeSalaTelemedicina() {
  console.log('🧪 TESTE DA SALA DE TELEMEDICINA');
  console.log('='.repeat(50));

  const baseURL = 'http://localhost:3000';
  const frontendURL = 'http://localhost:8080';

  // 1. Verificar se backend está rodando
  console.log('\n1. 🔍 Verificando backend...');
  try {
    const healthCheck = await fetch(`${baseURL}/auth/debug`);
    if (healthCheck.ok) {
      console.log('✅ Backend está online');
    } else {
      console.log('❌ Backend com problemas');
      return;
    }
  } catch (error) {
    console.log('❌ Backend offline ou com problemas');
    return;
  }

  // 2. Fazer login como admin
  console.log('\n2. 🔑 Fazendo login como admin...');
  let token = '';
  try {
    const loginResponse = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@sgh.com',
        password: '123456'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Debug login response:', loginData);
    if (loginResponse.ok && (loginData.access_token || loginData.token)) {
      token = loginData.access_token || loginData.token;
      console.log('✅ Login realizado com sucesso');
      console.log(`   Usuário: ${loginData.user?.nome} (${loginData.user?.role})`);
    } else {
      console.log('❌ Erro no login:', loginData.message || 'Erro desconhecido');
      console.log('Response status:', loginResponse.status);
      return;
    }
  } catch (error) {
    console.log('❌ Erro ao fazer login:', error.message);
    return;
  }

  // 3. Buscar agendamentos para telemedicina
  console.log('\n3. 📅 Buscando agendamentos para telemedicina...');
  let agendamentosTelemedicina = [];
  try {
    const response = await fetch(`${baseURL}/agendamentos`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      const agendamentos = await response.json();
      agendamentosTelemedicina = agendamentos.filter(ag => 
        ag.tipo === 'TELEMEDICINA' && ag.status === 'CONFIRMADO'
      );
      
      console.log(`✅ Encontrados ${agendamentosTelemedicina.length} agendamentos de telemedicina confirmados`);
      
      if (agendamentosTelemedicina.length > 0) {
        const primeiro = agendamentosTelemedicina[0];
        console.log(`   Primeiro agendamento:`);
        console.log(`   - ID: ${primeiro.id}`);
        console.log(`   - Paciente: ${primeiro.paciente?.nome || 'N/A'}`);
        console.log(`   - Médico: ${primeiro.medico?.nome || 'N/A'}`);
        console.log(`   - Data: ${primeiro.dataHora}`);
        console.log(`   - Status: ${primeiro.status}`);
      }
    } else {
      console.log('❌ Erro ao buscar agendamentos');
      return;
    }
  } catch (error) {
    console.log('❌ Erro ao buscar agendamentos:', error.message);
    return;
  }

  // 4. Testar carregamento de dados específicos do agendamento
  if (agendamentosTelemedicina.length > 0) {
    const agendamentoTeste = agendamentosTelemedicina[0];
    console.log(`\n4. 🔍 Testando carregamento de dados do agendamento ${agendamentoTeste.id}...`);
    
    try {
      const response = await fetch(`${baseURL}/agendamentos/${agendamentoTeste.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const agendamento = await response.json();
        console.log('✅ Dados do agendamento carregados com sucesso');
        console.log(`   Paciente: ${agendamento.paciente?.nome || 'N/A'}`);
        console.log(`   CPF: ${agendamento.paciente?.cpf || 'N/A'}`);
        console.log(`   Médico: ${agendamento.medico?.nome || 'N/A'}`);
        console.log(`   CRM: ${agendamento.medico?.crm || 'N/A'}`);
      } else {
        console.log('❌ Erro ao carregar dados específicos do agendamento');
      }
    } catch (error) {
      console.log('❌ Erro ao testar carregamento:', error.message);
    }
  }

  // 5. Verificar se há dados de teste suficientes
  if (agendamentosTelemedicina.length === 0) {
    console.log('\n⚠️  CRIANDO DADOS DE TESTE...');
    
    // Buscar um médico para usar
    try {
      const medicosResponse = await fetch(`${baseURL}/auth/medicos`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (medicosResponse.ok) {
        const medicos = await medicosResponse.json();
        if (medicos.length > 0) {
          const medico = medicos[0];
          console.log(`✅ Médico encontrado: ${medico.nome} (ID: ${medico.id})`);
          
          // Criar um paciente de teste
          const pacienteResponse = await fetch(`${baseURL}/pacientes`, {
            method: 'POST',
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
              nome: 'Paciente Teste Telemedicina',
              cpf: '12345678901',
              telefone: '(11) 99999-9999',
              email: 'teste@telemedicina.com',
              dataNascimento: '1990-01-01',
              endereco: {
                cep: '01234-567',
                logradouro: 'Rua Teste',
                numero: '123',
                cidade: 'São Paulo',
                estado: 'SP'
              }
            })
          });

          if (pacienteResponse.ok) {
            const paciente = await pacienteResponse.json();
            console.log(`✅ Paciente criado: ${paciente.nome} (ID: ${paciente.id})`);
            
            // Criar agendamento de telemedicina
            const agora = new Date();
            agora.setHours(14, 0, 0, 0); // Hoje às 14:00
            
            const agendamentoResponse = await fetch(`${baseURL}/agendamentos`, {
              method: 'POST',
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
              },
              body: JSON.stringify({
                pacienteId: paciente.id,
                medicoId: medico.id,
                dataHora: agora.toISOString(),
                tipo: 'TELEMEDICINA',
                observacoes: 'Agendamento de teste para telemedicina'
              })
            });

            if (agendamentoResponse.ok) {
              const agendamento = await agendamentoResponse.json();
              console.log(`✅ Agendamento criado: ID ${agendamento.id}`);
              
              // Confirmar o agendamento
              const confirmarResponse = await fetch(`${baseURL}/agendamentos/${agendamento.id}/confirmar`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
              });

              if (confirmarResponse.ok) {
                console.log(`✅ Agendamento confirmado`);
                console.log(`\n🎯 DADOS PRONTOS PARA TESTE!`);
                console.log(`   URL da sala: ${frontendURL}/telemedicina/${agendamento.id}`);
                console.log(`   URL de teste: ${frontendURL}/telemedicina-teste/${agendamento.id}`);
              }
            }
          }
        }
      }
    } catch (error) {
      console.log('❌ Erro ao criar dados de teste:', error.message);
    }
  } else {
    console.log(`\n🎯 DADOS PRONTOS PARA TESTE!`);
    const primeiro = agendamentosTelemedicina[0];
    console.log(`   URL da sala: ${frontendURL}/telemedicina/${primeiro.id}`);
    console.log(`   URL de teste: ${frontendURL}/telemedicina-teste/${primeiro.id}`);
  }

  console.log(`\n📋 INSTRUÇÕES PARA TESTE:`);
  console.log(`1. Acesse: ${frontendURL}/login`);
  console.log(`2. Faça login com: admin@sgh.com / 123456`);
  console.log(`3. Vá para Agendamentos`);
  console.log(`4. Procure agendamentos TELEMEDICINA CONFIRMADOS`);
  console.log(`5. Clique em "Iniciar Videochamada"`);
  console.log(`6. Verifique se os dados do paciente aparecem corretamente`);
  console.log(`\n🔗 LINKS DIRETOS:`);
  console.log(`   Frontend: ${frontendURL}`);
  console.log(`   Login: ${frontendURL}/login`);
  console.log(`   Agendamentos: ${frontendURL}/agendamentos`);
}

testeSalaTelemedicina().catch(console.error);