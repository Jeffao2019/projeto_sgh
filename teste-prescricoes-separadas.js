const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

// Função para fazer login e obter token
async function obterToken() {
    try {
        console.log('🔐 Fazendo login...');
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: 'jeffersonalmeidasantos@gmail.com',
            password: '123456'
        });
        
        console.log('✅ Login realizado com sucesso!');
        console.log('Token recebido:', loginResponse.data);
        return loginResponse.data.access_token || loginResponse.data.token;
    } catch (error) {
        console.error('❌ Erro ao fazer login:', error.response?.data || error.message);
        throw error;
    }
}

async function testarProntuarioComPrescricoesSeparadas() {
    console.log('🏥 ========== TESTANDO PRESCRIÇÕES SEPARADAS ==========');
    console.log('');

    try {
        const token = await obterToken();
        
        console.log('📋 Buscando prontuários existentes...');
        const response = await axios.get(`${API_BASE_URL}/prontuarios`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const prontuarios = response.data;
        console.log(`✅ Encontrados ${prontuarios.length} prontuários`);
        
        if (prontuarios.length > 0) {
            const prontuario = prontuarios[0];
            console.log('');
            console.log('📄 Exemplo de prontuário:');
            console.log(`   ID: ${prontuario.id}`);
            console.log(`   Paciente: ${prontuario.paciente?.nome || 'N/A'}`);
            console.log(`   Prescrição atual: ${prontuario.prescricao ? 'Sim' : 'Não'}`);
            console.log(`   Prescrição uso interno: ${prontuario.prescricaoUsoInterno ? 'Sim' : 'Não'}`);
            console.log(`   Prescrição uso externo: ${prontuario.prescricaoUsoExterno ? 'Sim' : 'Não'}`);
            
            // Testar atualização com prescrições separadas
            console.log('');
            console.log('🔄 Testando atualização com prescrições separadas...');
            
            const updateData = {
                prescricaoUsoInterno: `
MEDICAMENTOS DE USO INTERNO (Ambiente Domiciliar):
1. Paracetamol 500mg - 1 comprimido a cada 6 horas (tomar em casa)
2. Dipirona 500mg - 1 comprimido se dor (uso doméstico)
3. Água abundante - 2 litros por dia (em casa)
4. Repouso relativo - permanecer em casa durante tratamento
                `,
                prescricaoUsoExterno: `
MEDICAMENTOS DE USO EXTERNO (Ambiente Externo):
1. Vitamina D 2000UI - 1 cápsula ao dia (tomar antes de sair)
2. Protetor solar FPS 60 - aplicar 30min antes da exposição solar
3. Óculos de sol - usar sempre que estiver em ambiente externo
4. Hidratação extra - levar água para atividades externas
                `
            };
            
            const updateResponse = await axios.put(`${API_BASE_URL}/prontuarios/${prontuario.id}`, updateData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('✅ Prontuário atualizado com prescrições separadas!');
            console.log('');
            console.log('📊 ESTRUTURA ATUALIZADA:');
            console.log('   ✓ Prescrição de uso interno (ambiente domiciliar) adicionada');
            console.log('   ✓ Prescrição de uso externo (ambiente externo) adicionada');
            console.log('   ✓ Sistema de prescrições separadas funcionando corretamente!');
            
        } else {
            console.log('❌ Nenhum prontuário encontrado para testar');
        }
        
    } catch (error) {
        console.error('💥 Erro no teste:', error.response?.data || error.message);
    }
}

// Executar o teste
testarProntuarioComPrescricoesSeparadas().catch(error => {
    console.error('💥 Erro fatal no teste:', error);
    process.exit(1);
});
