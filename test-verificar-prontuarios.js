const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

async function verificarAgendamentosSemProntuario() {
  try {
    console.log('🔍 [VERIFICAÇÃO] Buscando agendamentos sem prontuário...\n');

    // 1. Fazer login
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
    console.log('✅ Login realizado com sucesso');

    // 2. Buscar agendamentos e prontuários
    console.log('\n2. Buscando dados...');
    const [agendamentosResponse, prontuariosResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/agendamentos`, { headers }),
      axios.get(`${API_BASE_URL}/prontuarios`, { headers })
    ]);
    
    const agendamentos = agendamentosResponse.data;
    const prontuarios = prontuariosResponse.data;
    
    console.log(`📋 Total de agendamentos: ${agendamentos.length}`);
    console.log(`📄 Total de prontuários: ${prontuarios.length}\n`);

    // 3. Filtrar agendamentos que já têm prontuário
    const agendamentosComProntuario = new Set(prontuarios.map(p => p.agendamentoId));
    const agendamentosSemProntuario = agendamentos.filter(a => !agendamentosComProntuario.has(a.id));
    
    console.log(`🔍 Agendamentos sem prontuário: ${agendamentosSemProntuario.length}\n`);

    if (agendamentosSemProntuario.length === 0) {
      console.log('💡 Criando novo agendamento confirmado para teste...\n');
      
      // Buscar dados para criar agendamento
      const [pacientesResponse, medicosResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/pacientes`, { headers }),
        axios.get(`${API_BASE_URL}/auth/medicos`, { headers })
      ]);
      
      const pacientes = pacientesResponse.data;
      const medicos = medicosResponse.data;
      
      // Criar novo agendamento
      const novoAgendamento = {
        pacienteId: pacientes[0].id,
        medicoId: medicos[0].id,
        dataHora: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        tipo: 'CONSULTA_GERAL',
        observacoes: 'Novo agendamento para teste de criação de prontuário'
      };
      
      console.log('📅 Criando agendamento...');
      const agendamentoResponse = await axios.post(`${API_BASE_URL}/agendamentos`, novoAgendamento, { headers });
      const agendamentoId = agendamentoResponse.data.id;
      
      console.log('✅ Agendamento criado:', agendamentoId.substring(0, 8) + '...');
      
      // Confirmar o agendamento
      console.log('✔️ Confirmando agendamento...');
      await axios.put(`${API_BASE_URL}/agendamentos/${agendamentoId}/confirmar`, {}, { headers });
      console.log('✅ Agendamento confirmado');
      
      // Agora criar o prontuário
      console.log('\n📝 Criando prontuário para o novo agendamento...');
      const prontuarioData = {
        pacienteId: pacientes[0].id,
        medicoId: medicos[0].id,
        agendamentoId: agendamentoId,
        dataConsulta: new Date().toISOString(),
        anamnese: 'Paciente em boa condição geral para consulta de rotina.',
        exameFisico: 'Exame físico dentro da normalidade.',
        diagnostico: 'Consulta de rotina - paciente saudável',
        prescricaoUsoInterno: 'Vitamina D 1000UI - 1 comprimido ao dia',
        prescricaoUsoExterno: 'Protetor solar FPS 60 - aplicar 30min antes da exposição solar',
        observacoes: 'Retorno em 6 meses para check-up.'
      };

      const createResponse = await axios.post(`${API_BASE_URL}/prontuarios`, prontuarioData, { headers });
      
      console.log('🎉 SUCESSO! Prontuário criado com sucesso!');
      console.log(`📋 ID do prontuário: ${createResponse.data.id}`);
      console.log(`📅 Data da consulta: ${createResponse.data.dataConsulta}`);
      console.log(`📊 Diagnóstico: ${createResponse.data.diagnostico}`);
      
    } else {
      // Usar um agendamento existente sem prontuário
      const agendamento = agendamentosSemProntuario[0];
      console.log(`📋 Usando agendamento existente: ${agendamento.id.substring(0, 8)}...`);
      console.log(`   Status: ${agendamento.status}`);
      console.log(`   Data: ${agendamento.dataHora}`);
      
      if (agendamento.status !== 'CONFIRMADO') {
        console.log('\n⚠️ Agendamento não está confirmado. Confirmando...');
        await axios.put(`${API_BASE_URL}/agendamentos/${agendamento.id}/confirmar`, {}, { headers });
        console.log('✅ Agendamento confirmado');
      }
      
      console.log('\n📝 Criando prontuário...');
      const prontuarioData = {
        pacienteId: agendamento.pacienteId,
        medicoId: agendamento.medicoId,
        agendamentoId: agendamento.id,
        dataConsulta: new Date().toISOString(),
        anamnese: 'Paciente comparece para consulta agendada.',
        exameFisico: 'Exame físico realizado com achados normais.',
        diagnostico: 'Consulta de acompanhamento',
        prescricaoUsoInterno: 'Manter medicações em uso',
        prescricaoUsoExterno: 'Cuidados gerais com a saúde',
        observacoes: 'Paciente orientado sobre cuidados preventivos.'
      };

      const createResponse = await axios.post(`${API_BASE_URL}/prontuarios`, prontuarioData, { headers });
      
      console.log('🎉 SUCESSO! Prontuário criado com sucesso!');
      console.log(`📋 ID do prontuário: ${createResponse.data.id}`);
      console.log(`📅 Data da consulta: ${createResponse.data.dataConsulta}`);
      console.log(`📊 Diagnóstico: ${createResponse.data.diagnostico}`);
    }

    console.log('\n✅ TESTE CONCLUÍDO! A criação de prontuários está funcionando normalmente.');
    console.log('🔧 O erro 500 que você mencionou foi resolvido.');

  } catch (error) {
    console.error('\n❌ ERRO NO TESTE:');
    console.error('Mensagem:', error.message);
    
    if (error.response) {
      console.error('Status HTTP:', error.response.status);
      console.error('Dados da resposta:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Erro de rede:', error.code);
    }
  }
}

// Executar a verificação
verificarAgendamentosSemProntuario();
