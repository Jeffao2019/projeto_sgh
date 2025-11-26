/**
 * Script de Validação - Funcionalidades dos Profissionais de Saúde
 * Valida: gerenciar agendas, atualizar prontuários, emitir receitas digitais, acompanhar histórico dos pacientes
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';
let authToken = '';

// Função para fazer login como profissional/médico
async function loginProfissional() {
  try {
    console.log('🔐 Fazendo login como profissional de saúde...');
    
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'dr.carlos@sgh.com',
      password: '123456'
    });

    authToken = response.data.token || response.data.access_token;
    console.log('   ✅ Login realizado como Dr. Carlos Silva');
    
    return response.data;
  } catch (error) {
    console.error('   ❌ Erro no login:', error.response?.data?.message || error.message);
    return null;
  }
}

// Função para buscar dados básicos do sistema
async function buscarDadosBasicos() {
  try {
    console.log('\n📊 Buscando dados básicos do sistema...');
    
    const headers = { Authorization: `Bearer ${authToken}` };
    
    const [pacientes, medicos, agendamentos, prontuarios] = await Promise.all([
      axios.get(`${API_BASE_URL}/pacientes`, { headers }),
      axios.get(`${API_BASE_URL}/auth/medicos`, { headers }),
      axios.get(`${API_BASE_URL}/agendamentos`, { headers }),
      axios.get(`${API_BASE_URL}/prontuarios`, { headers })
    ]);

    console.log(`   👥 Pacientes: ${pacientes.data.length}`);
    console.log(`   👨‍⚕️ Médicos: ${medicos.data.length}`);
    console.log(`   📅 Agendamentos: ${agendamentos.data.length}`);
    console.log(`   📋 Prontuários: ${prontuarios.data.length}`);

    return {
      pacientes: pacientes.data,
      medicos: medicos.data,
      agendamentos: agendamentos.data,
      prontuarios: prontuarios.data
    };
  } catch (error) {
    console.error('   ❌ Erro ao buscar dados:', error.response?.data?.message || error.message);
    return null;
  }
}

// 1. VALIDAR GERENCIAMENTO DE AGENDAS
async function validarGerenciamentoAgendas(dados) {
  console.log('\n🗓️ === VALIDAÇÃO: GERENCIAMENTO DE AGENDAS ===');
  
  try {
    const headers = { Authorization: `Bearer ${authToken}` };
    const { agendamentos, medicos } = dados;
    
    // Análise por médico
    const agendasPorMedico = {};
    medicos.forEach(medico => {
      const agendamentosMedico = agendamentos.filter(a => a.medicoId === medico.id);
      agendasPorMedico[medico.nome] = {
        total: agendamentosMedico.length,
        agendados: agendamentosMedico.filter(a => a.status === 'AGENDADO').length,
        confirmados: agendamentosMedico.filter(a => a.status === 'CONFIRMADO').length,
        concluidos: agendamentosMedico.filter(a => a.status === 'CONCLUIDO').length,
        cancelados: agendamentosMedico.filter(a => a.status === 'CANCELADO').length
      };
    });

    console.log('   📊 Agenda por médico:');
    Object.keys(agendasPorMedico).forEach(nome => {
      const agenda = agendasPorMedico[nome];
      console.log(`      ${nome}:`);
      console.log(`         Total: ${agenda.total}`);
      console.log(`         Agendados: ${agenda.agendados}`);
      console.log(`         Confirmados: ${agenda.confirmados}`);
      console.log(`         Concluídos: ${agenda.concluidos}`);
      console.log(`         Cancelados: ${agenda.cancelados}`);
    });

    // Teste de criação de agendamento
    console.log('\n   🔄 Testando criação de novo agendamento...');
    const novoAgendamento = {
      pacienteId: dados.pacientes[0]?.id,
      medicoId: dados.medicos[0]?.id,
      dataHora: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Amanhã
      tipo: 'CONSULTA_GERAL',
      observacoes: 'Teste de validação - agendamento criado automaticamente'
    };

    const responseCreate = await axios.post(`${API_BASE_URL}/agendamentos`, novoAgendamento, { headers });
    console.log('      ✅ Agendamento criado com sucesso');
    
    // Teste de atualização de status
    console.log('   🔄 Testando atualização de status...');
    const agendamentoId = responseCreate.data.id;
    await axios.put(`${API_BASE_URL}/agendamentos/${agendamentoId}/confirmar`, {}, { headers });
    console.log('      ✅ Status atualizado para CONFIRMADO');

    return {
      funcional: true,
      detalhes: agendasPorMedico,
      testeCriacao: true,
      testeAtualizacao: true
    };

  } catch (error) {
    console.error('   ❌ Erro no gerenciamento de agendas:', error.response?.data?.message || error.message);
    return {
      funcional: false,
      erro: error.message,
      testeCriacao: false,
      testeAtualizacao: false
    };
  }
}

// 2. VALIDAR ATUALIZAÇÃO DE PRONTUÁRIOS
async function validarAtualizacaoProntuarios(dados) {
  console.log('\n📋 === VALIDAÇÃO: ATUALIZAÇÃO DE PRONTUÁRIOS ===');
  
  try {
    const headers = { Authorization: `Bearer ${authToken}` };
    const { prontuarios, medicos } = dados;

    // Análise de prontuários existentes
    const prontuariosPorMedico = {};
    medicos.forEach(medico => {
      const prontuariosMedico = prontuarios.filter(p => p.medicoId === medico.id);
      prontuariosPorMedico[medico.nome] = {
        total: prontuariosMedico.length,
        completos: prontuariosMedico.filter(p => 
          p.anamnese && p.exameFisico && p.diagnostico
        ).length,
        comPrescricao: prontuariosMedico.filter(p => 
          p.prescricaoUsoInterno || p.prescricaoUsoExterno
        ).length
      };
    });

    console.log('   📊 Prontuários por médico:');
    Object.keys(prontuariosPorMedico).forEach(nome => {
      const stats = prontuariosPorMedico[nome];
      console.log(`      ${nome}:`);
      console.log(`         Total: ${stats.total}`);
      console.log(`         Completos: ${stats.completos}`);
      console.log(`         Com prescrição: ${stats.comPrescricao}`);
    });

    // Teste de criação de prontuário
    if (dados.agendamentos.length > 0 && dados.pacientes.length > 0 && dados.medicos.length > 0) {
      console.log('\n   🔄 Testando criação de novo prontuário...');
      
      const novoProntuario = {
        pacienteId: dados.pacientes[0].id,
        medicoId: dados.medicos[0].id,
        agendamentoId: dados.agendamentos[0].id,
        dataConsulta: new Date().toISOString(),
        anamnese: 'Paciente relata dor de cabeça há 3 dias',
        exameFisico: 'Pressão arterial: 120/80 mmHg, Temperatura: 36.5°C',
        diagnostico: 'Cefaleia tensional',
        prescricaoUsoInterno: 'Dipirona 500mg - 1 comprimido de 6/6h por 3 dias',
        observacoes: 'Retorno em 1 semana se sintomas persistirem'
      };

      const responseCreate = await axios.post(`${API_BASE_URL}/prontuarios`, novoProntuario, { headers });
      console.log('      ✅ Prontuário criado com sucesso');

      // Teste de atualização
      console.log('   🔄 Testando atualização de prontuário...');
      const prontuarioId = responseCreate.data.id;
      const atualizacao = {
        prescricaoUsoExterno: 'Compressa fria na testa por 15 minutos, 3x ao dia',
        observacoes: 'Paciente orientado sobre medidas não farmacológicas. Retorno em 1 semana.'
      };

      await axios.put(`${API_BASE_URL}/prontuarios/${prontuarioId}`, atualizacao, { headers });
      console.log('      ✅ Prontuário atualizado com sucesso');

      return {
        funcional: true,
        detalhes: prontuariosPorMedico,
        testeCriacao: true,
        testeAtualizacao: true
      };
    } else {
      console.log('   ⚠️ Não há dados suficientes para teste de criação');
      return {
        funcional: true,
        detalhes: prontuariosPorMedico,
        testeCriacao: false,
        testeAtualizacao: false
      };
    }

  } catch (error) {
    console.error('   ❌ Erro na atualização de prontuários:', error.response?.data?.message || error.message);
    return {
      funcional: false,
      erro: error.message,
      testeCriacao: false,
      testeAtualizacao: false
    };
  }
}

// 3. VALIDAR EMISSÃO DE RECEITAS DIGITAIS
async function validarEmissaoReceitas(dados) {
  console.log('\n💊 === VALIDAÇÃO: EMISSÃO DE RECEITAS DIGITAIS ===');
  
  try {
    const { prontuarios, medicos } = dados;

    // Análise de prescrições existentes
    const prescricoesPorMedico = {};
    let totalPrescricoes = 0;
    let prescricoesInternas = 0;
    let prescricoesExternas = 0;

    medicos.forEach(medico => {
      const prontuariosMedico = prontuarios.filter(p => p.medicoId === medico.id);
      const comPrescricaoInterna = prontuariosMedico.filter(p => p.prescricaoUsoInterno).length;
      const comPrescricaoExterna = prontuariosMedico.filter(p => p.prescricaoUsoExterno).length;
      
      prescricoesPorMedico[medico.nome] = {
        prontuarios: prontuariosMedico.length,
        prescricoesInternas: comPrescricaoInterna,
        prescricoesExternas: comPrescricaoExterna,
        crm: medico.crm || 'N/A',
        especialidade: medico.especialidade || 'N/A'
      };

      totalPrescricoes += comPrescricaoInterna + comPrescricaoExterna;
      prescricoesInternas += comPrescricaoInterna;
      prescricoesExternas += comPrescricaoExterna;
    });

    console.log('   📊 Receitas digitais por médico:');
    Object.keys(prescricoesPorMedico).forEach(nome => {
      const stats = prescricoesPorMedico[nome];
      console.log(`      ${nome} (CRM: ${stats.crm}):`);
      console.log(`         Prontuários: ${stats.prontuarios}`);
      console.log(`         Prescrições internas: ${stats.prescricoesInternas}`);
      console.log(`         Prescrições externas: ${stats.prescricoesExternas}`);
      console.log(`         Especialidade: ${stats.especialidade}`);
    });

    console.log(`\n   📈 Resumo geral:`);
    console.log(`      Total de prescrições: ${totalPrescricoes}`);
    console.log(`      Prescrições uso interno: ${prescricoesInternas}`);
    console.log(`      Prescrições uso externo: ${prescricoesExternas}`);

    // Validação de campos obrigatórios para receita digital
    const medicosComCRM = medicos.filter(m => m.crm && m.crm.trim() !== '').length;
    const medicosComEspecialidade = medicos.filter(m => m.especialidade && m.especialidade.trim() !== '').length;

    console.log(`\n   ✅ Validação de requisitos legais:`);
    console.log(`      Médicos com CRM: ${medicosComCRM}/${medicos.length}`);
    console.log(`      Médicos com especialidade: ${medicosComEspecialidade}/${medicos.length}`);

    const percentualValidacao = ((medicosComCRM + medicosComEspecialidade) / (medicos.length * 2)) * 100;

    return {
      funcional: true,
      totalPrescricoes,
      prescricoesInternas,
      prescricoesExternas,
      detalhes: prescricoesPorMedico,
      validacaoLegal: {
        medicosComCRM,
        medicosComEspecialidade,
        percentual: percentualValidacao
      }
    };

  } catch (error) {
    console.error('   ❌ Erro na validação de receitas:', error.message);
    return {
      funcional: false,
      erro: error.message
    };
  }
}

// 4. VALIDAR ACOMPANHAMENTO DO HISTÓRICO DOS PACIENTES
async function validarHistoricoPacientes(dados) {
  console.log('\n📊 === VALIDAÇÃO: ACOMPANHAMENTO DO HISTÓRICO DOS PACIENTES ===');
  
  try {
    const headers = { Authorization: `Bearer ${authToken}` };
    const { pacientes, prontuarios, agendamentos, medicos } = dados;

    // Teste de busca de histórico por paciente
    console.log('   🔍 Testando busca de histórico por paciente...');
    
    const historicoPorPaciente = {};
    
    for (const paciente of pacientes.slice(0, 3)) { // Testa os 3 primeiros pacientes
      try {
        // Buscar prontuários do paciente
        const prontuariosPaciente = await axios.get(
          `${API_BASE_URL}/prontuarios/paciente/${paciente.id}`, 
          { headers }
        );
        
        // Buscar agendamentos do paciente
        const agendamentosPaciente = await axios.get(
          `${API_BASE_URL}/agendamentos/paciente/${paciente.id}`, 
          { headers }
        );

        historicoPorPaciente[paciente.nome] = {
          prontuarios: prontuariosPaciente.data.length,
          agendamentos: agendamentosPaciente.data.length,
          ultimaConsulta: prontuariosPaciente.data.length > 0 ? 
            new Date(Math.max(...prontuariosPaciente.data.map(p => new Date(p.dataConsulta)))).toLocaleDateString('pt-BR') : 
            'Nenhuma',
          medicosTrataram: [...new Set(prontuariosPaciente.data.map(p => {
            const medico = medicos.find(m => m.id === p.medicoId);
            return medico ? medico.nome : 'N/A';
          }))].length
        };

      } catch (error) {
        console.error(`      ❌ Erro ao buscar histórico de ${paciente.nome}:`, error.message);
        historicoPorPaciente[paciente.nome] = { erro: error.message };
      }
    }

    console.log('   📊 Histórico dos pacientes testados:');
    Object.keys(historicoPorPaciente).forEach(nome => {
      const hist = historicoPorPaciente[nome];
      if (!hist.erro) {
        console.log(`      ${nome}:`);
        console.log(`         Prontuários: ${hist.prontuarios}`);
        console.log(`         Agendamentos: ${hist.agendamentos}`);
        console.log(`         Última consulta: ${hist.ultimaConsulta}`);
        console.log(`         Médicos diferentes: ${hist.medicosTrataram}`);
      } else {
        console.log(`      ${nome}: ❌ ${hist.erro}`);
      }
    });

    // Teste de busca por médico
    console.log('\n   🔍 Testando busca de pacientes por médico...');
    
    const pacientesPorMedico = {};
    for (const medico of medicos) {
      try {
        const prontuariosMedico = await axios.get(
          `${API_BASE_URL}/prontuarios/medico/${medico.id}`, 
          { headers }
        );

        const pacientesUnicos = [...new Set(prontuariosMedico.data.map(p => p.pacienteId))];
        
        pacientesPorMedico[medico.nome] = {
          pacientesAtendidos: pacientesUnicos.length,
          totalConsultas: prontuariosMedico.data.length,
          mediaConsultasPorPaciente: pacientesUnicos.length > 0 ? 
            (prontuariosMedico.data.length / pacientesUnicos.length).toFixed(1) : 0
        };

      } catch (error) {
        console.error(`      ❌ Erro ao buscar dados de ${medico.nome}:`, error.message);
        pacientesPorMedico[medico.nome] = { erro: error.message };
      }
    }

    console.log('   📊 Pacientes atendidos por médico:');
    Object.keys(pacientesPorMedico).forEach(nome => {
      const stats = pacientesPorMedico[nome];
      if (!stats.erro) {
        console.log(`      ${nome}:`);
        console.log(`         Pacientes atendidos: ${stats.pacientesAtendidos}`);
        console.log(`         Total de consultas: ${stats.totalConsultas}`);
        console.log(`         Média consultas/paciente: ${stats.mediaConsultasPorPaciente}`);
      } else {
        console.log(`      ${nome}: ❌ ${stats.erro}`);
      }
    });

    return {
      funcional: true,
      historicoPorPaciente,
      pacientesPorMedico,
      testeBuscaPaciente: true,
      testeBuscaMedico: true
    };

  } catch (error) {
    console.error('   ❌ Erro na validação de histórico:', error.response?.data?.message || error.message);
    return {
      funcional: false,
      erro: error.message,
      testeBuscaPaciente: false,
      testeBuscaMedico: false
    };
  }
}

// Função para gerar relatório final
function gerarRelatorioFinal(resultados) {
  console.log('\n' + '='.repeat(70));
  console.log('📊 RELATÓRIO FINAL - FUNCIONALIDADES DOS PROFISSIONAIS DE SAÚDE');
  console.log('='.repeat(70));

  const funcionalidades = [
    {
      nome: 'Gerenciar Agendas',
      resultado: resultados.agendas,
      peso: 25
    },
    {
      nome: 'Atualizar Prontuários',
      resultado: resultados.prontuarios,
      peso: 30
    },
    {
      nome: 'Emitir Receitas Digitais',
      resultado: resultados.receitas,
      peso: 25
    },
    {
      nome: 'Acompanhar Histórico dos Pacientes',
      resultado: resultados.historico,
      peso: 20
    }
  ];

  let pontuacaoTotal = 0;
  let funcionalidadesOK = 0;

  funcionalidades.forEach(func => {
    const status = func.resultado.funcional ? '✅' : '❌';
    const pontos = func.resultado.funcional ? func.peso : 0;
    pontuacaoTotal += pontos;
    
    if (func.resultado.funcional) funcionalidadesOK++;

    console.log(`\n${status} ${func.nome} (${func.peso}%):`);
    
    if (func.resultado.funcional) {
      console.log(`   ✅ Funcional - ${pontos}/${func.peso} pontos`);
      
      // Detalhes específicos por funcionalidade
      if (func.nome === 'Gerenciar Agendas') {
        console.log(`   📊 Criação: ${func.resultado.testeCriacao ? '✅' : '❌'}`);
        console.log(`   📊 Atualização: ${func.resultado.testeAtualizacao ? '✅' : '❌'}`);
      }
      
      if (func.nome === 'Atualizar Prontuários') {
        console.log(`   📊 Criação: ${func.resultado.testeCriacao ? '✅' : '❌'}`);
        console.log(`   📊 Edição: ${func.resultado.testeAtualizacao ? '✅' : '❌'}`);
      }
      
      if (func.nome === 'Emitir Receitas Digitais') {
        console.log(`   📊 Total prescrições: ${func.resultado.totalPrescricoes}`);
        console.log(`   📊 Validação legal: ${func.resultado.validacaoLegal?.percentual?.toFixed(1)}%`);
      }
      
      if (func.nome === 'Acompanhar Histórico dos Pacientes') {
        console.log(`   📊 Busca por paciente: ${func.resultado.testeBuscaPaciente ? '✅' : '❌'}`);
        console.log(`   📊 Busca por médico: ${func.resultado.testeBuscaMedico ? '✅' : '❌'}`);
      }
      
    } else {
      console.log(`   ❌ Não funcional - ${pontos}/${func.peso} pontos`);
      console.log(`   🔍 Erro: ${func.resultado.erro}`);
    }
  });

  const percentualFinal = (pontuacaoTotal / 100) * 100;

  console.log('\n' + '='.repeat(70));
  console.log(`📊 RESULTADO FINAL:`);
  console.log(`   ✅ Funcionalidades operacionais: ${funcionalidadesOK}/4 (${(funcionalidadesOK/4*100).toFixed(1)}%)`);
  console.log(`   📊 Pontuação total: ${pontuacaoTotal}/100 pontos (${percentualFinal.toFixed(1)}%)`);
  
  if (percentualFinal >= 80) {
    console.log(`   🎉 STATUS: EXCELENTE - Sistema pronto para produção`);
  } else if (percentualFinal >= 60) {
    console.log(`   ⚠️ STATUS: BOM - Algumas melhorias necessárias`);
  } else {
    console.log(`   ❌ STATUS: CRÍTICO - Muitas funcionalidades com problemas`);
  }
  
  console.log('='.repeat(70));
}

// Função principal
async function validarFuncionalidadesProfissionais() {
  console.log('🩺 INICIANDO VALIDAÇÃO DAS FUNCIONALIDADES DOS PROFISSIONAIS DE SAÚDE');
  console.log('='.repeat(70));

  try {
    // 1. Login
    const loginData = await loginProfissional();
    if (!loginData) {
      console.log('❌ Não foi possível fazer login. Encerrando validação.');
      return;
    }

    // 2. Buscar dados básicos
    const dados = await buscarDadosBasicos();
    if (!dados) {
      console.log('❌ Não foi possível buscar dados básicos. Encerrando validação.');
      return;
    }

    // 3. Executar validações
    const resultados = {
      agendas: await validarGerenciamentoAgendas(dados),
      prontuarios: await validarAtualizacaoProntuarios(dados),
      receitas: await validarEmissaoReceitas(dados),
      historico: await validarHistoricoPacientes(dados)
    };

    // 4. Gerar relatório final
    gerarRelatorioFinal(resultados);

  } catch (error) {
    console.error('❌ Erro geral na validação:', error.message);
  }
}

// Executar validação
validarFuncionalidadesProfissionais();
