const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sgh_database',
  password: '90308614',
  port: 5433,
});

async function testConnection() {
  try {
    console.log('🔄 Testando conexão com PostgreSQL...');
    const client = await pool.connect();
    const result = await client.query('SELECT current_user, current_database(), version();');
    console.log('✅ Conexão bem-sucedida!');
    console.log('📊 Resultado:', result.rows[0]);
    client.release();
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro de conexão:', err.message);
    console.error('🔍 Stack:', err.stack);
    process.exit(1);
  }
}

testConnection();
