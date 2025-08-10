/**
 * Teste super simples dos botões de exportação
 * Para substituir no Prontuarios.tsx
 */

// Função super simples para testar botão PDF
const handleGeneratePDF = async (prontuario) => {
  // Alert IMEDIATO para confirmar clique
  alert("🔵 TESTE: Botão PDF foi clicado!");
  
  // Log visível no console
  console.log("🔵🔵🔵 [TESTE PDF] BOTÃO CLICADO! 🔵🔵🔵");
  console.log("📋 [TESTE PDF] Prontuário:", prontuario);
  
  try {
    // Importar jsPDF
    console.log("🧪 [TESTE PDF] Importando jsPDF...");
    const jsPDF = (await import('jspdf')).default;
    console.log("✅ [TESTE PDF] jsPDF importado!");
    
    // Criar documento
    console.log("📄 [TESTE PDF] Criando documento...");
    const doc = new jsPDF();
    
    // Adicionar conteúdo básico
    doc.setFontSize(16);
    doc.text('PRONTUÁRIO MÉDICO', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Paciente: ${prontuario.paciente?.nome || 'Nome não disponível'}`, 20, 40);
    doc.text(`Diagnóstico: ${prontuario.diagnostico}`, 20, 60);
    
    // Salvar
    const nomeArquivo = `prontuario_${Date.now()}.pdf`;
    console.log("💾 [TESTE PDF] Salvando:", nomeArquivo);
    doc.save(nomeArquivo);
    
    console.log("🎉 [TESTE PDF] SUCESSO!");
    alert("🎉 SUCESSO! PDF foi gerado!");
    
  } catch (error) {
    console.error("❌ [TESTE PDF] ERRO:", error);
    alert(`❌ ERRO: ${error.message}`);
  }
};

// Função super simples para testar botão LGPD
const handleGenerateLGPDPDF = async (prontuario) => {
  // Alert IMEDIATO para confirmar clique
  alert("🔒 TESTE: Botão LGPD foi clicado!");
  
  // Log visível no console
  console.log("🔒🔒🔒 [TESTE LGPD] BOTÃO CLICADO! 🔒🔒🔒");
  console.log("📋 [TESTE LGPD] Prontuário:", prontuario);
  
  try {
    // Importar jsPDF
    console.log("🧪 [TESTE LGPD] Importando jsPDF...");
    const jsPDF = (await import('jspdf')).default;
    console.log("✅ [TESTE LGPD] jsPDF importado!");
    
    // Criar documento
    console.log("📄 [TESTE LGPD] Criando documento...");
    const doc = new jsPDF();
    
    // Anonimizar dados
    const cpfAnonimizado = prontuario.paciente?.cpf ? 
      `${prontuario.paciente.cpf.substring(0, 3)}.XXX.XXX-${prontuario.paciente.cpf.slice(-2)}` : 
      'XXX.XXX.XXX-XX';
    
    // Adicionar conteúdo anonimizado
    doc.setFontSize(16);
    doc.text('PRONTUÁRIO MÉDICO - LGPD', 20, 20);
    
    doc.setFontSize(10);
    doc.text('DOCUMENTO ANONIMIZADO CONFORME LGPD', 20, 30);
    
    doc.setFontSize(12);
    doc.text(`Paciente: ${prontuario.paciente?.nome || 'Nome não disponível'}`, 20, 50);
    doc.text(`CPF: ${cpfAnonimizado}`, 20, 60);
    doc.text(`Diagnóstico: ${prontuario.diagnostico}`, 20, 70);
    
    // Salvar
    const nomeArquivo = `prontuario_lgpd_${Date.now()}.pdf`;
    console.log("💾 [TESTE LGPD] Salvando:", nomeArquivo);
    doc.save(nomeArquivo);
    
    console.log("🎉 [TESTE LGPD] SUCESSO!");
    alert("🎉 SUCESSO! PDF LGPD foi gerado com dados anonimizados!");
    
  } catch (error) {
    console.error("❌ [TESTE LGPD] ERRO:", error);
    alert(`❌ ERRO LGPD: ${error.message}`);
  }
};

// INSTRUÇÕES PARA USAR:
// 1. Copie as funções acima
// 2. Substitua as funções handleGeneratePDF e handleGenerateLGPDPDF no arquivo Prontuarios.tsx
// 3. Teste os botões - deve aparecer um alert imediatamente quando clicar
// 4. Abra o DevTools (F12) e vá na aba Console para ver os logs

console.log("📝 Funções de teste criadas!");
console.log("🔧 Para usar: copie as funções e substitua no Prontuarios.tsx");
console.log("🧪 Os alerts aparecerão IMEDIATAMENTE quando clicar nos botões");
