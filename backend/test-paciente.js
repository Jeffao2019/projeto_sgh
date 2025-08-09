const axios = require('axios');

async function testPacienteRegistration() {
  try {
    console.log('📤 Enviando dados de cadastro de paciente:');
    
    const pacienteData = {
      nome: 'João Carlos Silva',
      cpf: '52998224725', // CPF válido diferente
      telefone: '(11) 98888-8888',
      email: 'joao.carlos@email.com',
      dataNascimento: '1990-03-20',
      endereco: {
        cep: '01234-567',
        logradouro: 'Rua das Flores',
        numero: '123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP'
      }
    };
    
    console.log(JSON.stringify(pacienteData, null, 2));

    // Token obtido do teste de registro
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwZjVlOWVkZS01MTM0LTRhZDQtOGY0MS05MGFiZDFmZjg4ZDMiLCJlbWFpbCI6ImpvYW8udGVzdGVAZW1haWwuY29tIiwicm9sZSI6Ik1FRElDTyIsImlhdCI6MTc1NDcwNjg5MCwiZXhwIjoxNzU0NzkzMjkwfQ.SXyeuXFACN395buVrD79Utdg5nhfsdoPpfG2iBQ5M8Q';

    const response = await axios.post('http://localhost:3001/pacientes', pacienteData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      timeout: 10000
    });

    console.log('✅ Paciente cadastrado com sucesso!');
    console.log('Status:', response.status);
    console.log('Data:', response.data);

  } catch (error) {
    console.log('❌ Erro no cadastro do paciente:');
    console.log('Status:', error.response?.status || 'N/A');
    console.log('Data:', error.response?.data || error.message);
  }
}

testPacienteRegistration();
