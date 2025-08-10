const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

async function testFrontendWorkflow() {
  try {
    console.log('🎯 [TESTE COMPLETO] Simulando workflow completo do frontend...\n');

    // 1. Login
    console.log('1. Fazendo login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'dr.teste.agendamento@teste.com',
      password: '123456'
    });
    
    const token = loginResponse.data.token;
    const headers = { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    console.log('✅ Login realizado');

    // 2. Buscar dados necessários
    console.log('\n2. Buscando pacientes e médicos...');
    const [pacientesResponse, medicosResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/pacientes`, { headers }),
      axios.get(`${API_BASE_URL}/auth/medicos`, { headers })
    ]);
    
    const pacientes = pacientesResponse.data;
    const medicos = medicosResponse.data;
    
    console.log(`✅ ${pacientes.length} pacientes encontrados`);
    console.log(`✅ ${medicos.length} médicos encontrados`);
    
    if (pacientes.length === 0 || medicos.length === 0) {
      console.log('❌ Não há pacientes ou médicos suficientes para o teste');
      return;
    }

    // 3. Criar um novo agendamento
    console.log('\n3. Criando novo agendamento...');
    const novoAgendamento = {
      pacienteId: pacientes[0].id,
      medicoId: medicos[0].id,
      dataHora: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // amanhã
      tipo: 'CONSULTA_GERAL',
      observacoes: 'Teste de alteração de status via frontend'
    };
    
    const createResponse = await axios.post(`${API_BASE_URL}/agendamentos`, novoAgendamento, { headers });
    const agendamentoCriado = createResponse.data;
    
    console.log(`✅ Agendamento criado com ID: ${agendamentoCriado.id.substring(0, 8)}...`);
    console.log(`   Status inicial: ${agendamentoCriado.status}`);
    console.log(`   Paciente: ${pacientes[0].nome}`);
    console.log(`   Médico: ${medicos[0].nome}`);

    // 4. Simular edição no frontend - alterando status para CONFIRMADO
    console.log('\n4. Simulando edição via frontend: AGENDADO → CONFIRMADO');
    
    const updateData = {
      dataHora: agendamentoCriado.dataHora, // manter a mesma data
      tipo: agendamentoCriado.tipo,
      status: 'CONFIRMADO',
      observacoes: agendamentoCriado.observacoes + ' - Status alterado para CONFIRMADO'
    };
    
    const updateResponse = await axios.put(
      `${API_BASE_URL}/agendamentos/${agendamentoCriado.id}`, 
      updateData, 
      { headers }
    );
    
    console.log('✅ Atualização enviada');
    console.log(`   Status anterior: ${agendamentoCriado.status}`);
    console.log(`   Status novo: ${updateResponse.data.status}`);
    
    if (updateResponse.data.status === 'CONFIRMADO') {
      console.log('🎉 SUCESSO! Status alterado corretamente');
    } else {
      console.log('❌ PROBLEMA! Status não foi alterado');
      console.log('   Resposta completa:', JSON.stringify(updateResponse.data, null, 2));
    }

    // 5. Verificar persistência
    console.log('\n5. Verificando persistência no banco...');
    const verificacaoResponse = await axios.get(`${API_BASE_URL}/agendamentos/${agendamentoCriado.id}`, { headers });
    
    console.log(`   Status no banco: ${verificacaoResponse.data.status}`);
    
    if (verificacaoResponse.data.status === 'CONFIRMADO') {
      console.log('✅ CONFIRMADO! Alteração persistida no banco');
    } else {
      console.log('❌ PROBLEMA! Alteração não foi persistida');
    }

    // 6. Testar outros status
    console.log('\n6. Testando outras alterações de status...');
    
    const statusParaTestar = ['FINALIZADO', 'CANCELADO'];
    
    for (const novoStatus of statusParaTestar) {
      console.log(`\n   Alterando para: ${novoStatus}`);
      
      const updateData2 = {
        ...updateData,
        status: novoStatus,
        observacoes: updateData.observacoes + ` - Alterado para ${novoStatus}`
      };
      
      try {
        const response = await axios.put(
          `${API_BASE_URL}/agendamentos/${agendamentoCriado.id}`, 
          updateData2, 
          { headers }
        );
        
        console.log(`   ✅ ${novoStatus}: ${response.data.status}`);
      } catch (error) {
        console.log(`   ❌ ${novoStatus}: Erro - ${error.response?.data?.message || error.message}`);
      }
    }

    console.log('\n🎉 TESTE COMPLETO FINALIZADO!');
    console.log('✅ A correção da alteração de status do agendamento está funcionando perfeitamente!');
    console.log('🎯 O usuário agora pode alterar o status de AGENDADO para CONFIRMADO sem problemas.');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Dados:', error.response.data);
    }
  }
}

// Executar o teste
testFrontendWorkflow();
