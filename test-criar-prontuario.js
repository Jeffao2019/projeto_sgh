const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

async function testCriarProntuario() {
  try {
    console.log('🧪 [TESTE PRONTUARIO] Testando criação de prontuário...\n');

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

    // 2. Buscar dados necessários
    console.log('\n2. Buscando dados necessários...');
    const [pacientesResponse, medicosResponse, agendamentosResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/pacientes`, { headers }),
      axios.get(`${API_BASE_URL}/auth/medicos`, { headers }),
      axios.get(`${API_BASE_URL}/agendamentos/para-prontuario`, { headers })
    ]);
    
    const pacientes = pacientesResponse.data;
    const medicos = medicosResponse.data;
    const agendamentos = agendamentosResponse.data;
    
    console.log(`✅ ${pacientes.length} pacientes encontrados`);
    console.log(`✅ ${medicos.length} médicos encontrados`);
    console.log(`✅ ${agendamentos.length} agendamentos para prontuário encontrados`);

    if (pacientes.length === 0 || medicos.length === 0 || agendamentos.length === 0) {
      console.log('❌ Não há dados suficientes para criar um prontuário');
      console.log('💡 Criando agendamento para teste...');
      
      // Criar um agendamento se não houver
      const novoAgendamento = {
        pacienteId: pacientes[0].id,
        medicoId: medicos[0].id,
        dataHora: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        tipo: 'CONSULTA_GERAL',
        observacoes: 'Agendamento para teste de prontuário'
      };
      
      const agendamentoResponse = await axios.post(`${API_BASE_URL}/agendamentos`, novoAgendamento, { headers });
      
      // Confirmar o agendamento
      await axios.put(`${API_BASE_URL}/agendamentos/${agendamentoResponse.data.id}/confirmar`, {}, { headers });
      
      console.log('✅ Agendamento criado e confirmado');
    }

    // Buscar novamente os agendamentos
    const agendamentosAtualizados = await axios.get(`${API_BASE_URL}/agendamentos/para-prontuario`, { headers });
    const agendamento = agendamentosAtualizados.data[0];

    if (!agendamento) {
      console.log('❌ Ainda não há agendamentos confirmados para criar prontuário');
      return;
    }

    console.log(`\n3. Usando agendamento: ${agendamento.id.substring(0, 8)}...`);

    // 3. Criar dados do prontuário
    console.log('\n4. Criando prontuário...');
    const prontuarioData = {
      pacienteId: agendamento.pacienteId,
      medicoId: agendamento.medicoId,
      agendamentoId: agendamento.id,
      dataConsulta: new Date().toISOString(),
      anamnese: 'Paciente relata dor abdominal há 2 dias, sem febre. Alimentação normal.',
      exameFisico: 'Paciente consciente, orientado. Abdome: dor à palpação em hipogástrio. Ausculta pulmonar normal.',
      diagnostico: 'Gastrite aguda',
      prescricaoUsoInterno: 'Omeprazol 20mg - 1 comprimido pela manhã em jejum por 14 dias',
      prescricaoUsoExterno: 'Buscopan Plus 10mg - 1 comprimido de 8/8h se dor por 5 dias',
      observacoes: 'Retorno em 7 dias se persistir sintomas. Dieta leve.'
    };

    console.log('📤 Dados do prontuário:');
    console.log(JSON.stringify({
      ...prontuarioData,
      pacienteId: prontuarioData.pacienteId.substring(0, 8) + '...',
      medicoId: prontuarioData.medicoId.substring(0, 8) + '...',
      agendamentoId: prontuarioData.agendamentoId.substring(0, 8) + '...'
    }, null, 2));

    const createResponse = await axios.post(`${API_BASE_URL}/prontuarios`, prontuarioData, { headers });
    
    console.log('\n✅ SUCESSO! Prontuário criado com sucesso!');
    console.log(`📋 ID do prontuário: ${createResponse.data.id}`);
    console.log(`📅 Data da consulta: ${createResponse.data.dataConsulta}`);
    console.log(`📊 Diagnóstico: ${createResponse.data.diagnostico}`);

    // 4. Verificar se foi salvo corretamente
    console.log('\n5. Verificando se foi salvo corretamente...');
    const verificacaoResponse = await axios.get(`${API_BASE_URL}/prontuarios/${createResponse.data.id}`, { headers });
    
    console.log('✅ Prontuário verificado no banco de dados:');
    console.log(`   - Prescrição Uso Interno: ${verificacaoResponse.data.prescricaoUsoInterno ? 'Preenchida' : 'Vazia'}`);
    console.log(`   - Prescrição Uso Externo: ${verificacaoResponse.data.prescricaoUsoExterno ? 'Preenchida' : 'Vazia'}`);

    console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO! O erro 500 foi resolvido.');

  } catch (error) {
    console.error('\n❌ ERRO NO TESTE:');
    console.error('Mensagem:', error.message);
    
    if (error.response) {
      console.error('Status HTTP:', error.response.status);
      console.error('Dados da resposta:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 500) {
        console.error('\n🚨 ERRO 500 DETECTADO! Vamos investigar...');
        
        // Verificar se é problema de validação
        if (error.response.data.message) {
          console.error('📝 Detalhes do erro:', error.response.data.message);
        }
        
        if (error.response.data.details) {
          console.error('🔍 Detalhes adicionais:', error.response.data.details);
        }
      }
    } else {
      console.error('Erro de rede ou conexão:', error.code);
    }
  }
}

// Executar o teste
testCriarProntuario();
