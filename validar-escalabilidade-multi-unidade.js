/**
 * Script de Validação - Escalabilidade Multi-Unidade Hospitalar
 * Valida: suporte a múltiplas unidades, multi-tenancy, escalabilidade
 */

const axios = require('axios');
const fs = require('fs');

const API_BASE_URL = 'http://localhost:3001';
let authTokenMedico = '';

// Função para verificar estrutura de dados multi-tenant
function verificarEstruturaDados() {
  console.log('🏥 === VALIDAÇÃO: ESTRUTURA MULTI-UNIDADE ===');
  
  // Verificar se existem arquivos relacionados a unidades hospitalares
  const arquivosUnidades = [
    'backend/src/entities/unidade-hospitalar.entity.ts',
    'backend/src/entities/unidade.entity.ts', 
    'backend/src/entities/hospital.entity.ts',
    'backend/src/domain/unidade-hospitalar.entity.ts',
    'backend/src/domain/unidade.entity.ts',
    'backend/src/domain/hospital.entity.ts'
  ];

  let arquivosEncontrados = 0;
  console.log('   🔍 Verificando entidades de unidade hospitalar...');
  
  arquivosUnidades.forEach(arquivo => {
    try {
      if (fs.existsSync(arquivo)) {
        console.log(`      ✅ Encontrado: ${arquivo}`);
        arquivosEncontrados++;
      }
    } catch (error) {
      // Arquivo não existe
    }
  });

  if (arquivosEncontrados === 0) {
    console.log('      ❌ Nenhuma entidade de unidade hospitalar encontrada');
  }

  // Verificar estrutura de banco se houver migrations
  console.log('   🔍 Verificando migrations/esquemas...');
  
  const arquivosMigration = [
    'backend/migrations',
    'backend/database/migrations',
    'backend/src/migrations'
  ];

  let migrationsEncontradas = false;
  arquivosMigration.forEach(pasta => {
    try {
      if (fs.existsSync(pasta)) {
        const arquivos = fs.readdirSync(pasta);
        const migrationUnidade = arquivos.find(arquivo => 
          arquivo.toLowerCase().includes('unidade') || 
          arquivo.toLowerCase().includes('hospital') ||
          arquivo.toLowerCase().includes('tenant')
        );
        
        if (migrationUnidade) {
          console.log(`      ✅ Migration de unidade encontrada: ${migrationUnidade}`);
          migrationsEncontradas = true;
        }
      }
    } catch (error) {
      // Pasta não existe
    }
  });

  if (!migrationsEncontradas) {
    console.log('      ❌ Nenhuma migration de unidade encontrada');
  }

  // Verificar configurações de multi-tenancy
  console.log('   🔍 Verificando configurações de multi-tenancy...');
  
  const arquivosConfig = [
    'backend/src/config/database.config.ts',
    'backend/src/config/tenant.config.ts',
    'backend/ormconfig.js',
    'backend/.env'
  ];

  let configMultiTenant = false;
  arquivosConfig.forEach(arquivo => {
    try {
      if (fs.existsSync(arquivo)) {
        const conteudo = fs.readFileSync(arquivo, 'utf8');
        if (conteudo.includes('tenant') || conteudo.includes('unidade') || conteudo.includes('multi')) {
          console.log(`      ✅ Configuração multi-tenant encontrada em: ${arquivo}`);
          configMultiTenant = true;
        }
      }
    } catch (error) {
      // Arquivo não existe
    }
  });

  if (!configMultiTenant) {
    console.log('      ❌ Configurações de multi-tenancy não encontradas');
  }

  return {
    funcional: arquivosEncontrados > 0 || migrationsEncontradas || configMultiTenant,
    entidadesEncontradas: arquivosEncontrados,
    migrationsEncontradas,
    configMultiTenant,
    implementacao: arquivosEncontrados === 0 && !migrationsEncontradas ? 'AUSENTE' : 'PARCIAL'
  };
}

// Função para validar endpoints de unidades
async function validarEndpointsUnidades() {
  console.log('\n🌐 === VALIDAÇÃO: ENDPOINTS DE UNIDADES ===');
  
  try {
    // Fazer login para obter token
    console.log('   🔍 Realizando autenticação...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'dr.carlos@sgh.com',
      password: '123456'
    });
    
    authTokenMedico = loginResponse.data.token || loginResponse.data.access_token;
    const headers = { Authorization: `Bearer ${authTokenMedico}` };
    console.log('      ✅ Autenticação realizada com sucesso');

    // Testar endpoints relacionados a unidades
    const endpointsUnidades = [
      { url: '/unidades', nome: 'Lista de unidades' },
      { url: '/unidades-hospitalares', nome: 'Unidades hospitalares' },
      { url: '/hospitais', nome: 'Lista de hospitais' },
      { url: '/filiais', nome: 'Filiais' },
      { url: '/tenant', nome: 'Tenant atual' },
      { url: '/configuracao/unidade', nome: 'Configuração da unidade' }
    ];

    let endpointsEncontrados = 0;
    let endpointsDisponiveis = [];

    console.log('   🔍 Testando endpoints de unidades...');
    
    for (const endpoint of endpointsUnidades) {
      try {
        const response = await axios.get(`${API_BASE_URL}${endpoint.url}`, { headers });
        console.log(`      ✅ ${endpoint.nome}: Disponível`);
        endpointsEncontrados++;
        endpointsDisponiveis.push({
          endpoint: endpoint.url,
          nome: endpoint.nome,
          status: 'DISPONIVEL',
          dadosRetornados: Array.isArray(response.data) ? response.data.length : 'Objeto'
        });
      } catch (error) {
        if (error.response?.status === 404) {
          console.log(`      ❌ ${endpoint.nome}: Não implementado`);
        } else if (error.response?.status === 403) {
          console.log(`      ⚠️ ${endpoint.nome}: Sem permissão (implementado)`);
          endpointsEncontrados++;
          endpointsDisponiveis.push({
            endpoint: endpoint.url,
            nome: endpoint.nome,
            status: 'SEM_PERMISSAO'
          });
        } else {
          console.log(`      ⚠️ ${endpoint.nome}: Erro ${error.response?.status}`);
        }
      }
    }

    return {
      funcional: endpointsEncontrados > 0,
      endpointsEncontrados,
      totalEndpoints: endpointsUnidades.length,
      endpointsDisponiveis,
      percentualImplementado: Math.round((endpointsEncontrados / endpointsUnidades.length) * 100)
    };

  } catch (error) {
    console.error('   ❌ Erro na validação de endpoints:', error.response?.data?.message || error.message);
    return { funcional: false, erro: error.message };
  }
}

// Função para verificar isolamento de dados entre unidades
async function verificarIsolamentoDados() {
  console.log('\n🔒 === VALIDAÇÃO: ISOLAMENTO DE DADOS ENTRE UNIDADES ===');
  
  if (!authTokenMedico) {
    console.log('   ❌ Token de autenticação não disponível');
    return { funcional: false, erro: 'Sem autenticação' };
  }

  const headers = { Authorization: `Bearer ${authTokenMedico}` };

  try {
    // Verificar se dados incluem identificadores de unidade
    console.log('   🔍 Verificando estrutura de dados com tenant...');
    
    const endpoints = [
      { url: '/pacientes', nome: 'Pacientes' },
      { url: '/agendamentos', nome: 'Agendamentos' },
      { url: '/prontuarios', nome: 'Prontuários' },
      { url: '/auth/medicos', nome: 'Médicos' }
    ];

    let dadosComTenant = 0;
    let totalEndpoints = 0;

    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`${API_BASE_URL}${endpoint.url}`, { headers });
        const dados = response.data;
        totalEndpoints++;

        if (Array.isArray(dados) && dados.length > 0) {
          const item = dados[0];
          
          // Verificar se contém campos de tenant/unidade
          const camposTenant = [
            'unidadeId', 
            'hospitalId', 
            'tenantId', 
            'unidade_id', 
            'hospital_id', 
            'tenant_id',
            'unidadeHospitalarId'
          ];

          const temTenant = camposTenant.some(campo => 
            item.hasOwnProperty(campo) || 
            (item.unidade && typeof item.unidade === 'object') ||
            (item.hospital && typeof item.hospital === 'object')
          );

          if (temTenant) {
            console.log(`      ✅ ${endpoint.nome}: Dados incluem identificador de unidade`);
            dadosComTenant++;
          } else {
            console.log(`      ❌ ${endpoint.nome}: Sem isolamento por unidade`);
          }

          // Mostrar campos disponíveis para análise
          console.log(`         Campos: ${Object.keys(item).join(', ')}`);
        } else {
          console.log(`      ⚠️ ${endpoint.nome}: Sem dados para análise`);
        }

      } catch (error) {
        console.log(`      ❌ ${endpoint.nome}: Erro ao acessar`);
      }
    }

    const percentualIsolamento = totalEndpoints > 0 ? 
      Math.round((dadosComTenant / totalEndpoints) * 100) : 0;

    return {
      funcional: dadosComTenant > 0,
      dadosComTenant,
      totalEndpoints,
      percentualIsolamento,
      implementacaoTenant: dadosComTenant === 0 ? 'AUSENTE' : 
                          dadosComTenant === totalEndpoints ? 'COMPLETA' : 'PARCIAL'
    };

  } catch (error) {
    console.error('   ❌ Erro na verificação de isolamento:', error.message);
    return { funcional: false, erro: error.message };
  }
}

// Função para testar capacidade de escala
function verificarCapacidadeEscala() {
  console.log('\n📈 === VALIDAÇÃO: CAPACIDADE DE ESCALA ===');
  
  console.log('   🔍 Verificando arquitetura para escalabilidade...');
  
  // Verificar padrões de arquitetura escalável
  const aspectosEscalabilidade = [
    {
      aspecto: 'Separação por módulos',
      arquivo: 'backend/src',
      funcional: false
    },
    {
      aspecto: 'Configuração externa',
      arquivo: 'backend/.env',
      funcional: false
    },
    {
      aspecto: 'Docker/Containerização',
      arquivo: 'docker-compose.yml',
      funcional: false
    },
    {
      aspecto: 'Load balancing config',
      arquivo: 'nginx.conf',
      funcional: false
    },
    {
      aspecto: 'Database pooling',
      arquivo: 'backend/src/config/database.config.ts',
      funcional: false
    }
  ];

  let aspectosImplementados = 0;

  aspectosEscalabilidade.forEach(aspecto => {
    try {
      if (fs.existsSync(aspecto.arquivo)) {
        console.log(`      ✅ ${aspecto.aspecto}: Implementado`);
        aspecto.funcional = true;
        aspectosImplementados++;
      } else {
        console.log(`      ❌ ${aspecto.aspecto}: Não implementado`);
      }
    } catch (error) {
      console.log(`      ❌ ${aspecto.aspecto}: Erro na verificação`);
    }
  });

  // Verificar estrutura de pastas para multi-tenant
  console.log('   🔍 Verificando estrutura de pastas...');
  
  const estruturaMultiTenant = [
    'backend/src/tenant',
    'backend/src/multi-tenant',
    'backend/src/unidades',
    'frontend/src/context/tenant',
    'frontend/src/context/unidade'
  ];

  let estruturasEncontradas = 0;
  estruturaMultiTenant.forEach(pasta => {
    try {
      if (fs.existsSync(pasta)) {
        console.log(`      ✅ Estrutura encontrada: ${pasta}`);
        estruturasEncontradas++;
      }
    } catch (error) {
      // Pasta não existe
    }
  });

  if (estruturasEncontradas === 0) {
    console.log('      ❌ Nenhuma estrutura multi-tenant encontrada');
  }

  // Verificar configurações de performance
  console.log('   🔍 Verificando configurações de performance...');
  
  const configsPerformance = {
    'Cache': false,
    'Database Indexing': false,
    'API Rate Limiting': false,
    'Connection Pooling': false,
    'Lazy Loading': false
  };

  // Verificar se há implementações de cache/performance
  try {
    if (fs.existsSync('backend/package.json')) {
      const packageJson = fs.readFileSync('backend/package.json', 'utf8');
      const package = JSON.parse(packageJson);
      
      if (package.dependencies) {
        if (package.dependencies['@nestjs/cache-manager'] || package.dependencies['redis']) {
          configsPerformance['Cache'] = true;
          console.log('      ✅ Sistema de cache identificado');
        }
        
        if (package.dependencies['@nestjs/throttler']) {
          configsPerformance['API Rate Limiting'] = true;
          console.log('      ✅ Rate limiting identificado');
        }
      }
    }
  } catch (error) {
    console.log('      ❌ Erro ao verificar dependências');
  }

  const performanceScore = Object.values(configsPerformance).filter(Boolean).length;
  const maxPerformance = Object.keys(configsPerformance).length;

  return {
    funcional: aspectosImplementados > 0 || estruturasEncontradas > 0,
    aspectosEscalabilidade: aspectosImplementados,
    totalAspectos: aspectosEscalabilidade.length,
    estruturasMultiTenant: estruturasEncontradas,
    configsPerformance,
    performanceScore,
    scoreEscalabilidade: Math.round(((aspectosImplementados + estruturasEncontradas + performanceScore) / 
                                   (aspectosEscalabilidade.length + estruturaMultiTenant.length + maxPerformance)) * 100),
    recomendacoes: [
      'Implementar arquitetura multi-tenant',
      'Configurar isolamento de dados por unidade',
      'Adicionar sistema de cache',
      'Implementar connection pooling',
      'Configurar load balancing'
    ]
  };
}

// Função para simular cenários de múltiplas unidades
async function simularMultiplasUnidades() {
  console.log('\n🏥 === SIMULAÇÃO: MÚLTIPLAS UNIDADES ===');
  
  const cenariosMultiUnidade = [
    {
      cenario: 'Hospital Principal + 2 Filiais',
      unidades: [
        { nome: 'Hospital Central', tipo: 'PRINCIPAL', capacidade: 500 },
        { nome: 'Clínica Norte', tipo: 'FILIAL', capacidade: 100 },
        { nome: 'Posto Sul', tipo: 'FILIAL', capacidade: 50 }
      ]
    },
    {
      cenario: 'Rede Hospitalar (5 unidades)',
      unidades: [
        { nome: 'Hospital A', tipo: 'PRINCIPAL', capacidade: 800 },
        { nome: 'Hospital B', tipo: 'PRINCIPAL', capacidade: 600 },
        { nome: 'Clínica C', tipo: 'FILIAL', capacidade: 200 },
        { nome: 'UPA D', tipo: 'URGENCIA', capacidade: 100 },
        { nome: 'Ambulatório E', tipo: 'AMBULATORIO', capacidade: 80 }
      ]
    }
  ];

  console.log('   📊 Cenários de teste identificados:');
  
  cenariosMultiUnidade.forEach((cenario, index) => {
    console.log(`      ${index + 1}. ${cenario.cenario}:`);
    cenario.unidades.forEach(unidade => {
      console.log(`         - ${unidade.nome} (${unidade.tipo}) - Cap: ${unidade.capacidade} leitos`);
    });
    
    const capacidadeTotal = cenario.unidades.reduce((total, unidade) => total + unidade.capacidade, 0);
    console.log(`         📈 Capacidade total: ${capacidadeTotal} leitos`);
  });

  // Verificar se o sistema atual suportaria esses cenários
  console.log('\n   🔍 Análise de suporte aos cenários:');
  
  const requisitosMultiUnidade = [
    'Isolamento de dados entre unidades',
    'Gestão centralizada de usuários',
    'Relatórios consolidados por unidade',
    'Transferência de pacientes entre unidades',
    'Configurações específicas por unidade',
    'Dashboard multi-unidade'
  ];

  console.log('      ❌ Requisitos não atendidos atualmente:');
  requisitosMultiUnidade.forEach(requisito => {
    console.log(`         • ${requisito}`);
  });

  return {
    funcional: false, // Sistema atual não suporta multi-unidade
    cenariosTestados: cenariosMultiUnidade.length,
    requisitosIdentificados: requisitosMultiUnidade.length,
    capacidadeMaximaSimulada: 1430, // Total de leitos dos cenários
    suporteAtual: 'SINGLE_TENANT',
    necessarioImplementar: requisitosMultiUnidade
  };
}

// Função para gerar relatório de escalabilidade
function gerarRelatorioEscalabilidade(resultados) {
  console.log('\n' + '='.repeat(70));
  console.log('🏥 RELATÓRIO FINAL - ESCALABILIDADE MULTI-UNIDADE');
  console.log('='.repeat(70));

  const aspectos = [
    {
      nome: 'Estrutura de Dados Multi-Tenant',
      resultado: resultados.estrutura,
      peso: 30
    },
    {
      nome: 'Endpoints de Unidades',
      resultado: resultados.endpoints,
      peso: 25
    },
    {
      nome: 'Isolamento de Dados',
      resultado: resultados.isolamento,
      peso: 25
    },
    {
      nome: 'Capacidade de Escala',
      resultado: resultados.escala,
      peso: 20
    }
  ];

  let pontuacaoTotal = 0;
  let aspectosFuncionais = 0;

  aspectos.forEach(aspecto => {
    const status = aspecto.resultado.funcional ? '✅' : '❌';
    let pontos = 0;
    
    if (aspecto.resultado.funcional) {
      if (aspecto.nome === 'Endpoints de Unidades' && aspecto.resultado.percentualImplementado) {
        pontos = Math.round((aspecto.resultado.percentualImplementado / 100) * aspecto.peso);
      } else if (aspecto.nome === 'Isolamento de Dados' && aspecto.resultado.percentualIsolamento !== undefined) {
        pontos = Math.round((aspecto.resultado.percentualIsolamento / 100) * aspecto.peso);
      } else if (aspecto.nome === 'Capacidade de Escala' && aspecto.resultado.scoreEscalabilidade) {
        pontos = Math.round((aspecto.resultado.scoreEscalabilidade / 100) * aspecto.peso);
      } else {
        pontos = Math.round(aspecto.peso * 0.3); // Implementação parcial
      }
      aspectosFuncionais++;
    }
    
    pontuacaoTotal += pontos;

    console.log(`\n${status} ${aspecto.nome} (${aspecto.peso}%):`);
    console.log(`   📊 Pontos obtidos: ${pontos}/${aspecto.peso}`);
    
    if (aspecto.resultado.funcional) {
      if (aspecto.nome === 'Estrutura de Dados Multi-Tenant') {
        console.log(`   📁 Entidades encontradas: ${aspecto.resultado.entidadesEncontradas}`);
        console.log(`   🔧 Migrations: ${aspecto.resultado.migrationsEncontradas ? 'Sim' : 'Não'}`);
        console.log(`   ⚙️ Configurações: ${aspecto.resultado.configMultiTenant ? 'Sim' : 'Não'}`);
      }
      
      if (aspecto.nome === 'Endpoints de Unidades') {
        console.log(`   🌐 Endpoints implementados: ${aspecto.resultado.endpointsEncontrados}/${aspecto.resultado.totalEndpoints}`);
        console.log(`   📈 Percentual: ${aspecto.resultado.percentualImplementado}%`);
      }
      
      if (aspecto.nome === 'Isolamento de Dados') {
        console.log(`   🔒 Dados com tenant: ${aspecto.resultado.dadosComTenant}/${aspecto.resultado.totalEndpoints}`);
        console.log(`   📊 Implementação: ${aspecto.resultado.implementacaoTenant}`);
      }
      
      if (aspecto.nome === 'Capacidade de Escala') {
        console.log(`   🏗️ Aspectos escaláveis: ${aspecto.resultado.aspectosEscalabilidade}/${aspecto.resultado.totalAspectos}`);
        console.log(`   📈 Score performance: ${aspecto.resultado.performanceScore}/5`);
      }
      
    } else {
      if (aspecto.resultado.erro) {
        console.log(`   ❌ Erro: ${aspecto.resultado.erro}`);
      } else if (aspecto.resultado.implementacao) {
        console.log(`   📋 Status: ${aspecto.resultado.implementacao}`);
      }
    }
  });

  const percentualFinal = pontuacaoTotal;

  console.log('\n' + '='.repeat(70));
  console.log(`📊 RESULTADO FINAL - ESCALABILIDADE:`);
  console.log(`   ✅ Aspectos funcionais: ${aspectosFuncionais}/4 (${(aspectosFuncionais/4*100).toFixed(1)}%)`);
  console.log(`   📊 Pontuação total: ${pontuacaoTotal}/100 pontos (${percentualFinal}%)`);
  
  if (percentualFinal >= 80) {
    console.log(`   🎉 STATUS: EXCELENTE - Suporte completo a múltiplas unidades`);
  } else if (percentualFinal >= 60) {
    console.log(`   ✅ STATUS: BOM - Suporte básico implementado`);
  } else if (percentualFinal >= 30) {
    console.log(`   ⚠️ STATUS: LIMITADO - Suporte parcial`);
  } else {
    console.log(`   ❌ STATUS: NÃO SUPORTA - Sistema single-tenant`);
  }

  console.log('\n🏥 CENÁRIOS DE USO ANALISADOS:');
  if (resultados.simulacao) {
    console.log(`   📊 Cenários testados: ${resultados.simulacao.cenariosTestados}`);
    console.log(`   📋 Requisitos identificados: ${resultados.simulacao.requisitosIdentificados}`);
    console.log(`   🏥 Capacidade máxima simulada: ${resultados.simulacao.capacidadeMaximaSimulada} leitos`);
    console.log(`   🔧 Tipo atual: ${resultados.simulacao.suporteAtual}`);
  }

  console.log('\n🚀 PRIORIDADES PARA ESCALABILIDADE:');
  console.log('1. Implementar arquitetura multi-tenant');
  console.log('2. Adicionar campos de unidade/tenant em todas entidades');
  console.log('3. Criar endpoints específicos para gestão de unidades');
  console.log('4. Implementar isolamento de dados por unidade');
  console.log('5. Configurar dashboard multi-unidade');
  console.log('6. Adicionar sistema de cache e performance');
  
  console.log('='.repeat(70));

  return {
    scoreEscalabilidade: percentualFinal,
    aspectosFuncionais,
    suporteMultiUnidade: percentualFinal >= 60,
    statusFinal: percentualFinal >= 60 ? 'SUPORTA_MULTI_UNIDADE' : 'SINGLE_TENANT'
  };
}

// Função principal
async function validarEscalabilidadeCompleta() {
  console.log('🏥 INICIANDO VALIDAÇÃO DE ESCALABILIDADE MULTI-UNIDADE');
  console.log('='.repeat(70));

  try {
    const resultados = {
      estrutura: verificarEstruturaDados(),
      endpoints: await validarEndpointsUnidades(),
      isolamento: await verificarIsolamentoDados(),
      escala: verificarCapacidadeEscala(),
      simulacao: await simularMultiplasUnidades()
    };

    const relatorioFinal = gerarRelatorioEscalabilidade(resultados);

    // Salvar relatório
    const dadosCompletos = {
      dataValidacao: new Date().toISOString(),
      scoreEscalabilidade: relatorioFinal.scoreEscalabilidade,
      suporteMultiUnidade: relatorioFinal.suporteMultiUnidade,
      statusFinal: relatorioFinal.statusFinal,
      aspectosFuncionais: relatorioFinal.aspectosFuncionais,
      resultadosDetalhados: resultados,
      recomendacoes: [
        'Sistema atualmente configurado como single-tenant',
        'Necessária implementação de arquitetura multi-tenant',
        'Priorizar isolamento de dados por unidade hospitalar',
        'Implementar dashboard consolidado para múltiplas unidades'
      ]
    };

    fs.writeFileSync(
      'RELATORIO_ESCALABILIDADE_MULTI_UNIDADE.json',
      JSON.stringify(dadosCompletos, null, 2)
    );

    console.log('\n💾 Relatório detalhado salvo: RELATORIO_ESCALABILIDADE_MULTI_UNIDADE.json');

  } catch (error) {
    console.error('❌ Erro geral na validação de escalabilidade:', error.message);
  }
}

// Executar validação
validarEscalabilidadeCompleta();
