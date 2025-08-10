/**
 * Script para migrar dados existentes e tornar prescrições obrigatórias
 */

const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'sgh_database',
  user: 'sgh_user',
  password: 'sgh_password',
});

async function migrarDados() {
  try {
    console.log('🔗 Conectando ao banco de dados...');
    await client.connect();
    
    console.log('📊 Verificando registros com prescrições NULL...');
    const result = await client.query(`
      SELECT id, "prescricaoUsoInterno", "prescricaoUsoExterno" 
      FROM prontuarios 
      WHERE "prescricaoUsoInterno" IS NULL OR "prescricaoUsoExterno" IS NULL
    `);
    
    console.log(`📋 Encontrados ${result.rows.length} registros que precisam ser atualizados:`);
    
    if (result.rows.length > 0) {
      console.log('🔄 Atualizando registros existentes...');
      
      // Atualizar registros com valores padrão temporários
      const updateQuery = `
        UPDATE prontuarios 
        SET 
          "prescricaoUsoInterno" = COALESCE("prescricaoUsoInterno", 'Prescrição de uso interno migrada automaticamente'),
          "prescricaoUsoExterno" = COALESCE("prescricaoUsoExterno", 'Prescrição de uso externo migrada automaticamente')
        WHERE "prescricaoUsoInterno" IS NULL OR "prescricaoUsoExterno" IS NULL
      `;
      
      await client.query(updateQuery);
      console.log('✅ Registros atualizados com sucesso!');
      
      // Verificar se a atualização funcionou
      const checkResult = await client.query(`
        SELECT COUNT(*) as count 
        FROM prontuarios 
        WHERE "prescricaoUsoInterno" IS NULL OR "prescricaoUsoExterno" IS NULL
      `);
      
      console.log(`🔍 Registros restantes com NULL: ${checkResult.rows[0].count}`);
    } else {
      console.log('✅ Todos os registros já possuem prescrições preenchidas!');
    }
    
    console.log('\n📋 Status final dos prontuários:');
    const finalResult = await client.query(`
      SELECT 
        id, 
        CASE 
          WHEN "prescricaoUsoInterno" IS NOT NULL THEN 'OK' 
          ELSE 'NULL' 
        END as uso_interno,
        CASE 
          WHEN "prescricaoUsoExterno" IS NOT NULL THEN 'OK' 
          ELSE 'NULL' 
        END as uso_externo
      FROM prontuarios 
      ORDER BY id
      LIMIT 10
    `);
    
    finalResult.rows.forEach(row => {
      console.log(`   ${row.id}: Interno=${row.uso_interno}, Externo=${row.uso_externo}`);
    });
    
    console.log('\n🎉 Migração concluída! Agora o backend pode iniciar normalmente.');
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
  } finally {
    await client.end();
  }
}

migrarDados();
