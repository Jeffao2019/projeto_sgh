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

async function buscarMedicos() {
    try {
        console.log('🔍 Buscando médicos...');
        const response = await axios.get(`${API_BASE_URL}/medicos`);
        return response.data;
    } catch (error) {
        console.error('❌ Erro ao buscar médicos:', error.response?.data || error.message);
        return [];
    }
}

async function atualizarMedico(medicoId, dadosAtualizados) {
    try {
        const response = await axios.put(`${API_BASE_URL}/medicos/${medicoId}`, dadosAtualizados);
        return response.data;
    } catch (error) {
        console.error(`❌ Erro ao atualizar médico ${medicoId}:`, error.response?.data || error.message);
        return null;
    }
}

function gerarCRMFicticio(index) {
    return crmsFicticios[index % crmsFicticios.length];
}

function gerarEspecialidadeAleatoria() {
    return especialidades[Math.floor(Math.random() * especialidades.length)];
}

async function atualizarCRMsMedicos() {
    console.log('🏥 ========== ATUALIZANDO CRMs DOS MÉDICOS ==========');
    console.log('');

    const medicos = await buscarMedicos();
    
    if (medicos.length === 0) {
        console.log('❌ Nenhum médico encontrado ou erro na busca.');
        return;
    }

    console.log(`📊 Total de médicos encontrados: ${medicos.length}`);
    console.log('');

    let medicosAtualizados = 0;
    let medicosComCRM = 0;

    for (let i = 0; i < medicos.length; i++) {
        const medico = medicos[i];
        
        console.log(`👨‍⚕️ Médico ${i + 1}: ${medico.nome}`);
        console.log(`   ID: ${medico.id}`);
        console.log(`   CRM atual: ${medico.crm || '❌ VAZIO'}`);
        console.log(`   Especialidade atual: ${medico.especialidade || '❌ VAZIA'}`);

        // Verificar se já tem CRM
        if (medico.crm && medico.crm.trim() !== '') {
            console.log(`   ✅ Médico já possui CRM válido: ${medico.crm}`);
            medicosComCRM++;
        } else {
            // Gerar dados fictícios
            const novoCRM = gerarCRMFicticio(i);
            const novaEspecialidade = medico.especialidade || gerarEspecialidadeAleatoria();
            
            console.log(`   🔄 Atualizando com:`);
            console.log(`      Novo CRM: ${novoCRM}`);
            console.log(`      Especialidade: ${novaEspecialidade}`);

            const dadosAtualizados = {
                nome: medico.nome,
                email: medico.email,
                telefone: medico.telefone,
                crm: novoCRM,
                especialidade: novaEspecialidade
            };

            const resultado = await atualizarMedico(medico.id, dadosAtualizados);
            
            if (resultado) {
                console.log(`   ✅ Médico atualizado com sucesso!`);
                medicosAtualizados++;
            } else {
                console.log(`   ❌ Falha ao atualizar médico`);
            }
        }
        
        console.log('');
    }

    console.log('📈 ========== RESUMO DA ATUALIZAÇÃO ==========');
    console.log(`✅ Médicos já com CRM: ${medicosComCRM}`);
    console.log(`🔄 Médicos atualizados: ${medicosAtualizados}`);
    console.log(`📊 Total processados: ${medicos.length}`);
    console.log('');

    if (medicosAtualizados > 0) {
        console.log('🎉 Atualização de CRMs concluída com sucesso!');
        console.log('💡 Agora todos os médicos possuem CRMs fictícios para testes.');
    } else {
        console.log('ℹ️  Nenhuma atualização foi necessária - todos os médicos já possuem CRM.');
    }
}

// Executar o script
atualizarCRMsMedicos().catch(error => {
    console.error('💥 Erro fatal na execução:', error);
    process.exit(1);
});
