const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testarUpdateStatusAgendamento() {
  try {
    console.log('🧪 Testando correção do status de agendamento...\n');

    // 1. Fazer login como admin
    console.log('1. Fazendo login como admin...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@sgh.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    const headers = { Authorization: `Bearer ${token}` };
    console.log('✅ Login realizado com sucesso\n');

    // 2. Buscar agendamentos existentes
    console.log('2. Buscando agendamentos...');
    const agendamentosResponse = await axios.get(`${BASE_URL}/agendamentos`, { headers });
    const agendamentos = agendamentosResponse.data;
    
    if (agendamentos.length === 0) {
      console.log('⚠️  Nenhum agendamento encontrado. Criando um para teste...');
      
      // Buscar pacientes e médicos
      const pacientesResponse = await axios.get(`${BASE_URL}/pacientes`, { headers });
      const medicosResponse = await axios.get(`${BASE_URL}/auth/medicos`, { headers });
      
      if (pacientesResponse.data.length === 0 || medicosResponse.data.length === 0) {
        console.log('❌ Não há pacientes ou médicos cadastrados');
        return;
      }
      
      const paciente = pacientesResponse.data[0];
      const medico = medicosResponse.data[0];
      
      // Criar agendamento teste
      const novoAgendamento = {
        pacienteId: paciente.id,
        medicoId: medico.id,
        dataHora: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 horas no futuro
        tipo: 'CONSULTA_GERAL',
        observacoes: 'Agendamento para teste de status'
      };
      
      const createResponse = await axios.post(`${BASE_URL}/agendamentos`, novoAgendamento, { headers });
      agendamentos.push(createResponse.data);
      console.log('✅ Agendamento de teste criado\n');
    }

    const agendamento = agendamentos[0];
    console.log(`✅ Agendamento encontrado: ${agendamento.id}`);
    console.log(`   Status atual: ${agendamento.status}`);
    console.log(`   Data/Hora: ${agendamento.dataHora}\n`);

    // 3. Testar atualização APENAS do status para CONFIRMADO
    console.log('3. Testando atualização APENAS do status para CONFIRMADO...');
    
    const updateData = {
      status: 'CONFIRMADO'
      // Propositalmente NÃO incluindo dataHora, tipo ou observacoes
    };
    
    const updateResponse = await axios.put(
      `${BASE_URL}/agendamentos/${agendamento.id}`,
      updateData,
      { headers }
    );
    
    console.log('✅ Requisição de atualização enviada');
    console.log(`   Status retornado: ${updateResponse.data.status}`);
    
    // 4. Verificar se o status foi atualizado corretamente
    console.log('\n4. Verificando se o status foi atualizado corretamente...');
    
    const verificacaoResponse = await axios.get(
      `${BASE_URL}/agendamentos/${agendamento.id}`,
      { headers }
    );
    
    const agendamentoAtualizado = verificacaoResponse.data;
    console.log(`   Status após atualização: ${agendamentoAtualizado.status}`);
    
    if (agendamentoAtualizado.status === 'CONFIRMADO') {
      console.log('🎉 SUCESSO! O status foi atualizado corretamente para CONFIRMADO');
      console.log('🔧 O problema foi resolvido!');
    } else {
      console.log(`❌ FALHOU! O status deveria ser CONFIRMADO mas é ${agendamentoAtualizado.status}`);
      
      if (agendamentoAtualizado.status === 'REAGENDADO') {
        console.log('🐛 Problema confirmado: ainda está forçando REAGENDADO');
      }
    }

    // 5. Testar outras atualizações de status
    console.log('\n5. Testando outros status...');
    
    const outrosStatus = ['AGENDADO', 'CANCELADO', 'FINALIZADO'];
    
    for (const novoStatus of outrosStatus) {
      console.log(`\n   Testando status: ${novoStatus}`);
      
      const updateStatusResponse = await axios.put(
        `${BASE_URL}/agendamentos/${agendamento.id}`,
        { status: novoStatus },
        { headers }
      );
      
      if (updateStatusResponse.data.status === novoStatus) {
        console.log(`   ✅ ${novoStatus}: Correto`);
      } else {
        console.log(`   ❌ ${novoStatus}: Falhou (retornou ${updateStatusResponse.data.status})`);
      }
    }

    // 6. Testar reagendamento real (mudança de data)
    console.log('\n6. Testando reagendamento real (mudança de data)...');
    
    const novaData = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(); // 4 horas no futuro
    
    const reagendamentoResponse = await axios.put(
      `${BASE_URL}/agendamentos/${agendamento.id}`,
      { dataHora: novaData },
      { headers }
    );
    
    console.log(`   Status após mudança de data: ${reagendamentoResponse.data.status}`);
    
    if (reagendamentoResponse.data.status === 'REAGENDADO') {
      console.log('   ✅ Reagendamento real: Correto (deve ser REAGENDADO)');
    } else {
      console.log(`   ⚠️  Reagendamento real: Inesperado (${reagendamentoResponse.data.status})`);
    }

    // 7. Testar mudança de data + status específico
    console.log('\n7. Testando mudança de data + status específico...');
    
    const novaData2 = new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString();
    
    const mudancaComStatusResponse = await axios.put(
      `${BASE_URL}/agendamentos/${agendamento.id}`,
      { 
        dataHora: novaData2,
        status: 'CONFIRMADO' // Deve prevalecer o status especificado
      },
      { headers }
    );
    
    console.log(`   Status após mudança de data + status: ${mudancaComStatusResponse.data.status}`);
    
    if (mudancaComStatusResponse.data.status === 'CONFIRMADO') {
      console.log('   ✅ Mudança com status específico: Correto');
    } else {
      console.log(`   ❌ Mudança com status específico: Falhou (${mudancaComStatusResponse.data.status})`);
    }

    console.log('\n🏁 Teste concluído!');

  } catch (error) {
    console.error('❌ Erro no teste:');
    console.error('Message:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Full error:', error);
    }
  }
}

testarUpdateStatusAgendamento();