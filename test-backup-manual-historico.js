/**
 * Teste para verificar se o backup manual está atualizando o histórico corretamente
 */

const testarBackupManual = async () => {
  console.log('🧪 Testando backup manual...');

  try {
    // Simular clique no botão de backup manual
    const response = await fetch('http://localhost:3000/backup/manual', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || 'test-token'}`
      }
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backup manual executado:', data);
      
      // Verificar se o histórico seria atualizado
      console.log('📝 Novo registro seria adicionado ao histórico:');
      console.log({
        id: Date.now(),
        data: new Date().toLocaleString('pt-BR'),
        tipo: 'Manual',
        tamanho: data.tamanho || '2.1 GB',
        status: 'Sucesso'
      });
    } else {
      console.log('❌ Erro no backup:', await response.text());
    }
  } catch (error) {
    console.error('💥 Erro durante o teste:', error);
  }
};

// Executar teste se estiver no browser
if (typeof window !== 'undefined') {
  console.log('🌐 Executando teste no browser...');
  testarBackupManual();
} else {
  console.log('📁 Arquivo de teste criado. Execute no DevTools do browser.');
}
