/**
 * Script para criar usuário administrador
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

async function criarAdmin() {
  try {
    console.log('🔐 Criando usuário administrador...');
    
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      nome: 'Administrador do Sistema',
      email: 'admin@sgh.com',
      password: '123456',
      confirmPassword: '123456',
      role: 'ADMIN',
      acceptTerms: true
    });
    
    console.log('✅ Usuário administrador criado com sucesso!');
    console.log('📧 Email:', response.data.email);
    console.log('👤 Nome:', response.data.nome);
    console.log('🎭 Papel:', response.data.papel);
    
  } catch (error) {
    if (error.response?.status === 409) {
      console.log('ℹ️ Usuário administrador já existe!');
    } else {
      console.error('❌ Erro ao criar administrador:', error.response?.data || error.message);
    }
  }
}

criarAdmin();
