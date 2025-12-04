const axios = require('axios');

const API_BASE_URL = 'http://localhost:3008';

console.log('🧪 TESTE DIRETO DO BACKEND - EXPORTAÇÃO DE PACIENTES');
console.log('='.repeat(60));

async function testarExportacaoBackend() {
  try {
    console.log('\n1. Fazendo login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@sgh.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    const headers = { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    console.log('✅ Login realizado com sucesso');

    console.log('\n2. Chamando endpoint de exportação de pacientes...');
    const exportResponse = await axios.post(`${API_BASE_URL}/backup/exportar`, {
      categoria: 'pacientes'
    }, { headers });
    
    console.log('✅ Resposta do backend:');
    console.log(JSON.stringify(exportResponse.data, null, 2));

    console.log('\n3. Verificando quantos pacientes existem no sistema...');
    const pacientesResponse = await axios.get(`${API_BASE_URL}/pacientes`, { headers });
    console.log(`📊 Total de pacientes no sistema: ${pacientesResponse.data.length}`);
    
    // Mostrar alguns dados dos pacientes
    console.log('\n4. Amostra dos dados dos pacientes:');
    if (pacientesResponse.data.length > 0) {
      console.log('Primeiro paciente:', {
        id: pacientesResponse.data[0].id?.substring(0, 8) + '...',
        nome: pacientesResponse.data[0].nome,
        email: pacientesResponse.data[0].email,
        telefone: pacientesResponse.data[0].telefone
      });
    }

    console.log('\n5. Verificando se arquivo foi criado no backend...');
    try {
      const fs = require('fs');
      const path = require('path');
      const exportDir = path.join(process.cwd(), 'backend', 'exports');
      
      if (fs.existsSync(exportDir)) {
        const files = fs.readdirSync(exportDir)
          .filter(f => f.includes('pacientes'))
          .sort((a, b) => fs.statSync(path.join(exportDir, b)).mtime - fs.statSync(path.join(exportDir, a)).mtime);
        
        if (files.length > 0) {
          console.log(`📁 Arquivo mais recente: ${files[0]}`);
          const filePath = path.join(exportDir, files[0]);
          const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          
          console.log('\n📄 Conteúdo do arquivo gerado:');
          console.log(`   Categoria: ${content.categoria}`);
          console.log(`   Registros: ${content.registros}`);
          console.log(`   Dados incluídos: ${content.dados ? content.dados.length : 'Nenhum'}`);
          
          if (content.dados && content.dados.length > 0) {
            console.log('\n✅ DADOS REAIS ENCONTRADOS!');
            console.log('Exemplo do primeiro paciente exportado:');
            console.log(JSON.stringify(content.dados[0], null, 2));
          } else {
            console.log('\n❌ ARQUIVO SEM DADOS REAIS - apenas metadados');
          }
        } else {
          console.log('❌ Nenhum arquivo de exportação encontrado');
        }
      } else {
        console.log('❌ Diretório de exports não existe');
      }
    } catch (error) {
      console.log('⚠️ Erro ao verificar arquivo:', error.message);
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
  }
}

testarExportacaoBackend();
