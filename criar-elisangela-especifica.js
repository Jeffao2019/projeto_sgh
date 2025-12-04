const axios = require('axios');

async function criarPacienteElisangela() {
  console.log('👩 Criando especificamente a paciente Elisangela Ferreira dos Santos...\n');

  try {
    // Login
    const login = await axios.post('http://localhost:3000/auth/login', {
      email: 'admin@sgh.com',
      password: '123456'
    });

    const headers = { Authorization: `Bearer ${login.data.token}` };

    // Verificar se já existe
    const pacientes = await axios.get('http://localhost:3000/pacientes', { headers });
    const elisangelaExistente = pacientes.data.find(p => 
      p.nome && p.nome.toLowerCase().includes('elisangela')
    );

    if (elisangelaExistente) {
      console.log(`✅ Paciente Elisangela já existe: ${elisangelaExistente.nome} (ID: ${elisangelaExistente.id})`);
      console.log(`📱 Telefone: ${elisangelaExistente.telefone}`);
      return elisangelaExistente;
    }

    // Criar paciente com dados mínimos necessários
    const pacienteData = {
      nome: 'Elisangela Ferreira dos Santos',
      cpf: '11122233344', // CPF simples sem pontuação
      email: 'elisangela.teste@email.com',
      telefone: '41999188632', // Telefone sem formatação especial
      dataNascimento: '1985-03-15',
      endereco: {
        cep: '80010000', // CEP sem traço
        logradouro: 'Rua das Flores',
        numero: '123',
        bairro: 'Centro',
        cidade: 'Curitiba',
        estado: 'PR'
      }
    };

    console.log('🔄 Tentando criar com dados simplificados...');
    const resultado = await axios.post('http://localhost:3000/pacientes', pacienteData, { headers });
    
    console.log('✅ PACIENTE ELISANGELA CRIADA COM SUCESSO!');
    console.log(`🆔 ID: ${resultado.data.id}`);
    console.log(`👩 Nome: ${resultado.data.nome}`);
    console.log(`📱 Telefone: ${resultado.data.telefone}`);
    console.log(`📧 Email: ${resultado.data.email}`);

    return resultado.data;

  } catch (error) {
    console.log('❌ Erro ao criar paciente:');
    if (error.response?.data) {
      console.log('   Resposta do servidor:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('   Erro:', error.message);
    }
    
    console.log('\n💡 Vamos tentar com formatação diferente...');
    
    try {
      // Tentar novamente com formatação padrão brasileira
      const login = await axios.post('http://localhost:3000/auth/login', {
        email: 'admin@sgh.com',
        password: '123456'
      });

      const headers = { Authorization: `Bearer ${login.data.token}` };

      const pacienteFormatado = {
        nome: 'Elisangela Ferreira dos Santos',
        cpf: '111.222.333-44',
        email: 'elisangela.ferreira@email.com',
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
      };

      const resultado = await axios.post('http://localhost:3000/pacientes', pacienteFormatado, { headers });
      console.log('✅ PACIENTE ELISANGELA CRIADA (segunda tentativa)!');
      console.log(`🆔 ID: ${resultado.data.id}`);
      console.log(`👩 Nome: ${resultado.data.nome}`);
      return resultado.data;

    } catch (error2) {
      console.log('❌ Segunda tentativa também falhou:', error2.response?.data || error2.message);
      return null;
    }
  }
}

criarPacienteElisangela();
