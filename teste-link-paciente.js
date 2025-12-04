// Teste direto do link de paciente
console.log('🧪 Testando link do paciente...');

// Simular um link real que seria gerado
const baseUrl = 'http://localhost:8081';
const inviteId = `invite-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const agendamentoId = '123';
const patientLink = `${baseUrl}/paciente-videochamada?invite=${inviteId}&agendamento=${agendamentoId}`;

console.log('\n📱 LINK GERADO PARA TESTE:');
console.log(patientLink);

console.log('\n🔍 COMPONENTES DO LINK:');
console.log('Base URL:', baseUrl);
console.log('Rota:', '/paciente-videochamada');
console.log('Invite ID:', inviteId);
console.log('Agendamento ID:', agendamentoId);

console.log('\n✅ INSTRUÇÕES PARA TESTE:');
console.log('1. Copie o link acima');
console.log('2. Abra em uma nova aba do navegador');
console.log('3. Deve abrir a página do paciente');
console.log('4. Se não funcionar, verifique:');
console.log('   • Frontend está rodando na porta 8081');
console.log('   • Não há erros no console do navegador');
console.log('   • A rota está registrada no App.tsx');

console.log('\n🚀 TESTE RÁPIDO:');
console.log('Acesse: http://localhost:8081/paciente-videochamada?invite=test&agendamento=123');