const axios = require('axios');

const API_BASE_URL = 'http://localhost:3008';

console.log('🔍 TESTANDO EXPORTAÇÃO COM DADOS REAIS');
console.log('='.repeat(50));

async function testarExportacaoComDados() {
  try {
    // 1. Fazer login
    console.log('\n1. Fazendo login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@sgh.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    const headers = { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    console.log('✅ Login realizado com sucesso');

    // 2. Testar backup manual
    console.log('\n2. Testando backup manual...');
    try {
      const backupResponse = await axios.post(`${API_BASE_URL}/backup/manual`, {}, { headers });
      console.log('✅ Backup manual:', backupResponse.data);
    } catch (error) {
      console.log('❌ Erro no backup manual:', error.response?.data || error.message);
    }

    // 3. Testar exportação de pacientes
    console.log('\n3. Testando exportação de pacientes...');
    try {
      const pacientesResponse = await axios.post(`${API_BASE_URL}/backup/exportar`, {
        categoria: 'pacientes'
      }, { headers });
      console.log('✅ Exportação de pacientes:', pacientesResponse.data);
    } catch (error) {
      console.log('❌ Erro ao exportar pacientes:', error.response?.data || error.message);
    }

    // 4. Testar exportação de agendamentos
    console.log('\n4. Testando exportação de agendamentos...');
    try {
      const agendamentosResponse = await axios.post(`${API_BASE_URL}/backup/exportar`, {
        categoria: 'agendamentos'
      }, { headers });
      console.log('✅ Exportação de agendamentos:', agendamentosResponse.data);
    } catch (error) {
      console.log('❌ Erro ao exportar agendamentos:', error.response?.data || error.message);
    }

    // 5. Testar exportação de prontuários
    console.log('\n5. Testando exportação de prontuários...');
    try {
      const prontuariosResponse = await axios.post(`${API_BASE_URL}/backup/exportar`, {
        categoria: 'prontuários'
      }, { headers });
      console.log('✅ Exportação de prontuários:', prontuariosResponse.data);
    } catch (error) {
      console.log('❌ Erro ao exportar prontuários:', error.response?.data || error.message);
    }

    // 6. Testar exportação de usuários
    console.log('\n6. Testando exportação de usuários...');
    try {
      const usuariosResponse = await axios.post(`${API_BASE_URL}/backup/exportar`, {
        categoria: 'usuários'
      }, { headers });
      console.log('✅ Exportação de usuários:', usuariosResponse.data);
    } catch (error) {
      console.log('❌ Erro ao exportar usuários:', error.response?.data || error.message);
    }

    // 7. Verificar dados do sistema
    console.log('\n7. Verificando quantidades reais no sistema...');
    try {
      const [pacientes, agendamentos, prontuarios, usuarios] = await Promise.all([
        axios.get(`${API_BASE_URL}/pacientes`, { headers }),
        axios.get(`${API_BASE_URL}/agendamentos`, { headers }),
        axios.get(`${API_BASE_URL}/prontuarios/with-relations`, { headers }),
        axios.get(`${API_BASE_URL}/auth/medicos`, { headers })
      ]);

      console.log(`📊 Dados reais no sistema:`);
      console.log(`   👥 Pacientes: ${pacientes.data.length}`);
      console.log(`   📅 Agendamentos: ${agendamentos.data.length}`);
      console.log(`   📋 Prontuários: ${prontuarios.data.length}`);
      console.log(`   👨‍⚕️ Usuários: ${usuarios.data.length}`);
    } catch (error) {
      console.log('❌ Erro ao verificar dados:', error.response?.data || error.message);
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.response?.data || error.message);
  }
}

testarExportacaoComDados();
