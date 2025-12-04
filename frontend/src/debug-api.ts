import { apiService } from './lib/api-service';

// Função para testar o apiService no browser
async function testApiService() {
  console.log('🔧 TESTE DO API SERVICE');
  console.log('='.repeat(40));

  const agendamentoId = '497f102f-d557-42a4-a723-a3cba277cb64';

  try {
    console.log('1. 🔑 Verificando token...');
    const token = localStorage.getItem('auth_token');
    console.log('Token existe:', !!token);
    console.log('Token:', token?.substring(0, 20) + '...');

    if (!token) {
      console.log('❌ Sem token, fazendo login...');
      const loginResult = await apiService.login({
        email: 'admin@sgh.com',
        password: '123456'
      });
      console.log('✅ Login realizado:', loginResult);
    }

    console.log('2. 🔍 Buscando agendamento...');
    const agendamento = await apiService.getAgendamentoById(agendamentoId);
    console.log('✅ Agendamento recebido:', agendamento);

    console.log('3. ✅ API Service funcionando!');
    return agendamento;

  } catch (error) {
    console.error('❌ Erro no API Service:', error);
    throw error;
  }
}

// Expor no window para testar no console do navegador
(window as any).testApiService = testApiService;

console.log('🔧 API Service Test carregado!');
console.log('Execute: testApiService() no console do navegador');