const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function teste() {
  console.log('🏥 Teste rápido de criação de dados para videochamada...\n');

  try {
    // 1. Login
    const login = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@sgh.com',
      password: '123456'
    });

    const headers = { Authorization: `Bearer ${login.data.token}` };
    console.log('✅ Login realizado!');

    // 2. Verificar médicos
    const medicos = await axios.get(`${BASE_URL}/auth/medicos`, { headers });
    console.log(`✅ Médicos encontrados: ${medicos.data.length}`);
    
    let drCarlos = medicos.data.find(m => 
      m.nome && m.nome.toLowerCase().includes('carlos')
    );

    if (!drCarlos && medicos.data.length > 0) {
      drCarlos = medicos.data[0]; // Pegar o primeiro médico disponível
      console.log(`✅ Usando médico: ${drCarlos.nome} (ID: ${drCarlos.id})`);
    }

    if (!drCarlos) {
      console.log('❌ Nenhum médico disponível');
      return;
    }

    // 3. Verificar pacientes existentes
    const pacientes = await axios.get(`${BASE_URL}/pacientes`, { headers });
    console.log(`✅ Pacientes existentes: ${pacientes.data.length}`);
    
    let pacienteElisangela = pacientes.data.find(p => 
      p.nome && p.nome.toLowerCase().includes('elisangela')
    );

    if (!pacienteElisangela) {
      console.log('👩 Paciente Elisangela não encontrada, tentando criar...');
      
      // Tentar criar com estrutura mínima
      try {
        const novaPaciente = await axios.post(`${BASE_URL}/pacientes`, {
          nome: 'Elisangela Ferreira dos Santos',
          cpf: '111.444.777-35',
          email: 'elisangela.teste@email.com',
          telefone: '(41) 99918-8632',
          dataNascimento: '1985-03-15',
          endereco: {
            cep: '80010-000',
            logradouro: 'Rua das Flores',
            numero: '123',
            bairro: 'Centro',
            cidade: 'Curitiba',
            estado: 'PR'
          }
        }, { headers });
        
        pacienteElisangela = novaPaciente.data;
        console.log(`✅ Paciente Elisangela criada! (ID: ${pacienteElisangela.id})`);
      } catch (error) {
        // Se não conseguir criar, pegar uma paciente existente
        if (pacientes.data.length > 0) {
          pacienteElisangela = pacientes.data[0];
          console.log(`⚠️ Erro ao criar, usando paciente existente: ${pacienteElisangela.nome}`);
        } else {
          console.log('❌ Erro ao criar paciente e nenhuma existente disponível');
          return;
        }
      }
    } else {
      console.log(`✅ Paciente Elisangela encontrada! (ID: ${pacienteElisangela.id})`);
    }

    // 4. Criar agendamento para hoje às 14:00
    const hoje = new Date();
    const dataAgendamento = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 14, 0, 0);
    
    console.log('\n📅 Criando agendamento de teleconsulta...');
    
    const agendamento = await axios.post(`${BASE_URL}/agendamentos`, {
      pacienteId: pacienteElisangela.id,
      medicoId: drCarlos.id,
      dataHora: dataAgendamento.toISOString(),
      tipo: 'TELEMEDICINA',
      observacoes: 'Teste de videochamada - Sistema SGH'
    }, { headers });

    console.log('✅ Agendamento criado com sucesso!');
    console.log('\n🎉 DADOS DE TESTE CRIADOS!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`👩 PACIENTE: ${pacienteElisangela.nome}`);
    console.log(`📱 TELEFONE: ${pacienteElisangela.telefone || '(41) 99918-8632'}`);
    console.log(`👨‍⚕️ MÉDICO: ${drCarlos.nome}`);
    console.log(`📅 DATA: ${hoje.toLocaleDateString('pt-BR')} às 14:00`);
    console.log(`🎥 TIPO: TELECONSULTA`);
    console.log(`🆔 AGENDAMENTO ID: ${agendamento.data.id}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n▶️ PARA TESTAR A VIDEOCHAMADA:');
    console.log(`   1. Login no sistema como: ${drCarlos.nome}`);
    console.log('   2. Acesse a agenda do dia');
    console.log('   3. Localize a consulta da Elisangela às 14:00');
    console.log('   4. Clique para iniciar a videochamada');

  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
  }
}

teste();
