/**
 * TESTE DIRETO DOS BOTÕES DE EXPORTAÇÃO
 * Execute este script no console do navegador para diagnosticar o problema
 */

console.log("🔍 INICIANDO DIAGNÓSTICO DOS BOTÕES...");

// 1. Verificar se os botões existem na página
console.log("\n1️⃣ Verificando se os botões existem...");
const botoesPDF = document.querySelectorAll('[data-testid*="export"], button[title*="PDF"], button[aria-label*="PDF"]');
const botoesComDownload = document.querySelectorAll('button:has(svg), button[class*="export"]');
const todosBotoes = document.querySelectorAll('button');

console.log(`📊 Botões encontrados:`);
console.log(`   - Botões com PDF/export: ${botoesPDF.length}`);
console.log(`   - Botões com ícones: ${botoesComDownload.length}`);
console.log(`   - Total de botões: ${todosBotoes.length}`);

// 2. Listar todos os botões para identificação
console.log("\n2️⃣ Listando botões na página...");
todosBotoes.forEach((botao, index) => {
  const texto = botao.textContent?.trim() || botao.title || botao.ariaLabel || 'Sem texto';
  const classes = botao.className || 'Sem classes';
  const onClick = botao.onclick ? 'TEM onClick' : 'SEM onClick';
  const listeners = getEventListeners ? getEventListeners(botao) : 'N/A';
  
  console.log(`   Botão ${index + 1}: "${texto}" | Classes: ${classes} | ${onClick}`);
  
  // Se parece com botão de export, destaque
  if (texto.toLowerCase().includes('export') || 
      texto.toLowerCase().includes('pdf') || 
      classes.toLowerCase().includes('export')) {
    console.log(`   ⭐ POSSÍVEL BOTÃO DE EXPORT: ${texto}`);
    
    // Tentar clicar no botão
    console.log(`   🧪 Testando clique...`);
    try {
      botao.click();
      console.log(`   ✅ Clique executado!`);
    } catch (error) {
      console.log(`   ❌ Erro no clique: ${error.message}`);
    }
  }
});

// 3. Verificar se React está carregado
console.log("\n3️⃣ Verificando React...");
if (window.React) {
  console.log("✅ React detectado!");
} else {
  console.log("❌ React não detectado");
}

// 4. Verificar se jsPDF está disponível
console.log("\n4️⃣ Verificando jsPDF...");
try {
  import('jspdf').then(() => {
    console.log("✅ jsPDF pode ser importado!");
  }).catch(error => {
    console.log("❌ Erro ao importar jsPDF:", error);
  });
} catch (error) {
  console.log("❌ Erro ao testar import jsPDF:", error);
}

// 5. Verificar erros no console
console.log("\n5️⃣ Verificando erros...");
console.log("🔍 Abra a aba 'Console' e procure por erros em vermelho");
console.log("🔍 Clique em um botão de export e veja se aparece alguma mensagem");

// 6. Criar função de teste manual
console.log("\n6️⃣ Criando função de teste manual...");
window.testarBotaoExport = () => {
  console.log("🧪 TESTE MANUAL INICIADO!");
  alert("🧪 Função de teste manual está funcionando!");
  
  try {
    import('jspdf').then(jsPDF => {
      console.log("✅ jsPDF importado com sucesso!");
      const doc = new jsPDF.default();
      doc.text('Teste', 20, 20);
      doc.save('teste.pdf');
      alert("✅ PDF de teste gerado!");
    });
  } catch (error) {
    console.log("❌ Erro no teste:", error);
    alert(`❌ Erro: ${error.message}`);
  }
};

console.log("\n🎯 INSTRUÇÕES:");
console.log("1. Execute: testarBotaoExport() no console");
console.log("2. Clique nos botões de export na interface");
console.log("3. Veja se aparecem mensagens de [TESTE] no console");
console.log("4. Reporte os resultados!");

console.log("\n✅ DIAGNÓSTICO COMPLETO! Verifique os resultados acima.");
