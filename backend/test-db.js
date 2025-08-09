const { Client } = require('pg');

async function testDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'sgh_user',  // Mudança aqui: user em vez de username
    password: 'sgh_password',
    database: 'sgh_database',
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao banco de dados PostgreSQL');
    
    // Verificar se a tabela users existe
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'users';
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ Tabela users existe');
      
      // Verificar estrutura da tabela
      const columns = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'users'
        ORDER BY ordinal_position;
      `);
      
      console.log('📋 Colunas da tabela users:');
      columns.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
    } else {
      console.log('❌ Tabela users não existe');
      console.log('🔧 Execute as migrações: npm run migration:run');
    }
    
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco:', error.message);
  } finally {
    await client.end();
  }
}

testDatabase();
