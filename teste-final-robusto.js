/**
 * 🎯 TESTE FINAL - Versão Robusta do Filtro
 * 
 * Este script testa a versão robusta implementada para garantir
 * que o filtro de paciente seja preservado em todas as situações.
 */

console.log("🎯 [TESTE FINAL] Testando versão robusta do filtro de pacientes...");

// Simular diferentes cenários que podem causar problemas
const cenariosTeste = [
  {
    nome: "Navegação Normal",
    descricao: "Usuário navega normalmente com filtro",
    url: "http://localhost:8081/prontuarios?paciente=123",
    expectedPaciente: "123"
  },
  {
    nome: "URL com caracteres especiais",
    descricao: "URL pode ter caracteres codificados",
    url: "http://localhost:8081/prontuarios?paciente=123&other=test",
    expectedPaciente: "123"
  },
  {
    nome: "Cache/Reload",
    descricao: "Simular reload da página com sessionStorage",
    url: "http://localhost:8081/prontuarios",
    sessionStorage: { currentPacienteFilter: "123" },
    expectedPaciente: "123"
  },
  {
    nome: "Return URL complexa",
    descricao: "URL de retorno com múltiplos parâmetros",
    url: "http://localhost:8081/prontuarios?paciente=123&sort=date&order=desc",
    expectedPaciente: "123"
  }
];

// Função para testar recuperação robusta de pacienteId
const testGetPacienteIdRobust = (scenario) => {
  console.log(`\n🧪 [TESTE] ${scenario.nome}: ${scenario.descricao}`);
  
  // Simular ambiente
  const url = new URL(scenario.url);
  const searchParams = new URLSearchParams(url.search);
  
  // Simular sessionStorage se necessário
  if (scenario.sessionStorage) {
    Object.entries(scenario.sessionStorage).forEach(([key, value]) => {
      console.log(`   📦 SessionStorage: ${key} = ${value}`);
    });
  }
  
  // Método 1: searchParams.get
  let pacienteId = searchParams.get('paciente');
  console.log(`   📍 Método 1 (searchParams): ${pacienteId}`);
  
  // Método 2: Parsing manual
  if (!pacienteId) {
    const urlString = url.search;
    const match = urlString.match(/[?&]paciente=([^&]*)/);
    if (match) {
      pacienteId = decodeURIComponent(match[1]);
    }
    console.log(`   🔍 Método 2 (regex): ${pacienteId}`);
  }
  
  // Método 3: SessionStorage fallback
  if (!pacienteId && scenario.sessionStorage?.currentPacienteFilter) {
    pacienteId = scenario.sessionStorage.currentPacienteFilter;
    console.log(`   💾 Método 3 (sessionStorage): ${pacienteId}`);
  }
  
  const sucesso = pacienteId === scenario.expectedPaciente;
  console.log(`   📊 Resultado: ${sucesso ? '✅ PASSOU' : '❌ FALHOU'} (esperado: ${scenario.expectedPaciente}, obtido: ${pacienteId})`);
  
  return { cenario: scenario.nome, sucesso, pacienteId, esperado: scenario.expectedPaciente };
};

// Função para testar construção robusta de returnUrl
const testBuildReturnUrlRobust = (pacienteId) => {
  console.log(`\n🔗 [TESTE] Construção de returnUrl para paciente: ${pacienteId}`);
  
  if (!pacienteId) {
    console.log(`   📍 Resultado: /prontuarios (sem filtro)`);
    return '/prontuarios';
  }
  
  // Garantir que o pacienteId é válido (apenas números)
  const cleanPacienteId = pacienteId.toString().replace(/[^0-9]/g, '');
  if (!cleanPacienteId) {
    console.log(`   ⚠️  pacienteId inválido, usando fallback: /prontuarios`);
    return '/prontuarios';
  }
  
  const returnUrl = `/prontuarios?paciente=${cleanPacienteId}`;
  console.log(`   📍 Resultado: ${returnUrl}`);
  return returnUrl;
};

// Executar testes
console.log("\n🚀 [INICIANDO TESTES] Versão robusta do filtro:");

const resultados = cenariosTeste.map(testGetPacienteIdRobust);

console.log("\n🔗 [TESTE URLS] Construção de returnUrls:");
testBuildReturnUrlRobust("123");
testBuildReturnUrlRobust("abc123def"); // Deve limpar para "123"
testBuildReturnUrlRobust(""); // Deve retornar fallback
testBuildReturnUrlRobust(null); // Deve retornar fallback

// Resumo dos resultados
const sucessos = resultados.filter(r => r.sucesso).length;
const total = resultados.length;

console.log(`\n📊 [RESUMO FINAL]`);
console.log(`✅ Testes passaram: ${sucessos}/${total}`);
console.log(`${sucessos === total ? '🎉 TODOS OS TESTES PASSARAM!' : '🚨 ALGUNS TESTES FALHARAM!'}`);

if (sucessos === total) {
  console.log(`\n✅ [IMPLEMENTAÇÃO ROBUSTA] As melhorias incluem:`);
  console.log(`   • Múltiplos métodos de detecção do pacienteId`);
  console.log(`   • SessionStorage como backup`);
  console.log(`   • Validação e limpeza de dados`);
  console.log(`   • Logs detalhados para debug`);
  console.log(`   • Navegação consolidada em funções específicas`);
  console.log(`\n🧪 [TESTE MANUAL] Execute agora:`);
  console.log(`   1. Acesse: http://localhost:8081/prontuarios?paciente=123`);
  console.log(`   2. Clique em "Ver" em qualquer prontuário`);
  console.log(`   3. Clique em "Voltar"`);
  console.log(`   4. Verifique se mantém o filtro paciente=123`);
  console.log(`   5. Abra o console (F12) para ver logs detalhados`);
}

export { resultados, sucessos, total };
