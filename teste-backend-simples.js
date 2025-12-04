/**
 * Teste simples para verificar se o backend está rodando e se agendamentos estão sendo salvos
 */

const https = require('https');
const http = require('http');

// Configuração para ignorar certificados SSL auto-assinados
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const API_BASE = 'http://localhost:3000';

async function testeConectividade() {
    console.log('🔍 Verificando conectividade com o backend...');
    
    try {
        const response = await fetch(`${API_BASE}/auth/debug`);
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Backend está rodando!');
            console.log('📊 Dados do debug:', data);
            return true;
        } else {
            console.log('❌ Backend retornou erro:', response.status);
            return false;
        }
    } catch (error) {
        console.log('❌ Erro de conectividade:', error.message);
        console.log('🔧 Tentando verificar se o processo Node.js está ativo...');
        return false;
    }
}

async function testeLogin() {
    console.log('\n🔐 Testando login...');
    
    // Primeiro, vamos tentar registrar um usuário de teste
    console.log('📝 Registrando usuário de teste...');
    try {
        const registerResponse = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome: 'Usuário Teste',
                email: 'teste@sgh.com',
                password: 'teste123',
                papel: 'ADMIN'
            })
        });

        if (registerResponse.ok) {
            console.log('✅ Usuário de teste criado com sucesso!');
        } else {
            console.log('ℹ️ Usuário de teste já existe ou erro na criação');
        }
    } catch (error) {
        console.log('ℹ️ Erro no registro (normal se usuário já existe):', error.message);
    }
    
    // Agora tentar login com diferentes credenciais
    const credenciais = [
        { email: 'teste@sgh.com', password: 'teste123' },
        { email: 'admin@sgh.com', password: 'admin123' },
        { email: 'admin@sgh.com', password: 'senha123' },
        { email: 'admin@sgh.com', password: '123456' }
    ];
    
    for (const cred of credenciais) {
        try {
            console.log(`🔑 Tentando login com: ${cred.email}`);
            
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cred)
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Login realizado com sucesso!');
                console.log('📊 Resposta completa:', JSON.stringify(data, null, 2));
                console.log('🎫 Token:', data.access_token ? 'Obtido' : 'Não obtido');
                return data.access_token || data.token || data.accessToken;
            } else {
                console.log(`❌ Falhou para ${cred.email}:`, response.status);
            }
        } catch (error) {
            console.log(`❌ Erro para ${cred.email}:`, error.message);
        }
    }
    
    return null;
}

async function testeListarAgendamentos(token) {
    console.log('\n📅 Testando listagem de agendamentos...');
    
    try {
        const response = await fetch(`${API_BASE}/agendamentos`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Agendamentos listados com sucesso!');
            console.log('📊 Total de agendamentos:', data.length);
            console.log('📝 Primeiros 3 agendamentos:', JSON.stringify(data.slice(0, 3), null, 2));
            return data;
        } else {
            console.log('❌ Erro ao listar agendamentos:', response.status);
            const error = await response.text();
            console.log('📝 Detalhes:', error);
            return [];
        }
    } catch (error) {
        console.log('❌ Erro ao listar agendamentos:', error.message);
        return [];
    }
}

async function testeCriarAgendamento(token) {
    console.log('\n➕ Testando criação de agendamento...');
    
    // Usar dados de pacientes e médicos reais da base
    const novoAgendamento = {
        pacienteId: "d47d5240-146b-43a7-a977-348b7ecf89c8", // Ana Paula Costa (do resultado anterior)
        medicoId: "eda927f1-a263-403c-a59f-dad467640216", // Dr. Ana Oliveira (do resultado anterior)
        dataHora: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Amanhã
        tipo: "CONSULTA_GERAL", // Tipo válido baseado nos dados existentes
        observacoes: "Teste de criação de agendamento via script - Verificação de persistência"
    };
    
    try {
        console.log('📝 Dados do agendamento:', JSON.stringify(novoAgendamento, null, 2));
        
        const response = await fetch(`${API_BASE}/agendamentos`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novoAgendamento)
        });

        console.log('📊 Status da resposta:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Agendamento criado com sucesso!');
            console.log('🆔 ID do agendamento:', data.id);
            console.log('📝 Dados retornados:', JSON.stringify(data, null, 2));
            return data;
        } else {
            console.log('❌ Erro ao criar agendamento:', response.status);
            const error = await response.text();
            console.log('📝 Detalhes do erro:', error);
            return null;
        }
    } catch (error) {
        console.log('❌ Erro ao criar agendamento:', error.message);
        return null;
    }
}

async function testeVerificarPersistencia(token, agendamentoId) {
    console.log('\n🔍 Verificando se o agendamento foi persistido...');
    
    try {
        const response = await fetch(`${API_BASE}/agendamentos/${agendamentoId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Agendamento encontrado na base de dados!');
            console.log('📝 Dados persistidos:', JSON.stringify(data, null, 2));
            return data;
        } else if (response.status === 404) {
            console.log('❌ Agendamento NÃO foi encontrado na base de dados!');
            console.log('🚨 PROBLEMA DE PERSISTÊNCIA CONFIRMADO!');
            return null;
        } else {
            console.log('❌ Erro ao verificar agendamento:', response.status);
            const error = await response.text();
            console.log('📝 Detalhes:', error);
            return null;
        }
    } catch (error) {
        console.log('❌ Erro ao verificar agendamento:', error.message);
        return null;
    }
}

async function executarTestes() {
    console.log('🧪 INICIANDO TESTES DO SGH BACKEND');
    console.log('=' .repeat(50));
    
    // Teste 1: Conectividade
    const conectado = await testeConectividade();
    if (!conectado) {
        console.log('\n❌ Backend não está acessível. Finalizando testes.');
        process.exit(1);
    }
    
    // Teste 2: Login
    const token = await testeLogin();
    if (!token) {
        console.log('\n❌ Não foi possível fazer login. Finalizando testes.');
        process.exit(1);
    }
    
    // Teste 3: Listar agendamentos (estado inicial)
    const agendamentosAntes = await testeListarAgendamentos(token);
    console.log(`\n📊 Estado inicial: ${agendamentosAntes.length} agendamentos na base`);
    
    // Teste 4: Criar agendamento
    const novoAgendamento = await testeCriarAgendamento(token);
    if (!novoAgendamento) {
        console.log('\n❌ Não foi possível criar agendamento. Finalizando testes.');
        process.exit(1);
    }
    
    // Aguardar um pouco para garantir que a transação foi commitada
    console.log('\n⏳ Aguardando 2 segundos para verificar persistência...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Teste 5: Verificar persistência
    const agendamentoPersistido = await testeVerificarPersistencia(token, novoAgendamento.id);
    
    // Teste 6: Listar agendamentos novamente
    const agendamentosDepois = await testeListarAgendamentos(token);
    console.log(`\n📊 Estado final: ${agendamentosDepois.length} agendamentos na base`);
    
    console.log('\n' + '=' .repeat(50));
    console.log('📋 RESUMO DOS TESTES:');
    console.log('✅ Conectividade:', conectado ? 'OK' : 'FALHOU');
    console.log('✅ Login:', token ? 'OK' : 'FALHOU');
    console.log('✅ Criação:', novoAgendamento ? 'OK' : 'FALHOU');
    console.log('✅ Persistência:', agendamentoPersistido ? 'OK' : 'FALHOU');
    console.log('📊 Incremento na lista:', agendamentosDepois.length - agendamentosAntes.length);
    
    if (novoAgendamento && !agendamentoPersistido) {
        console.log('\n🚨 DIAGNÓSTICO: O backend retorna sucesso na criação mas não persiste os dados!');
        console.log('💡 Possíveis causas:');
        console.log('   - Transação não está sendo commitada');
        console.log('   - Erro silencioso no repository/entity');
        console.log('   - Problema de configuração do TypeORM');
    }
}

// Executar os testes
executarTestes().catch(error => {
    console.error('💥 Erro durante os testes:', error);
    process.exit(1);
});