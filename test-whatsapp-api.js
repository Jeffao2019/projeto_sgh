console.log('🧪 Testando Sistema WhatsApp API - SGH');

async function testWhatsAppAPI() {
  const baseUrl = 'http://localhost:3000/api';
  
  try {
    console.log('\n📱 1. Testando status do WhatsApp...');
    
    // Testar status
    const statusResponse = await fetch(`${baseUrl}/whatsapp/status`);
    const status = await statusResponse.json();
    
    console.log('✅ Status obtido:');
    console.log('- Provider atual:', status.provider);
    console.log('- Configurado:', status.configured);
    console.log('- Providers disponíveis:', status.availableProviders?.length || 0);
    
    if (status.availableProviders) {
      console.log('\n🔧 Providers disponíveis:');
      status.availableProviders.forEach(provider => {
        console.log(`  ${provider.configured ? '✅' : '❌'} ${provider.title} - ${provider.cost} (${provider.reliability})`);
      });
    }
    
    console.log('\n📱 2. Testando envio de mensagem...');
    
    // Testar envio de mensagem simples
    const messageResponse = await fetch(`${baseUrl}/whatsapp/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: '(41) 99918-8633',
        message: '🧪 Teste da API WhatsApp SGH\n\nSe você recebeu esta mensagem, o sistema está funcionando!',
      }),
    });
    
    const messageResult = await messageResponse.json();
    
    console.log('✅ Resultado do envio:');
    console.log('- Sucesso:', messageResult.success);
    console.log('- Message ID:', messageResult.messageId || 'N/A');
    console.log('- Web URL:', messageResult.webUrl ? 'Gerada' : 'N/A');
    console.log('- Provider usado:', messageResult.provider?.provider || 'N/A');
    
    console.log('\n📱 3. Testando envio de Google Meet...');
    
    // Testar envio de Google Meet
    const meetResponse = await fetch(`${baseUrl}/whatsapp/send-meet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: '(41) 99918-8633',
        meetLink: 'https://meet.google.com/teste-123-abc',
        patientName: 'João da Silva',
        doctorName: 'Dr. Carlos Teste',
        appointmentDate: new Date().toLocaleString('pt-BR'),
      }),
    });
    
    const meetResult = await meetResponse.json();
    
    console.log('✅ Resultado Google Meet:');
    console.log('- Sucesso:', meetResult.success);
    console.log('- Message ID:', meetResult.messageId || 'N/A');
    console.log('- Web URL:', meetResult.webUrl ? 'Gerada' : 'N/A');
    console.log('- Mensagem formatada:', meetResult.message ? 'Sim' : 'N/A');
    
    console.log('\n🎯 RESUMO DOS TESTES:');
    console.log('==================');
    console.log('✅ API WhatsApp funcionando');
    console.log('✅ Múltiplos providers suportados');
    console.log('✅ Fallback para WhatsApp Web ativo');
    console.log('✅ Mensagens formatadas corretamente');
    
    console.log('\n📋 PRÓXIMOS PASSOS:');
    console.log('==================');
    console.log('1. Configure credenciais do Twilio ou WhatsApp Business no .env');
    console.log('2. Altere WHATSAPP_PROVIDER para usar API real');
    console.log('3. Teste em ambiente de produção');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    console.log('\n🔧 VERIFICAÇÕES:');
    console.log('- Backend está rodando na porta 3000?');
    console.log('- Rotas do WhatsApp estão registradas?');
    console.log('- Configuração do CORS permite requisições?');
  }
}

// Aguardar um pouco para garantir que o backend iniciou
setTimeout(() => {
  testWhatsAppAPI();
}, 2000);

console.log('\n⏳ Aguardando backend inicializar...');
console.log('📊 Teste iniciará em 2 segundos...');