/**
 * Script de Validação - Funcionalidades de Telemedicina
 * Valida: videochamadas seguras, registro de prontuários online, prescrições online
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';
let authToken = '';

// Função para fazer login como médico
async function loginMedico() {
  try {
    console.log('🔐 Fazendo login como médico...');
    
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

// Função para buscar dados básicos
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

// 1. VALIDAR AGENDAMENTO DE TELECONSULTAS
async function validarAgendamentoTeleconsultas(dados) {
  console.log('\n📹 === VALIDAÇÃO: AGENDAMENTO DE TELECONSULTAS ===');
  
  try {
    const headers = { Authorization: `Bearer ${authToken}` };
    const { agendamentos, medicos, pacientes } = dados;

    // Análise de teleconsultas existentes
    const teleconsultas = agendamentos.filter(ag => ag.tipo === 'TELEMEDICINA');
    const teleconsultasPorStatus = {};
    
    teleconsultas.forEach(tc => {
      teleconsultasPorStatus[tc.status] = (teleconsultasPorStatus[tc.status] || 0) + 1;
    });

    console.log(`   📊 Total de teleconsultas: ${teleconsultas.length}`);
    console.log('   📊 Distribuição por status:');
    Object.keys(teleconsultasPorStatus).forEach(status => {
      console.log(`      ${status}: ${teleconsultasPorStatus[status]}`);
    });

    // Análise por médico
    const teleconsultasPorMedico = {};
    medicos.forEach(medico => {
      const tcMedico = teleconsultas.filter(tc => tc.medicoId === medico.id);
      teleconsultasPorMedico[medico.nome] = tcMedico.length;
    });

    console.log('\n   📊 Teleconsultas por médico:');
    Object.keys(teleconsultasPorMedico).forEach(nome => {
      console.log(`      ${nome}: ${teleconsultasPorMedico[nome]}`);
    });

    // Teste de criação de nova teleconsulta
    console.log('\n   🔄 Testando criação de nova teleconsulta...');
    const novaTeleconsulta = {
      pacienteId: pacientes[0]?.id,
      medicoId: medicos[0]?.id,
      dataHora: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Em 7 dias
      tipo: 'TELEMEDICINA',
      observacoes: 'Teleconsulta de validação - consulta de seguimento via telemedicina'
    };

    const responseCreate = await axios.post(`${API_BASE_URL}/agendamentos`, novaTeleconsulta, { headers });
    console.log('      ✅ Teleconsulta agendada com sucesso');
    
    return {
      funcional: true,
      totalTeleconsultas: teleconsultas.length,
      distribuicaoStatus: teleconsultasPorStatus,
      distribuicaoMedicos: teleconsultasPorMedico,
      testeCriacao: true
    };

  } catch (error) {
    console.error('   ❌ Erro no agendamento de teleconsultas:', error.response?.data?.message || error.message);
    return {
      funcional: false,
      erro: error.message,
      testeCriacao: false
    };
  }
}

// 2. VALIDAR INTERFACE DE VIDEOCHAMADAS
async function validarInterfaceVideochamadas() {
  console.log('\n🎥 === VALIDAÇÃO: INTERFACE DE VIDEOCHAMADAS ===');
  
  try {
    // Verificação de dependências para videochamadas
    const dependenciasVideo = {
      webrtc: false,
      socketio: false,
      videoLibrary: false,
      securityFeatures: false
    };

    console.log('   🔍 Verificando tecnologias de videochamada...');
    
    // Simulação de verificação de dependências (seria implementado no frontend)
    console.log('      📱 WebRTC: ❌ Não implementado');
    console.log('      🔌 Socket.IO: ❌ Não configurado');
    console.log('      📹 Biblioteca de vídeo: ❌ Não instalada');
    console.log('      🔒 Recursos de segurança: ❌ Não implementados');

    // Verificação de endpoints específicos para videochamadas
    console.log('\n   🔍 Verificando endpoints de videochamada...');
    const endpointsVideo = [
      '/api/video/room/create',
      '/api/video/room/join',
      '/api/video/room/end',
      '/ws/video'
    ];

    let endpointsExistem = 0;
    for (const endpoint of endpointsVideo) {
      try {
        // Tentativa de acessar endpoints (esperado 404 pois não existem)
        await axios.get(`${API_BASE_URL}${endpoint}`);
        console.log(`      ✅ ${endpoint}: Disponível`);
        endpointsExistem++;
      } catch (error) {
        console.log(`      ❌ ${endpoint}: Não implementado`);
      }
    }

    const percentualImplementacao = (endpointsExistem / endpointsVideo.length) * 100;

    return {
      funcional: false,
      dependencias: dependenciasVideo,
      endpointsImplementados: endpointsExistem,
      totalEndpoints: endpointsVideo.length,
      percentualImplementacao,
      recomendacoes: [
        'Implementar WebRTC para comunicação P2P',
        'Configurar Socket.IO para sinalização',
        'Adicionar biblioteca de vídeo (ex: Jitsi, Twilio)',
        'Implementar criptografia end-to-end'
      ]
    };

  } catch (error) {
    console.error('   ❌ Erro na validação de videochamadas:', error.message);
    return {
      funcional: false,
      erro: error.message
    };
  }
}

// 3. VALIDAR PRONTUÁRIOS ONLINE PARA TELECONSULTA
async function validarProntuariosOnline(dados) {
  console.log('\n📋 === VALIDAÇÃO: PRONTUÁRIOS ONLINE PARA TELECONSULTA ===');
  
  try {
    const headers = { Authorization: `Bearer ${authToken}` };
    const { prontuarios, agendamentos } = dados;

    // Buscar prontuários de teleconsultas
    const teleconsultas = agendamentos.filter(ag => ag.tipo === 'TELEMEDICINA');
    const prontuariosTeleconsulta = [];
    
    for (const tc of teleconsultas) {
      const prontuario = prontuarios.find(p => p.agendamentoId === tc.id);
      if (prontuario) {
        prontuariosTeleconsulta.push({
          agendamento: tc,
          prontuario: prontuario
        });
      }
    }

    console.log(`   📊 Teleconsultas com prontuário: ${prontuariosTeleconsulta.length}/${teleconsultas.length}`);

    // Análise dos campos específicos para teleconsulta
    let prontuariosCompletos = 0;
    let comPrescricaoDigital = 0;
    let comObservacoesTelemed = 0;

    prontuariosTeleconsulta.forEach(pt => {
      const p = pt.prontuario;
      
      // Verificar se o prontuário está completo
      if (p.anamnese && p.exameFisico && p.diagnostico) {
        prontuariosCompletos++;
      }

      // Verificar prescrições digitais
      if (p.prescricaoUsoInterno || p.prescricaoUsoExterno) {
        comPrescricaoDigital++;
      }

      // Verificar observações específicas de telemedicina
      if (p.observacoes && p.observacoes.toLowerCase().includes('telemed')) {
        comObservacoesTelemed++;
      }
    });

    console.log(`   📊 Prontuários completos: ${prontuariosCompletos}`);
    console.log(`   📊 Com prescrição digital: ${comPrescricaoDigital}`);
    console.log(`   📊 Com observações de telemedicina: ${comObservacoesTelemed}`);

    // Teste de criação de prontuário para teleconsulta
    console.log('\n   🔄 Testando criação de prontuário para teleconsulta...');
    
    // Buscar uma teleconsulta sem prontuário
    const teleconsultaSemProntuario = teleconsultas.find(tc => 
      !prontuarios.some(p => p.agendamentoId === tc.id)
    );

    if (teleconsultaSemProntuario) {
      const novoProntuario = {
        pacienteId: teleconsultaSemProntuario.pacienteId,
        medicoId: teleconsultaSemProntuario.medicoId,
        agendamentoId: teleconsultaSemProntuario.id,
        dataConsulta: new Date().toISOString(),
        anamnese: 'Teleconsulta: Paciente relata sintomas de forma remota. Conexão estável durante toda a consulta.',
        exameFisico: 'Exame visual remoto: Paciente orientado, sem sinais visuais de desconforto. Limitações do exame físico por teleconsulta documentadas.',
        diagnostico: 'Diagnóstico baseado em anamnese e exame visual remoto',
        prescricaoUsoInterno: 'Prescrição digital: Paracetamol 500mg - 1 comprimido se dor',
        prescricaoUsoExterno: 'Orientações de autocuidado via telemedicina',
        observacoes: 'Consulta realizada via telemedicina. Qualidade de áudio e vídeo adequada. Paciente orientado sobre limitações e próximos passos.'
      };

      try {
        const response = await axios.post(`${API_BASE_URL}/prontuarios`, novoProntuario, { headers });
        console.log('      ✅ Prontuário de teleconsulta criado com sucesso');
        
        return {
          funcional: true,
          teleconsultasComProntuario: prontuariosTeleconsulta.length + 1,
          prontuariosCompletos,
          comPrescricaoDigital: comPrescricaoDigital + 1,
          testeCriacao: true,
          camposTelemedicina: {
            anamneseRemota: true,
            exameFisicoLimitado: true,
            prescricaoDigital: true,
            observacoesEspecificas: true
          }
        };
      } catch (error) {
        console.error('      ❌ Erro ao criar prontuário de teleconsulta:', error.response?.data?.message || error.message);
        return {
          funcional: false,
          erro: error.message,
          testeCriacao: false
        };
      }
    } else {
      console.log('      ⚠️ Todas as teleconsultas já possuem prontuário');
      return {
        funcional: true,
        teleconsultasComProntuario: prontuariosTeleconsulta.length,
        prontuariosCompletos,
        comPrescricaoDigital,
        testeCriacao: false,
        observacao: 'Todas as teleconsultas já possuem prontuário'
      };
    }

  } catch (error) {
    console.error('   ❌ Erro na validação de prontuários online:', error.response?.data?.message || error.message);
    return {
      funcional: false,
      erro: error.message
    };
  }
}

// 4. VALIDAR PRESCRIÇÕES DIGITAIS PARA TELEMEDICINA
async function validarPrescricoesDigitaisTelemedicina(dados) {
  console.log('\n💊 === VALIDAÇÃO: PRESCRIÇÕES DIGITAIS PARA TELEMEDICINA ===');
  
  try {
    const { prontuarios, agendamentos, medicos } = dados;

    // Filtrar prontuários de teleconsultas
    const teleconsultas = agendamentos.filter(ag => ag.tipo === 'TELEMEDICINA');
    const prontuariosTeleconsulta = prontuarios.filter(p => 
      teleconsultas.some(tc => tc.id === p.agendamentoId)
    );

    console.log(`   📊 Prontuários de teleconsulta: ${prontuariosTeleconsulta.length}`);

    // Análise de prescrições digitais
    let prescricoesDigitais = {
      usoInterno: 0,
      usoExterno: 0,
      total: 0,
      porMedico: {}
    };

    medicos.forEach(medico => {
      prescricoesDigitais.porMedico[medico.nome] = {
        prontuarios: 0,
        prescricoesInternas: 0,
        prescricoesExternas: 0,
        crm: medico.crm,
        especialidade: medico.especialidade
      };
    });

    prontuariosTeleconsulta.forEach(p => {
      const medico = medicos.find(m => m.id === p.medicoId);
      const nomeMedico = medico ? medico.nome : 'N/A';

      if (medico) {
        prescricoesDigitais.porMedico[nomeMedico].prontuarios++;
      }

      if (p.prescricaoUsoInterno) {
        prescricoesDigitais.usoInterno++;
        prescricoesDigitais.total++;
        if (medico) {
          prescricoesDigitais.porMedico[nomeMedico].prescricoesInternas++;
        }
      }

      if (p.prescricaoUsoExterno) {
        prescricoesDigitais.usoExterno++;
        prescricoesDigitais.total++;
        if (medico) {
          prescricoesDigitais.porMedico[nomeMedico].prescricoesExternas++;
        }
      }
    });

    console.log(`   📊 Prescrições digitais em teleconsultas:`);
    console.log(`      Uso interno: ${prescricoesDigitais.usoInterno}`);
    console.log(`      Uso externo: ${prescricoesDigitais.usoExterno}`);
    console.log(`      Total: ${prescricoesDigitais.total}`);

    console.log('\n   📊 Prescrições por médico em teleconsultas:');
    Object.keys(prescricoesDigitais.porMedico).forEach(nome => {
      const stats = prescricoesDigitais.porMedico[nome];
      if (stats.prontuarios > 0) {
        console.log(`      ${nome} (CRM: ${stats.crm}):`);
        console.log(`         Teleconsultas: ${stats.prontuarios}`);
        console.log(`         Prescrições internas: ${stats.prescricoesInternas}`);
        console.log(`         Prescrições externas: ${stats.prescricoesExternas}`);
      }
    });

    // Validação de conformidade legal para prescrições digitais
    const medicosComCRM = medicos.filter(m => m.crm && m.crm.trim() !== '').length;
    const medicosComEspecialidade = medicos.filter(m => m.especialidade && m.especialidade.trim() !== '').length;
    
    console.log('\n   ✅ Validação legal para prescrições digitais:');
    console.log(`      Médicos com CRM: ${medicosComCRM}/${medicos.length} (${(medicosComCRM/medicos.length*100).toFixed(1)}%)`);
    console.log(`      Médicos com especialidade: ${medicosComEspecialidade}/${medicos.length} (${(medicosComEspecialidade/medicos.length*100).toFixed(1)}%)`);

    // Verificação de recursos de segurança para prescrições digitais
    const recursosSeguranca = {
      assinaturaDigital: false, // Seria implementado
      criptografia: false,      // Seria implementado
      timestamping: false,      // Seria implementado
      auditoria: false          // Seria implementado
    };

    console.log('\n   🔒 Recursos de segurança para prescrições digitais:');
    console.log('      Assinatura digital: ❌ Não implementada');
    console.log('      Criptografia: ❌ Não implementada');
    console.log('      Timestamp seguro: ❌ Não implementado');
    console.log('      Log de auditoria: ❌ Não implementado');

    return {
      funcional: true,
      prescricoesDigitais,
      conformidadeLegal: {
        medicosComCRM,
        medicosComEspecialidade,
        percentualConformidade: (medicosComCRM + medicosComEspecialidade) / (medicos.length * 2) * 100
      },
      recursosSeguranca,
      recomendacoes: [
        'Implementar assinatura digital certificada',
        'Adicionar criptografia nas prescrições',
        'Implementar timestamp confiável',
        'Criar log de auditoria para prescrições'
      ]
    };

  } catch (error) {
    console.error('   ❌ Erro na validação de prescrições digitais:', error.message);
    return {
      funcional: false,
      erro: error.message
    };
  }
}

// Função para gerar relatório final
function gerarRelatorioFinalTelemedicina(resultados) {
  console.log('\n' + '='.repeat(70));
  console.log('📹 RELATÓRIO FINAL - FUNCIONALIDADES DE TELEMEDICINA');
  console.log('='.repeat(70));

  const funcionalidades = [
    {
      nome: 'Agendamento de Teleconsultas',
      resultado: resultados.agendamento,
      peso: 30
    },
    {
      nome: 'Interface de Videochamadas',
      resultado: resultados.videochamadas,
      peso: 40
    },
    {
      nome: 'Prontuários Online',
      resultado: resultados.prontuarios,
      peso: 20
    },
    {
      nome: 'Prescrições Digitais',
      resultado: resultados.prescricoes,
      peso: 10
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
      
      if (func.nome === 'Agendamento de Teleconsultas') {
        console.log(`   📊 Total teleconsultas: ${func.resultado.totalTeleconsultas}`);
        console.log(`   📊 Criação: ${func.resultado.testeCriacao ? '✅' : '❌'}`);
      }
      
      if (func.nome === 'Prontuários Online') {
        console.log(`   📊 Criação: ${func.resultado.testeCriacao ? '✅' : '❌'}`);
        console.log(`   📊 Com prescrição: ${func.resultado.comPrescricaoDigital || 0}`);
      }
      
      if (func.nome === 'Prescrições Digitais') {
        console.log(`   📊 Conformidade legal: ${func.resultado.conformidadeLegal?.percentualConformidade?.toFixed(1)}%`);
        console.log(`   📊 Total prescrições: ${func.resultado.prescricoesDigitais?.total || 0}`);
      }
      
    } else {
      console.log(`   ❌ Não funcional - ${pontos}/${func.peso} pontos`);
      if (func.resultado.erro) {
        console.log(`   🔍 Erro: ${func.resultado.erro}`);
      }
      if (func.resultado.percentualImplementacao !== undefined) {
        console.log(`   🔍 Implementação: ${func.resultado.percentualImplementacao}%`);
      }
    }
  });

  const percentualFinal = (pontuacaoTotal / 100) * 100;

  console.log('\n' + '='.repeat(70));
  console.log(`📊 RESULTADO FINAL - TELEMEDICINA:`);
  console.log(`   ✅ Funcionalidades operacionais: ${funcionalidadesOK}/4 (${(funcionalidadesOK/4*100).toFixed(1)}%)`);
  console.log(`   📊 Pontuação total: ${pontuacaoTotal}/100 pontos (${percentualFinal.toFixed(1)}%)`);
  
  if (percentualFinal >= 80) {
    console.log(`   🎉 STATUS: EXCELENTE - Telemedicina pronta para produção`);
  } else if (percentualFinal >= 50) {
    console.log(`   ⚠️ STATUS: EM DESENVOLVIMENTO - Recursos parciais disponíveis`);
  } else {
    console.log(`   ❌ STATUS: INICIAL - Muitas funcionalidades em desenvolvimento`);
  }
  
  console.log('='.repeat(70));

  // Recomendações específicas
  console.log('\n🎯 RECOMENDAÇÕES PRIORITÁRIAS:');
  console.log('1. 🚨 CRÍTICO: Implementar interface de videochamadas');
  console.log('   - WebRTC para comunicação peer-to-peer');
  console.log('   - Socket.IO para sinalização');
  console.log('   - Biblioteca de vídeo (Jitsi, Twilio, etc.)');
  
  console.log('\n2. 🔒 IMPORTANTE: Recursos de segurança');
  console.log('   - Criptografia end-to-end para vídeo');
  console.log('   - Assinatura digital para prescrições');
  console.log('   - Logs de auditoria para conformidade');
  
  console.log('\n3. 📱 DESEJÁVEL: Melhorias de usabilidade');
  console.log('   - App mobile para teleconsultas');
  console.log('   - Gravação de sessões (opcional)');
  console.log('   - Chat integrado durante videochamadas');
}

// Função principal
async function validarTelemedicina() {
  console.log('📹 INICIANDO VALIDAÇÃO DAS FUNCIONALIDADES DE TELEMEDICINA');
  console.log('='.repeat(70));

  try {
    // 1. Login
    const loginData = await loginMedico();
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
      agendamento: await validarAgendamentoTeleconsultas(dados),
      videochamadas: await validarInterfaceVideochamadas(),
      prontuarios: await validarProntuariosOnline(dados),
      prescricoes: await validarPrescricoesDigitaisTelemedicina(dados)
    };

    // 4. Gerar relatório final
    gerarRelatorioFinalTelemedicina(resultados);

  } catch (error) {
    console.error('❌ Erro geral na validação:', error.message);
  }
}

// Executar validação
validarTelemedicina();
