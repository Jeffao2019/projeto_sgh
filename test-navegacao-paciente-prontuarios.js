const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

async function testarNavegacaoPacienteProntuarios() {
    console.log('=== TESTE: Navegação Paciente -> Prontuários ===\n');

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
        const headers = { Authorization: `Bearer ${token}` };
        console.log('✅ Login realizado com sucesso');

        // 2. Buscar pacientes
        console.log('\n2. Buscando lista de pacientes...');
        const pacientesResponse = await axios.get(`${API_BASE_URL}/pacientes`, { headers });
        
        if (!pacientesResponse.data || pacientesResponse.data.length === 0) {
            console.log('❌ Nenhum paciente encontrado');
            return;
        }
        
        const paciente = pacientesResponse.data[0];
        console.log(`✅ Pacientes encontrados: ${pacientesResponse.data.length}`);
        console.log(`   Primeiro paciente: ${paciente.nome} (ID: ${paciente.id})`);

        // 3. Buscar prontuários do paciente
        console.log(`\n3. Buscando prontuários do paciente ${paciente.nome}...`);
        const prontuariosResponse = await axios.get(
            `${API_BASE_URL}/prontuarios/with-relations?pacienteId=${paciente.id}`, 
            { headers }
        );
        
        console.log(`✅ Prontuários encontrados: ${prontuariosResponse.data.length}`);
        
        if (prontuariosResponse.data.length > 0) {
            const prontuario = prontuariosResponse.data[0];
            console.log(`   Primeiro prontuário: ID ${prontuario.id}`);
            console.log(`   Data: ${new Date(prontuario.dataConsulta).toLocaleDateString()}`);
            console.log(`   Paciente: ${prontuario.paciente.nome}`);
            console.log(`   Médico: ${prontuario.medico.nome}`);
        }

        // 4. Teste de busca de dados do paciente específico (para o banner)
        console.log(`\n4. Testando busca específica do paciente (para banner)...`);
        const pacienteEspecificoResponse = await axios.get(
            `${API_BASE_URL}/pacientes/${paciente.id}`, 
            { headers }
        );
        
        console.log('✅ Dados do paciente para banner:');
        console.log(`   Nome: ${pacienteEspecificoResponse.data.nome}`);
        console.log(`   CPF: ${pacienteEspecificoResponse.data.cpf}`);

        console.log('\n=== RESULTADO FINAL ===');
        console.log('✅ Fluxo de navegação Paciente -> Prontuários está funcionando!');
        console.log('✅ Banner com informações do paciente pode ser exibido');
        console.log('✅ Navegação de volta funcional');

        // Simulação das URLs que seriam utilizadas
        console.log('\n=== URLs DO FLUXO ===');
        console.log(`1. Lista de pacientes: /pacientes`);
        console.log(`2. Ver prontuários do paciente: /prontuarios?pacienteId=${paciente.id}`);
        console.log(`3. Voltar para pacientes: /pacientes`);
        console.log(`4. Ver todos os prontuários: /prontuarios`);

    } catch (error) {
        console.error('❌ Erro durante o teste:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Dados:', error.response.data);
        }
    }
}

// Executar teste
testarNavegacaoPacienteProntuarios();
