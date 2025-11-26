/**
 * Script para criar médicos de teste
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

const medicos = [
    {
        nome: 'Dr. Carlos Silva',
        email: 'dr.carlos@sgh.com',
        password: '123456',
        crm: '123456-SP',
        especialidade: 'Cardiologia'
    },
    {
        nome: 'Dr. Ana Oliveira',
        email: 'dr.ana@sgh.com', 
        password: '123456',
        crm: '234567-RJ',
        especialidade: 'Pediatria'
    },
    {
        nome: 'Dr. João Santos',
        email: 'dr.joao@sgh.com',
        password: '123456', 
        crm: '345678-MG',
        especialidade: 'Clínico Geral'
    }
];

async function criarMedicos() {
    try {
        console.log('🏥 Cadastrando médicos...');
        
        for (const medico of medicos) {
            try {
                const response = await axios.post(`${API_BASE_URL}/auth/register`, {
                    nome: medico.nome,
                    email: medico.email,
                    password: medico.password,
                    confirmPassword: medico.password,
                    role: 'MEDICO',
                    acceptTerms: true
                });
                
                console.log(`✅ ${medico.nome} - ${medico.especialidade} criado com sucesso!`);
                
            } catch (error) {
                if (error.response?.status === 409) {
                    console.log(`ℹ️ ${medico.nome} já existe!`);
                } else {
                    console.error(`❌ Erro ao criar ${medico.nome}:`, error.response?.data || error.message);
                }
            }
        }
        
        console.log('🎉 Cadastro de médicos concluído!');
        
    } catch (error) {
        console.error('❌ Erro geral:', error.message);
    }
}

criarMedicos();
