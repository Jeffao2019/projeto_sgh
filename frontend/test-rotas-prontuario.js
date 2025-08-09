// Teste para verificar as rotas do prontuário
console.log('🧪 Testando rotas do prontuário...');

// Simular URLs diferentes
const urls = [
  '/prontuarios/123',           // Modo visualização
  '/prontuarios/123/editar',    // Modo edição
  '/prontuarios/novo'           // Modo criação
];

urls.forEach(url => {
  console.log(`\n📍 URL: ${url}`);
  
  // Extrair ID da URL
  const match = url.match(/\/prontuarios\/([^\/]+)/);
  const id = match ? match[1] : null;
  
  // Verificar modo
  const isViewMode = id && id !== 'novo' && !url.includes('/editar');
  const isEditMode = id && id !== 'novo' && url.includes('/editar');
  const isCreateMode = !id || id === 'novo';
  
  console.log(`- ID: ${id || 'nenhum'}`);
  console.log(`- Modo Visualização: ${isViewMode}`);
  console.log(`- Modo Edição: ${isEditMode}`);
  console.log(`- Modo Criação: ${isCreateMode}`);
  
  // Simular comportamento dos campos
  console.log(`- Campos desabilitados: ${isViewMode ? 'SIM' : 'NÃO'}`);
  console.log(`- Botão Salvar visível: ${!isViewMode ? 'SIM' : 'NÃO'}`);
});

console.log('\n✅ Teste de lógica concluído!');
