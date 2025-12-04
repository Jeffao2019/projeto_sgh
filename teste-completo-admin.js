const axios = require('axios');

const API_BASE_URL = 'http://localhost:3008';

console.log('🔐 CRIAR ADMIN E TESTAR EXPORTAÇÃO');
console.log('='.repeat(50));

async function criarAdminETestar() {
  try {
    console.log('\n1. Criando usuário administrador...');
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, {
        nome: 'Administrador Sistema',
        email: 'admin@sgh.com',
        password: 'admin123',
        papel: 'ADMIN',
        crm: 'ADM001',
        especialidade: 'Administração'
      });
      console.log('✅ Admin criado com sucesso');
    } catch (err) {
      if (err.response?.status === 409) {
        console.log('ℹ️ Admin já existe, prosseguindo...');
      } else {
        throw err;
      }
    }

    console.log('\n2. Fazendo login...');
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

    console.log('\n3. Verificando quantos pacientes existem...');
    const pacientesResponse = await axios.get(`${API_BASE_URL}/pacientes`, { headers });
    console.log(`📊 Total de pacientes no sistema: ${pacientesResponse.data.length}`);
    
    if (pacientesResponse.data.length === 0) {
      console.log('\n4. Criando paciente de teste...');
      await axios.post(`${API_BASE_URL}/pacientes`, {
        nome: 'João da Silva',
        email: 'joao@teste.com',
        telefone: '(11) 99999-9999',
        dataNascimento: '1990-01-01',
        endereco: 'Rua Teste, 123'
      }, { headers });
      
      // Buscar novamente
      const novaPacientesResponse = await axios.get(`${API_BASE_URL}/pacientes`, { headers });
      console.log(`📊 Total de pacientes após criação: ${novaPacientesResponse.data.length}`);
    }

    console.log('\n5. Testando exportação de pacientes...');
    const exportResponse = await axios.post(`${API_BASE_URL}/backup/exportar`, {
      categoria: 'pacientes'
    }, { headers });
    
    console.log('✅ Resposta do backend:');
    console.log(JSON.stringify(exportResponse.data, null, 2));

    if (exportResponse.data.filePath) {
      console.log('\n6. Verificando arquivo criado...');
      const fs = require('fs');
      const path = require('path');
      
      // Caminho do arquivo baseado na resposta do backend
      const fullPath = path.resolve(exportResponse.data.filePath);
      
      if (fs.existsSync(fullPath)) {
        const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        
        console.log('📁 Arquivo encontrado!');
        console.log(`   Categoria: ${content.categoria}`);
        console.log(`   Registros: ${content.registros}`);
        console.log(`   Dados incluídos: ${content.dados ? content.dados.length : 'Nenhum'}`);
        
        if (content.dados && content.dados.length > 0) {
          console.log('\n✅ SUCESSO! DADOS REAIS ENCONTRADOS!');
          console.log('Exemplo do primeiro paciente:');
          console.log(JSON.stringify(content.dados[0], null, 2));
        } else {
          console.log('\n❌ PROBLEMA: Arquivo contém apenas metadados, sem dados reais');
          console.log('Estrutura do arquivo:');
          console.log(JSON.stringify(content, null, 2));
        }
      } else {
        console.log('❌ Arquivo não encontrado no caminho esperado');
      }
    }

  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
  }
}

criarAdminETestar();
