/**
 * Script para verificar usuários administradores do SGH
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3008';

async function verificarAdministradores() {
  console.log('🔐 ========== VERIFICAÇÃO: USUÁRIOS ADMINISTRADORES ==========');
  console.log('');

  try {
    // 1. Buscar informações dos usuários administradores
    console.log('🔍 Buscando usuários administradores...');
    const debugResponse = await axios.get(`${API_BASE_URL}/auth/debug`);
    const debugData = debugResponse.data;

    console.log(`📊 Total de usuários no sistema: ${debugData.totalUsers}`);
    console.log(`👥 Usuários administradores encontrados: ${debugData.adminUsers.length}`);
    console.log('');

    // 2. Exibir detalhes dos administradores
    if (debugData.adminUsers.length === 0) {
      console.log('❌ Nenhum usuário administrador encontrado!');
      console.log('💡 Execute o script criar-admin.js para criar um administrador.');
      return;
    }

    debugData.adminUsers.forEach((admin, index) => {
      console.log(`👤 ADMINISTRADOR ${index + 1}:`);
      console.log(`   📧 Email: ${admin.email}`);
      console.log(`   👨‍💼 Nome: ${admin.nome}`);
      console.log(`   🆔 ID: ${admin.id}`);
      console.log(`   🎭 Papel: ${admin.role}`);
      console.log(`   ✅ Ativo: ${admin.isActive ? 'Sim' : 'Não'}`);
      console.log(`   🔑 Senha padrão: 123456 (caso não tenha sido alterada)`);
      console.log('');
    });

    // 3. Testar login com cada administrador
    console.log('🧪 ========== TESTANDO LOGIN DOS ADMINISTRADORES ==========');
    console.log('');

    for (let i = 0; i < debugData.adminUsers.length; i++) {
      const admin = debugData.adminUsers[i];
      console.log(`🔐 Testando login para: ${admin.email}`);
      
      try {
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
          email: admin.email,
          password: '123456'
        });

        console.log(`   ✅ Login SUCESSO!`);
        console.log(`   🎫 Token gerado: ${loginResponse.data.token ? 'Sim' : 'Não'}`);
        console.log(`   👤 Dados retornados:`, {
          nome: loginResponse.data.user?.nome || loginResponse.data.nome,
          email: loginResponse.data.user?.email || loginResponse.data.email,
          papel: loginResponse.data.user?.role || loginResponse.data.role
        });
        console.log('');

      } catch (error) {
        if (error.response?.status === 401) {
          console.log(`   ❌ Login FALHOU: Credenciais inválidas`);
          console.log(`   💡 A senha padrão (123456) pode ter sido alterada`);
        } else {
          console.log(`   ⚠️ Erro no login:`, error.response?.data?.message || error.message);
        }
        console.log('');
      }
    }

    // 4. Informações adicionais
    console.log('📝 ========== INFORMAÇÕES IMPORTANTES ==========');
    console.log('');
    console.log('🔑 CREDENCIAIS PADRÃO:');
    debugData.adminUsers.forEach((admin) => {
      console.log(`   📧 Email: ${admin.email}`);
      console.log(`   🔐 Senha: 123456 (padrão)`);
      console.log('');
    });

    console.log('🌐 ACESSO AO SISTEMA:');
    console.log(`   🖥️ Backend: ${API_BASE_URL}`);
    console.log(`   🌍 Frontend: http://localhost:5173 (se rodando)`);
    console.log('');

    console.log('🛠️ COMANDOS ÚTEIS:');
    console.log('   📦 Criar admin: node criar-admin.js');
    console.log('   🔍 Verificar users: node verificar-usuarios-admin.js');
    console.log('   🚀 Iniciar backend: npm run start:dev');
    console.log('   🎨 Iniciar frontend: npm run dev');
    console.log('');

  } catch (error) {
    console.error('❌ Erro ao verificar administradores:', error.response?.data || error.message);
  }
}

verificarAdministradores();
