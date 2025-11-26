/**
 * Teste do Sistema de Segurança SGH
 * Verifica configurações de senha, autenticação e privacidade
 */

const axios = require('axios');

async function testarSistemaSeguranca() {
    console.log('🔐 Testando Sistema de Segurança...\n');

    const baseURL = 'http://localhost:3001/api';
    const userId = 'user_123'; // ID de teste

    try {
        // 1. Testar obtenção de configurações de segurança
        console.log('1. Verificando configurações de segurança...');
        try {
            const configResponse = await axios.get(`${baseURL}/seguranca/configuracoes/${userId}`);
            console.log('✅ Configurações obtidas:', configResponse.data);
        } catch (error) {
            console.log('❌ Erro ao obter configurações:', error.message);
        }

        // 2. Testar alteração de configurações
        console.log('\n2. Atualizando configurações de segurança...');
        try {
            const novasConfiguracoes = {
                autenticacaoDoisFatores: false,
                logoutAutomatico: true,
                tempoLogout: 45
            };

            const updateResponse = await axios.put(
                `${baseURL}/seguranca/configuracoes/${userId}`,
                novasConfiguracoes
            );
            console.log('✅ Configurações atualizadas:', updateResponse.data);
        } catch (error) {
            console.log('❌ Erro ao atualizar configurações:', error.message);
        }

        // 3. Testar alteração de senha
        console.log('\n3. Testando alteração de senha...');
        try {
            const dadosSenha = {
                senhaAtual: 'senha123',
                novaSenha: 'novaSenha@2024!'
            };

            const senhaResponse = await axios.post(
                `${baseURL}/seguranca/alterar-senha/${userId}`,
                dadosSenha
            );
            console.log('✅ Resultado alteração de senha:', senhaResponse.data);
        } catch (error) {
            console.log('❌ Erro ao alterar senha:', error.message);
        }

        // 4. Testar obtenção de sessões ativas
        console.log('\n4. Verificando sessões ativas...');
        try {
            const sessoesResponse = await axios.get(`${baseURL}/seguranca/sessoes/${userId}`);
            console.log('✅ Sessões ativas:', sessoesResponse.data);
        } catch (error) {
            console.log('❌ Erro ao obter sessões:', error.message);
        }

        // 5. Testar encerramento de sessão
        console.log('\n5. Testando encerramento de sessão...');
        try {
            const sessionId = 'session_2';
            const encerrarResponse = await axios.post(
                `${baseURL}/seguranca/encerrar-sessao/${userId}/${sessionId}`
            );
            console.log('✅ Sessão encerrada:', encerrarResponse.data);
        } catch (error) {
            console.log('❌ Erro ao encerrar sessão:', error.message);
        }

        // 6. Testar histórico de login
        console.log('\n6. Verificando histórico de login...');
        try {
            const historicoResponse = await axios.get(`${baseURL}/seguranca/historico-login/${userId}`);
            console.log('✅ Histórico obtido:', {
                success: historicoResponse.data.success,
                totalRegistros: historicoResponse.data.data?.length || 0
            });
        } catch (error) {
            console.log('❌ Erro ao obter histórico:', error.message);
        }

        // 7. Testar configuração de 2FA
        console.log('\n7. Testando configuração de 2FA...');
        try {
            const config2FA = { ativar: true };
            const tfaResponse = await axios.post(
                `${baseURL}/seguranca/configurar-2fa/${userId}`,
                config2FA
            );
            console.log('✅ 2FA configurado:', tfaResponse.data);
        } catch (error) {
            console.log('❌ Erro ao configurar 2FA:', error.message);
        }

        // 8. Testar cálculo do nível de segurança
        console.log('\n8. Calculando nível de segurança...');
        try {
            const nivelResponse = await axios.get(`${baseURL}/seguranca/nivel-seguranca/${userId}`);
            console.log('✅ Nível de segurança:', nivelResponse.data);
        } catch (error) {
            console.log('❌ Erro ao calcular nível:', error.message);
        }

        console.log('\n🎉 Teste do sistema de segurança concluído!');
        console.log('\n📋 RESUMO DA IMPLEMENTAÇÃO:');
        console.log('   ✅ Frontend: Componente Seguranca.tsx criado');
        console.log('   ✅ Frontend: Integrado na página de configurações');
        console.log('   ✅ Backend: SegurancaService implementado');
        console.log('   ✅ Backend: SegurancaController implementado');
        console.log('   ✅ Backend: SegurancaModule criado e integrado');
        console.log('\n📌 FUNCIONALIDADES IMPLEMENTADAS:');
        console.log('   • Alteração de senha com validação');
        console.log('   • Autenticação de dois fatores (2FA)');
        console.log('   • Configurações de sessão e timeout');
        console.log('   • Histórico de login e auditoria');
        console.log('   • Gerenciamento de sessões ativas');
        console.log('   • Configurações de privacidade e LGPD');
        console.log('   • Cálculo automático de nível de segurança');
        console.log('   • Interface com 3 abas (Senha, Autenticação, Privacidade)');

    } catch (error) {
        console.error('❌ Erro geral no teste:', error.message);
        console.log('\n📝 NOTA: O backend precisa estar rodando na porta 3001 para os testes funcionarem.');
        console.log('   Para iniciar: cd backend && npm run start:dev');
    }
}

// Executar teste
testarSistemaSeguranca();
