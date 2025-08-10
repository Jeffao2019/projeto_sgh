const axios = require('axios');

const API_BASE_URL = 'http://localhost:3002';

async function testCriarProntuarioPorta3002() {
  try {
    console.log('🧪 [TESTE PORTA 3002] Testando criação de prontuário...\n');

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
    const [pacientesResponse, medicosResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/pacientes`, { headers }),
      axios.get(`${API_BASE_URL}/auth/medicos`, { headers })
    ]);
    
    const pacientes = pacientesResponse.data;
    const medicos = medicosResponse.data;
    
    console.log(`✅ ${pacientes.length} pacientes encontrados`);
    console.log(`✅ ${medicos.length} médicos encontrados`);

    // 3. Criar um agendamento novo
    console.log('\n3. Criando novo agendamento...');
    const novoAgendamento = {
      pacienteId: pacientes[0].id,
      medicoId: medicos[0].id,
      dataHora: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      tipo: 'CONSULTA_GERAL',
      observacoes: 'Agendamento para teste de criação de prontuário - porta 3002'
    };
    
    const agendamentoResponse = await axios.post(`${API_BASE_URL}/agendamentos`, novoAgendamento, { headers });
    const agendamentoId = agendamentoResponse.data.id;
    console.log(`✅ Agendamento criado: ${agendamentoId.substring(0, 8)}...`);
    
    // 4. Confirmar o agendamento
    console.log('4. Confirmando agendamento...');
    await axios.put(`${API_BASE_URL}/agendamentos/${agendamentoId}/confirmar`, {}, { headers });
    console.log('✅ Agendamento confirmado');
    
    // 5. Criar o prontuário
    console.log('\n5. Criando prontuário...');
    const prontuarioData = {
      pacienteId: pacientes[0].id,
      medicoId: medicos[0].id,
      agendamentoId: agendamentoId,
      dataConsulta: new Date().toISOString(),
      anamnese: 'Teste de criação de prontuário via porta 3002',
      exameFisico: 'Exame físico de teste realizado.',
      diagnostico: 'Teste diagnóstico - porta 3002',
      prescricaoUsoInterno: 'Medicação teste interna',
      prescricaoUsoExterno: 'Medicação teste externa',
      observacoes: 'Observações de teste para prontuário.'
    };

    console.log('📤 Enviando dados do prontuário...');
    const createResponse = await axios.post(`${API_BASE_URL}/prontuarios`, prontuarioData, { headers });
    
    console.log('\n🎉 SUCESSO! Prontuário criado com sucesso!');
    console.log(`📋 ID do prontuário: ${createResponse.data.id}`);
    console.log(`📅 Data da consulta: ${createResponse.data.dataConsulta}`);
    console.log(`📊 Diagnóstico: ${createResponse.data.diagnostico}`);
    
    console.log('\n✅ TESTE CONCLUÍDO! A criação de prontuários está funcionando na porta 3002.');
    console.log('🔧 Não há erro 500 nesta porta.');

  } catch (error) {
    console.error('\n❌ ERRO NO TESTE:');
    console.error('Mensagem:', error.message);
    
    if (error.response) {
      console.error('Status HTTP:', error.response.status);
      console.error('Dados da resposta:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 500) {
        console.error('\n🚨 ERRO 500 DETECTADO! Verificando logs do backend...');
      }
    } else {
      console.error('Erro de rede ou conexão:', error.code);
    }
  }
}

// Executar o teste
testCriarProntuarioPorta3002();
