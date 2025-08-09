const axios = require('axios');

async function testRegister() {
  try {
    const registerData = {
      nome: "João Teste",
      email: "joao.teste@email.com",
      password: "123456789",
      confirmPassword: "123456789",
      role: "MEDICO",
      telefone: "(11) 99999-9999",
      acceptTerms: true
    };

    console.log('📤 Enviando dados de registro:', registerData);
    
    const response = await axios.post('http://localhost:3001/auth/register', registerData);
    
    console.log('✅ Registro bem-sucedido:', response.data);
    
  } catch (error) {
    console.error('❌ Erro no registro:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testRegister();
