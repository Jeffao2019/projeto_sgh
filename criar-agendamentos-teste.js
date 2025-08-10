const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

function gerarDataAgendamento() {
    // Gera datas futuras entre hoje e 60 dias no futuro
    const hoje = new Date();
    const futuroDias = new Date(hoje.getTime() + (60 * 24 * 60 * 60 * 1000));
    
    // Adiciona algumas horas para não cair exatamente na meia-noite
    const timestamp = hoje.getTime() + (2 * 60 * 60 * 1000) + Math.random() * (futuroDias.getTime() - hoje.getTime());
    const data = new Date(timestamp);
    
    // Ajusta para horário comercial (8h às 17h)
    data.setHours(8 + Math.floor(Math.random() * 9)); // 8h-17h
    data.setMinutes(Math.floor(Math.random() * 4) * 15); // 0, 15, 30, 45 min
    data.setSeconds(0);
    data.setMilliseconds(0);
    
    return data;
}

async function criarAgendamentosParaTodos() {
    console.log('=== CRIAÇÃO DE AGENDAMENTOS PARA TODOS OS PACIENTES ===\n');

    try {
        // 1. Login
        console.log('1. Fazendo login...');
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: 'dr.teste.agendamento@teste.com',
            password: '123456'
        });
        
        const token = loginResponse.data.token;
        const headers = { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        console.log('✅ Login realizado');

        // 2. Buscar todos os pacientes
        console.log('\n2. Buscando pacientes...');
        const pacientesResponse = await axios.get(`${API_BASE_URL}/pacientes`, { headers });
        const pacientes = pacientesResponse.data;
        console.log(`✅ Encontrados ${pacientes.length} pacientes`);

        // 3. Buscar agendamentos existentes
        console.log('\n3. Verificando agendamentos existentes...');
        const agendamentosResponse = await axios.get(`${API_BASE_URL}/agendamentos`, { headers });
        const agendamentosExistentes = agendamentosResponse.data;
        
        // Contar agendamentos por paciente
        const agendamentosPorPaciente = {};
        agendamentosExistentes.forEach(a => {
            if (!agendamentosPorPaciente[a.pacienteId]) {
                agendamentosPorPaciente[a.pacienteId] = 0;
            }
            agendamentosPorPaciente[a.pacienteId]++;
        });

        console.log(`📋 ${agendamentosExistentes.length} agendamentos já existem`);

        // 4. Criar agendamentos para pacientes que têm poucos ou nenhum
        console.log('\n4. Criando agendamentos...\n');
        
        const medicoId = '8d39054c-87e9-458b-a44a-9fc4b266776c';
        let sucessos = 0;
        let erros = 0;

        for (const paciente of pacientes) {
            const agendamentosExistentesParaPaciente = agendamentosPorPaciente[paciente.id] || 0;
            const agendamentosParaCriar = Math.max(0, 2 - agendamentosExistentesParaPaciente); // Mínimo 2 por paciente
            
            if (agendamentosParaCriar === 0) {
                console.log(`✅ ${paciente.nome} já tem agendamentos suficientes (${agendamentosExistentesParaPaciente})`);
                continue;
            }

            console.log(`📝 Criando ${agendamentosParaCriar} agendamento(s) para ${paciente.nome}...`);
            
            for (let i = 0; i < agendamentosParaCriar; i++) {
                try {
                    const agendamento = {
                        pacienteId: paciente.id,
                        medicoId: medicoId,
                        dataHora: gerarDataAgendamento().toISOString(),
                        tipo: 'CONSULTA_GERAL',
                        observacoes: `Consulta ${i + 1} - agendamento automático para teste`
                    };
                    
                    const response = await axios.post(`${API_BASE_URL}/agendamentos`, agendamento, { headers });
                    console.log(`   ✅ Agendamento ${i + 1} criado - ${new Date(agendamento.dataHora).toLocaleDateString()}`);
                    sucessos++;
                    
                    await new Promise(resolve => setTimeout(resolve, 150));
                    
                } catch (error) {
                    console.log(`   ❌ Erro no agendamento ${i + 1}: ${error.response?.data?.message || error.message}`);
                    erros++;
                }
            }
        }

        console.log(`\n=== RESULTADOS ===`);
        console.log(`✅ Agendamentos criados: ${sucessos}`);
        console.log(`❌ Erros: ${erros}`);

        // 5. Verificar totais finais
        console.log(`\n5. Verificando totais finais...`);
        const agendamentosFinais = await axios.get(`${API_BASE_URL}/agendamentos`, { headers });
        
        console.log(`📊 Sistema atualizado:`);
        console.log(`   • ${pacientes.length} pacientes`);
        console.log(`   • ${agendamentosFinais.data.length} agendamentos`);

        // 6. Estatísticas por paciente
        const estatisticasFinais = {};
        agendamentosFinais.data.forEach(a => {
            const paciente = pacientes.find(p => p.id === a.pacienteId);
            if (paciente) {
                if (!estatisticasFinais[paciente.nome]) {
                    estatisticasFinais[paciente.nome] = 0;
                }
                estatisticasFinais[paciente.nome]++;
            }
        });

        console.log(`\n📋 Agendamentos por paciente:`);
        Object.entries(estatisticasFinais)
            .sort(([,a], [,b]) => b - a)
            .forEach(([nome, quantidade]) => {
                console.log(`   ${nome}: ${quantidade} agendamento(s)`);
            });

        console.log(`\n🎉 Criação de agendamentos concluída!`);
        console.log(`🔄 Execute novamente criar-prontuarios-simples.js para gerar prontuários.`);

    } catch (error) {
        console.error('❌ Erro durante a criação:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Dados:', error.response.data);
        }
    }
}

// Executar
criarAgendamentosParaTodos();
