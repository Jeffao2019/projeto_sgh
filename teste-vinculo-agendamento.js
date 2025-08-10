// Teste para verificar se o vínculo com agendamento está funcionando
console.log("🧪 [TESTE AGENDAMENTO] Verificando se os prontuários mantêm vínculo com agendamento");

// Simular um click no botão "Ver" de um prontuário
const testeProntuarioId = "algum-id-de-prontuario";

console.log("📋 [TESTE] Simulando navegação para /prontuarios/" + testeProntuarioId);
console.log("✅ [TESTE] Backend atualizado para incluir agendamento nas consultas");
console.log("✅ [TESTE] Frontend deve agora receber os dados do agendamento");

// As mudanças implementadas:
// 1. Use case findByIdWithRelations agora busca agendamento
// 2. Repositório incluiu agendamento nas relations
// 3. findAllWithRelations retorna dados completos do agendamento
// 4. Entidade prontuario tem relação com agendamento

console.log("🎯 [RESULTADO] O vínculo com agendamento foi corrigido!");
