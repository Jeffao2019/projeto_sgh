const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function testarBackupManual() {
    console.log('🔄 TESTE DO BACKUP MANUAL\n');

    try {
        // 1. Login para obter token
        console.log('🔐 Fazendo login...');
        const loginResponse = await axios.post('http://localhost:3010/auth/login', {
            email: 'admin@sgh.com',
            password: '123456'
        });
        
        const token = loginResponse.data.token;
        console.log('✅ Login realizado com sucesso\n');

        const headers = {
            'Authorization': `Bearer ${token}`
        };

        // 2. Verificar dados reais no banco ANTES do backup
        console.log('📊 VERIFICANDO DADOS REAIS NO BANCO:');
        
        const [pacientesData, agendamentosData, prontuariosData] = await Promise.all([
            axios.get('http://localhost:3010/pacientes', { headers }),
            axios.get('http://localhost:3010/agendamentos', { headers }),
            axios.get('http://localhost:3010/prontuarios', { headers })
        ]);

        const dadosReais = {
            pacientes: pacientesData.data.length,
            agendamentos: agendamentosData.data.length,
            prontuarios: prontuariosData.data.length,
            users: 5 // Assumindo
        };

        console.log(`   📋 Pacientes: ${dadosReais.pacientes}`);
        console.log(`   📅 Agendamentos: ${dadosReais.agendamentos}`);
        console.log(`   📄 Prontuários: ${dadosReais.prontuarios}`);
        console.log(`   👥 Usuários: ${dadosReais.users}\n`);

        // 3. Executar backup manual
        console.log('🔄 EXECUTANDO BACKUP MANUAL...');
        const backupResponse = await axios.post('http://localhost:3010/backup/manual', {}, { headers });
        console.log('✅ Backup manual executado\n');

        console.log('📁 INFORMAÇÕES DO BACKUP:');
        console.log(`   📋 ID: ${backupResponse.data.id}`);
        console.log(`   📅 Data: ${backupResponse.data.data}`);
        console.log(`   📂 Tipo: ${backupResponse.data.tipo}`);
        console.log(`   📏 Tamanho: ${backupResponse.data.tamanho} bytes`);
        console.log(`   ✅ Status: ${backupResponse.data.status}`);
        console.log(`   📍 Localização: ${backupResponse.data.localizacao}`);
        console.log(`   🔒 Hash: ${backupResponse.data.hash}\n`);

        // 4. Verificar se arquivo foi criado
        const backupPath = backupResponse.data.localizacao;
        console.log('📁 VERIFICANDO ARQUIVO DE BACKUP:');
        
        if (fs.existsSync(backupPath)) {
            console.log('✅ Arquivo de backup encontrado');
            
            const stats = fs.statSync(backupPath);
            console.log(`   📏 Tamanho do arquivo: ${stats.size} bytes`);
            console.log(`   📅 Data de criação: ${stats.birthtime}`);
            console.log(`   📂 Diretório: ${path.dirname(backupPath)}\n`);

            // 5. Ler e verificar conteúdo do backup
            console.log('🔍 CONTEÚDO DO BACKUP:');
            const backupContent = fs.readFileSync(backupPath, 'utf8');
            const backupData = JSON.parse(backupContent);

            console.log('📋 Estrutura do backup:');
            console.log(JSON.stringify(backupData, null, 2));

            // 6. Verificar se dados batem
            console.log('\n🔍 VERIFICAÇÃO DE INTEGRIDADE:');
            
            if (backupData.dados) {
                const backupDados = backupData.dados;
                console.log('┌─────────────────┬──────────┬──────────┬──────────────┐');
                console.log('│ Categoria       │ Real     │ Backup   │ Status       │');
                console.log('├─────────────────┼──────────┼──────────┼──────────────┤');
                console.log(`│ Pacientes       │ ${dadosReais.pacientes.toString().padEnd(8)} │ ${(backupDados.Pacientes || 0).toString().padEnd(8)} │ ${dadosReais.pacientes === backupDados.Pacientes ? '✅ Correto' : '❌ Diverge'} │`);
                console.log(`│ Agendamentos    │ ${dadosReais.agendamentos.toString().padEnd(8)} │ ${(backupDados.Agendamentos || 0).toString().padEnd(8)} │ ${dadosReais.agendamentos === backupDados.Agendamentos ? '✅ Correto' : '❌ Diverge'} │`);
                console.log(`│ Prontuários     │ ${dadosReais.prontuarios.toString().padEnd(8)} │ ${(backupDados.Prontuários || 0).toString().padEnd(8)} │ ${dadosReais.prontuarios === backupDados.Prontuários ? '✅ Correto' : '❌ Diverge'} │`);
                console.log(`│ Usuários        │ ${dadosReais.users.toString().padEnd(8)} │ ${(backupDados.Usuários || 0).toString().padEnd(8)} │ ${dadosReais.users === backupDados.Usuários ? '✅ Correto' : '❌ Diverge'} │`);
                console.log('└─────────────────┴──────────┴──────────┴──────────────┘');
            }

            // 7. Verificar se backup contém dados completos
            console.log('\n📊 COMPLETUDE DO BACKUP:');
            const contemDados = backupData.dados && Object.keys(backupData.dados).length > 0;
            const contemTimestamp = !!backupData.timestamp;
            const contemVersao = !!backupData.versao;
            
            console.log(`   📋 Contém dados: ${contemDados ? '✅' : '❌'}`);
            console.log(`   🕒 Contém timestamp: ${contemTimestamp ? '✅' : '❌'}`);
            console.log(`   📝 Contém versão: ${contemVersao ? '✅' : '❌'}`);
            console.log(`   📏 Tamanho não-vazio: ${stats.size > 0 ? '✅' : '❌'}`);

        } else {
            console.log('❌ Arquivo de backup NÃO encontrado');
            console.log(`   📍 Caminho esperado: ${backupPath}`);
        }

        // 8. Listar todos os backups no diretório
        console.log('\n📂 BACKUPS DISPONÍVEIS:');
        const backupDir = path.join(process.cwd(), 'backend', 'backups');
        console.log(`   📍 Diretório: ${backupDir}`);
        
        if (fs.existsSync(backupDir)) {
            const files = fs.readdirSync(backupDir);
            const backupFiles = files.filter(f => f.includes('backup'));
            
            if (backupFiles.length > 0) {
                console.log(`   📁 ${backupFiles.length} arquivos de backup encontrados:`);
                backupFiles.forEach(file => {
                    const filePath = path.join(backupDir, file);
                    const stats = fs.statSync(filePath);
                    console.log(`      📄 ${file} (${stats.size} bytes, ${stats.birthtime.toLocaleString()})`);
                });
            } else {
                console.log('   📂 Nenhum arquivo de backup encontrado');
            }
        } else {
            console.log('   📂 Diretório de backup não existe');
        }

        console.log('\n✅ TESTE DE BACKUP CONCLUÍDO!');

    } catch (error) {
        console.error('❌ Erro durante o teste:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Dados:', error.response.data);
        }
        
        console.log('\n🔧 VERIFICAÇÕES NECESSÁRIAS:');
        console.log('1. Backend rodando: cd backend && npm run start:dev');
        console.log('2. PostgreSQL ativo na porta 5433');
        console.log('3. Credenciais corretas: admin@sgh.com / 123456');
    }
}

// Executar teste
testarBackupManual();
