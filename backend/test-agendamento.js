const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

async function testAgendamentoCadastro() {
  try {
    console.log('🧪 Iniciando teste de cadastro de agendamento...\n');

    // 1. Primeiro, vamos registrar um usuário médico
    console.log('1. Registrando usuário médico...');
    const medicoData = {
      nome: 'Dr. Teste Agendamento',
      email: 'dr.teste.agendamento@teste.com',
      password: '123456',
      confirmPassword: '123456',
      role: 'MEDICO',
      telefone: '(11) 99999-9999',
      acceptTerms: true
    };

    let medicoResponse;
    let authToken;
    try {
      medicoResponse = await axios.post(`${API_BASE_URL}/auth/register`, medicoData);
      console.log('✅ Médico registrado com sucesso! ID:', medicoResponse.data.id);
      
      // Fazer login para obter o token
      const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: medicoData.email,
        password: medicoData.password
      });
      authToken = loginResponse.data.token;
      medicoResponse = { data: { id: loginResponse.data.user.id } };
      console.log('✅ Login realizado! Token obtido. ID:', medicoResponse.data.id);
    } catch (error) {
      if (error.response?.status === 409) {
        // Se usuário já existe, vamos fazer login para pegar o ID e token
        console.log('ℹ️ Usuário já existe, fazendo login...');
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
          email: medicoData.email,
          password: medicoData.password
        });
        authToken = loginResponse.data.token;
        medicoResponse = { data: { id: loginResponse.data.user.id } };
        console.log('✅ Login realizado! Token obtido. ID:', medicoResponse.data.id);
      } else {
        throw error;
      }
    }

    // 2. Usar um paciente existente (pular criação por enquanto)
    console.log('\n2. Usando paciente existente...');
    const pacienteResponse = { data: { id: 'f3585b14-4260-46eb-8026-81a6c8dbf366' } }; // ID real do banco
    console.log('✅ Paciente selecionado! ID:', pacienteResponse.data.id);

    // 3. Criar agendamento
    console.log('\n3. Criando agendamento...');
    const agendamentoData = {
      pacienteId: pacienteResponse.data.id,
      medicoId: medicoResponse.data.id,
      dataHora: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // amanhã
      tipo: 'CONSULTA_GERAL',
      observacoes: 'Consulta de teste para verificar cadastro'
    };

    console.log('Dados do agendamento:', JSON.stringify(agendamentoData, null, 2));

    const agendamentoResponse = await axios.post(`${API_BASE_URL}/agendamentos`, agendamentoData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ SUCESSO! Agendamento criado com sucesso!');
    console.log('📋 Dados do agendamento criado:');
    console.log(JSON.stringify(agendamentoResponse.data, null, 2));
    
    // 4. Verificar se o agendamento foi realmente salvo
    console.log('\n4. Verificando agendamento criado...');
    const agendamentoId = agendamentoResponse.data.id;
    const verificacaoResponse = await axios.get(`${API_BASE_URL}/agendamentos/${agendamentoId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Agendamento verificado com sucesso!');
    console.log('📋 Dados verificados:');
    console.log(JSON.stringify(verificacaoResponse.data, null, 2));

    console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO! O cadastro de agendamento está funcionando corretamente.');

  } catch (error) {
    console.error('❌ ERRO NO TESTE:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Erro:', error.message);
    }
    
    if (error.response?.status === 500) {
      console.error('\n🚨 ERRO 500 DETECTADO! O problema ainda não foi resolvido.');
    }
  }
}

// Executar o teste
testAgendamentoCadastro();
