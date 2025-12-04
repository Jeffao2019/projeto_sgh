const axios = require('axios');

async function testarCadastroAdmin() {
  console.log('🔐 Testando cadastro de paciente como ADMINISTRADOR...\n');

  try {
    // 1. Login como admin
    console.log('1. Fazendo login como admin...');
    const loginResponse = await axios.post('http://localhost:3000/auth/login', {
      email: 'admin@sgh.com',
      password: '123456'
    });

    const token = loginResponse.data.token;
    const headers = { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    console.log('✅ Login realizado com sucesso');

    // 2. Verificar perfil do usuário
    console.log('\n2. Verificando perfil do usuário...');
    const perfilResponse = await axios.get('http://localhost:3000/auth/profile', { headers });
    console.log('✅ Perfil obtido:');
    console.log(`   Nome: ${perfilResponse.data.nome}`);
    console.log(`   Email: ${perfilResponse.data.email}`);
    console.log(`   Role: ${perfilResponse.data.role}`);
    console.log(`   ID: ${perfilResponse.data.id}`);

    // 3. Tentar listar pacientes primeiro
    console.log('\n3. Testando listagem de pacientes...');
    try {
      const pacientesResponse = await axios.get('http://localhost:3000/pacientes', { headers });
      console.log(`✅ Listagem funcionou - Total: ${pacientesResponse.data.length} pacientes`);
    } catch (error) {
      console.log(`❌ Erro na listagem: ${error.response?.status} - ${error.response?.data?.message}`);
      return;
    }

    // 4. Tentar cadastrar paciente
    console.log('\n4. Tentando cadastrar novo paciente...');
    
    const pacienteData = {
      nome: 'Teste Admin Cadastro',
      cpf: '111.444.777-35', // CPF válido
      email: 'teste.admin@email.com',
      telefone: '(11) 99999-9999',
      dataNascimento: '1990-01-01',
      endereco: {
        cep: '01310-100',
        logradouro: 'Avenida Paulista',
        numero: '1000',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        estado: 'SP'
      },
      convenio: 'Particular'
    };

    console.log('   Dados do paciente:', JSON.stringify(pacienteData, null, 2));
    
    try {
      const createResponse = await axios.post('http://localhost:3000/pacientes', pacienteData, { headers });
      console.log('✅ PACIENTE CADASTRADO COM SUCESSO!');
      console.log(`   ID: ${createResponse.data.id}`);
      console.log(`   Nome: ${createResponse.data.nome}`);
      console.log(`   CPF: ${createResponse.data.cpf}`);
    } catch (error) {
      console.log('❌ ERRO AO CADASTRAR PACIENTE:');
      console.log(`   Status: ${error.response?.status}`);
      console.log(`   Erro: ${JSON.stringify(error.response?.data, null, 2)}`);
      
      if (error.response?.status === 403) {
        console.log('\n🔒 PROBLEMA DE PERMISSÃO DETECTADO!');
        console.log('   O administrador não tem permissão para cadastrar pacientes.');
        console.log('   Isso vai contra os requisitos funcionais que especificam que');
        console.log('   administradores devem gerenciar cadastros (pacientes, profissionais).');
      }
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.response?.data || error.message);
  }
}

testarCadastroAdmin();
