/**
 * 🔍 DEBUG - Teste específico do filtro de pacientes
 * 
 * Este script vai testar se o filtro está sendo preservado corretamente
 * ao navegar entre as telas de prontuários.
 */

console.log("🔍 [DEBUG FILTRO] Iniciando teste específico do filtro de pacientes...");

// Simular navegação com filtro ativo
const testarFluxoFiltro = () => {
  console.log("\n📋 [TESTE] Simulando fluxo completo de navegação com filtro");
  
  // 1. URL inicial com filtro de paciente
  const urlComFiltro = "http://localhost:8081/prontuarios?paciente=123";
  console.log(`📍 [1] URL inicial: ${urlComFiltro}`);
  
  // 2. Simular extração do pacienteId
  const urlParams = new URLSearchParams("?paciente=123");
  const pacienteId = urlParams.get('paciente');
  console.log(`🔍 [2] pacienteId extraído: ${pacienteId}`);
  
  // 3. Simular geração da URL de retorno
  const returnUrl = pacienteId ? `/prontuarios?paciente=${pacienteId}` : '/prontuarios';
  console.log(`🔗 [3] returnUrl gerado: ${returnUrl}`);
  
  // 4. Simular navegação para "Ver" prontuário
  const prontuarioId = "456";
  const urlVer = `/prontuarios/${prontuarioId}?return=${encodeURIComponent(returnUrl)}`;
  console.log(`👀 [4] URL para Ver prontuário: ${urlVer}`);
  
  // 5. Simular leitura do parâmetro return no CadastroProntuario
  const searchParams = new URLSearchParams(`?return=${encodeURIComponent(returnUrl)}`);
  const returnRecebido = searchParams.get('return');
  console.log(`📥 [5] Parâmetro return recebido: ${returnRecebido}`);
  
  // 6. Decodificar URL de retorno
  const returnDecodificado = decodeURIComponent(returnRecebido || '');
  console.log(`🔓 [6] Return decodificado: ${returnDecodificado}`);
  
  // 7. Verificar se o filtro é preservado
  const finalParams = new URLSearchParams(returnDecodificado.split('?')[1] || '');
  const pacientePreservado = finalParams.get('paciente');
  console.log(`✅ [7] Paciente preservado no retorno: ${pacientePreservado}`);
  
  // 8. Resultado final
  const sucesso = pacienteId === pacientePreservado;
  console.log(`\n📊 [RESULTADO] Teste ${sucesso ? '✅ PASSOU' : '❌ FALHOU'}`);
  
  if (!sucesso) {
    console.log("\n🚨 [PROBLEMA] O filtro não está sendo preservado!");
    console.log("   Possíveis causas:");
    console.log("   • URL não está sendo construída corretamente");
    console.log("   • Parâmetro return não está sendo lido corretamente");
    console.log("   • Decodificação da URL está falhando");
  } else {
    console.log("\n🎉 [SUCESSO] O filtro está funcionando corretamente!");
    console.log("   O problema pode estar em outro lugar.");
  }
  
  return {
    pacienteOriginal: pacienteId,
    pacientePreservado: pacientePreservado,
    sucesso: sucesso,
    urlVer: urlVer,
    returnUrl: returnUrl
  };
};

// Executar teste
const resultado = testarFluxoFiltro();

// Instruções para teste manual
console.log(`\n📋 [INSTRUÇÕES] Para testar manualmente:`);
console.log(`1. Acesse: http://localhost:8081/prontuarios?paciente=123`);
console.log(`2. Verifique no console se aparece: "pacienteId extraído: 123"`);
console.log(`3. Clique em "Ver" em qualquer prontuário`);
console.log(`4. Na tela do prontuário, clique em "Voltar"`);
console.log(`5. Verifique se a URL volta para: /prontuarios?paciente=123`);
console.log(`\n🔍 [LOGS ESPERADOS]:`);
console.log(`   • [PRONTUARIOS DEBUG] pacienteId extraído: 123`);
console.log(`   • [VER PRONTUARIO DEBUG] returnUrl: /prontuarios?paciente=123`);
console.log(`   • [CADASTRO PRONTUARIO DEBUG] returnUrl recebido: %2Fprontuarios%3Fpaciente%3D123`);
console.log(`   • [VOLTAR DEBUG] Navegando para returnUrl: /prontuarios?paciente=123`);

export { resultado, testarFluxoFiltro };
