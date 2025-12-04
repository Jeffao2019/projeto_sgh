const axios = require('axios');

// Função para gerar CPF válido
function gerarCPFValido() {
  // Gera os 9 primeiros dígitos
  const cpfArray = [];
  for (let i = 0; i < 9; i++) {
    cpfArray[i] = Math.floor(Math.random() * 9);
  }

  // Calcula o primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += cpfArray[i] * (10 - i);
  }
  let resto = soma % 11;
  cpfArray[9] = resto < 2 ? 0 : 11 - resto;

  // Calcula o segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += cpfArray[i] * (11 - i);
  }
  resto = soma % 11;
  cpfArray[10] = resto < 2 ? 0 : 11 - resto;

  return cpfArray.join('');
}

async function criarElisangelaComCPFValido() {
  console.log('👩 Criando paciente Elisangela com CPF válido...\n');

  try {
    const login = await axios.post('http://localhost:3000/auth/login', {
      email: 'admin@sgh.com',
      password: '123456'
    });

    const headers = { Authorization: `Bearer ${login.data.token}` };
    
    // Gerar CPF válido
    const cpfNumeros = gerarCPFValido();
    const cpfFormatado = `${cpfNumeros.substr(0,3)}.${cpfNumeros.substr(3,3)}.${cpfNumeros.substr(6,3)}-${cpfNumeros.substr(9,2)}`;
    
    console.log(`🔢 CPF gerado: ${cpfFormatado}`);

    const pacienteData = {
      nome: 'Elisangela Ferreira dos Santos',
      cpf: cpfFormatado,
      email: 'elisangela.ferreira.santos@email.com',
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

    const resultado = await axios.post('http://localhost:3000/pacientes', pacienteData, { headers });
    
    console.log('✅ PACIENTE ELISANGELA CRIADA COM SUCESSO!');
    console.log(`🆔 ID: ${resultado.data.id}`);
    console.log(`👩 Nome: ${resultado.data.nome}`);
    console.log(`📱 Telefone: ${resultado.data.telefone}`);
    console.log(`🆔 CPF: ${resultado.data.cpf}`);

    // Agora criar agendamento para ela
    console.log('\n📅 Criando agendamento para videochamada...');
    
    const medicos = await axios.get('http://localhost:3000/auth/medicos', { headers });
    const drCarlos = medicos.data.find(m => m.nome.toLowerCase().includes('carlos')) || medicos.data[0];

    const hoje = new Date();
    const dataAgendamento = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 14, 0, 0);
    
    const agendamento = await axios.post('http://localhost:3000/agendamentos', {
      pacienteId: resultado.data.id,
      medicoId: drCarlos.id,
      dataHora: dataAgendamento.toISOString(),
      tipo: 'TELEMEDICINA',
      observacoes: 'Teste de videochamada - Paciente Elisangela Ferreira dos Santos'
    }, { headers });

    console.log('✅ Agendamento criado com sucesso!');
    console.log('\n🎉 SETUP COMPLETO PARA TESTE DE VIDEOCHAMADA!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`👩 PACIENTE: ${resultado.data.nome}`);
    console.log(`📱 TELEFONE: ${resultado.data.telefone}`);
    console.log(`👨‍⚕️ MÉDICO: ${drCarlos.nome}`);
    console.log(`📅 DATA: ${hoje.toLocaleDateString('pt-BR')} às 14:00`);
    console.log(`🎥 TIPO: TELEMEDICINA (Videochamada)`);
    console.log(`🆔 AGENDAMENTO: ${agendamento.data.id}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return resultado.data;

  } catch (error) {
    console.log('❌ Erro:', error.response?.data || error.message);
    return null;
  }
}

criarElisangelaComCPFValido();
