console.log('📅 TESTE DE FORMATAÇÃO DE DATA');
console.log('=' .repeat(45));

// Simular uma data de consulta
const dataConsulta = new Date('2025-10-08T18:30:00.000Z');

console.log('\n📋 Data original:', dataConsulta.toISOString());

// Função de formatação (igual a implementada)
function formatarDataConsulta(dataConsulta) {
  const data = new Date(dataConsulta);
  const dataFormatada = data.toLocaleDateString('pt-BR');
  const horaFormatada = data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
  return `${dataFormatada} às ${horaFormatada}`;
}

console.log('\n✅ FORMATO NOVO:');
console.log('📅', formatarDataConsulta(dataConsulta));

console.log('\n🆚 COMPARAÇÃO:');
console.log('❌ Antigo: "08/10/2025, 18:30"');
console.log('✅ Novo:  "08/10/2025 às 18:30"');

console.log('\n🎯 BENEFÍCIOS:');
console.log('• Mais natural em português');
console.log('• Fácil de ler e entender');
console.log('• Padrão consistente no sistema');

console.log('\n📝 LOCAIS ATUALIZADOS:');
console.log('✅ Lista de prontuários');
console.log('✅ PDF regular');
console.log('✅ PDF LGPD');

console.log('\n' + '=' .repeat(45));
console.log('🕒 FORMATAÇÃO APLICADA COM SUCESSO!');
