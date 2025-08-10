/**
 * Debug do filtro de paciente nos prontuários
 * Vamos testar se o problema está na navegação ou na URL gerada
 */

console.log("🔍 [DEBUG FILTRO] Iniciando análise do problema do filtro...");

// Simular navegação com filtro de paciente
const testarNavegacao = () => {
  console.log("\n🧪 [TESTE] Simulando navegação com filtro de paciente");
  
  // 1. URL inicial com filtro
  const urlInicial = "/prontuarios?paciente=123";
  console.log(`📍 URL inicial: ${urlInicial}`);
  
  // 2. Extrair pacienteId da URL
  const urlParams = new URLSearchParams("?paciente=123");
  const pacienteId = urlParams.get('paciente');
  console.log(`🔍 PacienteId extraído: ${pacienteId}`);
  
  // 3. Gerar URL de retorno
  const returnUrl = pacienteId ? `/prontuarios?paciente=${pacienteId}` : '/prontuarios';
  console.log(`🔗 URL de retorno gerada: ${returnUrl}`);
  
  // 4. Gerar URL de navegação para "Ver"
  const prontuarioId = "456";
  const urlVer = `/prontuarios/${prontuarioId}?return=${encodeURIComponent(returnUrl)}`;
  console.log(`👀 URL para "Ver": ${urlVer}`);
  
  // 5. Decodificar parâmetro return
  const encodedReturn = encodeURIComponent(returnUrl);
  console.log(`🔐 Return codificado: ${encodedReturn}`);
  
  const decodedReturn = decodeURIComponent(encodedReturn);
  console.log(`🔓 Return decodificado: ${decodedReturn}`);
  
  // 6. Verificar se o filtro é preservado
  const returnParams = new URLSearchParams(decodedReturn.split('?')[1] || '');
  const pacientePreservado = returnParams.get('paciente');
  console.log(`✅ Paciente preservado no retorno: ${pacientePreservado}`);
  
  return {
    urlInicial,
    pacienteId,
    returnUrl,
    urlVer,
    pacientePreservado,
    funcionou: pacienteId === pacientePreservado
  };
};

// Executar teste
const resultado = testarNavegacao();
console.log(`\n📊 [RESULTADO] Teste ${resultado.funcionou ? '✅ PASSOU' : '❌ FALHOU'}`);

if (!resultado.funcionou) {
  console.log("\n🚨 [PROBLEMA DETECTADO] Analisando possíveis causas:");
  console.log("1. Verificar se searchParams está sendo lido corretamente");
  console.log("2. Verificar se returnUrl está sendo construído corretamente");
  console.log("3. Verificar se a navegação está usando o returnUrl");
  console.log("4. Verificar se CadastroProntuario está lendo o parâmetro return");
}

// Testar cenários específicos
console.log("\n🔧 [CENÁRIOS] Testando cenários específicos:");

const cenarios = [
  {
    nome: "Lista sem filtro",
    url: "/prontuarios",
    esperado: "/prontuarios"
  },
  {
    nome: "Lista com filtro de paciente",
    url: "/prontuarios?paciente=123",
    esperado: "/prontuarios?paciente=123"
  },
  {
    nome: "Lista com múltiplos parâmetros",
    url: "/prontuarios?paciente=123&status=agendado",
    esperado: "/prontuarios?paciente=123&status=agendado"
  }
];

cenarios.forEach(cenario => {
  console.log(`\n📋 [CENÁRIO] ${cenario.nome}`);
  console.log(`   🔗 URL: ${cenario.url}`);
  
  const params = new URLSearchParams(cenario.url.split('?')[1] || '');
  const paciente = params.get('paciente');
  const returnUrl = paciente ? `/prontuarios?paciente=${paciente}` : '/prontuarios';
  
  console.log(`   🎯 Esperado: ${cenario.esperado}`);
  console.log(`   📤 Gerado: ${returnUrl}`);
  console.log(`   ${returnUrl === cenario.esperado ? '✅' : '❌'} ${returnUrl === cenario.esperado ? 'CORRETO' : 'INCORRETO'}`);
});

console.log("\n🔍 [ANÁLISE] Possíveis problemas:");
console.log("1. O componente Prontuarios.tsx pode não estar detectando pacienteId corretamente");
console.log("2. O useSearchParams pode não estar funcionando como esperado");
console.log("3. A navegação pode estar sendo interceptada em algum lugar");
console.log("4. O CadastroProntuario pode não estar processando o parâmetro return");

console.log("\n💡 [PRÓXIMOS PASSOS]:");
console.log("1. Verificar se useSearchParams está retornando o valor correto");
console.log("2. Adicionar console.log nos componentes para debug");
console.log("3. Verificar se não há redirecionamentos interferindo");
console.log("4. Testar navegação manual com URLs completas");

export { testarNavegacao };
