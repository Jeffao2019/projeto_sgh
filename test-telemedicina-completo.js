const axios = require('axios');

async function criarAdmin() {
  try {
    console.log('🧪 Criando usuário admin...');

    const adminData = {
      nome: 'Administrador SGH',
      email: 'admin@sgh.com',
      telefone: '(11) 99999-0000',
      password: 'admin123',
      confirmPassword: 'admin123',
      role: 'ADMIN',
      acceptTerms: true
    };

    const response = await axios.post('http://localhost:3000/auth/register', adminData);
    console.log('✅ Admin criado com sucesso:', response.data);
    
  } catch (error) {
    if (error.response?.data?.message?.includes('já existe')) {
      console.log('ℹ️ Admin já existe, continuando...');
    } else {
      console.error('❌ Erro ao criar admin:', error.response?.data || error.message);
    }
  }
}

async function testarTelemedicina() {
  try {
    // Criar admin primeiro
    await criarAdmin();

    console.log('\n🧪 Criando dados para teste de telemedicina...');

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
      nome: 'João da Silva Telemedicina',
      cpf: '123.456.789-99',
      email: 'joao.telemedicina@email.com',
      telefone: '(11) 99999-8888',
      dataNascimento: '1980-05-15',
      endereco: 'Rua das Flores, 123',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567'
    };

    let pacienteResponse;
    try {
      pacienteResponse = await axios.post(
        'http://localhost:3000/pacientes', 
        pacienteData, 
        { headers: authHeaders }
      );
      console.log('✅ Paciente criado:', pacienteResponse.data.nome);
    } catch (error) {
      if (error.response?.data?.message?.includes('já existe')) {
        // Buscar paciente existente
        const pacientesResponse = await axios.get('http://localhost:3000/pacientes', { headers: authHeaders });
        pacienteResponse = { data: pacientesResponse.data.find(p => p.nome.includes('Telemedicina')) || pacientesResponse.data[0] };
        console.log('ℹ️ Usando paciente existente:', pacienteResponse.data.nome);
      } else {
        throw error;
      }
    }

    // 3. Buscar médicos disponíveis
    console.log('3. Buscando médicos...');
    const medicosResponse = await axios.get(
      'http://localhost:3000/auth/medicos', 
      { headers: authHeaders }
    );
    
    let medico;
    if (medicosResponse.data.length === 0) {
      console.log('⚠️ Nenhum médico encontrado, usando dados padrão...');
      // Criar médico via registro
      const medicoData = {
        nome: 'Dr. Carlos Telemedicina',
        email: 'dr.carlos@sgh.com',
        telefone: '(11) 99999-7777',
        password: 'medico123',
        confirmPassword: 'medico123',
        role: 'MEDICO',
        acceptTerms: true,
        crm: '123456',
        especialidade: 'Clínica Geral'
      };
      
      try {
        const medicoResponse = await axios.post('http://localhost:3000/auth/register', medicoData);
        medico = medicoResponse.data.user;
        console.log('✅ Médico criado:', medico.nome);
      } catch (error) {
        if (error.response?.data?.message?.includes('já existe')) {
          const medicosResponse2 = await axios.get('http://localhost:3000/auth/medicos', { headers: authHeaders });
          medico = medicosResponse2.data[0];
          console.log('ℹ️ Usando médico existente:', medico.nome);
        } else {
          throw error;
        }
      }
    } else {
      medico = medicosResponse.data[0];
      console.log('✅ Médico encontrado:', medico.nome);
    }

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

testarTelemedicina();