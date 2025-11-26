const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

// Função para gerar CPF válido
function gerarCPF() {
    const digits = [];
    
    // Gera os 9 primeiros dígitos aleatoriamente
    for (let i = 0; i < 9; i++) {
        digits[i] = Math.floor(Math.random() * 9);
    }
    
    // Calcula o primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += digits[i] * (10 - i);
    }
    let remainder = sum % 11;
    digits[9] = remainder < 2 ? 0 : 11 - remainder;
    
    // Calcula o segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += digits[i] * (11 - i);
    }
    remainder = sum % 11;
    digits[10] = remainder < 2 ? 0 : 11 - remainder;
    
    return digits.join('');
}

// Lista de pacientes de teste com dados realistas
const nomesPacientes = [
    'Maria Silva Santos',
    'João Carlos Oliveira', 
    'Ana Paula Costa',
    'Pedro Henrique Lima',
    'Lucia Fernanda Rodrigues',
    'Roberto Carlos Mendes',
    'Claudia Regina Alves',
    'Fernando José Sousa',
    'Carla Beatriz Nunes',
    'Marcos Antonio Silva',
    'Gabriela Santos Pereira',
    'Ricardo Martins Costa',
    'Juliana Alves Nascimento',
    'André Luiz Santos',
    'Beatriz Lima Ferreira'
];

const enderecos = [
    { logradouro: 'Rua das Flores', numero: '123', bairro: 'Centro', cep: '01234-567' },
    { logradouro: 'Av. Paulista', numero: '456', bairro: 'Bela Vista', cep: '01310-100' },
    { logradouro: 'Rua Augusta', numero: '789', bairro: 'Consolação', cep: '01305-000' },
    { logradouro: 'Rua da Consolação', numero: '321', bairro: 'Consolação', cep: '01301-000' },
    { logradouro: 'Rua Oscar Freire', numero: '654', bairro: 'Jardins', cep: '01426-000' },
    { logradouro: 'Rua Haddock Lobo', numero: '987', bairro: 'Jardins', cep: '01414-000' },
    { logradouro: 'Av. Rebouças', numero: '432', bairro: 'Pinheiros', cep: '05402-000' },
    { logradouro: 'Rua Teodoro Sampaio', numero: '876', bairro: 'Pinheiros', cep: '05405-000' },
    { logradouro: 'Rua da Bela Vista', numero: '543', bairro: 'Bela Vista', cep: '01308-000' },
    { logradouro: 'Rua dos Três Irmãos', numero: '210', bairro: 'Vila Madalena', cep: '05615-000' },
    { logradouro: 'Av. Faria Lima', numero: '765', bairro: 'Itaim Bibi', cep: '04552-000' },
    { logradouro: 'Rua Vergueiro', numero: '1234', bairro: 'Vila Mariana', cep: '04101-000' },
    { logradouro: 'Av. Ibirapuera', numero: '555', bairro: 'Moema', cep: '04029-000' },
    { logradouro: 'Rua Estados Unidos', numero: '888', bairro: 'Jardins', cep: '01427-000' },
    { logradouro: 'Av. Angélica', numero: '999', bairro: 'Higienópolis', cep: '01227-000' }
];

const telefoneBase = ['(11) 98765-', '(11) 99876-', '(11) 97654-', '(11) 96543-', '(11) 95432-'];

function gerarTelefone() {
    const base = telefoneBase[Math.floor(Math.random() * telefoneBase.length)];
    const sufixo = Math.floor(Math.random() * 9000) + 1000;
    return base + sufixo;
}

function gerarDataNascimento() {
    const ano = Math.floor(Math.random() * (2000 - 1960) + 1960);
    const mes = Math.floor(Math.random() * 12) + 1;
    const dia = Math.floor(Math.random() * 28) + 1;
    return `${ano}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
}

function gerarPacientes(quantidade) {
    const pacientes = [];
    for (let i = 0; i < quantidade; i++) {
        const nome = nomesPacientes[i];
        const endereco = enderecos[i];
        const emailBase = nome.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '.')
            .replace(/[^a-z.]/g, '');
        
        pacientes.push({
            nome: nome,
            cpf: gerarCPF(),
            dataNascimento: gerarDataNascimento(),
            telefone: gerarTelefone(),
            email: `${emailBase}@email.com`,
            endereco: {
                cep: endereco.cep,
                logradouro: endereco.logradouro,
                numero: endereco.numero,
                bairro: endereco.bairro,
                cidade: 'São Paulo',
                estado: 'SP'
            }
        });
    }
    return pacientes;
}

async function cadastrarPacientesTeste() {
    console.log('=== CADASTRO DE PACIENTES DE TESTE (CPFs VÁLIDOS) ===\n');

    try {
        // 1. Login para obter token
        console.log('1. Fazendo login...');
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: 'admin@sgh.com',
            password: '123456'
        });
        
        if (!loginResponse.data.token) {
            console.log('❌ Login falhou');
            return;
        }
        
        const token = loginResponse.data.token;
        const headers = { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        console.log('✅ Login realizado com sucesso');

        // 2. Gerar pacientes com CPFs válidos
        const pacientesParaCadastrar = gerarPacientes(12);
        console.log(`\n2. Cadastrando ${pacientesParaCadastrar.length} pacientes com CPFs válidos...\n`);
        
        let sucessos = 0;
        let erros = 0;

        for (let i = 0; i < pacientesParaCadastrar.length; i++) {
            const paciente = pacientesParaCadastrar[i];
            
            try {
                console.log(`📝 Cadastrando: ${paciente.nome} (CPF: ${paciente.cpf})...`);
                
                const response = await axios.post(`${API_BASE_URL}/pacientes`, paciente, { headers });
                
                console.log(`   ✅ Sucesso - ID: ${response.data.id}`);
                sucessos++;
                
                // Pequena pausa entre cadastros
                await new Promise(resolve => setTimeout(resolve, 300));
                
            } catch (error) {
                console.log(`   ❌ Erro: ${error.response?.data?.message || error.message}`);
                erros++;
            }
        }

        console.log(`\n=== RESULTADOS ===`);
        console.log(`✅ Sucessos: ${sucessos}`);
        console.log(`❌ Erros: ${erros}`);
        console.log(`📊 Total: ${pacientesParaCadastrar.length}`);

        // 3. Verificar total de pacientes cadastrados
        console.log(`\n3. Verificando total de pacientes no sistema...`);
        const pacientesResponse = await axios.get(`${API_BASE_URL}/pacientes`, { headers });
        console.log(`📋 Total de pacientes no sistema: ${pacientesResponse.data.length}`);

        // 4. Mostrar alguns exemplos
        if (pacientesResponse.data.length > 0) {
            console.log(`\n📋 Pacientes cadastrados (últimos 10):`);
            pacientesResponse.data.slice(-10).forEach((p, index) => {
                console.log(`   ${index + 1}. ${p.nome} - CPF: ${p.cpf} - Tel: ${p.telefone}`);
            });
        }

        console.log(`\n🎉 Cadastro de pacientes concluído!`);
        console.log(`📱 Agora você pode testar a navegação com ${pacientesResponse.data.length} pacientes diferentes.`);
        console.log(`🔍 Acesse: http://localhost:8081/pacientes para ver a lista completa.`);

    } catch (error) {
        console.error('❌ Erro durante o cadastro:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Dados:', error.response.data);
        }
    }
}

// Executar cadastro
cadastrarPacientesTeste();
