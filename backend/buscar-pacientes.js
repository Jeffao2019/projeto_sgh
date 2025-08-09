const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

async function buscarPacientes() {
  try {
    // Fazer login para obter o token
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'dr.teste.agendamento@teste.com',
      password: '123456'
    });
    const authToken = loginResponse.data.token;
    
    // Buscar pacientes
    const pacientesResponse = await axios.get(`${API_BASE_URL}/pacientes`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('Pacientes encontrados:');
    pacientesResponse.data.forEach(p => {
      console.log(`- ID: ${p.id}, Nome: ${p.nome}, CPF: ${p.cpf}`);
    });
    
    if (pacientesResponse.data.length > 0) {
      console.log('\nUsando primeiro paciente para teste de agendamento...');
      return pacientesResponse.data[0].id;
    }
    
  } catch (error) {
    console.error('Erro:', error.response?.data || error.message);
  }
}

buscarPacientes();
