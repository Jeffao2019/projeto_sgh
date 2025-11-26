const { Client } = require('pg');

// Configuração do banco de dados
const dbConfig = {
  host: 'localhost',
  port: 5433,
  user: 'postgres',
  password: '90308614',
  database: 'sgh_database'
};

async function atualizarStatusAgendamentos() {
  console.log('=== ATUALIZANDO STATUS DOS AGENDAMENTOS DE OUTUBRO ===\n');
  
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('✅ Conectado ao banco de dados\n');
    
    // 1. Buscar agendamentos de outubro
    console.log('1. Buscando agendamentos de outubro...');
    
    const agendamentosResult = await client.query(`
      SELECT id, "dataHora", status, tipo 
      FROM agendamentos 
      WHERE "dataHora" >= '2025-10-01' AND "dataHora" < '2025-11-01'
      ORDER BY "dataHora"
    `);
    
    const agendamentos = agendamentosResult.rows;
    console.log(`✅ Encontrados ${agendamentos.length} agendamentos de outubro\n`);
    
    // 2. Atualizar status baseado em critérios específicos
    console.log('2. Atualizando status dos agendamentos...\n');
    
    let confirmadosCount = 0;
    let canceladosCount = 0;
    let mantidosCount = 0;
    
    for (let i = 0; i < agendamentos.length; i++) {
      const agendamento = agendamentos[i];
      const dataHora = new Date(agendamento.dataHora);
      const dia = dataHora.getDate();
      
      let novoStatus = agendamento.status;
      
      // Critérios para definir status:
      // - Agendamentos nos dias 15, 16, 17, 25, 30 ficam CANCELADO
      // - Agendamentos nos outros dias ficam CONFIRMADO
      if ([15, 16, 17, 25, 30].includes(dia)) {
        novoStatus = 'CANCELADO';
        canceladosCount++;
      } else {
        novoStatus = 'CONFIRMADO';
        confirmadosCount++;
      }
      
      // Se o status já está correto, não atualizar
      if (agendamento.status === novoStatus) {
        mantidosCount++;
        console.log(`📋 Mantido ${novoStatus}: ${dataHora.toLocaleDateString('pt-BR')} ${dataHora.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}`);
        continue;
      }
      
      // Atualizar o status
      try {
        await client.query(`
          UPDATE agendamentos 
          SET status = $1, "updatedAt" = NOW() 
          WHERE id = $2
        `, [novoStatus, agendamento.id]);
        
        console.log(`✅ ${agendamento.status} → ${novoStatus}: ${dataHora.toLocaleDateString('pt-BR')} ${dataHora.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}`);
        
      } catch (error) {
        console.log(`❌ Erro ao atualizar agendamento ${agendamento.id}: ${error.message}`);
      }
    }
    
    console.log('\n=== RESULTADOS DA ATUALIZAÇÃO ===');
    console.log(`✅ Confirmados: ${confirmadosCount}`);
    console.log(`❌ Cancelados: ${canceladosCount}`);
    console.log(`📋 Mantidos: ${mantidosCount}`);
    
    // 3. Verificar status final
    console.log('\n3. Verificando status final...');
    
    const statusResult = await client.query(`
      SELECT status, COUNT(*) as count FROM agendamentos 
      WHERE "dataHora" >= '2025-10-01' AND "dataHora" < '2025-11-01'
      GROUP BY status
      ORDER BY status
    `);
    
    console.log('\n📊 Status final dos agendamentos de outubro:');
    statusResult.rows.forEach(row => {
      const emoji = row.status === 'CONFIRMADO' ? '✅' : 
                   row.status === 'CANCELADO' ? '❌' : '⏳';
      console.log(`   ${emoji} ${row.status}: ${row.count} agendamentos`);
    });
    
    // 4. Mostrar alguns exemplos por data
    console.log('\n📅 Exemplos por data:');
    
    const exemploResult = await client.query(`
      SELECT DATE("dataHora") as data, status, COUNT(*) as count
      FROM agendamentos 
      WHERE "dataHora" >= '2025-10-01' AND "dataHora" < '2025-11-01'
      GROUP BY DATE("dataHora"), status
      ORDER BY DATE("dataHora")
    `);
    
    const agrupados = {};
    exemploResult.rows.forEach(row => {
      const data = row.data.toISOString().split('T')[0];
      if (!agrupados[data]) agrupados[data] = {};
      agrupados[data][row.status] = row.count;
    });
    
    Object.keys(agrupados).slice(0, 10).forEach(data => {
      const stats = agrupados[data];
      const confirmados = stats['CONFIRMADO'] || 0;
      const cancelados = stats['CANCELADO'] || 0;
      const pendentes = stats['PENDENTE'] || 0;
      
      console.log(`   ${data}: ✅ ${confirmados} confirmados, ❌ ${cancelados} cancelados, ⏳ ${pendentes} pendentes`);
    });
    
    console.log('\n🎉 Status dos agendamentos atualizados com sucesso!');
    console.log('📋 Agora você tem um histórico realista com agendamentos confirmados e cancelados!');
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  } finally {
    await client.end();
    console.log('\n🔌 Conexão com banco encerrada');
  }
}

// Executar
atualizarStatusAgendamentos();
