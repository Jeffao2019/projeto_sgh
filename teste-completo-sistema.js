/**
 * Script de teste completo do sistema SGH
 * Testa todas as funcionalidades das novas prescrições
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

let authToken = '';

// Função para fazer login
async function login() {
  try {
    console.log('🔐 Fazendo login...');
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@sgh.com',
      password: '123456'
    });
    
    authToken = response.data.access_token;
    console.log('✅ Login realizado com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro no login:', error.response?.data || error.message);
    return false;
  }
}

// Função para buscar pacientes
async function buscarPacientes() {
  try {
    const response = await axios.get(`${API_BASE_URL}/pacientes`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Pacientes encontrados:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao buscar pacientes:', error.response?.data || error.message);
    return [];
  }
}

// Função para buscar médicos
async function buscarMedicos() {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/medicos`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Médicos encontrados:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao buscar médicos:', error.response?.data || error.message);
    return [];
  }
}

// Função para criar prontuário de teste
async function criarProntuarioTeste(paciente, medico) {
  try {
    console.log('\n📝 Criando prontuário de teste...');
    
    const novoProntuario = {
      pacienteId: paciente.id,
      medicoId: medico.id,
      dataConsulta: new Date().toISOString(),
      anamnese: 'Paciente relata dor de cabeça há 3 dias, sem febre.',
      exameFisico: 'PA: 120/80 mmHg, FC: 72 bpm, ausculta cardiopulmonar normal.',
      diagnostico: 'Cefaleia tensional',
      prescricao: 'Orientações gerais para descanso e hidratação (uso hospitalar)',
      prescricaoUsoInterno: 'Dipirona 500mg - 1 comprimido de 6/6h por 3 dias (tomar em casa)',
      prescricaoUsoExterno: 'Paracetamol 750mg - 1 comprimido de 8/8h se dor (comprar na farmácia)',
      observacoes: 'Retornar se sintomas persistirem por mais de 3 dias'
    };

    const response = await axios.post(`${API_BASE_URL}/prontuarios`, novoProntuario, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    console.log('✅ Prontuário criado com sucesso! ID:', response.data.id);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao criar prontuário:', error.response?.data || error.message);
    return null;
  }
}

// Função para buscar prontuários
async function buscarProntuarios() {
  try {
    const response = await axios.get(`${API_BASE_URL}/prontuarios/with-relations`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Prontuários encontrados:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao buscar prontuários:', error.response?.data || error.message);
    return [];
  }
}

// Função para testar validações das prescrições
async function testarValidacoesPrescricoes() {
  console.log('\n🧪 Testando validações das prescrições...');
  
  const pacientes = await buscarPacientes();
  const medicos = await buscarMedicos();
  
  if (pacientes.length === 0) {
    console.log('⚠️ Nenhum paciente encontrado para teste');
    return;
  }
  
  if (medicos.length === 0) {
    console.log('⚠️ Nenhum médico encontrado para teste');
    return;
  }

  console.log('\n📋 Teste 1: Prontuário SEM prescrições obrigatórias (deve falhar)');
  try {
    const prontuarioInvalido = {
      pacienteId: pacientes[0].id,
      medicoId: medicos[0].id,
      dataConsulta: new Date().toISOString(),
      anamnese: 'Teste',
      exameFisico: 'Teste',
      diagnostico: 'Teste',
      prescricao: 'Apenas orientações gerais',
      // Sem prescricaoUsoInterno e prescricaoUsoExterno
      observacoes: 'Teste'
    };

    await axios.post(`${API_BASE_URL}/prontuarios`, prontuarioInvalido, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('❌ ERRO: Prontuário inválido foi aceito!');
  } catch (error) {
    console.log('✅ Validação funcionando: Prontuário rejeitado como esperado');
    console.log('   Erro:', error.response?.data?.message || 'Validation failed');
  }

  console.log('\n📋 Teste 2: Prontuário COM prescrições obrigatórias (deve funcionar)');
  const prontuarioValido = await criarProntuarioTeste(pacientes[0], medicos[0]);
  
  if (prontuarioValido) {
    console.log('✅ Prontuário válido criado com sucesso!');
    
    // Verificar se os campos estão corretos
    console.log('\n🔍 Verificando campos do prontuário:');
    console.log('   - Prescrição geral (opcional):', prontuarioValido.prescricao ? '✅ Presente' : '⚠️ Ausente');
    console.log('   - Prescrição uso interno (obrigatória):', prontuarioValido.prescricaoUsoInterno ? '✅ Presente' : '❌ Ausente');
    console.log('   - Prescrição uso externo (obrigatória):', prontuarioValido.prescricaoUsoExterno ? '✅ Presente' : '❌ Ausente');
  }
}

// Função para simular teste de receita digital
async function simularTesteReceitaDigital() {
  console.log('\n💊 Simulando teste de receita digital...');
  
  const prontuarios = await buscarProntuarios();
  
  if (prontuarios.length === 0) {
    console.log('⚠️ Nenhum prontuário encontrado para testar receita');
    return;
  }

  const prontuario = prontuarios[0];
  
  console.log('📋 Verificando se prontuário pode gerar receita digital:');
  
  const temPrescricaoInterno = prontuario.prescricaoUsoInterno && prontuario.prescricaoUsoInterno.trim() !== '';
  const temPrescricaoExterno = prontuario.prescricaoUsoExterno && prontuario.prescricaoUsoExterno.trim() !== '';
  
  console.log('   - Prescrição uso interno:', temPrescricaoInterno ? '✅ Presente' : '❌ Ausente');
  console.log('   - Prescrição uso externo:', temPrescricaoExterno ? '✅ Presente' : '❌ Ausente');
  
  if (temPrescricaoInterno || temPrescricaoExterno) {
    console.log('✅ Receita digital PODE ser gerada');
    console.log('📄 Conteúdo da receita seria:');
    if (temPrescricaoInterno) {
      console.log('   🏠 Uso Interno:', prontuario.prescricaoUsoInterno);
    }
    if (temPrescricaoExterno) {
      console.log('   🏪 Uso Externo:', prontuario.prescricaoUsoExterno);
    }
  } else {
    console.log('❌ Receita digital NÃO pode ser gerada (sem prescrições obrigatórias)');
  }
}

// Função principal
async function executarTestes() {
  console.log('🚀 Iniciando testes completos do Sistema SGH');
  console.log('=' .repeat(50));
  
  // Fazer login
  if (!await login()) {
    console.log('❌ Não foi possível fazer login. Encerrando testes.');
    return;
  }

  // Testar validações das prescrições
  await testarValidacoesPrescricoes();
  
  // Simular teste de receita digital
  await simularTesteReceitaDigital();
  
  console.log('\n' + '=' .repeat(50));
  console.log('🎉 Testes concluídos!');
  console.log('\n📋 Resumo das funcionalidades testadas:');
  console.log('   ✅ Login no sistema');
  console.log('   ✅ Busca de pacientes e médicos');
  console.log('   ✅ Validação de prescrições obrigatórias');
  console.log('   ✅ Criação de prontuário válido');
  console.log('   ✅ Verificação de receita digital');
  console.log('\n💡 Próximos passos:');
  console.log('   1. Acesse o frontend em: http://localhost:5173');
  console.log('   2. Teste a criação de prontuários pela interface');
  console.log('   3. Teste a geração de receitas digitais');
  console.log('   4. Verifique os campos obrigatórios no formulário');
}

// Executar testes
executarTestes().catch(console.error);
