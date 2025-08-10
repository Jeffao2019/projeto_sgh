const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

// Dados realistas para prontuários médicos
const anamneseExemplos = [
    'Paciente relata dor de cabeça persistente há 3 dias, de intensidade moderada, sem fatores de melhora ou piora específicos. Nega febre, náuseas ou alterações visuais.',
    'Refere febre baixa (37.5°C) há 2 dias, acompanhada de mal-estar geral, cefaleia e mialgia. Iniciou uso de paracetamol com melhora parcial dos sintomas.',
    'Queixa-se de dor epigástrica em queimação, principalmente após refeições, há 1 semana. Nega vômitos, diarreia ou alterações significativas do apetite.',
    'Apresenta tosse seca persistente há 5 dias, inicialmente noturna, agora durante todo o dia. Refere leve falta de ar aos esforços e nega febre.',
    'Dor lombar baixa há 1 semana, com irradiação para membro inferior direito. Piora com movimentos e melhora parcialmente com repouso.',
    'Paciente assintomático, comparece para consulta de rotina e check-up geral. Nega queixas específicas no momento.',
    'Dor precordial tipo pontada há 2 dias, principalmente ao respirar fundo. Nega dispneia de repouso, palpitações ou síncope.',
    'Episódios de tontura rotatória há 3 dias, principalmente ao levantar da cama. Acompanhado de náuseas leves, sem vômitos.',
    'Insônia há 2 semanas, com dificuldade para iniciar o sono. Refere preocupações relacionadas ao trabalho e ansiedade.',
    'Dor e rigidez nos joelhos bilateralmente, principalmente pela manhã. Melhora com movimentação e atividade física leve.',
    'Coriza, espirros e obstrução nasal há 2 dias. Refere contato próximo com familiar resfriado.',
    'Paciente hipertenso conhecindo, em acompanhamento. Última medição domiciliar: 150x95 mmHg. Nega sintomas relacionados.',
    'Diabético tipo 2, refere polidipsia e poliúria nas últimas semanas. Glicemia capilar atual: 190 mg/dL.',
    'Dor muscular intensa em membros inferiores após exercício físico intenso realizado ontem. Refere câimbras noturnas.',
    'Espirros frequentes, coriza e prurido ocular há 1 semana. Piora em ambientes empoeirados.'
];

const examesFisicos = [
    'Paciente em bom estado geral, corado, hidratado, anictérico. PA: 120x80 mmHg, FC: 72 bpm, FR: 16 irpm, Tax: 36.5°C. Ausculta cardiopulmonar normal.',
    'REG, corado, hidratado. Sinais vitais: PA 110x70, FC 80, Tax 37.2°C. Orofaringe hiperemiada. Linfonodos cervicais palpáveis.',
    'BEG, corado, hidratado. PA: 130x85, FC: 68. Abdome doloroso à palpação em epigástrio, sem sinais de irritação peritoneal.',
    'REG, discretamente dispneico. PA: 125x80, FC: 88, FR: 22. Ausculta pulmonar com roncos difusos bilateralmente.',
    'BEG, em posição antálgica. Exame da coluna lombar com limitação da flexão. Sinal de Lasègue positivo à direita.',
    'Excelente estado geral, corado, hidratado. Sinais vitais normais. Exame físico geral sem alterações significativas.',
    'BEG, corado, hidratado. PA: 115x75, FC: 70. Ausculta cardíaca com bulhas normofonéticas. Dor à palpação do gradil costal.',
    'REG, corado, hidratado. PA: 100x60, FC: 60. Exame neurológico com nistagmo horizontal. Romberg positivo.',
    'BEG, ansioso, corado, hidratado. Sinais vitais normais. Exame físico sem alterações. Paciente refere tensão muscular.',
    'BEG, corado. Exame dos joelhos com discreto edema e crepitação à mobilização. Amplitude de movimento preservada.',
    'REG, corado, hidratado. Rinoscopia com mucosa hiperemiada e secreção serosa. Orofaringe normal.',
    'BEG, corado, hidratado. PA: 150x95 mmHg confirmada após repouso. Ausculta cardíaca normal. Fundo de olho a esclarecer.',
    'REG, corado, hidratado, obeso (IMC 31). Glicemia capilar: 190 mg/dL. Exame dos pés sem lesões.',
    'BEG, corado. Exame dos membros inferiores com dor à palpação da musculatura posterior. Força muscular preservada.',
    'REG, corado. Conjuntivas hiperemiadas. Rinoscopia com mucosa edemaciada. Ausculta pulmonar com sibilos esparsos.'
];

const diagnosticos = [
    'Cefaleia tensional',
    'Síndrome gripal',
    'Dispepsia funcional',
    'Bronquite aguda',
    'Lombalgia mecânica',
    'Paciente hígido - exame normal',
    'Dor torácica atípica',
    'Vertigem posicional paroxística benigna',
    'Insônia primária com ansiedade',
    'Artrose de joelhos',
    'Rinofaringite viral',
    'Hipertensão arterial sistêmica',
    'Diabetes mellitus tipo 2 descompensado',
    'Mialgia pós-exercício',
    'Rinite alérgica'
];

const prescricoes = [
    'Paracetamol 750mg, 1 cp de 8/8h por 5 dias se dor. Orientações sobre higiene do sono e controle do estresse.',
    'Paracetamol 750mg se febre. Hidratação oral abundante. Repouso domiciliar. Retorno se piora.',
    'Omeprazol 20mg, 1 cp em jejum por 14 dias. Orientações dietéticas: evitar frituras e condimentos.',
    'Salbutamol spray: 2 jatos se falta de ar. Expectorante xarope. Hidratação. Evitar irritantes.',
    'Ibuprofeno 600mg de 8/8h por 7 dias com alimento. Repouso relativo. Encaminhamento para fisioterapia.',
    'Manter hábitos saudáveis. Retorno em 6 meses. Exames laboratoriais de rotina solicitados.',
    'Orientação para repouso. Retorno em 48h se persistência dos sintomas. Evitar esforços físicos.',
    'Orientações sobre manobras de reposicionamento. Betaistina 24mg de 12/12h por 7 dias.',
    'Orientações sobre higiene do sono. Melatonina 3mg ao deitar. Técnicas de relaxamento.',
    'Anti-inflamatório tópico. Glucosamina 1,5g/dia. Exercícios de fortalecimento orientados.',
    'Sintomáticos. Lavagem nasal com soro fisiológico. Repouso. Isolamento enquanto sintomático.',
    'Ajuste da medicação: Losartana 50mg/dia. Orientações dietéticas. Retorno em 15 dias.',
    'Orientações sobre dieta hipoglicídica. Ajuste da metformina para 850mg 12/12h. Retorno em 30 dias.',
    'Repouso, aplicação de gelo local. Alongamentos leves. Anti-inflamatório se necessário.',
    'Loratadina 10mg/dia. Spray nasal com corticoide. Evitar alérgenos. Retorno em 4 semanas.'
];

function gerarDataConsultaPassada() {
    // Gera datas entre 30 dias atrás e hoje
    const hoje = new Date();
    const trintaDiasAtras = new Date(hoje.getTime() - (30 * 24 * 60 * 60 * 1000));
    const timestamp = trintaDiasAtras.getTime() + Math.random() * (hoje.getTime() - trintaDiasAtras.getTime());
    return new Date(timestamp);
}

async function criarProntuariosSimplificado() {
    console.log('=== GERAÇÃO DE PRONTUÁRIOS SIMPLIFICADA ===\n');

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

        // 2. Buscar agendamentos existentes
        console.log('\n2. Buscando agendamentos disponíveis...');
        const agendamentosResponse = await axios.get(`${API_BASE_URL}/agendamentos`, { headers });
        const agendamentos = agendamentosResponse.data;
        console.log(`✅ Encontrados ${agendamentos.length} agendamentos`);

        if (agendamentos.length === 0) {
            console.log('❌ Nenhum agendamento encontrado. Não é possível criar prontuários.');
            return;
        }

        // 3. Buscar prontuários existentes para evitar duplicatas
        console.log('\n3. Verificando prontuários existentes...');
        const prontuariosResponse = await axios.get(`${API_BASE_URL}/prontuarios`, { headers });
        const agendamentosComProntuario = new Set(prontuariosResponse.data.map(p => p.agendamentoId));
        console.log(`📋 ${prontuariosResponse.data.length} prontuários já existem`);

        // 4. Filtrar agendamentos sem prontuário
        const agendamentosSemProntuario = agendamentos.filter(a => !agendamentosComProntuario.has(a.id));
        console.log(`📝 ${agendamentosSemProntuario.length} agendamentos sem prontuário`);

        if (agendamentosSemProntuario.length === 0) {
            console.log('✅ Todos os agendamentos já possuem prontuários!');
            return;
        }

        // 5. Criar prontuários para agendamentos sem prontuário
        console.log('\n4. Gerando prontuários...\n');
        
        let sucessos = 0;
        let erros = 0;

        for (const agendamento of agendamentosSemProntuario) {
            try {
                const index = Math.floor(Math.random() * anamneseExemplos.length);
                
                const prontuario = {
                    pacienteId: agendamento.pacienteId,
                    medicoId: agendamento.medicoId,
                    agendamentoId: agendamento.id,
                    dataConsulta: agendamento.dataHora,
                    anamnese: anamneseExemplos[index],
                    exameFisico: examesFisicos[index],
                    diagnostico: diagnosticos[index],
                    prescricao: prescricoes[index],
                    observacoes: 'Consulta realizada conforme agendamento. Paciente orientado sobre tratamento.'
                };
                
                const response = await axios.post(`${API_BASE_URL}/prontuarios`, prontuario, { headers });
                console.log(`✅ Prontuário criado para agendamento ${agendamento.id.substring(0, 8)}... - ID: ${response.data.id.substring(0, 8)}...`);
                sucessos++;
                
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (error) {
                console.log(`❌ Erro no agendamento ${agendamento.id.substring(0, 8)}...: ${error.response?.data?.message || error.message}`);
                erros++;
            }
        }

        console.log(`\n=== RESULTADOS ===`);
        console.log(`✅ Prontuários criados: ${sucessos}`);
        console.log(`❌ Erros: ${erros}`);

        // 6. Verificar totais finais
        console.log(`\n5. Verificando totais finais...`);
        const prontuariosFinais = await axios.get(`${API_BASE_URL}/prontuarios/with-relations`, { headers });
        const agendamentosFinais = await axios.get(`${API_BASE_URL}/agendamentos`, { headers });
        const pacientesFinais = await axios.get(`${API_BASE_URL}/pacientes`, { headers });

        console.log(`📊 Sistema atualizado:`);
        console.log(`   • ${pacientesFinais.data.length} pacientes`);
        console.log(`   • ${agendamentosFinais.data.length} agendamentos`);
        console.log(`   • ${prontuariosFinais.data.length} prontuários`);

        // 7. Estatísticas por paciente
        if (prontuariosFinais.data.length > 0) {
            console.log(`\n📋 Prontuários por paciente:`);
            const estatisticas = {};
            
            prontuariosFinais.data.forEach(p => {
                const nome = p.paciente.nome;
                if (!estatisticas[nome]) {
                    estatisticas[nome] = 0;
                }
                estatisticas[nome]++;
            });
            
            Object.entries(estatisticas)
                .sort(([,a], [,b]) => b - a)
                .forEach(([nome, quantidade]) => {
                    console.log(`   ${nome}: ${quantidade} prontuário(s)`);
                });
        }

        console.log(`\n🎉 Geração concluída!`);
        console.log(`🔍 Acesse: http://localhost:8081/pacientes para testar a navegação completa.`);

    } catch (error) {
        console.error('❌ Erro durante a geração:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Dados:', error.response.data);
        }
    }
}

// Executar
criarProntuariosSimplificado();
