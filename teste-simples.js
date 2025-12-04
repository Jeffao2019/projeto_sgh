async function testeSimples() {
  console.log('🔍 TESTE SIMPLES DE CONEXÃO');
  console.log('='.repeat(40));

  try {
    console.log('\n1. Tentando conectar ao backend...');
    const response = await fetch('http://localhost:3000/auth/debug', {
      method: 'GET'
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend respondeu:', data);
      
      // Agora testar login
      console.log('\n2. Testando login...');
      const loginResponse = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@sgh.com',
          password: '123456'
        })
      });
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('✅ Login OK, token recebido');
        
        // Testar criação de agendamento
        console.log('\n3. Testando criação básica...');
        const createResponse = await fetch('http://localhost:3000/agendamentos', {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${loginData.token}`,
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({
            pacienteId: "d47d5240-146b-43a7-a977-348b7ecf89c8",
            medicoId: "eda927f1-a263-403c-a59f-dad467640216",
            dataHora: "2025-12-05T14:00:00.000Z",
            tipo: "CONSULTA_GERAL",
            observacoes: "Teste simples"
          })
        });
        
        console.log('Status da criação:', createResponse.status);
        const responseText = await createResponse.text();
        console.log('Resposta:', responseText.substring(0, 200) + '...');
        
      } else {
        console.log('❌ Erro no login:', loginResponse.status);
      }
      
    } else {
      console.log('❌ Backend não responde:', response.status);
    }
  } catch (error) {
    console.log('❌ Erro de conexão:', error.message);
    console.log('\n💡 Sugestões:');
    console.log('- Verificar se o backend está rodando na porta 3000');
    console.log('- Verificar se o PostgreSQL está ativo');
    console.log('- Reiniciar os serviços');
  }
}

testeSimples().catch(console.error);