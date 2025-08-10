// Debug específico para investigar o problema do botão exportar
const axios = require('axios');

const API_BASE = 'http://localhost:3000';

async function investigarBotaoExportar() {
  console.log('🔍 INVESTIGAÇÃO: Por que o botão exportar não funciona?');
  console.log('=' .repeat(60));

  try {
    // 1. Testar autenticação
    console.log('\n1️⃣ Testando autenticação...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'dr.teste.agendamento@teste.com',
      password: '123456'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login OK - Token obtido');

    // 2. Buscar prontuários
    console.log('\n2️⃣ Buscando prontuários...');
    const prontuariosResponse = await axios.get(`${API_BASE}/prontuarios/with-relations`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const prontuarios = prontuariosResponse.data;
    console.log(`✅ ${prontuarios.length} prontuários encontrados`);

    // 3. Analisar primeiro prontuário
    const prontuario = prontuarios[0];
    console.log('\n3️⃣ Analisando primeiro prontuário:');
    console.log('🆔 ID:', prontuario.id);
    console.log('👤 Paciente:', {
      nome: prontuario.paciente?.nome,
      cpf: prontuario.paciente?.cpf,
      email: prontuario.paciente?.email
    });
    console.log('👨‍⚕️ Médico:', prontuario.medico?.nome);
    console.log('📅 Data:', prontuario.dataConsulta);

    // 4. Testar endpoint individual
    console.log('\n4️⃣ Testando endpoint individual...');
    const prontuarioIndividual = await axios.get(`${API_BASE}/prontuarios/${prontuario.id}/with-relations`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Endpoint individual funcionando');
    console.log('📋 Dados individuais completos:', {
      temPaciente: !!prontuarioIndividual.data.paciente,
      temMedico: !!prontuarioIndividual.data.medico,
      temDiagnostico: !!prontuarioIndividual.data.diagnostico
    });

    console.log('\n5️⃣ ANÁLISE DO PROBLEMA:');
    console.log('🔧 Backend: ✅ Funcionando perfeitamente');
    console.log('🔧 Dados: ✅ Completos e disponíveis');
    console.log('🔧 API: ✅ Respondendo corretamente');
    
    console.log('\n🎯 POSSÍVEIS CAUSAS DO PROBLEMA:');
    console.log('1. 🌐 Frontend: Erro no navegador/console');
    console.log('2. 📦 jsPDF: Biblioteca não carregando');
    console.log('3. 🖱️ Click: Botão não está respondendo');
    console.log('4. 🔗 Import: Problema nas importações');

    console.log('\n📝 PRÓXIMOS PASSOS DE DEBUG:');
    console.log('1. Abrir http://localhost:8081');
    console.log('2. Fazer login');
    console.log('3. Ir para Prontuários');
    console.log('4. Abrir DevTools (F12) → Console');
    console.log('5. Clicar no botão PDF/LGPD');
    console.log('6. Procurar por mensagens que começam com [TESTE]');

    console.log('\n🔎 MENSAGENS ESPERADAS NO CONSOLE:');
    console.log('[TESTE] Clicou no botão PDF');
    console.log('[TESTE] Dados do prontuário: {...}');
    console.log('[TESTE] Importando jsPDF...');
    console.log('[TESTE] jsPDF importado!');
    console.log('[TESTE] PDF gerado e salvo com sucesso!');

    console.log('\n❌ SE NÃO APARECER NENHUMA MENSAGEM:');
    console.log('→ O botão não está sendo clicado');
    console.log('→ Problema no evento onClick');

    console.log('\n❌ SE APARECER ERRO:');
    console.log('→ Copie a mensagem de erro completa');
    console.log('→ Informe qual botão foi clicado (PDF ou LGPD)');

  } catch (error) {
    console.error('❌ Erro na investigação:', error.message);
    if (error.response) {
      console.error('📝 Detalhes:', error.response.data);
    }
  }
}

investigarBotaoExportar();
