const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const PRONTUARIO_ID = '9fd941f5-cb77-4df2-a76c-29895b976c5d';

async function testarEdicaoProntuario() {
  try {
    console.log('🔄 Testando edição de prontuário...\n');

    // 1. Fazer login
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'dr.teste.agendamento@teste.com',
      password: '123456'
    });

    const token = loginResponse.data.token;
    console.log('✅ Login realizado com sucesso');

    // 2. Buscar o prontuário antes da edição
    const prontuarioAntesResponse = await axios.get(`${BASE_URL}/prontuarios/${PRONTUARIO_ID}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log('\n📋 Dados ANTES da edição:');
    console.log('Anamnese:', prontuarioAntesResponse.data.anamnese);
    console.log('Exame Físico:', prontuarioAntesResponse.data.exameFisico);
    console.log('Diagnóstico:', prontuarioAntesResponse.data.diagnostico);
    console.log('Prescrição:', prontuarioAntesResponse.data.prescricao);

    // 3. Editar o prontuário
    const dadosEdicao = {
      anamnese: "ANAMNESE EDITADA - Paciente relata dor de cabeça há 3 dias",
      exameFisico: "EXAME FÍSICO EDITADO - PA: 140/90 mmHg, FC: 80 bpm, ausculta pulmonar limpa, abdome sem alterações",
      diagnostico: "DIAGNÓSTICO EDITADO - Cefaléia tensional + Hipertensão arterial leve",
      prescricao: "PRESCRIÇÃO EDITADA - Paracetamol 750mg 8/8h, Captopril 25mg 12/12h",
      observacoes: "OBSERVAÇÕES EDITADAS - Orientado sobre hábitos alimentares saudáveis"
    };

    console.log('\n🔄 Editando prontuário...');
    const edicaoResponse = await axios.put(`${BASE_URL}/prontuarios/${PRONTUARIO_ID}`, dadosEdicao, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Prontuário editado com sucesso!');

    // 4. Buscar o prontuário após a edição
    const prontuarioDepoisResponse = await axios.get(`${BASE_URL}/prontuarios/${PRONTUARIO_ID}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log('\n📋 Dados DEPOIS da edição:');
    console.log('Anamnese:', prontuarioDepoisResponse.data.anamnese);
    console.log('Exame Físico:', prontuarioDepoisResponse.data.exameFisico);
    console.log('Diagnóstico:', prontuarioDepoisResponse.data.diagnostico);
    console.log('Prescrição:', prontuarioDepoisResponse.data.prescricao);
    console.log('Observações:', prontuarioDepoisResponse.data.observacoes);

    // 5. Verificar com relations também
    const withRelationsResponse = await axios.get(`${BASE_URL}/prontuarios/with-relations`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const prontuarioEditado = withRelationsResponse.data.find(p => p.id === PRONTUARIO_ID);
    if (prontuarioEditado) {
      console.log('\n📋 Dados com relations (editado):');
      console.log('Anamnese (relations):', prontuarioEditado.anamnese);
      console.log('Exame Físico (relations):', prontuarioEditado.exameFisico);
      console.log('Diagnóstico (relations):', prontuarioEditado.diagnostico);
      console.log('Prescrição (relations):', prontuarioEditado.prescricao);
    }

    console.log('\n🎉 TESTE DE EDIÇÃO CONCLUÍDO COM SUCESSO!');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.response?.data || error.message);
  }
}

testarEdicaoProntuario();
