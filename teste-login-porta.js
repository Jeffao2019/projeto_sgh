async function testarConectividade() {
  console.log('🔍 Testando conectividade com o backend...\n');

  // Teste 1: Status do backup
  try {
    console.log('1️⃣ Testando endpoint /backup/status...');
    const statusResponse = await fetch('http://localhost:3010/backup/status', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      console.log('✅ Backup status:', statusData);
    } else {
      console.log('❌ Erro no status:', statusResponse.status, statusResponse.statusText);
    }
  } catch (error) {
    console.log('❌ Erro de conexão:', error.message);
  }

  // Teste 2: Login
  try {
    console.log('\n2️⃣ Testando login...');
    const loginResponse = await fetch('http://localhost:3010/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@sgh.com',
        senha: 'admin123'
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login bem-sucedido!');
      console.log('🔑 Token:', loginData.access_token ? 'Recebido' : 'Não recebido');
      console.log('👤 Usuário:', loginData.user?.nome || 'Nome não encontrado');
    } else {
      const errorData = await loginResponse.json();
      console.log('❌ Erro no login:', loginResponse.status, errorData);
    }
  } catch (error) {
    console.log('❌ Erro na requisição de login:', error.message);
  }

  // Teste 3: Verificar se há usuário admin
  try {
    console.log('\n3️⃣ Testando endpoint de debug...');
    const debugResponse = await fetch('http://localhost:3010/auth/debug', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (debugResponse.ok) {
      const debugData = await debugResponse.json();
      console.log('✅ Debug info:', debugData);
    } else {
      console.log('❌ Erro no debug:', debugResponse.status);
    }
  } catch (error) {
    console.log('❌ Erro de conexão debug:', error.message);
  }
}

testarConectividade().catch(console.error);
