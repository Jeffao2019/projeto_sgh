console.log('🧪 Testando conectividade backend/frontend...');

// Teste 1: Verificar se backend está rodando
async function testarBackend() {
  try {
    console.log('1️⃣ Testando conexão com backend...');
    
    const response = await fetch('http://localhost:3000/backup/status', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Status response:', response.status, response.statusText);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend responde:', data);
      return true;
    } else {
      console.log('❌ Backend não responde corretamente');
      return false;
    }
  } catch (error) {
    console.error('💥 Erro na conexão:', error);
    return false;
  }
}

// Teste 2: Verificar endpoint de configurações
async function testarEndpointConfiguracoes() {
  try {
    console.log('2️⃣ Testando endpoint de configurações...');
    
    // Primeiro GET para buscar configurações
    const getResponse = await fetch('http://localhost:3000/backup/configuracoes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('📥 GET Status:', getResponse.status, getResponse.statusText);

    if (getResponse.ok) {
      const getData = await getResponse.json();
      console.log('✅ GET Configurações:', getData);
    }

    // Agora PUT para salvar configurações
    const configTeste = {
      automatico: true,
      frequencia: 'diaria',
      horario: '02:00',
      retencao: 7,
      local: '/backup',
      compressao: true,
      criptografia: false
    };

    const putResponse = await fetch('http://localhost:3000/backup/configuracoes', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(configTeste)
    });

    console.log('📤 PUT Status:', putResponse.status, putResponse.statusText);

    if (putResponse.ok) {
      const putData = await putResponse.json();
      console.log('✅ PUT Configurações salvas:', putData);
    } else {
      const errorText = await putResponse.text();
      console.log('❌ PUT Error:', errorText);
    }

  } catch (error) {
    console.error('💥 Erro no teste de configurações:', error);
  }
}

// Executar testes
async function executarTestes() {
  console.log('🚀 Iniciando testes de conectividade...');
  
  const backendOk = await testarBackend();
  
  if (backendOk) {
    await testarEndpointConfiguracoes();
  } else {
    console.log('❌ Backend não está acessível. Verifique se está rodando na porta 3000');
  }
  
  console.log('🏁 Testes finalizados!');
}

executarTestes();

