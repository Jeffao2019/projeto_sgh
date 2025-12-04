const axios = require('axios');

// Teste simples para verificar permissões
console.log('🔓 TESTANDO PERMISSÕES DE ADMINISTRADOR PARA CADASTRO DE PACIENTES');
console.log('═'.repeat(70));

async function teste() {
  try {
    console.log('📡 Testando conectividade...');
    
    // Teste básico de conectividade
    const health = await axios.get('http://localhost:3000/auth/debug');
    console.log('✅ Backend está respondendo');
    console.log(`📊 Total de usuários: ${health.data.totalUsers}`);
    
    // Login como admin
    console.log('\n🔐 Fazendo login como administrador...');
    const login = await axios.post('http://localhost:3000/auth/login', {
      email: 'admin@sgh.com',
      password: '123456'
    });
    
    const token = login.data.token;
    const headers = { Authorization: `Bearer ${token}` };
    console.log('✅ Login realizado');
    
    // Verificar perfil
    console.log('\n👤 Verificando perfil...');
    const perfil = await axios.get('http://localhost:3000/auth/profile', { headers });
    console.log(`Nome: ${perfil.data.nome}`);
    console.log(`Role: ${perfil.data.role}`);
    console.log(`Papel: ${perfil.data.papel}`);
    
    // Teste de listagem (deve funcionar)
    console.log('\n📋 Testando listagem de pacientes...');
    const pacientes = await axios.get('http://localhost:3000/pacientes', { headers });
    console.log(`✅ Listagem OK - ${pacientes.data.length} pacientes`);
    
    // Teste de cadastro (deve funcionar agora)
    console.log('\n➕ Testando cadastro de paciente...');
    const novoPaciente = {
      nome: 'Admin Teste Permissão',
      cpf: '111.444.777-35',
      email: 'admin.teste.permissao@email.com',
      telefone: '(11) 98765-4321',
      dataNascimento: '1990-01-01',
      endereco: {
        cep: '01310-100',
        logradouro: 'Avenida Paulista',
        numero: '1000',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        estado: 'SP'
      }
    };
    
    const resultado = await axios.post('http://localhost:3000/pacientes', novoPaciente, { headers });
    console.log('✅ CADASTRO FUNCIONOU!');
    console.log(`ID: ${resultado.data.id}`);
    console.log(`Nome: ${resultado.data.nome}`);
    
  } catch (error) {
    console.log('\n❌ ERRO:');
    console.log(`Status: ${error.response?.status}`);
    console.log(`Mensagem: ${error.response?.data?.message || error.message}`);
    
    if (error.response?.status === 403) {
      console.log('\n🚫 PROBLEMA: Permissão negada para administrador!');
      console.log('Isso vai contra os requisitos funcionais.');
    }
  }
}

teste();
