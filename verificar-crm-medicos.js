const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

// Lista de CRMs fictícios para testes
const crmsFicticios = [
    'CRM-SP 123456',
    'CRM-RJ 234567', 
    'CRM-MG 345678',
    'CRM-SP 456789',
    'CRM-RS 567890',
    'CRM-PR 678901',
    'CRM-SC 789012',
    'CRM-SP 890123',
    'CRM-RJ 901234',
    'CRM-MG 012345',
    'CRM-BA 112233',
    'CRM-PE 223344',
    'CRM-CE 334455',
    'CRM-GO 445566',
    'CRM-DF 556677',
    'CRM-ES 667788',
    'CRM-MT 778899',
    'CRM-MS 889900',
    'CRM-RO 990011',
    'CRM-AC 101112'
];

// Especialidades médicas realistas
const especialidades = [
    'Clínica Geral',
    'Cardiologia',
    'Dermatologia',
    'Endocrinologia',
    'Gastroenterologia',
    'Ginecologia e Obstetrícia',
    'Neurologia',
    'Oftalmologia',
    'Ortopedia',
    'Otorrinolaringologia',
    'Pediatria',
    'Pneumologia',
    'Psiquiatria',
    'Radiologia',
    'Urologia'
];

// Função para fazer login e obter token
async function obterToken() {
    try {
        console.log('🔐 Fazendo login...');
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: 'admin@admin.com',
            password: 'Admin123!'
        });
        
        console.log('✅ Login realizado com sucesso!');
        return loginResponse.data.access_token;
    } catch (error) {
        console.error('❌ Erro ao fazer login:', error.response?.data || error.message);
        console.log('💡 Certifique-se de que o backend está rodando e que existe um usuário admin.');
        throw error;
    }
}

async function buscarMedicos(token) {
    try {
        console.log('🔍 Buscando médicos...');
        const response = await axios.get(`${API_BASE_URL}/auth/medicos`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('❌ Erro ao buscar médicos:', error.response?.data || error.message);
        return [];
    }
}

// Como não existe endpoint de update para médicos, vamos verificar se podemos atualizar via auth
async function verificarEndpointsDisponiveis(token) {
    console.log('🔍 Verificando endpoints disponíveis...');
    
    // Testar se existe endpoint de update para usuários/médicos
    try {
        const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('✅ Endpoint /auth/profile funcionando');
    } catch (error) {
        console.log('❌ Endpoint /auth/profile não disponível');
    }
}

function gerarCRMFicticio(index) {
    return crmsFicticios[index % crmsFicticios.length];
}

function gerarEspecialidadeAleatoria() {
    return especialidades[Math.floor(Math.random() * especialidades.length)];
}

async function mostrarMedicosSemCRM() {
    console.log('🏥 ========== VERIFICANDO CRMs DOS MÉDICOS ==========');
    console.log('');

    try {
        const token = await obterToken();
        const medicos = await buscarMedicos(token);
        
        if (medicos.length === 0) {
            console.log('❌ Nenhum médico encontrado ou erro na busca.');
            return;
        }

        console.log(`📊 Total de médicos encontrados: ${medicos.length}`);
        console.log('');

        let medicosComCRM = 0;
        let medicosSemCRM = 0;
        const medicosSemCRMList = [];

        for (let i = 0; i < medicos.length; i++) {
            const medico = medicos[i];
            
            console.log(`👨‍⚕️ Médico ${i + 1}: ${medico.nome}`);
            console.log(`   ID: ${medico.id}`);
            console.log(`   Email: ${medico.email}`);
            console.log(`   Papel: ${medico.papel}`);

            // Verificar se tem campos CRM e especialidade (podem não existir na estrutura atual)
            if (medico.crm && medico.crm.trim() !== '') {
                console.log(`   ✅ CRM: ${medico.crm}`);
                medicosComCRM++;
            } else {
                console.log(`   ❌ CRM: VAZIO`);
                medicosSemCRM++;
                medicosSemCRMList.push({
                    id: medico.id,
                    nome: medico.nome,
                    email: medico.email,
                    crmSugerido: gerarCRMFicticio(i),
                    especialidadeSugerida: gerarEspecialidadeAleatoria()
                });
            }

            if (medico.especialidade && medico.especialidade.trim() !== '') {
                console.log(`   ✅ Especialidade: ${medico.especialidade}`);
            } else {
                console.log(`   ❌ Especialidade: VAZIA`);
            }
            
            console.log('');
        }

        console.log('📈 ========== RESUMO ==========');
        console.log(`✅ Médicos com CRM: ${medicosComCRM}`);
        console.log(`❌ Médicos sem CRM: ${medicosSemCRM}`);
        console.log(`📊 Total de médicos: ${medicos.length}`);
        console.log('');

        if (medicosSemCRM > 0) {
            console.log('🎯 ========== MÉDICOS QUE PRECISAM DE CRM ==========');
            medicosSemCRMList.forEach((medico, index) => {
                console.log(`${index + 1}. ${medico.nome}`);
                console.log(`   ID: ${medico.id}`);
                console.log(`   Email: ${medico.email}`);
                console.log(`   CRM sugerido: ${medico.crmSugerido}`);
                console.log(`   Especialidade sugerida: ${medico.especialidadeSugerida}`);
                console.log('');
            });

            console.log('💡 PRÓXIMOS PASSOS:');
            console.log('1. Verificar se a entidade User tem campos para CRM e especialidade');
            console.log('2. Se não tiver, adicionar os campos na migration');
            console.log('3. Criar endpoint para atualizar dados do médico');
            console.log('4. Executar script de atualização');
        } else {
            console.log('🎉 Todos os médicos já possuem CRM!');
        }

        await verificarEndpointsDisponiveis(token);

    } catch (error) {
        console.error('💥 Erro na execução:', error.message);
    }
}

// Executar o script
mostrarMedicosSemCRM().catch(error => {
    console.error('💥 Erro fatal na execução:', error);
    process.exit(1);
});
