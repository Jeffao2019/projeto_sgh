const { Client } = require('pg');

// Configuração do banco de dados
const dbConfig = {
  host: 'localhost',
  port: 5433,
  user: 'postgres',
  password: '90308614',
  database: 'sgh_database'
};

async function criarAgendamentosHistoricos() {
  console.log('=== CRIAÇÃO DE AGENDAMENTOS HISTÓRICOS (OUTUBRO 2025) ===\n');
  
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('✅ Conectado ao banco de dados\n');
    
    // 1. Buscar pacientes e médicos
    console.log('1. Buscando dados existentes...');
    
    // Primeiro vamos verificar a estrutura da tabela users
    const userColumnsResult = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'users' AND table_schema = 'public'
    `);
    console.log('Colunas da tabela users:', userColumnsResult.rows.map(r => r.column_name));
    
    const pacientesResult = await client.query('SELECT id, nome FROM pacientes ORDER BY nome');
    
    // Vamos ver como identificar médicos na tabela users
    const usersResult = await client.query('SELECT id, nome FROM users LIMIT 5');
    console.log('Primeiros 5 usuários:', usersResult.rows);
    
    // Vamos tentar buscar por email que contém "dr."
    const medicosResult = await client.query(`
      SELECT id, nome FROM users 
      WHERE email LIKE 'dr.%@%' OR nome LIKE 'Dr.%'
      ORDER BY nome
    `);
    
    const pacientes = pacientesResult.rows;
    const medicos = medicosResult.rows;
    
    console.log(`✅ ${pacientes.length} pacientes encontrados`);
    console.log(`✅ ${medicos.length} médicos encontrados\n`);
    
    if (pacientes.length === 0 || medicos.length === 0) {
      throw new Error('Não há pacientes ou médicos suficientes no banco');
    }
    
    // 2. Criar agendamentos históricos com diferentes status
    console.log('2. Criando agendamentos históricos de outubro 2025...\n');
    
    const agendamentosData = [
      // Primeira semana de outubro - CONFIRMADOS
      { data: '2025-10-02', hora: '08:00', tipo: 'CONSULTA_GERAL', status: 'CONFIRMADO', obs: 'Consulta de rotina cardiológica' },
      { data: '2025-10-02', hora: '14:30', tipo: 'CONSULTA_ESPECIALISTA', status: 'CONFIRMADO', obs: 'Acompanhamento pós-cirúrgico' },
      { data: '2025-10-03', hora: '09:15', tipo: 'CONSULTA_GERAL', status: 'CONFIRMADO', obs: 'Consulta clínica geral' },
      { data: '2025-10-03', hora: '16:00', tipo: 'EXAME', status: 'CONFIRMADO', obs: 'Exame cardiológico preventivo' },
      { data: '2025-10-04', hora: '10:30', tipo: 'RETORNO', status: 'CONFIRMADO', obs: 'Revisão de medicamentos' },
      
      // Segunda semana de outubro - MIX DE STATUS
      { data: '2025-10-08', hora: '15:45', tipo: 'CONSULTA_GERAL', status: 'CONFIRMADO', obs: 'Consulta de acompanhamento' },
      { data: '2025-10-09', hora: '08:30', tipo: 'CONSULTA_ESPECIALISTA', status: 'CONFIRMADO', obs: 'Avaliação clínica completa' },
      { data: '2025-10-10', hora: '11:15', tipo: 'TELEMEDICINA', status: 'CANCELADO', obs: 'Consulta via telemedicina - cancelada' },
      { data: '2025-10-11', hora: '14:00', tipo: 'RETORNO', status: 'CONFIRMADO', obs: 'Retorno programado' },
      
      // Terceira semana de outubro - MAIS CANCELADOS
      { data: '2025-10-15', hora: '09:00', tipo: 'CONSULTA_GERAL', status: 'CANCELADO', obs: 'Cancelado pelo paciente' },
      { data: '2025-10-16', hora: '14:00', tipo: 'EXAME', status: 'CANCELADO', obs: 'Reagendamento solicitado' },
      { data: '2025-10-17', hora: '10:45', tipo: 'CONSULTA_ESPECIALISTA', status: 'CANCELADO', obs: 'Indisponibilidade médica' },
      { data: '2025-10-18', hora: '16:30', tipo: 'RETORNO', status: 'CONFIRMADO', obs: 'Retorno de acompanhamento' },
      
      // Quarta semana de outubro - MAIS CONFIRMADOS
      { data: '2025-10-22', hora: '08:15', tipo: 'CONSULTA_GERAL', status: 'CONFIRMADO', obs: 'Consulta clínica' },
      { data: '2025-10-23', hora: '13:30', tipo: 'TELEMEDICINA', status: 'CONFIRMADO', obs: 'Teleconsulta' },
      { data: '2025-10-24', hora: '09:30', tipo: 'CONSULTA_ESPECIALISTA', status: 'CONFIRMADO', obs: 'Consulta cardiológica' },
      { data: '2025-10-25', hora: '15:00', tipo: 'EXAME', status: 'CANCELADO', obs: 'Cancelado por falta' },
      
      // Final de outubro - MIX FINAL
      { data: '2025-10-28', hora: '11:00', tipo: 'RETORNO', status: 'CONFIRMADO', obs: 'Avaliação final' },
      { data: '2025-10-29', hora: '14:15', tipo: 'CONSULTA_GERAL', status: 'CONFIRMADO', obs: 'Consulta de encerramento' },
      { data: '2025-10-30', hora: '10:00', tipo: 'CONSULTA_ESPECIALISTA', status: 'CANCELADO', obs: 'Cancelamento de última hora' },
      { data: '2025-10-31', hora: '16:45', tipo: 'TELEMEDICINA', status: 'CONFIRMADO', obs: 'Teleconsulta final outubro' }
    ];
    
    let criadosCount = 0;
    let confirmadosCount = 0;
    let canceladosCount = 0;
    let errosCount = 0;
    
    for (let i = 0; i < agendamentosData.length; i++) {
      const agendamento = agendamentosData[i];
      
      // Selecionar paciente e médico rotacionalmente
      const pacienteIndex = i % pacientes.length;
      const medicoIndex = i % medicos.length;
      
      const paciente = pacientes[pacienteIndex];
      const medico = medicos[medicoIndex];
      
      try {
        const dataHora = `${agendamento.data} ${agendamento.hora}:00`;
        
        const query = `
          INSERT INTO agendamentos (
            id, "pacienteId", "medicoId", "dataHora", tipo, status, observacoes, "createdAt", "updatedAt"
          ) VALUES (
            gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW(), NOW()
          ) RETURNING id
        `;
        
        const result = await client.query(query, [
          paciente.id,
          medico.id,
          dataHora,
          agendamento.tipo,
          agendamento.status,
          agendamento.obs
        ]);
        
        console.log(`✅ ${agendamento.status}: ${agendamento.data} ${agendamento.hora} - ${paciente.nome} com ${medico.nome}`);
        
        criadosCount++;
        if (agendamento.status === 'CONFIRMADO') {
          confirmadosCount++;
        } else {
          canceladosCount++;
        }
        
      } catch (error) {
        console.log(`❌ Erro ao criar agendamento: ${agendamento.data} ${agendamento.hora}`);
        console.log(`   Erro: ${error.message}`);
        errosCount++;
      }
    }
    
    console.log('\n=== RESULTADOS ===');
    console.log(`✅ Agendamentos criados: ${criadosCount}`);
    console.log(`   📅 Confirmados: ${confirmadosCount}`);
    console.log(`   ❌ Cancelados: ${canceladosCount}`);
    console.log(`❌ Erros: ${errosCount}`);
    
    // 3. Verificar totais finais
    console.log('\n3. Verificando totais do sistema...');
    
    const totalResult = await client.query('SELECT COUNT(*) as total FROM agendamentos');
    const outResult = await client.query(`
      SELECT COUNT(*) as total FROM agendamentos 
      WHERE "dataHora" >= '2025-10-01' AND "dataHora" < '2025-11-01'
    `);
    const novResult = await client.query(`
      SELECT COUNT(*) as total FROM agendamentos 
      WHERE "dataHora" >= '2025-11-01' AND "dataHora" < '2025-12-01'
    `);
    
    // Estatísticas por status em outubro
    const statusResult = await client.query(`
      SELECT status, COUNT(*) as count FROM agendamentos 
      WHERE "dataHora" >= '2025-10-01' AND "dataHora" < '2025-11-01'
      GROUP BY status
    `);
    
    console.log(`📊 Total de agendamentos no sistema: ${totalResult.rows[0].total}`);
    console.log(`   📅 Outubro 2025: ${outResult.rows[0].total} agendamentos`);
    console.log(`   📅 Novembro 2025: ${novResult.rows[0].total} agendamentos`);
    
    console.log(`\n📈 Outubro 2025 - Status:`);
    const statusMap = {};
    statusResult.rows.forEach(row => {
      statusMap[row.status] = row.count;
    });
    
    console.log(`   ⏳ Pendentes: ${statusMap['PENDENTE'] || 0}`);
    console.log(`   ✅ Confirmados: ${statusMap['CONFIRMADO'] || 0}`);
    console.log(`   ❌ Cancelados: ${statusMap['CANCELADO'] || 0}`);
    
    console.log('\n🎉 Agendamentos históricos criados com sucesso!');
    console.log('📋 Agora você pode testar filtros por data, status e relatórios mensais!');
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  } finally {
    await client.end();
    console.log('\n🔌 Conexão com banco encerrada');
  }
}

// Executar
criarAgendamentosHistoricos();
