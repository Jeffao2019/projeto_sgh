const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

async function criarAgendamentosMesAnterior() {
    console.log('=== CRIAÇÃO DE AGENDAMENTOS DO MÊS ANTERIOR (OUTUBRO 2025) ===\n');

    try {
        // 1. Login
        console.log('1. Fazendo login...');
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: 'admin@sgh.com',
            password: '123456'
        });

        const token = loginResponse.data.token || loginResponse.data.access_token;
        if (!token) {
            console.log('Resposta do login:', loginResponse.data);
            throw new Error('Falha na autenticação - token não recebido');
        }

        const headers = { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        console.log('✅ Login realizado\n');

        // 2. Buscar pacientes e médicos existentes
        console.log('2. Buscando dados existentes...');
        
        const [pacientesResponse, medicosResponse] = await Promise.all([
            axios.get(`${API_BASE_URL}/pacientes`, { headers }),
            axios.get(`${API_BASE_URL}/auth/medicos`, { headers })
        ]);

        const pacientes = pacientesResponse.data;
        const medicos = medicosResponse.data;

        console.log(`✅ ${pacientes.length} pacientes encontrados`);
        console.log(`✅ ${medicos.length} médicos encontrados\n`);

        // 3. Criar agendamentos do mês anterior com diferentes status
        console.log('3. Criando agendamentos de outubro 2025...\n');

        const agendamentosData = [
            // Agendamentos para primeira quinzena de outubro
            { data: '2025-10-02', hora: '08:00', tipo: 'CONSULTA_GERAL', observacoes: 'Consulta de rotina cardiológica' },
            { data: '2025-10-02', hora: '14:30', tipo: 'CONSULTA_ESPECIALIZADA', observacoes: 'Acompanhamento pós-cirúrgico' },
            { data: '2025-10-03', hora: '09:15', tipo: 'CONSULTA_GERAL', observacoes: 'Consulta clínica geral' },
            { data: '2025-10-03', hora: '16:00', tipo: 'CONSULTA_ESPECIALIZADA', observacoes: 'Exame cardiológico preventivo' },
            { data: '2025-10-07', hora: '10:30', tipo: 'RETORNO', observacoes: 'Revisão de medicamentos' },
            { data: '2025-10-08', hora: '15:45', tipo: 'CONSULTA_GERAL', observacoes: 'Consulta de acompanhamento' },
            { data: '2025-10-09', hora: '08:30', tipo: 'CONSULTA_ESPECIALIZADA', observacoes: 'Avaliação clínica completa' },
            { data: '2025-10-10', hora: '11:15', tipo: 'RETORNO', observacoes: 'Consulta cardiológica de rotina' },
            
            // Agendamentos para segunda quinzena de outubro
            { data: '2025-10-15', hora: '09:00', tipo: 'CONSULTA_GERAL', observacoes: 'Consulta clínica de rotina' },
            { data: '2025-10-16', hora: '14:00', tipo: 'CONSULTA_ESPECIALIZADA', observacoes: 'Avaliação especializada' },
            { data: '2025-10-17', hora: '10:45', tipo: 'RETORNO', observacoes: 'Retorno para avaliação' },
            { data: '2025-10-21', hora: '16:30', tipo: 'CONSULTA_GERAL', observacoes: 'Consulta de acompanhamento' },
            { data: '2025-10-22', hora: '08:15', tipo: 'CONSULTA_ESPECIALIZADA', observacoes: 'Consulta especializada' },
            { data: '2025-10-23', hora: '13:30', tipo: 'RETORNO', observacoes: 'Retorno programado' },
            
            // Mix para final de outubro
            { data: '2025-10-24', hora: '09:30', tipo: 'CONSULTA_GERAL', observacoes: 'Consulta cardiológica urgente' },
            { data: '2025-10-25', hora: '15:00', tipo: 'CONSULTA_ESPECIALIZADA', observacoes: 'Avaliação médica especializada' },
            { data: '2025-10-28', hora: '11:00', tipo: 'RETORNO', observacoes: 'Avaliação clínica final' },
            { data: '2025-10-29', hora: '14:15', tipo: 'CONSULTA_GERAL', observacoes: 'Consulta de encerramento mensal' },
            { data: '2025-10-30', hora: '10:00', tipo: 'CONSULTA_ESPECIALIZADA', observacoes: 'Consulta especializada' },
            { data: '2025-10-31', hora: '16:45', tipo: 'RETORNO', observacoes: 'Consulta final de outubro' }
        ];

        let criadosCount = 0;
        let errosCount = 0;

        for (let i = 0; i < agendamentosData.length; i++) {
            const agendamento = agendamentosData[i];
            
            // Selecionar paciente e médico aleatoriamente
            const pacienteIndex = i % pacientes.length;
            const medicoIndex = i % medicos.length;
            
            const pacienteId = pacientes[pacienteIndex].id;
            const medicoId = medicos[medicoIndex].id;

            try {
                const novoAgendamento = {
                    pacienteId,
                    medicoId,
                    dataHora: `${agendamento.data}T${agendamento.hora}:00.000Z`,
                    tipo: agendamento.tipo,
                    observacoes: agendamento.observacoes
                };

                const response = await axios.post(`${API_BASE_URL}/agendamentos`, novoAgendamento, { headers });
                
                console.log(`✅ ${agendamento.tipo}: ${agendamento.data} ${agendamento.hora} - ${pacientes[pacienteIndex].nome}`);
                
                criadosCount++;

                // Pequena pausa para evitar sobrecarga
                await new Promise(resolve => setTimeout(resolve, 100));

            } catch (error) {
                console.log(`❌ Erro ao criar agendamento: ${agendamento.data} ${agendamento.hora}`);
                console.log(`   Erro: ${error.response?.data?.message || error.message}`);
                errosCount++;
            }
        }

        console.log('\n=== RESULTADOS ===');
        console.log(`✅ Agendamentos criados: ${criadosCount}`);
        console.log(`❌ Erros: ${errosCount}`);

        // 4. Verificar totais finais
        console.log('\n4. Verificando totais do sistema...');
        const agendamentosResponse = await axios.get(`${API_BASE_URL}/agendamentos`, { headers });
        const todosAgendamentos = agendamentosResponse.data;

        // Filtrar por mês
        const agendamentosOutubro = todosAgendamentos.filter(ag => 
            ag.dataHora.startsWith('2025-10')
        );
        
        const agendamentosNovembro = todosAgendamentos.filter(ag => 
            ag.dataHora.startsWith('2025-11')
        );

        console.log(`📊 Total de agendamentos no sistema: ${todosAgendamentos.length}`);
        console.log(`   📅 Outubro 2025: ${agendamentosOutubro.length} agendamentos`);
        console.log(`   📅 Novembro 2025: ${agendamentosNovembro.length} agendamentos`);

        // Estatísticas por status em outubro
        const outPendentes = agendamentosOutubro.filter(ag => ag.status === 'PENDENTE').length;
        const outConfirmados = agendamentosOutubro.filter(ag => ag.status === 'CONFIRMADO').length;
        const outCancelados = agendamentosOutubro.filter(ag => ag.status === 'CANCELADO').length;

        console.log(`\n📈 Outubro 2025 - Status:`);
        console.log(`   ⏳ Pendentes: ${outPendentes}`);
        console.log(`   ✅ Confirmados: ${outConfirmados}`);
        console.log(`   ❌ Cancelados: ${outCancelados}`);

        console.log('\n🎉 Agendamentos do mês anterior criados com sucesso!');

    } catch (error) {
        console.error('❌ Erro geral:', error.response?.data?.message || error.message);
    }
}

// Executar
criarAgendamentosMesAnterior();
