const axios = require('axios');

async function verificarElisangela() {
  try {
    console.log('🔍 Verificando se a paciente Elisangela foi cadastrada...\n');
    
    // Login
    const login = await axios.post('http://localhost:3000/auth/login', {
      email: 'admin@sgh.com',
      password: '123456'
    });
    
    const headers = { Authorization: `Bearer ${login.data.token}` };
    
    // Buscar pacientes
    const response = await axios.get('http://localhost:3000/pacientes', { headers });
    const pacientes = response.data;
    
    console.log(`📊 Total de pacientes no sistema: ${pacientes.length}`);
    console.log('');
    
    // Procurar por Elisangela
    const elisangelas = pacientes.filter(p => 
      p.nome && p.nome.toLowerCase().includes('elisangela')
    );
    
    if (elisangelas.length > 0) {
      console.log('✅ PACIENTE(S) ELISANGELA ENCONTRADA(S):');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      elisangelas.forEach((paciente, index) => {
        console.log(`👩 Paciente ${index + 1}:`);
        console.log(`   🆔 ID: ${paciente.id}`);
        console.log(`   👤 Nome: ${paciente.nome}`);
        console.log(`   📧 Email: ${paciente.email}`);
        console.log(`   📱 Telefone: ${paciente.telefone}`);
        console.log(`   🆔 CPF: ${paciente.cpf}`);
        console.log(`   📅 Criado em: ${new Date(paciente.createdAt).toLocaleString('pt-BR')}`);
        console.log('');
      });
    } else {
      console.log('❌ NENHUMA PACIENTE COM NOME ELISANGELA ENCONTRADA');
      console.log('');
      
      // Mostrar alguns pacientes como referência
      console.log('📋 Pacientes disponíveis no sistema:');
      pacientes.slice(0, 8).forEach((paciente, index) => {
        console.log(`   ${index + 1}. ${paciente.nome} (ID: ${paciente.id.substring(0,8)}...)`);
      });
      
      if (pacientes.length > 8) {
        console.log(`   ... e mais ${pacientes.length - 8} pacientes`);
      }
    }
    
    // Verificar também busca parcial por 'ferreira' ou 'santos'
    const ferreiraSantos = pacientes.filter(p => 
      p.nome && (
        p.nome.toLowerCase().includes('ferreira') || 
        p.nome.toLowerCase().includes('santos')
      )
    );
    
    if (ferreiraSantos.length > 0 && elisangelas.length === 0) {
      console.log('');
      console.log('🔍 Pacientes com sobrenome Ferreira ou Santos:');
      ferreiraSantos.slice(0, 5).forEach(paciente => {
        console.log(`   • ${paciente.nome}`);
      });
    }
    
    // Verificar agendamentos de hoje para teleconsulta
    console.log('\n📅 Verificando agendamentos de hoje para teleconsulta...');
    const agendamentos = await axios.get('http://localhost:3000/agendamentos', { headers });
    
    const hoje = new Date().toDateString();
    const teleconsultasHoje = agendamentos.data.filter(ag => {
      const dataAg = new Date(ag.dataHora).toDateString();
      return dataAg === hoje && ag.tipo === 'TELEMEDICINA';
    });
    
    if (teleconsultasHoje.length > 0) {
      console.log(`✅ Encontradas ${teleconsultasHoje.length} teleconsulta(s) para hoje:`);
      teleconsultasHoje.forEach(ag => {
        const horario = new Date(ag.dataHora).toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        console.log(`   🎥 ${horario} - Agendamento ID: ${ag.id.substring(0,8)}...`);
      });
    } else {
      console.log('❌ Nenhuma teleconsulta agendada para hoje');
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar pacientes:', error.response?.data || error.message);
  }
}

verificarElisangela();
