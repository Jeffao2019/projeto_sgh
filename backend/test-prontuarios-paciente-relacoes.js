const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const PACIENTE_ID = 'f3585b14-4260-46eb-8026-81a6c8dbf366';

async function testarProntuariosPacienteComRelacoes() {
  try {
    console.log('🔍 Testando endpoint de prontuários por paciente com relações...\n');

    // 1. Fazer login
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'dr.teste.agendamento@teste.com',
      password: '123456'
    });

    const token = loginResponse.data.token;
    console.log('✅ Login realizado com sucesso');

    // 2. Buscar prontuários do paciente com relações
    const response = await axios.get(`${BASE_URL}/prontuarios/paciente/${PACIENTE_ID}/with-relations`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log(`\n📋 Prontuários do paciente encontrados: ${response.data.length}`);
    
    for (const prontuario of response.data) {
      console.log(`\n--- Prontuário ID: ${prontuario.id} ---`);
      console.log(`Paciente: ${prontuario.paciente?.nome || 'Não identificado'} (${prontuario.paciente?.cpf || 'CPF não informado'})`);
      console.log(`Médico: ${prontuario.medico?.nome || 'Não identificado'} (${prontuario.medico?.email || 'Email não informado'})`);
      console.log(`Data: ${new Date(prontuario.dataConsulta).toLocaleDateString('pt-BR')}`);
      console.log(`Diagnóstico: ${prontuario.diagnostico}`);
    }

    console.log('\n🎉 Novo endpoint funcionando corretamente!');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.response?.data || error.message);
  }
}

testarProntuariosPacienteComRelacoes();
