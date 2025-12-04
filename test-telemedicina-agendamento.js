const axios = require('axios');

async function criarDadosTelemedicina() {
  try {
    console.log('🧪 Criando dados para teste de telemedicina...');

    // 1. Login como admin
    console.log('1. Fazendo login como admin...');
    const loginResponse = await axios.post('http://localhost:3000/auth/login', {
      email: 'admin@sgh.com',
      password: 'admin123'
    });

    const token = loginResponse.data.token;
    console.log('✅ Login realizado com sucesso');

    const authHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // 2. Criar paciente para telemedicina
    console.log('2. Criando paciente para telemedicina...');
    const pacienteData = {
      nome: 'João da Silva',
      cpf: '123.456.789-10',
      email: 'joao.silva@email.com',
      telefone: '(11) 99999-8888',
      dataNascimento: '1980-05-15',
      endereco: 'Rua das Flores, 123',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567'
    };

    const pacienteResponse = await axios.post(
      'http://localhost:3000/pacientes', 
      pacienteData, 
      { headers: authHeaders }
    );
    console.log('✅ Paciente criado:', pacienteResponse.data.nome);

    // 3. Buscar médicos disponíveis
    console.log('3. Buscando médicos...');
    const medicosResponse = await axios.get(
      'http://localhost:3000/auth/medicos', 
      { headers: authHeaders }
    );
    
    if (medicosResponse.data.length === 0) {
      console.log('⚠️ Nenhum médico encontrado, criando um...');
      // Implementar criação de médico se necessário
    }

    const medico = medicosResponse.data[0];
    console.log('✅ Médico encontrado:', medico.nome);

    // 4. Criar agendamento de telemedicina
    console.log('4. Criando agendamento de telemedicina...');
    const agendamentoData = {
      pacienteId: pacienteResponse.data.id,
      medicoId: medico.id,
      dataHora: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hora no futuro
      tipo: 'TELEMEDICINA',
      status: 'CONFIRMADO',
      observacoes: 'Consulta via videochamada - Teste'
    };

    const agendamentoResponse = await axios.post(
      'http://localhost:3000/agendamentos', 
      agendamentoData, 
      { headers: authHeaders }
    );

    console.log('✅ Agendamento de telemedicina criado!');
    console.log('📋 Detalhes:');
    console.log(`   - ID: ${agendamentoResponse.data.id}`);
    console.log(`   - Paciente: ${pacienteResponse.data.nome}`);
    console.log(`   - Médico: ${medico.nome}`);
    console.log(`   - Data/Hora: ${agendamentoResponse.data.dataHora}`);
    console.log(`   - Tipo: ${agendamentoResponse.data.tipo}`);
    console.log(`   - Status: ${agendamentoResponse.data.status}`);

    console.log('\n🎯 Para testar a videochamada:');
    console.log(`1. Acesse: http://localhost:8080/agendamentos`);
    console.log(`2. Encontre o agendamento de ${pacienteResponse.data.nome}`);
    console.log(`3. Clique em "Iniciar Videochamada"`);
    console.log(`4. URL da sala: http://localhost:8080/telemedicina/${agendamentoResponse.data.id}`);

    return agendamentoResponse.data.id;

  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
    return null;
  }
}

criarDadosTelemedicina();