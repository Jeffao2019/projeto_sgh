const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

async function testSimpleStatusChange() {
  try {
    console.log('🎯 [TESTE FINAL] Reproduzindo exatamente o problema do usuário...\n');

    // 1. Login
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

    // 2. Buscar um agendamento AGENDADO
    const agendamentosResponse = await axios.get(`${API_BASE_URL}/agendamentos`, { headers });
    const agendamentos = agendamentosResponse.data;
    
    let agendamentoTeste = agendamentos.find(a => a.status === 'AGENDADO');
    
    if (!agendamentoTeste) {
      console.log('⚠️ Nenhum agendamento AGENDADO encontrado. Criando um novo...');
      
      // Buscar dados para criar
      const [pacientesResponse, medicosResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/pacientes`, { headers }),
        axios.get(`${API_BASE_URL}/auth/medicos`, { headers })
      ]);
      
      const novoAgendamento = {
        pacienteId: pacientesResponse.data[0].id,
        medicoId: medicosResponse.data[0].id,
        dataHora: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // em 2 dias
        tipo: 'CONSULTA_GERAL',
        observacoes: 'Teste final de alteração de status'
      };
      
      const createResponse = await axios.post(`${API_BASE_URL}/agendamentos`, novoAgendamento, { headers });
      agendamentoTeste = createResponse.data;
      console.log(`✅ Novo agendamento criado: ${agendamentoTeste.id.substring(0, 8)}...`);
    }

    console.log(`\n📋 Agendamento selecionado: ${agendamentoTeste.id.substring(0, 8)}...`);
    console.log(`   Status atual: ${agendamentoTeste.status}`);

    // 3. REPRODUZIR O PROBLEMA: Alterar apenas o status de AGENDADO para CONFIRMADO
    console.log('\n3. Alterando status: AGENDADO → CONFIRMADO (exatamente como o usuário faz)');
    
    const updateData = {
      status: 'CONFIRMADO'
      // Não enviando outros campos, apenas o status como o usuário relatou
    };
    
    console.log('📤 Dados enviados:', JSON.stringify(updateData, null, 2));
    
    const updateResponse = await axios.put(
      `${API_BASE_URL}/agendamentos/${agendamentoTeste.id}`, 
      updateData, 
      { headers }
    );
    
    console.log('\n📥 Resposta recebida:');
    console.log(`   Status retornado: ${updateResponse.data.status}`);
    console.log(`   ID: ${updateResponse.data.id.substring(0, 8)}...`);
    console.log(`   Atualizado em: ${new Date(updateResponse.data.updatedAt).toLocaleString()}`);
    
    // 4. Verificar no banco
    const verificacaoResponse = await axios.get(`${API_BASE_URL}/agendamentos/${agendamentoTeste.id}`, { headers });
    console.log(`\n🗄️ Status no banco de dados: ${verificacaoResponse.data.status}`);
    
    // 5. Resultado final
    if (updateResponse.data.status === 'CONFIRMADO' && verificacaoResponse.data.status === 'CONFIRMADO') {
      console.log('\n🎉 PROBLEMA RESOLVIDO!');
      console.log('✅ O status foi alterado corretamente de AGENDADO para CONFIRMADO');
      console.log('✅ A alteração foi persistida no banco de dados');
      console.log('✅ O usuário não verá mais o status ficando como REAGENDADO');
      console.log('\n🔧 Correção implementada:');
      console.log('   • Adicionado método atualizar() na entidade Agendamento');
      console.log('   • Corrigido método update() no AgendamentoUseCase');
      console.log('   • Diferenciação entre reagendamento e atualização de status');
    } else {
      console.log('\n❌ PROBLEMA AINDA EXISTE!');
      console.log(`   Esperado: CONFIRMADO`);
      console.log(`   Obtido: ${updateResponse.data.status}`);
    }

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Dados:', error.response.data);
    }
  }
}

// Executar o teste final
testSimpleStatusChange();
