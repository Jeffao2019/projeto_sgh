const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

async function criarProntuariosOutubro() {
    console.log('=== CRIAÇÃO DE PRONTUÁRIOS PARA AGENDAMENTOS DE OUTUBRO ===\n');

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

        // 2. Buscar agendamentos de outubro CONFIRMADOS
        console.log('2. Buscando agendamentos confirmados de outubro...');
        const agendamentosResponse = await axios.get(`${API_BASE_URL}/agendamentos`, { headers });
        const todosAgendamentos = agendamentosResponse.data;

        // Filtrar agendamentos de outubro que estão CONFIRMADOS
        const agendamentosOutubro = todosAgendamentos.filter(ag => 
            ag.dataHora.startsWith('2025-10') && ag.status === 'CONFIRMADO'
        );

        console.log(`✅ Encontrados ${agendamentosOutubro.length} agendamentos confirmados em outubro\n`);

        if (agendamentosOutubro.length === 0) {
            console.log('⚠️ Nenhum agendamento confirmado encontrado para outubro');
            return;
        }

        // 3. Verificar prontuários existentes
        console.log('3. Verificando prontuários existentes...');
        const prontuariosResponse = await axios.get(`${API_BASE_URL}/prontuarios`, { headers });
        const prontuariosExistentes = prontuariosResponse.data;

        // Filtrar agendamentos que ainda não têm prontuário
        const agendamentosSemProntuario = agendamentosOutubro.filter(ag => 
            !prontuariosExistentes.some(p => p.agendamentoId === ag.id)
        );

        console.log(`📋 ${prontuariosExistentes.length} prontuários já existem no sistema`);
        console.log(`📝 ${agendamentosSemProntuario.length} agendamentos de outubro precisam de prontuários\n`);

        // 4. Criar prontuários para agendamentos de outubro
        console.log('4. Criando prontuários para agendamentos de outubro...\n');

        let criadosCount = 0;
        let errosCount = 0;

        // Dados médicos variados para os prontuários
        const dadosMedicos = [
            {
                anamnese: 'Paciente relata episódios de dor precordial aos esforços há 2 semanas, acompanhada de dispnéia. Nega síncope. HAS controlada com medicação.',
                exameFisico: 'BEG, corado, hidratado. PA: 140/90 mmHg, FC: 85 bpm. Ausculta cardíaca com sopro sistólico discreto em foco aórtico. Pulsos periféricos palpáveis.',
                diagnostico: 'Hipertensão arterial leve, suspeita de estenose aórtica',
                prescricao: 'Losartana 50mg 1x/dia pela manhã. Solicitar ecocardiograma. Retorno em 30 dias.'
            },
            {
                anamnese: 'Quadro de cefaléia occipital há 1 mês, associada a tonturas matinais. Paciente hipertenso irregular com medicações.',
                exameFisico: 'BEG, corado, hidratado. PA: 160/100 mmHg, FC: 92 bpm. Exame neurológico normal, fundoscopia com cruzamentos arteriovenosos.',
                diagnostico: 'Hipertensão arterial moderada descompensada',
                prescricao: 'Enalapril 10mg 12/12h, Amlodipina 5mg 1x/dia pela manhã. Controle pressórico domiciliar. Retorno em 15 dias.'
            },
            {
                anamnese: 'Dor epigástrica há 3 dias, acompanhada de náuseas e vômitos ocasionais. Nega febre. Relata uso frequente de AINEs.',
                exameFisico: 'BEG, corado, hidratado. PA: 120/80 mmHg, FC: 78 bpm. Abdomen doloroso à palpação em epigástrio, sem sinais de irritação peritoneal.',
                diagnostico: 'Gastrite aguda medicamentosa',
                prescricao: 'Omeprazol 40mg 1x/dia em jejum por 30 dias. Dieta leve, evitar AINEs. Retorno se necessário.'
            },
            {
                anamnese: 'Dispnéia progressiva aos esforços há 1 mês, evoluindo com edema em membros inferiores. Nega dor torácica.',
                exameFisico: 'REG, corado, hidratado. PA: 130/85 mmHg, FC: 95 bpm. Estertores crepitantes em bases pulmonares, edema +2/+4 em MMII.',
                diagnostico: 'Insuficiência cardíaca congestiva NYHA II',
                prescricao: 'Furosemida 40mg 1x/dia pela manhã, Carvedilol 3,25mg 2x/dia. Restrição de sal para 2g/dia. Retorno em 15 dias.'
            },
            {
                anamnese: 'Paciente assintomático, procura consulta preventiva de rotina. Nega queixas específicas.',
                exameFisico: 'BEG, corado, hidratado. PA: 115/75 mmHg, FC: 70 bpm. Exame físico geral normal, sem alterações significativas.',
                diagnostico: 'Paciente hígido - consulta preventiva',
                prescricao: 'Manter hábitos saudáveis, atividade física regular. Retorno anual ou se necessário.'
            }
        ];

        for (let i = 0; i < agendamentosSemProntuario.length; i++) {
            const agendamento = agendamentosSemProntuario[i];
            
            // Selecionar dados médicos aleatoriamente
            const dadosIndex = i % dadosMedicos.length;
            const dados = dadosMedicos[dadosIndex];

            try {
                const novoProntuario = {
                    pacienteId: agendamento.pacienteId,
                    medicoId: agendamento.medicoId,
                    agendamentoId: agendamento.id,
                    dataConsulta: agendamento.dataHora,
                    anamnese: dados.anamnese,
                    exameFisico: dados.exameFisico,
                    diagnostico: dados.diagnostico,
                    prescricao: dados.prescricao,
                    observacoes: `Prontuário criado para consulta histórica de ${new Date(agendamento.dataHora).toLocaleDateString('pt-BR')} - Consulta de outubro 2025`
                };

                const response = await axios.post(`${API_BASE_URL}/prontuarios`, novoProntuario, { headers });
                
                const dataConsulta = new Date(agendamento.dataHora).toLocaleDateString('pt-BR');
                console.log(`✅ Prontuário criado para consulta de ${dataConsulta} - ${dados.diagnostico}`);
                
                criadosCount++;

                // Pausa para evitar sobrecarga
                await new Promise(resolve => setTimeout(resolve, 150));

            } catch (error) {
                console.log(`❌ Erro ao criar prontuário para agendamento ${agendamento.id.substring(0, 8)}...`);
                console.log(`   Erro: ${error.response?.data?.message || error.message}`);
                errosCount++;
            }
        }

        console.log('\n=== RESULTADOS ===');
        console.log(`✅ Prontuários criados: ${criadosCount}`);
        console.log(`❌ Erros: ${errosCount}`);

        // 5. Verificar totais finais
        console.log('\n5. Verificando totais finais...');
        const prontuariosFinaisResponse = await axios.get(`${API_BASE_URL}/prontuarios`, { headers });
        const todosProntuarios = prontuariosFinaisResponse.data;

        console.log(`📊 Total de prontuários no sistema: ${todosProntuarios.length}`);
        console.log(`   📋 Novembro 2025: ${todosProntuarios.filter(p => p.createdAt.startsWith('2025-11')).length}`);
        console.log(`   📋 Outubro 2025: ${criadosCount} (criados agora)`);

        console.log('\n🎉 Prontuários para outubro criados com sucesso!');
        console.log('📋 Agora você tem dados históricos completos para testes de relatórios e filtros!');

    } catch (error) {
        console.error('❌ Erro geral:', error.response?.data?.message || error.message);
    }
}

// Executar
criarProntuariosOutubro();
