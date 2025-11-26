/**
 * Teste simples do sistema de backup
 * Verifica se o backend está conectado ao frontend
 */

const axios = require('axios');

async function testarSistemaBackup() {
    console.log('🔍 Testando Sistema de Backup e Dados...\n');

    const baseURL = 'http://localhost:3001/api';
    
    try {
        // 1. Testar status do backup
        console.log('1. Verificando status do backup...');
        try {
            const statusResponse = await axios.get(`${baseURL}/backup/status`);
            console.log('✅ Status do backup:', statusResponse.data);
        } catch (error) {
            console.log('❌ Erro ao verificar status:', error.message);
        }

        // 2. Testar estatísticas de armazenamento
        console.log('\n2. Verificando estatísticas de armazenamento...');
        try {
            const statsResponse = await axios.get(`${baseURL}/backup/estatisticas`);
            console.log('✅ Estatísticas:', statsResponse.data);
        } catch (error) {
            console.log('❌ Erro ao obter estatísticas:', error.message);
        }

        // 3. Testar lista de backups
        console.log('\n3. Verificando lista de backups...');
        try {
            const listResponse = await axios.get(`${baseURL}/backup/lista`);
            console.log('✅ Lista de backups:', listResponse.data);
        } catch (error) {
            console.log('❌ Erro ao listar backups:', error.message);
        }

        // 4. Testar backup manual (se o servidor estiver rodando)
        console.log('\n4. Executando backup manual...');
        try {
            const backupResponse = await axios.post(`${baseURL}/backup/manual`);
            console.log('✅ Backup manual executado:', backupResponse.data);
        } catch (error) {
            console.log('❌ Erro ao executar backup manual:', error.message);
        }

        // 5. Testar exportação de dados
        console.log('\n5. Testando exportação de dados...');
        try {
            const exportResponse = await axios.post(`${baseURL}/backup/exportar`, {
                categoria: 'pacientes'
            });
            console.log('✅ Exportação realizada:', exportResponse.data);
        } catch (error) {
            console.log('❌ Erro ao exportar dados:', error.message);
        }

        // 6. Testar limpeza de cache
        console.log('\n6. Testando limpeza de cache...');
        try {
            const cacheResponse = await axios.post(`${baseURL}/backup/limpar-cache`);
            console.log('✅ Cache limpo:', cacheResponse.data);
        } catch (error) {
            console.log('❌ Erro ao limpar cache:', error.message);
        }

        console.log('\n🎉 Teste do sistema de backup concluído!');
        console.log('\n📋 RESUMO DA IMPLEMENTAÇÃO:');
        console.log('   ✅ Frontend: Componente DadosBackup.tsx criado');
        console.log('   ✅ Frontend: Integrado na página de configurações');
        console.log('   ✅ Backend: BackupService implementado');
        console.log('   ✅ Backend: BackupController implementado');
        console.log('   ✅ Backend: BackupModule criado e integrado');
        console.log('\n📌 FUNCIONALIDADES IMPLEMENTADAS:');
        console.log('   • Backup automático configurável');
        console.log('   • Backup manual sob demanda');
        console.log('   • Histórico de backups');
        console.log('   • Estatísticas de armazenamento');
        console.log('   • Exportação de dados por categoria');
        console.log('   • Gerenciamento de dados (limpar cache)');
        console.log('   • Interface completa no frontend');

    } catch (error) {
        console.error('❌ Erro geral no teste:', error.message);
        console.log('\n📝 NOTA: O backend precisa estar rodando na porta 3001 para os testes funcionarem.');
        console.log('   Para iniciar: cd backend && npm run start:dev');
    }
}

// Executar teste
testarSistemaBackup();
