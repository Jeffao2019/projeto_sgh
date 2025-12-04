const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function criarPacienteEAgendamento() {
  try {
    console.log('🏥 Criando paciente e agendamento para teste de videochamada...\n');

    // 1. Primeiro fazer login para obter token
    console.log('🔐 Fazendo login para obter token...');
    let authToken;
    try {
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: 'admin@sgh.com',
        password: '123456'
      });
      authToken = loginResponse.data.token;
      console.log('✅ Login realizado com sucesso!');
    } catch (error) {
      console.log('❌ Erro ao fazer login:', error.response?.data || error.message);
      return;
    }

    const headers = { Authorization: `Bearer ${authToken}` };

    // 2. Verificar se existe o médico Dr. Carlos Silva
    console.log('\n🔍 Verificando médico Dr. Carlos Silva...');
    let medico;
    try {
      const medicosResponse = await axios.get(`${BASE_URL}/auth/medicos`, { headers });
      medico = medicosResponse.data.find(m => 
        m.nome && m.nome.toLowerCase().includes('carlos') && m.nome.toLowerCase().includes('silva')
      );
      
      if (!medico) {
        console.log('👨‍⚕️ Médico Dr. Carlos Silva não encontrado, criando...');
        const medicoResponse = await axios.post(`${BASE_URL}/auth/register`, {
          nome: 'Dr. Carlos Silva',
          email: 'dr.carlos.silva@sgh.com',
          password: '123456',
          role: 'MEDICO',
          telefone: '(41) 3333-4444'
        });
        medico = medicoResponse.data.user;
        console.log('✅ Médico Dr. Carlos Silva criado com sucesso!');
      } else {
        console.log('✅ Médico Dr. Carlos Silva encontrado!');
      }
    } catch (error) {
      console.log('❌ Erro ao verificar/criar médico:', error.response?.data || error.message);
      return;
    }

    // 3. Criar a paciente Elisangela Ferreira dos Santos
    console.log('\n👩 Criando paciente Elisangela Ferreira dos Santos...');
    let paciente;
    try {
      const pacienteResponse = await axios.post(`${BASE_URL}/pacientes`, {
        nome: 'Elisangela Ferreira dos Santos',
        cpf: '111.444.777-35', // CPF válido para teste
        email: 'elisangela.santos@email.com',
        telefone: '(41) 99918-8632',
        dataNascimento: '1985-03-15',
        endereco: {
          cep: '80010-000',
          logradouro: 'Rua das Flores',
          numero: '123',
          complemento: 'Apto 45',
          bairro: 'Centro',
          cidade: 'Curitiba',
          estado: 'PR'
        },
        convenio: 'Particular',
        numeroConvenio: null
      }, { headers });
      
      paciente = pacienteResponse.data;
      console.log('✅ Paciente criada com sucesso!');
      console.log(`   ID: ${paciente.id}`);
      console.log(`   Nome: ${paciente.nome}`);
      console.log(`   Telefone: ${paciente.telefone}`);
    } catch (error) {
      console.log('❌ Erro ao criar paciente:', error.response?.data || error.message);
      return;
    }

    // 4. Criar agendamento para hoje às 14:00
    console.log('\n📅 Criando agendamento para hoje às 14:00...');
    const hoje = new Date();
    const dataAgendamento = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 14, 0, 0);
    
    try {
      const agendamentoResponse = await axios.post(`${BASE_URL}/agendamentos`, {
        pacienteId: paciente.id,
        medicoId: medico.id,
        dataHora: dataAgendamento.toISOString(),
        tipoConsulta: 'TELECONSULTA',
        observacoes: 'Teste de videochamada - Paciente Elisangela',
        status: 'AGENDADO'
      }, { headers });
      
      const agendamento = agendamentoResponse.data;
      console.log('✅ Agendamento criado com sucesso!');
      console.log(`   ID: ${agendamento.id}`);
      console.log(`   Data/Hora: ${new Date(agendamento.dataHora).toLocaleString('pt-BR')}`);
      console.log(`   Tipo: ${agendamento.tipoConsulta}`);
      console.log(`   Status: ${agendamento.status}`);
    } catch (error) {
      console.log('❌ Erro ao criar agendamento:', error.response?.data || error.message);
      return;
    }

    console.log('\n🎉 SUCESSO! Paciente e agendamento criados para teste de videochamada!');
    console.log('\n📋 Resumo:');
    console.log(`   👩 Paciente: Elisangela Ferreira dos Santos`);
    console.log(`   📱 Celular: (41) 99918-8632`);
    console.log(`   👨‍⚕️ Médico: Dr. Carlos Silva (ID: ${medico.id})`);
    console.log(`   📅 Consulta: Hoje (${hoje.toLocaleDateString('pt-BR')}) às 14:00`);
    console.log(`   🎥 Tipo: TELECONSULTA (videochamada)`);
    console.log('\n▶️ Para testar a videochamada:');
    console.log('   1. Faça login como Dr. Carlos Silva no sistema');
    console.log('   2. Acesse a agenda do dia');
    console.log('   3. Clique na consulta da Elisangela às 14:00');
    console.log('   4. Inicie a videochamada');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

// Executar o script
criarPacienteEAgendamento();
