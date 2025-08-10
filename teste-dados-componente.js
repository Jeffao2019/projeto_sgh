/**
 * FUNÇÃO SUPER SIMPLES PARA TESTAR OS DADOS NO COMPONENTE
 * Adicione esta função no console para testar os dados que estão chegando
 */

// Função para inspecionar os dados que estão sendo usados no componente React
window.inspecionarDadosProntuarios = () => {
  console.log("🔍 INSPECIONANDO DADOS DOS PRONTUÁRIOS...");
  
  // Tentar encontrar os dados no React
  const componenteReact = document.querySelector('[data-react-component]') || document.querySelector('#root');
  
  if (componenteReact) {
    console.log("✅ Componente React encontrado");
    
    // Verificar se há dados de prontuários no estado do React
    const reactFiber = componenteReact._reactInternalFiber || componenteReact._reactInternalInstance;
    
    if (reactFiber) {
      console.log("✅ React Fiber encontrado");
    }
  }
  
  // Método alternativo: verificar o que está sendo renderizado
  const linhasProntuarios = document.querySelectorAll('[class*="grid"]:has(button)');
  console.log(`📊 Linhas de prontuários encontradas: ${linhasProntuarios.length}`);
  
  linhasProntuarios.forEach((linha, index) => {
    console.log(`\n📋 Prontuário ${index + 1}:`);
    
    // Buscar dados visíveis na linha
    const textos = linha.textContent?.split(/\s+/).filter(t => t.length > 2) || [];
    console.log("   Textos visíveis:", textos.slice(0, 10).join(' | '));
    
    // Buscar botões de export
    const botoesExport = linha.querySelectorAll('button');
    console.log(`   Botões encontrados: ${botoesExport.length}`);
    
    botoesExport.forEach((botao, btnIndex) => {
      const texto = botao.textContent?.trim() || botao.title || 'Sem texto';
      console.log(`   Botão ${btnIndex + 1}: "${texto}"`);
      
      // Tentar extrair dados do onClick do botão
      if (botao.onclick) {
        console.log(`   ✅ Botão ${btnIndex + 1} tem função onClick`);
      } else {
        console.log(`   ❌ Botão ${btnIndex + 1} SEM função onClick`);
      }
    });
  });
  
  // Testar se conseguimos acessar o estado do React diretamente
  console.log("\n🔍 Tentando acessar dados do React...");
  
  // Método mais direto: capturar o que é passado para os botões
  const botoesPDF = document.querySelectorAll('button');
  botoesPDF.forEach((botao, index) => {
    if (botao.textContent?.includes('') || botao.title?.includes('PDF')) {
      console.log(`\n🎯 Botão PDF ${index + 1}:`);
      
      // Tentar capturar o evento de clique para ver os dados
      const originalClick = botao.onclick;
      botao.onclick = function(event) {
        console.log("🎯 DADOS CAPTURADOS DO CLIQUE:");
        console.log("   Event:", event);
        console.log("   Arguments:", arguments);
        console.log("   This:", this);
        
        // Restaurar função original e executar
        botao.onclick = originalClick;
        if (originalClick) {
          originalClick.call(this, event);
        }
      };
    }
  });
  
  console.log("\n✅ Inspeção concluída! Agora clique em um botão de export para ver os dados.");
};

// Função para testar dados específicos
window.testarDadosEspecificos = () => {
  console.log("🧪 TESTE DE DADOS ESPECÍFICOS");
  
  const token = localStorage.getItem('auth_token');
  if (!token) {
    console.log("❌ Token não encontrado!");
    return;
  }
  
  fetch('http://localhost:3000/prontuarios/with-relations', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(prontuarios => {
    console.log(`📊 ${prontuarios.length} prontuários encontrados`);
    
    prontuarios.forEach((p, index) => {
      console.log(`\n📋 Prontuário ${index + 1}:`);
      console.log(`   ID: ${p.id}`);
      console.log(`   Paciente: ${p.paciente?.nome || '❌ AUSENTE'}`);
      console.log(`   CPF: ${p.paciente?.cpf || '❌ AUSENTE'}`);
      console.log(`   Email: ${p.paciente?.email || '❌ AUSENTE'}`);
      console.log(`   Médico: ${p.medico?.nome || '❌ AUSENTE'}`);
      console.log(`   CRM: ${p.medico?.crm || '❌ AUSENTE'}`);
      console.log(`   Diagnóstico: ${p.diagnostico || '❌ AUSENTE'}`);
      console.log(`   Data: ${p.dataConsulta || '❌ AUSENTE'}`);
    });
  })
  .catch(error => {
    console.error("❌ Erro:", error);
  });
};

console.log("🛠️ FUNÇÕES DE TESTE CRIADAS:");
console.log("1. inspecionarDadosProntuarios() - Inspeciona os dados no componente");
console.log("2. testarDadosEspecificos() - Testa dados direto da API");
console.log("Execute uma das funções para começar o teste!");
