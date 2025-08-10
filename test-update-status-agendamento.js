const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

async function testUpdateStatusAgendamento() {
  try {
    console.log('🧪 [TESTE UPDATE STATUS] Testando atualização de status do agendamento...\n');

    // 1. Fazer login
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
    console.log('✅ Login realizado com sucesso');

    // 2. Buscar um agendamento AGENDADO para testar
    console.log('\n2. Buscando agendamentos...');
    const agendamentosResponse = await axios.get(`${API_BASE_URL}/agendamentos`, { headers });
    const agendamentos = agendamentosResponse.data;
    
    // Procurar um agendamento AGENDADO
    const agendamentoAgendado = agendamentos.find(a => a.status === 'AGENDADO');
    
    if (!agendamentoAgendado) {
      console.log('❌ Nenhum agendamento com status AGENDADO encontrado para teste');
      console.log('📋 Agendamentos disponíveis:');
      agendamentos.slice(0, 3).forEach(a => {
        console.log(`   - ID: ${a.id.substring(0, 8)}... | Status: ${a.status}`);
      });
      
      // Usar o primeiro agendamento disponível
      if (agendamentos.length > 0) {
        const primeiroAgendamento = agendamentos[0];
        console.log(`\n🔄 Usando agendamento ${primeiroAgendamento.id.substring(0, 8)}... (Status atual: ${primeiroAgendamento.status})`);
        await testarAlteracaoStatus(primeiroAgendamento, headers);
      }
      return;
    }

    console.log(`✅ Agendamento AGENDADO encontrado: ${agendamentoAgendado.id.substring(0, 8)}...`);
    console.log(`   Status atual: ${agendamentoAgendado.status}`);
    
    await testarAlteracaoStatus(agendamentoAgendado, headers);

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Dados:', error.response.data);
    }
  }
}

async function testarAlteracaoStatus(agendamento, headers) {
  try {
    console.log(`\n3. Testando alteração de status: ${agendamento.status} → CONFIRMADO`);
    
    // Dados para atualização - apenas o status
    const updateData = {
      status: 'CONFIRMADO'
    };
    
    console.log('📤 Enviando dados de atualização:', updateData);
    
    // Fazer a atualização
    const updateResponse = await axios.put(
      `${API_BASE_URL}/agendamentos/${agendamento.id}`, 
      updateData, 
      { headers }
    );
    
    console.log('✅ Resposta da atualização recebida!');
    console.log('📋 Status anterior:', agendamento.status);
    console.log('📋 Status atualizado:', updateResponse.data.status);
    
    if (updateResponse.data.status === 'CONFIRMADO') {
      console.log('🎉 SUCESSO! Status foi alterado corretamente para CONFIRMADO');
    } else {
      console.log('❌ PROBLEMA! Status não foi alterado conforme esperado');
      console.log('   Esperado: CONFIRMADO');
      console.log('   Recebido:', updateResponse.data.status);
    }
    
    // 4. Verificar se a alteração foi persistida
    console.log('\n4. Verificando se a alteração foi persistida...');
    const verificacaoResponse = await axios.get(`${API_BASE_URL}/agendamentos/${agendamento.id}`, { headers });
    
    console.log('📋 Status no banco:', verificacaoResponse.data.status);
    
    if (verificacaoResponse.data.status === 'CONFIRMADO') {
      console.log('✅ CONFIRMADO! A alteração foi persistida no banco de dados');
      
      // 5. Testar outra alteração: CONFIRMADO → FINALIZADO
      console.log('\n5. Testando segunda alteração: CONFIRMADO → FINALIZADO');
      const updateData2 = { status: 'FINALIZADO' };
      
      const updateResponse2 = await axios.put(
        `${API_BASE_URL}/agendamentos/${agendamento.id}`, 
        updateData2, 
        { headers }
      );
      
      console.log('📋 Status final:', updateResponse2.data.status);
      
      if (updateResponse2.data.status === 'FINALIZADO') {
        console.log('🎉 PERFEITO! Segunda alteração também funcionou!');
      } else {
        console.log('❌ Problema na segunda alteração');
      }
      
    } else {
      console.log('❌ PROBLEMA! A alteração não foi persistida no banco');
    }
    
  } catch (error) {
    console.error('❌ Erro durante a alteração de status:', error.message);
    if (error.response) {
      console.error('   Status HTTP:', error.response.status);
      console.error('   Dados:', error.response.data);
    }
  }
}

// Executar o teste
testUpdateStatusAgendamento();
