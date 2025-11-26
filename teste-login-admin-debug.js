/**
 * Script para testar login dos administradores
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3008';

async function testarLoginAdmin() {
  console.log('🔐 ========== TESTE DE LOGIN ADMINISTRADORES ==========');
  console.log('');

  try {
    // 1. Buscar administradores
    console.log('🔍 Buscando administradores...');
    const debugResponse = await axios.get(`${API_BASE_URL}/auth/debug`);
    const adminUsers = debugResponse.data.adminUsers;

    console.log(`👥 Administradores encontrados: ${adminUsers.length}`);
    console.log('');

    // 2. Testar login de cada administrador
    for (let i = 0; i < adminUsers.length; i++) {
      const admin = adminUsers[i];
      console.log(`📧 Testando: ${admin.email}`);
      
      try {
        const loginData = {
          email: admin.email,
          password: '123456'
        };

        console.log('📤 Dados do login:', loginData);
        
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, loginData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('✅ LOGIN SUCESSO!');
        console.log('📥 Resposta completa:');
        console.log(JSON.stringify(loginResponse.data, null, 2));
        
        // Verificar se existe token
        const token = loginResponse.data.access_token || loginResponse.data.token;
        if (token) {
          console.log('🎫 Token encontrado:', token.substring(0, 20) + '...');
          
          // Testar endpoint protegido
          const profileResponse = await axios.get(`${API_BASE_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('👤 Perfil obtido:', profileResponse.data);
        } else {
          console.log('⚠️ Token não encontrado na resposta');
        }
        
        console.log('');

      } catch (error) {
        console.log('❌ ERRO NO LOGIN:');
        if (error.response) {
          console.log('📊 Status:', error.response.status);
          console.log('💬 Mensagem:', error.response.data);
        } else {
          console.log('🚨 Erro:', error.message);
        }
        console.log('');
      }
    }

    // 3. Verificar estrutura da resposta de login esperada
    console.log('📋 ========== DIAGNÓSTICO ==========');
    console.log('');
    
    // Testar com email que sabemos que existe
    try {
      const testResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: 'admin@sgh.com',
        password: '123456'
      });
      
      console.log('🔬 Estrutura da resposta de login:');
      console.log('- Chaves disponíveis:', Object.keys(testResponse.data));
      console.log('- Dados completos:', testResponse.data);
      
    } catch (error) {
      console.log('🚨 Erro ao obter estrutura:', error.response?.data || error.message);
    }

  } catch (error) {
    console.error('💥 Erro geral:', error.response?.data || error.message);
  }
}

testarLoginAdmin();
