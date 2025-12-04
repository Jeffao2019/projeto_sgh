const { DataSource } = require('typeorm');

// Configuração da conexão com o banco
const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'postgres',
    password: '90308614',
    database: 'sgh_database',
    synchronize: false,
    logging: false,
    entities: [],
    migrations: [],
    subscribers: []
});

async function verificarDadosReaisCompletos() {
    console.log('🔍 VERIFICAÇÃO COMPLETA DE DADOS REAIS\n');
    
    try {
        await AppDataSource.initialize();
        console.log('✅ Conectado ao banco PostgreSQL\n');

        // 1. Pacientes
        const pacientes = await AppDataSource.query('SELECT COUNT(*) FROM pacientes');
        console.log('📋 PACIENTES:');
        console.log(`   Total: ${pacientes[0].count} registros`);
        console.log(`   Hardcoded mostrado: 15.847`);
        console.log(`   ✅ Status: ${pacientes[0].count === '15847' ? 'Correto' : 'PRECISA CORREÇÃO'}\n`);

        // 2. Agendamentos
        const agendamentos = await AppDataSource.query('SELECT COUNT(*) FROM agendamentos');
        console.log('📅 AGENDAMENTOS:');
        console.log(`   Total: ${agendamentos[0].count} registros`);
        console.log(`   Hardcoded mostrado: 8.921`);
        console.log(`   ✅ Status: ${agendamentos[0].count === '8921' ? 'Correto' : 'PRECISA CORREÇÃO'}\n`);

        // 3. Prontuários
        const prontuarios = await AppDataSource.query('SELECT COUNT(*) FROM prontuarios');
        console.log('📄 PRONTUÁRIOS:');
        console.log(`   Total: ${prontuarios[0].count} registros`);
        console.log(`   Hardcoded mostrado: 42.153`);
        console.log(`   ✅ Status: ${prontuarios[0].count === '42153' ? 'Correto' : 'PRECISA CORREÇÃO'}\n`);

        // 4. Usuários
        const users = await AppDataSource.query('SELECT COUNT(*) FROM users');
        console.log('👥 USUÁRIOS:');
        console.log(`   Total: ${users[0].count} registros`);
        console.log(`   Hardcoded mostrado: 342`);
        console.log(`   ✅ Status: ${users[0].count === '342' ? 'Correto' : 'PRECISA CORREÇÃO'}\n`);

        // 5. Verificar se existe tabela de exames
        console.log('🔬 EXAMES:');
        try {
            const exames = await AppDataSource.query('SELECT COUNT(*) FROM exames');
            console.log(`   Total: ${exames[0].count} registros`);
            console.log(`   Hardcoded mostrado: 28.674`);
            console.log(`   ✅ Status: ${exames[0].count === '28674' ? 'Correto' : 'PRECISA CORREÇÃO'}`);
        } catch (error) {
            console.log('   ❌ Tabela "exames" NÃO EXISTE');
            console.log('   💡 Recomendação: Remover categoria ou usar dados de agendamentos tipo EXAME');
            
            // Verificar agendamentos do tipo EXAME
            try {
                const agendamentosExame = await AppDataSource.query("SELECT COUNT(*) FROM agendamentos WHERE tipo = 'EXAME'");
                console.log(`   📊 Agendamentos tipo EXAME: ${agendamentosExame[0].count} registros`);
            } catch (e) {
                console.log('   ❌ Não foi possível verificar agendamentos tipo EXAME');
            }
        }
        console.log('');

        // 6. Verificar logs/auditoria
        console.log('📋 LOGS DO SISTEMA/AUDITORIA:');
        try {
            const auditoria = await AppDataSource.query('SELECT COUNT(*) FROM auditoria');
            console.log(`   Total: ${auditoria[0].count} registros`);
            console.log(`   Hardcoded mostrado: 125.847`);
            console.log(`   ✅ Status: ${auditoria[0].count === '125847' ? 'Correto' : 'PRECISA CORREÇÃO'}`);
        } catch (error) {
            console.log('   ❌ Tabela "auditoria" NÃO EXISTE ou está vazia');
            console.log('   💡 Recomendação: Criar endpoint para logs ou usar valor dinâmico baseado em outros dados');
        }
        console.log('');

        // 7. Verificar todas as tabelas disponíveis
        console.log('📊 TABELAS DISPONÍVEIS NO BANCO:');
        const tabelas = await AppDataSource.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name
        `);
        
        for (const tabela of tabelas) {
            try {
                const count = await AppDataSource.query(`SELECT COUNT(*) FROM ${tabela.table_name}`);
                console.log(`   📁 ${tabela.table_name}: ${count[0].count} registros`);
            } catch (e) {
                console.log(`   📁 ${tabela.table_name}: Erro ao contar`);
            }
        }

        console.log('\n🎯 RESUMO DAS CORREÇÕES NECESSÁRIAS:');
        console.log('1. ✅ Pacientes: Já corrigido para usar dadosReais.pacientes');
        console.log('2. ✅ Agendamentos: Já corrigido para usar dadosReais.agendamentos');
        console.log('3. ✅ Prontuários: Já corrigido para usar dadosReais.prontuarios');
        console.log('4. ✅ Usuários: Já corrigido para usar dadosReais.users');
        console.log('5. ⚠️ Exames: PRECISA CORREÇÃO - usar dados reais ou remover categoria');
        console.log('6. ⚠️ Logs do Sistema: PRECISA CORREÇÃO - usar dados reais ou valor calculado');

    } catch (error) {
        console.error('❌ Erro:', error.message);
    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

verificarDadosReaisCompletos();
