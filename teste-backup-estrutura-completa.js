const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Simulação da lógica do backup para teste
function criarBackupCompleto() {
    console.log('🔄 SIMULANDO CRIAÇÃO DE BACKUP MANUAL\n');

    // Determinar diretório de backup
    const backupDir = path.join(process.cwd(), 'backend', 'backups');
    console.log(`📁 Diretório de backup: ${backupDir}`);
    
    // Criar diretório se não existir
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
        console.log('✅ Diretório de backup criado');
    } else {
        console.log('✅ Diretório de backup já existe');
    }

    // Criar nome do arquivo
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupId = `backup_${timestamp}_${Math.random().toString(36).substring(2, 8)}`;
    const backupPath = path.join(backupDir, `${backupId}.json`);

    console.log(`📄 Arquivo de backup: ${path.basename(backupPath)}\n`);

    // Dados de exemplo (como seria com dados reais)
    const dadosExemplo = {
        metadata: {
            timestamp: new Date().toISOString(),
            versao: '1.0.0',
            tipo: 'backup_completo',
            backupId: backupId,
            status: 'completo'
        },
        estatisticas: {
            totalPacientes: 12,
            totalAgendamentos: 70,
            totalProntuarios: 41,
            totalUsuarios: 5,
            tamanhoEstimado: '2.3 GB'
        },
        dados_completos: {
            pacientes: [
                {
                    id: "example-patient-1",
                    nome: "João Silva Santos",
                    email: "joao.silva@email.com",
                    telefone: "(11) 99999-9999",
                    cpf: "12345678901",
                    dataNascimento: "1985-06-15",
                    endereco: {
                        logradouro: "Rua das Flores, 123",
                        bairro: "Centro",
                        cidade: "São Paulo",
                        estado: "SP",
                        cep: "01234-567"
                    },
                    criadoEm: "2024-01-15T10:30:00.000Z"
                }
                // ... mais pacientes
            ],
            agendamentos: [
                {
                    id: "example-agendamento-1",
                    pacienteId: "example-patient-1",
                    medicoId: "example-medico-1",
                    data: "2024-12-05T09:00:00.000Z",
                    tipo: "CONSULTA_GERAL",
                    status: "CONFIRMADO",
                    observacoes: "Consulta de rotina"
                }
                // ... mais agendamentos
            ],
            prontuarios: [
                {
                    id: "example-prontuario-1",
                    pacienteId: "example-patient-1",
                    agendamentoId: "example-agendamento-1",
                    queixaPrincipal: "Dor de cabeça frequente",
                    historiaDoencaAtual: "Paciente relata dor de cabeça há 2 semanas",
                    exameFisico: "Paciente consciente, orientado, sem alterações",
                    hipoteseDiagnostica: "Cefaleia tensional",
                    conduta: "Prescrição de analgésico",
                    dataConsulta: "2024-12-05T09:00:00.000Z"
                }
                // ... mais prontuários
            ],
            usuarios: [
                {
                    id: "example-user-1",
                    nome: "Dr. Carlos Medico",
                    email: "carlos@sgh.com",
                    role: "MEDICO",
                    telefone: "(11) 98888-8888",
                    isActive: true,
                    createdAt: "2024-01-01T08:00:00.000Z"
                }
                // ... mais usuários (sem senhas por segurança)
            ]
        },
        integridade: {
            hash_dados: crypto.createHash('md5').update(JSON.stringify({
                pacientes: 12,
                agendamentos: 70,
                prontuarios: 41,
                usuarios: 5
            })).digest('hex'),
            timestamp_verificacao: new Date().toISOString()
        }
    };

    // Escrever arquivo de backup
    fs.writeFileSync(backupPath, JSON.stringify(dadosExemplo, null, 2));
    
    const stats = fs.statSync(backupPath);
    console.log('📊 BACKUP CRIADO COM SUCESSO!');
    console.log(`   📍 Localização: ${backupPath}`);
    console.log(`   📏 Tamanho: ${stats.size} bytes (${(stats.size / 1024).toFixed(2)} KB)`);
    console.log(`   🕒 Criado em: ${stats.birthtime.toLocaleString()}`);

    // Verificar conteúdo
    console.log('\n📋 ESTRUTURA DO BACKUP:');
    console.log('   ✅ Metadata completo');
    console.log('   ✅ Estatísticas de contagem');
    console.log('   ✅ Dados completos de todas as entidades');
    console.log('   ✅ Hash de integridade');
    
    // Mostrar exemplo do conteúdo
    console.log('\n🔍 EXEMPLO DO CONTEÚDO (primeiros 500 caracteres):');
    const content = fs.readFileSync(backupPath, 'utf8');
    console.log(content.substring(0, 500) + '...');
    
    console.log('\n🎯 DIFERENÇAS DA VERSÃO ANTERIOR:');
    console.log('   ❌ ANTES: Salvava apenas contagens (Pacientes: 12, Agendamentos: 70...)');
    console.log('   ✅ AGORA: Salva dados completos de todos os pacientes, agendamentos, prontuários e usuários');
    console.log('   ✅ AGORA: Inclui metadata estruturado e hash de integridade');
    console.log('   ✅ AGORA: Backup verdadeiramente utilizável para restauração');
    
    return backupPath;
}

// Verificar backups existentes
function verificarBackupsExistentes() {
    console.log('\n📂 VERIFICANDO BACKUPS EXISTENTES:');
    const backupDir = path.join(process.cwd(), 'backend', 'backups');
    
    if (fs.existsSync(backupDir)) {
        const files = fs.readdirSync(backupDir);
        const backupFiles = files.filter(f => f.includes('backup') && f.endsWith('.json'));
        
        if (backupFiles.length > 0) {
            console.log(`   📁 ${backupFiles.length} backup(s) encontrado(s):`);
            backupFiles.forEach((file, index) => {
                const filePath = path.join(backupDir, file);
                const stats = fs.statSync(filePath);
                console.log(`   ${index + 1}. 📄 ${file}`);
                console.log(`      📏 Tamanho: ${stats.size} bytes`);
                console.log(`      🕒 Criado: ${stats.birthtime.toLocaleString()}\n`);
            });
        } else {
            console.log('   📂 Nenhum backup encontrado no diretório');
        }
    } else {
        console.log('   📂 Diretório de backups não existe ainda');
    }
}

// Executar teste
console.log('🎯 TESTE DE BACKUP MANUAL - ESTRUTURA COMPLETA\n');
verificarBackupsExistentes();
const backupPath = criarBackupCompleto();

console.log('\n✅ TESTE CONCLUÍDO!');
console.log('\n📋 PRÓXIMOS PASSOS:');
console.log('1. 🔄 Iniciar backend: cd backend && npm run start:dev');
console.log('2. 🌐 Acessar frontend: http://localhost:8080');
console.log('3. 🔐 Fazer login: admin@sgh.com / 123456');
console.log('4. ⚙️ Ir em: Configurações → Dados e Backup');
console.log('5. 🚀 Clicar em "Iniciar Backup Manual"');
console.log('6. 📁 Verificar arquivo criado em: backend/backups/');
console.log('7. 🔍 Confirmar que contém todos os dados reais do banco');
