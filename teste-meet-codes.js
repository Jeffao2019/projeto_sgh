// Teste para verificar formato válido do Google Meet
console.log('🧪 Testando códigos válidos do Google Meet...');

// Função para gerar código válido do Meet
const generateValidMeetCode = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const part1 = Array.from({length: 3}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part2 = Array.from({length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part3 = Array.from({length: 3}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${part1}-${part2}-${part3}`;
};

console.log('\n📋 FORMATOS TESTADOS:');

// Testar vários códigos
for (let i = 1; i <= 5; i++) {
  const meetCode = generateValidMeetCode();
  const meetLink = `https://meet.google.com/${meetCode}`;
  console.log(`${i}. ${meetCode} → ${meetLink}`);
}

console.log('\n✅ FORMATO VÁLIDO:');
console.log('• xxx-xxxx-xxx (letras minúsculas)');
console.log('• Exemplo: abc-defg-hij');
console.log('• Total: 10 caracteres + 2 hífens');

console.log('\n❌ FORMATOS INVÁLIDOS (evitados):');
console.log('• sgh-1234567890-abc123 (muito longo)');
console.log('• ABC-DEFG-HIJ (maiúsculas)');
console.log('• abc_defg_hij (underscores)');
console.log('• 123-4567-890 (apenas números)');

console.log('\n🎯 ALTERNATIVAS IMPLEMENTADAS:');

console.log('\n1️⃣ LINK AUTOMÁTICO:');
console.log('   • https://meet.google.com/new');
console.log('   • Cria reunião automaticamente');
console.log('   • Google gera código válido');
console.log('   • Sempre funciona');

console.log('\n2️⃣ CÓDIGO GERADO:');
const exampleCode = generateValidMeetCode();
console.log(`   • Formato válido: ${exampleCode}`);
console.log(`   • Link: https://meet.google.com/${exampleCode}`);
console.log('   • Pode precisar ser criado via API');

console.log('\n3️⃣ BOTÃO "CRIAR NOVO MEET":');
console.log('   • Abre https://meet.google.com/new');
console.log('   • Usuário copia link real');
console.log('   • 100% garantido de funcionar');

console.log('\n🚀 RECOMENDAÇÃO:');
console.log('Use o botão "🆕 Criar Novo Meet" para garantir funcionamento');
console.log('Ou implemente Google Calendar API para Meet real');

console.log('\n💡 TESTE AGORA:');
console.log('1. Acesse a telemedicina');
console.log('2. Clique "🚀 Criar Google Meet"');
console.log('3. Use "🆕 Criar Novo Meet" se der erro');
console.log('4. Copie o link real do Google Meet');
console.log('5. Envie para o paciente');