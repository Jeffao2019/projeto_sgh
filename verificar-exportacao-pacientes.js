const { DataSource } = require('typeorm');
const { config } = require('dotenv');

// Carrega as variáveis de ambiente
config({ path: './backend/.env' });

async function verificarPacientesNoBanco() {
  console.log('🔍 Verificando dados de pacientes no banco...\n');

  // Configuração da conexão com o banco
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5433', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '90308614',
    database: process.env.DB_NAME || 'sgh_database',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    synchronize: false,
    logging: false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Conectado ao banco de dados\n');

    // 1. Contar total de pacientes
    const totalPacientes = await dataSource.query('SELECT COUNT(*) as total FROM pacientes');
    console.log(`📊 Total de pacientes no banco: ${totalPacientes[0].total}`);

    // 2. Verificar alguns exemplos de registros
    const exemplosPacientes = await dataSource.query(`
      SELECT id, nome, cpf, email, telefone, "dataNascimento", "createdAt" 
      FROM pacientes 
      ORDER BY "createdAt" DESC 
      LIMIT 5
    `);
    
    console.log('\n📋 Últimos 5 pacientes cadastrados:');
    exemplosPacientes.forEach((paciente, index) => {
      console.log(`${index + 1}. ${paciente.nome} - CPF: ${paciente.cpf} - Email: ${paciente.email}`);
    });

    // 3. Verificar estatísticas por período
    const estatisticas = await dataSource.query(`
      SELECT 
        DATE("createdAt") as data,
        COUNT(*) as total_dia
      FROM pacientes 
      WHERE "createdAt" >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE("createdAt")
      ORDER BY data DESC
      LIMIT 10
    `);
    
    console.log('\n📈 Cadastros dos últimos 10 dias:');
    estatisticas.forEach(stat => {
      console.log(`${stat.data}: ${stat.total_dia} pacientes`);
    });

    // 4. Verificar integridade dos dados
    const dadosIncompletos = await dataSource.query(`
      SELECT COUNT(*) as total_incompletos
      FROM pacientes 
      WHERE nome IS NULL OR cpf IS NULL OR email IS NULL
    `);
    
    console.log(`\n⚠️ Pacientes com dados incompletos: ${dadosIncompletos[0].total_incompletos}`);

    await dataSource.destroy();
    return totalPacientes[0].total;

  } catch (error) {
    console.error('❌ Erro ao conectar com o banco:', error.message);
    return null;
  }
}

async function testarExportacao() {
  console.log('\n🧪 Testando exportação via API...\n');

  try {
    const response = await fetch('http://localhost:3010/backup/exportar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      const data = await response.json();
      
      console.log('✅ Exportação realizada com sucesso!');
      console.log(`📊 Total de pacientes exportados: ${data.dados?.pacientes?.length || 0}`);
      
      if (data.dados?.pacientes && data.dados.pacientes.length > 0) {
        const primeirosPacientes = data.dados.pacientes.slice(0, 3);
        console.log('\n📋 Primeiros 3 pacientes exportados:');
        primeirosPacientes.forEach((paciente, index) => {
          console.log(`${index + 1}. ${paciente.nome} - CPF: ${paciente.cpf}`);
        });
      }

      // Verificar outros dados exportados
      console.log(`\n📊 Outros dados exportados:`);
      console.log(`- Usuários: ${data.dados?.users?.length || 0}`);
      console.log(`- Agendamentos: ${data.dados?.agendamentos?.length || 0}`);
      console.log(`- Prontuários: ${data.dados?.prontuarios?.length || 0}`);

      return data.dados?.pacientes?.length || 0;
    } else {
      console.error('❌ Erro na exportação:', response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error('❌ Erro ao testar exportação:', error.message);
    return null;
  }
}

async function executarVerificacao() {
  console.log('🔍 VERIFICAÇÃO COMPLETA - EXPORTAÇÃO DE PACIENTES\n');
  console.log('=' .repeat(60));

  // Verificar dados no banco
  const totalNoBanco = await verificarPacientesNoBanco();

  if (totalNoBanco === null) {
    console.log('\n❌ Não foi possível acessar o banco de dados');
    return;
  }

  // Testar exportação
  const totalExportado = await testarExportacao();

  if (totalExportado === null) {
    console.log('\n❌ Não foi possível testar a exportação');
    return;
  }

  // Comparar resultados
  console.log('\n' + '=' .repeat(60));
  console.log('📊 RESULTADO DA VERIFICAÇÃO:');
  console.log('=' .repeat(60));
  console.log(`🏦 Total no banco de dados: ${totalNoBanco}`);
  console.log(`📤 Total exportado: ${totalExportado}`);
  console.log(`📊 Menção do sistema: 15.847 registros`);

  if (totalNoBanco == totalExportado) {
    console.log('✅ SUCESSO: Exportação está correta - todos os pacientes foram exportados!');
  } else {
    console.log('⚠️ DISCREPÂNCIA: Diferença entre banco e exportação');
    console.log(`   Diferença: ${Math.abs(totalNoBanco - totalExportado)} registros`);
    
    if (totalExportado < totalNoBanco) {
      console.log('   → A exportação está INCOMPLETA');
    } else {
      console.log('   → A exportação tem registros EXTRAS (possível duplicação)');
    }
  }

  // Verificar se a menção de 15.847 está correta
  if (totalNoBanco == 15847) {
    console.log('✅ A menção de 15.847 registros no sistema está CORRETA');
  } else {
    console.log(`⚠️ A menção de 15.847 registros está DESATUALIZADA (real: ${totalNoBanco})`);
  }

  console.log('\n' + '=' .repeat(60));
}

executarVerificacao().catch(console.error);
