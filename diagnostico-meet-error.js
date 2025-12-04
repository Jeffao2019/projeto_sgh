// Teste específico para o erro "Nome de videochamada inválido" do Google Meet
console.log('🔍 DIAGNOSTICO: Nome de videochamada inválido');

// 1. Códigos que FUNCIONAM no Google Meet
console.log('\n✅ CÓDIGOS QUE FUNCIONAM:');
const validCodes = [
  'abc-defg-hij',  // padrão básico
  'xyz-abcd-efg',  // variação
  'wer-tyui-opq'   // outro exemplo
];

validCodes.forEach((code, i) => {
  console.log(`${i+1}. https://meet.google.com/${code}`);
});

// 2. Códigos que CAUSAM ERRO
console.log('\n❌ CÓDIGOS QUE CAUSAM ERRO:');
const invalidCodes = [
  'sgh-1701360000000-abc123',  // muito longo
  'SGH-TESTE-123',             // maiúsculas
  'abc_def_ghi',               // underscores
  '123-456-789',               // só números
  'a-b-c',                     // muito curto
  'abcd-efgh-ijkl'             // 4 letras em cada parte
];

invalidCodes.forEach((code, i) => {
  console.log(`${i+1}. https://meet.google.com/${code} ← ❌ INVÁLIDO`);
});

// 3. REGRAS DO GOOGLE MEET
console.log('\n📋 REGRAS DO GOOGLE MEET:');
console.log('• Formato: xxx-xxxx-xxx');
console.log('• 3 letras - 4 letras - 3 letras');
console.log('• Apenas letras minúsculas (a-z)');
console.log('• Separado por hífens (-)');
console.log('• Total: 10 letras + 2 hífens = 12 caracteres');

// 4. FUNÇÃO CORRIGIDA
console.log('\n🔧 FUNÇÃO CORRIGIDA:');
function generateValidMeetCode() {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const part1 = Array.from({length: 3}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part2 = Array.from({length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part3 = Array.from({length: 3}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${part1}-${part2}-${part3}`;
}

// 5. TESTE DA FUNÇÃO
console.log('\n🧪 TESTE DA FUNÇÃO CORRIGIDA:');
for (let i = 1; i <= 3; i++) {
  const code = generateValidMeetCode();
  console.log(`${i}. ${code} → https://meet.google.com/${code}`);
  
  // Validar formato
  const parts = code.split('-');
  const isValid = parts.length === 3 && 
                  parts[0].length === 3 && 
                  parts[1].length === 4 && 
                  parts[2].length === 3 &&
                  /^[a-z-]+$/.test(code);
  console.log(`   ✓ Válido: ${isValid ? 'SIM' : 'NÃO'}`);
}

// 6. SOLUÇÃO DEFINITIVA
console.log('\n🎯 SOLUÇÃO DEFINITIVA:');
console.log('OPÇÃO 1: Usar https://meet.google.com/new');
console.log('• Sempre funciona');
console.log('• Google gera código automaticamente');
console.log('• Zero chance de erro');

console.log('\nOPÇÃO 2: Usar Google Calendar API');
console.log('• Cria reunião real');
console.log('• Integra com calendário');
console.log('• Mais profissional');

console.log('\n🚀 IMPLEMENTAÇÃO IMEDIATA:');
console.log('1. Use botão "🆕 Criar Novo Meet"');
console.log('2. Abre https://meet.google.com/new');
console.log('3. Copie o link gerado');
console.log('4. Use no sistema SGH');
console.log('5. Funciona 100%');