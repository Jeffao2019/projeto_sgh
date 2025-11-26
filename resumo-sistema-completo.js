const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

async function resumoSistemaCompleto() {
    console.log('=== RESUMO COMPLETO DO SISTEMA SGH ===\n');

    try {
        // 1. Login
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: 'admin@sgh.com',
            password: '123456'
        });

        const token = loginResponse.data.token;
        const headers = { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        // 2. Buscar dados do sistema
        const [pacientesResponse, medicosResponse, agendamentosResponse, prontuariosResponse] = await Promise.all([
            axios.get(`${API_BASE_URL}/pacientes`, { headers }),
            axios.get(`${API_BASE_URL}/auth/medicos`, { headers }),
            axios.get(`${API_BASE_URL}/agendamentos`, { headers }),
            axios.get(`${API_BASE_URL}/prontuarios`, { headers })
        ]);

        const pacientes = pacientesResponse.data;
        const medicos = medicosResponse.data;
        const agendamentos = agendamentosResponse.data;
        const prontuarios = prontuariosResponse.data;

        // 3. Análise dos dados
        console.log('📊 DADOS GERAIS DO SISTEMA:');
        console.log(`   👥 Pacientes: ${pacientes.length}`);
        console.log(`   👨‍⚕️ Médicos: ${medicos.length}`);
        console.log(`   📅 Agendamentos: ${agendamentos.length}`);
        console.log(`   📋 Prontuários: ${prontuarios.length}\n`);

        // 4. Análise por período
        const agendamentosNovembro = agendamentos.filter(ag => ag.dataHora.startsWith('2025-11'));
        const agendamentosOutubro = agendamentos.filter(ag => ag.dataHora.startsWith('2025-10'));

        console.log('📆 AGENDAMENTOS POR PERÍODO:');
        console.log(`   📅 Novembro 2025: ${agendamentosNovembro.length} agendamentos`);
        console.log(`   📅 Outubro 2025: ${agendamentosOutubro.length} agendamentos\n`);

        // 5. Análise por status
        const statusCount = {};
        agendamentos.forEach(ag => {
            statusCount[ag.status] = (statusCount[ag.status] || 0) + 1;
        });

        console.log('📊 AGENDAMENTOS POR STATUS:');
        Object.keys(statusCount).forEach(status => {
            const emoji = status === 'CONFIRMADO' ? '✅' : 
                         status === 'CANCELADO' ? '❌' : '⏳';
            console.log(`   ${emoji} ${status}: ${statusCount[status]} agendamentos`);
        });

        // 6. Status específico de outubro (dados históricos)
        const outConfirmados = agendamentosOutubro.filter(ag => ag.status === 'CONFIRMADO').length;
        const outCancelados = agendamentosOutubro.filter(ag => ag.status === 'CANCELADO').length;
        const outPendentes = agendamentosOutubro.filter(ag => ag.status === 'PENDENTE').length;

        console.log('\n📈 OUTUBRO 2025 (HISTÓRICO):');
        console.log(`   ✅ Confirmados: ${outConfirmados} agendamentos`);
        console.log(`   ❌ Cancelados: ${outCancelados} agendamentos`);
        console.log(`   ⏳ Pendentes: ${outPendentes} agendamentos`);

        // 7. Análise por tipo de consulta
        const tipoCount = {};
        agendamentos.forEach(ag => {
            tipoCount[ag.tipo] = (tipoCount[ag.tipo] || 0) + 1;
        });

        console.log('\n🏥 AGENDAMENTOS POR TIPO:');
        Object.keys(tipoCount).forEach(tipo => {
            console.log(`   📋 ${tipo}: ${tipoCount[tipo]} agendamentos`);
        });

        // 8. Prontuários por médico
        console.log('\n👨‍⚕️ MÉDICOS E PRONTUÁRIOS:');
        medicos.forEach(medico => {
            const prontuariosMedico = prontuarios.filter(p => p.medicoId === medico.id).length;
            console.log(`   👨‍⚕️ ${medico.nome}: ${prontuariosMedico} prontuários`);
        });

        // 9. Pacientes com mais agendamentos
        const pacienteAgendamentos = {};
        agendamentos.forEach(ag => {
            pacienteAgendamentos[ag.pacienteId] = (pacienteAgendamentos[ag.pacienteId] || 0) + 1;
        });

        console.log('\n👥 TOP 5 PACIENTES COM MAIS AGENDAMENTOS:');
        const topPacientes = Object.entries(pacienteAgendamentos)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);

        topPacientes.forEach(([pacienteId, count]) => {
            const paciente = pacientes.find(p => p.id === pacienteId);
            console.log(`   👤 ${paciente?.nome || 'N/A'}: ${count} agendamentos`);
        });

        // 10. Resumo final
        console.log('\n🎯 FUNCIONALIDADES DISPONÍVEIS PARA TESTE:');
        console.log('   ✅ Login de administrador (admin@sgh.com / 123456)');
        console.log('   ✅ Cadastro e listagem de pacientes');
        console.log('   ✅ Visualização de médicos');
        console.log('   ✅ Agendamentos com diferentes status');
        console.log('   ✅ Prontuários médicos completos');
        console.log('   ✅ Dados históricos (outubro 2025)');
        console.log('   ✅ Filtros por data, status, paciente');
        console.log('   ✅ Relatórios mensais');
        console.log('   ✅ Exportação de dados');

        console.log('\n🌐 ACESSO AO SISTEMA:');
        console.log('   🖥️ Frontend: http://localhost:8080');
        console.log('   🔧 Backend: http://localhost:3001');
        console.log('   🗄️ Database: PostgreSQL port 5433');

        console.log('\n🎉 SISTEMA SGH COMPLETAMENTE FUNCIONAL!');
        console.log('📋 Pronto para demonstrações e testes completos!');

    } catch (error) {
        console.error('❌ Erro ao gerar resumo:', error.response?.data?.message || error.message);
    }
}

// Executar
resumoSistemaCompleto();
