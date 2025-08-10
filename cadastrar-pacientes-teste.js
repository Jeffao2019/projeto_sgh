const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

// Lista de pacientes de teste com dados realistas e CPFs válidos
const pacientesParaCadastrar = [
    {
        nome: 'Maria Silva Santos',
        cpf: '11144477736',
        dataNascimento: '1985-03-15',
        telefone: '(11) 98765-4321',
        email: 'maria.silva2@email.com',
        endereco: {
            cep: '01234-567',
            logradouro: 'Rua das Flores',
            numero: '123',
            bairro: 'Centro',
            cidade: 'São Paulo',
            estado: 'SP'
        }
    },
    {
        nome: 'João Carlos Oliveira',
        cpf: '22255588890',
        dataNascimento: '1978-11-22',
        telefone: '(11) 99876-5432',
        email: 'joao.oliveira@email.com',
        endereco: {
            cep: '01310-100',
            logradouro: 'Av. Paulista',
            numero: '456',
            bairro: 'Bela Vista',
            cidade: 'São Paulo',
            estado: 'SP'
        }
    },
    {
        nome: 'Ana Paula Costa',
        cpf: '33366699901',
        dataNascimento: '1992-07-08',
        telefone: '(11) 97654-3210',
        email: 'ana.costa@email.com',
        endereco: {
            cep: '01305-000',
            logradouro: 'Rua Augusta',
            numero: '789',
            bairro: 'Consolação',
            cidade: 'São Paulo',
            estado: 'SP'
        }
    },
    {
        nome: 'Pedro Henrique Lima',
        cpf: '44477700012',
        dataNascimento: '1989-12-03',
        telefone: '(11) 96543-2109',
        email: 'pedro.lima@email.com',
        endereco: {
            cep: '01301-000',
            logradouro: 'Rua da Consolação',
            numero: '321',
            bairro: 'Consolação',
            cidade: 'São Paulo',
            estado: 'SP'
        }
    },
    {
        nome: 'Lucia Fernanda Rodrigues',
        cpf: '55588811123',
        dataNascimento: '1975-05-20',
        telefone: '(11) 95432-1098',
        email: 'lucia.rodrigues@email.com',
        endereco: {
            cep: '01426-000',
            logradouro: 'Rua Oscar Freire',
            numero: '654',
            bairro: 'Jardins',
            cidade: 'São Paulo',
            estado: 'SP'
        }
    },
    {
        nome: 'Roberto Carlos Mendes',
        cpf: '66699922234',
        dataNascimento: '1965-09-14',
        telefone: '(11) 94321-0987',
        email: 'roberto.mendes@email.com',
        endereco: {
            cep: '01414-000',
            logradouro: 'Rua Haddock Lobo',
            numero: '987',
            bairro: 'Jardins',
            cidade: 'São Paulo',
            estado: 'SP'
        }
    },
    {
        nome: 'Claudia Regina Alves',
        cpf: '77700033345',
        dataNascimento: '1983-01-30',
        telefone: '(11) 93210-9876',
        email: 'claudia.alves@email.com',
        endereco: {
            cep: '05402-000',
            logradouro: 'Av. Rebouças',
            numero: '432',
            bairro: 'Pinheiros',
            cidade: 'São Paulo',
            estado: 'SP'
        }
    },
    {
        nome: 'Fernando José Sousa',
        cpf: '88811144456',
        dataNascimento: '1970-08-17',
        telefone: '(11) 92109-8765',
        email: 'fernando.sousa@email.com',
        endereco: {
            cep: '05405-000',
            logradouro: 'Rua Teodoro Sampaio',
            numero: '876',
            bairro: 'Pinheiros',
            cidade: 'São Paulo',
            estado: 'SP'
        }
    },
    {
        nome: 'Carla Beatriz Nunes',
        cpf: '99922255567',
        dataNascimento: '1995-04-12',
        telefone: '(11) 91098-7654',
        email: 'carla.nunes@email.com',
        endereco: {
            cep: '01308-000',
            logradouro: 'Rua da Bela Vista',
            numero: '543',
            bairro: 'Bela Vista',
            cidade: 'São Paulo',
            estado: 'SP'
        }
    },
    {
        nome: 'Marcos Antonio Silva',
        cpf: '10203304505',
        dataNascimento: '1987-06-25',
        telefone: '(11) 90987-6543',
        email: 'marcos.silva@email.com',
        endereco: {
            cep: '05615-000',
            logradouro: 'Rua dos Três Irmãos',
            numero: '210',
            bairro: 'Vila Madalena',
            cidade: 'São Paulo',
            estado: 'SP'
        }
    }
];

async function cadastrarPacientesTeste() {
    console.log('=== CADASTRO DE PACIENTES DE TESTE ===\n');

    try {
        // 1. Login para obter token
        console.log('1. Fazendo login...');
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: 'dr.teste.agendamento@teste.com',
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

        // 2. Cadastrar cada paciente
        console.log(`\n2. Cadastrando ${pacientesParaCadastrar.length} pacientes...\n`);
        
        let sucessos = 0;
        let erros = 0;

        for (let i = 0; i < pacientesParaCadastrar.length; i++) {
            const paciente = pacientesParaCadastrar[i];
            
            try {
                console.log(`📝 Cadastrando: ${paciente.nome}...`);
                
                const response = await axios.post(`${API_BASE_URL}/pacientes`, paciente, { headers });
                
                console.log(`   ✅ Sucesso - ID: ${response.data.id}`);
                sucessos++;
                
                // Pequena pausa entre cadastros para não sobrecarregar o servidor
                await new Promise(resolve => setTimeout(resolve, 200));
                
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
            console.log(`\n📋 Alguns pacientes cadastrados:`);
            pacientesResponse.data.slice(0, 5).forEach((p, index) => {
                console.log(`   ${index + 1}. ${p.nome} - CPF: ${p.cpf} - Tel: ${p.telefone}`);
            });
            
            if (pacientesResponse.data.length > 5) {
                console.log(`   ... e mais ${pacientesResponse.data.length - 5} pacientes`);
            }
        }

        console.log(`\n🎉 Cadastro de pacientes concluído!`);
        console.log(`📱 Agora você pode testar a navegação com vários pacientes diferentes.`);

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
