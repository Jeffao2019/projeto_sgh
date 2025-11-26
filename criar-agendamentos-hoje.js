const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

async function criarAgendamentosProximosDias() {
    console.log('=== CRIAÇÃO DE AGENDAMENTOS PARA OS PRÓXIMOS DIAS ===\n');

    try {
        // 1. Login
        console.log('1. Fazendo login...');
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: 'admin@sgh.com',
            password: '123456'
        });

        const token = loginResponse.data.token;
        const headers = { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        console.log('✅ Login realizado\n');

        // 2. Buscar pacientes e médicos
        console.log('2. Buscando dados existentes...');
        const [pacientesResponse, medicosResponse] = await Promise.all([
            axios.get(`${API_BASE_URL}/pacientes`, { headers }),
            axios.get(`${API_BASE_URL}/auth/medicos`, { headers })
        ]);

        const pacientes = pacientesResponse.data;
        const medicos = medicosResponse.data;

        console.log(`✅ ${pacientes.length} pacientes encontrados`);
        console.log(`✅ ${medicos.length} médicos encontrados\n`);

        // 3. Criar agendamentos para os próximos dias
        console.log('3. Criando agendamentos para os próximos dias...\n');

        const proximosDias = [
            // Amanhã (27/11/2025)
            { data: '2025-11-27', hora: '08:00', tipo: 'CONSULTA_GERAL', observacoes: 'Consulta de rotina matinal' },
            { data: '2025-11-27', hora: '09:00', tipo: 'CONSULTA_ESPECIALISTA', observacoes: 'Consulta cardiológica' },
            { data: '2025-11-27', hora: '10:00', tipo: 'RETORNO', observacoes: 'Retorno de acompanhamento' },
            { data: '2025-11-27', hora: '14:00', tipo: 'CONSULTA_GERAL', observacoes: 'Consulta vespertina' },
            { data: '2025-11-27', hora: '15:00', tipo: 'EXAME', observacoes: 'Exame de rotina' },
            { data: '2025-11-27', hora: '16:00', tipo: 'TELEMEDICINA', observacoes: 'Teleconsulta agendada' },

            // Quinta-feira (28/11/2025)
            { data: '2025-11-28', hora: '08:30', tipo: 'CONSULTA_GERAL', observacoes: 'Consulta quinta-feira manhã' },
            { data: '2025-11-28', hora: '09:30', tipo: 'CONSULTA_ESPECIALISTA', observacoes: 'Avaliação especializada' },
            { data: '2025-11-28', hora: '10:30', tipo: 'RETORNO', observacoes: 'Retorno pós-exame' },
            { data: '2025-11-28', hora: '14:30', tipo: 'CONSULTA_GERAL', observacoes: 'Consulta tarde quinta' },
            { data: '2025-11-28', hora: '15:30', tipo: 'EXAME', observacoes: 'Exame médico quinta' },

            // Sexta-feira (29/11/2025)
            { data: '2025-11-29', hora: '08:00', tipo: 'CONSULTA_GERAL', observacoes: 'Consulta sexta manhã' },
            { data: '2025-11-29', hora: '09:00', tipo: 'RETORNO', observacoes: 'Retorno sexta' },
            { data: '2025-11-29', hora: '10:00', tipo: 'CONSULTA_ESPECIALISTA', observacoes: 'Consulta especializada sexta' },
            { data: '2025-11-29', hora: '14:00', tipo: 'CONSULTA_GERAL', observacoes: 'Última consulta da semana' },

            // Segunda próxima (02/12/2025)
            { data: '2025-12-02', hora: '08:00', tipo: 'CONSULTA_GERAL', observacoes: 'Primeira consulta dezembro' },
            { data: '2025-12-02', hora: '09:00', tipo: 'CONSULTA_ESPECIALISTA', observacoes: 'Consulta cardiológica dezembro' },
            { data: '2025-12-02', hora: '10:00', tipo: 'RETORNO', observacoes: 'Retorno início dezembro' },
            { data: '2025-12-02', hora: '14:00', tipo: 'EXAME', observacoes: 'Exame dezembro' },
            { data: '2025-12-02', hora: '15:00', tipo: 'TELEMEDICINA', observacoes: 'Teleconsulta dezembro' }
        ];

        let criadosCount = 0;
        let errosCount = 0;

        for (let i = 0; i < proximosDias.length; i++) {
            const agendamento = proximosDias[i];
            
            // Selecionar paciente e médico rotacionalmente
            const pacienteIndex = i % pacientes.length;
            const medicoIndex = i % medicos.length;
            
            const paciente = pacientes[pacienteIndex];
            const medico = medicos[medicoIndex];

            try {
                const novoAgendamento = {
                    pacienteId: paciente.id,
                    medicoId: medico.id,
                    dataHora: `${agendamento.data}T${agendamento.hora}:00.000Z`,
                    tipo: agendamento.tipo,
                    observacoes: agendamento.observacoes
                };

                const response = await axios.post(`${API_BASE_URL}/agendamentos`, novoAgendamento, { headers });
                
                console.log(`✅ ${agendamento.data} ${agendamento.hora} - ${agendamento.tipo}: ${paciente.nome} com ${medico.nome}`);
                
                criadosCount++;

                // Pausa para evitar sobrecarga
                await new Promise(resolve => setTimeout(resolve, 100));

            } catch (error) {
                console.log(`❌ Erro ao criar agendamento ${agendamento.data} ${agendamento.hora}`);
                console.log(`   Erro: ${error.response?.data?.message || error.message}`);
                errosCount++;
            }
        }

        console.log('\n=== RESULTADOS ===');
        console.log(`✅ Agendamentos criados para próximos dias: ${criadosCount}`);
        console.log(`❌ Erros: ${errosCount}`);

        // 4. Verificar agendamentos futuros
        console.log('\n4. Verificando agendamentos futuros...');
        const agendamentosResponse = await axios.get(`${API_BASE_URL}/agendamentos`, { headers });
        const todosAgendamentos = agendamentosResponse.data;

        const agendamentosFuturos = todosAgendamentos.filter(ag => 
            new Date(ag.dataHora) > new Date('2025-11-26')
        );

        console.log(`📅 Total de agendamentos futuros: ${agendamentosFuturos.length}`);

        // Agrupar por data
        const agendamentosPorData = {};
        agendamentosFuturos.forEach(ag => {
            const data = ag.dataHora.split('T')[0];
            if (!agendamentosPorData[data]) agendamentosPorData[data] = [];
            agendamentosPorData[data].push(ag);
        });

        console.log('\n📋 AGENDA DOS PRÓXIMOS DIAS:');
        Object.keys(agendamentosPorData).sort().forEach(data => {
            const agendamentosData = agendamentosPorData[data];
            const dataFormatada = new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
            
            console.log(`\n� ${dataFormatada} (${agendamentosData.length} agendamentos):`);
            
            agendamentosData.sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora));
            agendamentosData.forEach(ag => {
                const hora = new Date(ag.dataHora).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'});
                const paciente = pacientes.find(p => p.id === ag.pacienteId);
                const medico = medicos.find(m => m.id === ag.medicoId);
                
                console.log(`     🕒 ${hora} - ${ag.tipo} - ${paciente?.nome || 'N/A'} com ${medico?.nome || 'N/A'}`);
            });
        });

        console.log('\n🎉 Agendamentos futuros criados com sucesso!');
        console.log('📋 O sistema agora tem uma agenda completa para os próximos dias!');

    } catch (error) {
        console.error('❌ Erro geral:', error.response?.data?.message || error.message);
    }
}

// Executar
criarAgendamentosProximosDias();
