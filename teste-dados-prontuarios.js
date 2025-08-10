/**
 * TESTE DOS DADOS DO PRONTUÁRIO
 * Execute no console para verificar se os dados estão completos
 */

console.log("🔍 TESTANDO DADOS DOS PRONTUÁRIOS...");

// 1. Buscar token de autenticação
const token = localStorage.getItem('auth_token');
console.log("🔑 Token encontrado:", token ? "✅ SIM" : "❌ NÃO");

if (!token) {
  console.log("❌ Erro: Faça login primeiro!");
} else {
  
  // 2. Testar endpoint de prontuários com relações
  console.log("\n📡 Testando endpoint /prontuarios/with-relations...");
  
  fetch('http://localhost:3000/prontuarios/with-relations', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log("📡 Status da resposta:", response.status);
    return response.json();
  })
  .then(prontuarios => {
    console.log(`📊 Total de prontuários encontrados: ${prontuarios.length}`);
    
    if (prontuarios.length > 0) {
      const primeiro = prontuarios[0];
      console.log("\n📋 Estrutura do primeiro prontuário:");
      console.log("   ID:", primeiro.id);
      console.log("   Data Consulta:", primeiro.dataConsulta);
      console.log("   Diagnóstico:", primeiro.diagnostico);
      console.log("   Paciente:", primeiro.paciente ? "✅ PRESENTE" : "❌ AUSENTE");
      console.log("   Médico:", primeiro.medico ? "✅ PRESENTE" : "❌ AUSENTE");
      
      if (primeiro.paciente) {
        console.log("\n👤 Dados do Paciente:");
        console.log("   Nome:", primeiro.paciente.nome || "❌ AUSENTE");
        console.log("   CPF:", primeiro.paciente.cpf || "❌ AUSENTE");
        console.log("   Email:", primeiro.paciente.email || "❌ AUSENTE");
      }
      
      if (primeiro.medico) {
        console.log("\n👨‍⚕️ Dados do Médico:");
        console.log("   Nome:", primeiro.medico.nome || "❌ AUSENTE");
        console.log("   CRM:", primeiro.medico.crm || "❌ AUSENTE");
        console.log("   Especialidade:", primeiro.medico.especialidade || "❌ AUSENTE");
      }
      
      console.log("\n📝 Dados completos do primeiro prontuário:");
      console.log(JSON.stringify(primeiro, null, 2));
      
    } else {
      console.log("❌ Nenhum prontuário encontrado!");
    }
  })
  .catch(error => {
    console.error("❌ Erro ao buscar prontuários:", error);
  });
  
  // 3. Testar um prontuário específico (se houver)
  setTimeout(() => {
    console.log("\n🔍 Testando prontuário individual...");
    fetch('http://localhost:3000/prontuarios/with-relations', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(prontuarios => {
      if (prontuarios.length > 0) {
        const primeiroId = prontuarios[0].id;
        console.log(`📋 Testando prontuário ID: ${primeiroId}`);
        
        return fetch(`http://localhost:3000/prontuarios/${primeiroId}/with-relations`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    })
    .then(response => response ? response.json() : null)
    .then(prontuario => {
      if (prontuario) {
        console.log("📋 Dados do prontuário individual:");
        console.log("   Paciente completo:", prontuario.paciente ? "✅" : "❌");
        console.log("   Médico completo:", prontuario.medico ? "✅" : "❌");
        console.log("   Dados:", JSON.stringify(prontuario, null, 2));
      }
    })
    .catch(error => {
      console.error("❌ Erro ao buscar prontuário individual:", error);
    });
  }, 1000);
}

console.log("\n⏳ Aguarde os resultados dos testes...");
