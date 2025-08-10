/**
 * Teste rápido de login via frontend
 */

// Simular uma chamada de login igual ao frontend
async function testarLogin() {
  try {
    console.log('🧪 Testando login via fetch...');
    
    const response = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@sgh.com',
        password: '123456'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Login bem-sucedido!');
    console.log('� Resposta completa:', JSON.stringify(data, null, 2));
    console.log('�🔑 Token:', data.token ? 'Recebido' : 'Não recebido');
    console.log('👤 Usuário:', data.user?.nome || 'Nome não disponível');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testarLogin();
