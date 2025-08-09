// Script simples para testar a API do frontend
console.log('🧪 Testando API do frontend...');

// Simular a requisição que o frontend faria
fetch('http://localhost:3000/prontuarios/with-relations', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer SEU_TOKEN_AQUI',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  console.log('✅ Dados recebidos:');
  console.log('Total de prontuários:', data.length);
  if (data.length > 0) {
    console.log('Primeiro prontuário:');
    console.log('- Paciente:', data[0].paciente?.nome || 'Não identificado');
    console.log('- Médico:', data[0].medico?.nome || 'Não identificado');
  }
})
.catch(error => {
  console.error('❌ Erro:', error);
});

// Este arquivo é apenas para teste manual no browser console
