/**
 * Script para configurar SGH para acesso externo
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

function obterIPLocal() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  return 'localhost';
}

function configurarAcessoExterno() {
  console.log('🌍 ========== CONFIGURAÇÃO PARA ACESSO EXTERNO ==========');
  console.log('');

  const ipLocal = obterIPLocal();
  console.log(`🔍 IP Local detectado: ${ipLocal}`);
  console.log('');

  // 1. Configurar backend para aceitar conexões externas
  console.log('⚙️ Configurando backend...');
  const backendMainPath = path.join('backend', 'src', 'main.ts');
  
  try {
    let mainContent = fs.readFileSync(backendMainPath, 'utf8');
    
    // Verificar se CORS já está configurado adequadamente
    if (!mainContent.includes('origin: true') && !mainContent.includes('origin:')) {
      // Atualizar CORS para aceitar qualquer origem
      mainContent = mainContent.replace(
        'app.enableCors();',
        `app.enableCors({
    origin: true, // Permitir qualquer origem
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });`
      );
    }

    // Atualizar listen para aceitar conexões de qualquer IP
    if (mainContent.includes('app.listen(port)')) {
      mainContent = mainContent.replace(
        'await app.listen(port);',
        `await app.listen(port, '0.0.0.0'); // Escutar em todas as interfaces`
      );
    }

    fs.writeFileSync(backendMainPath, mainContent);
    console.log('   ✅ Backend configurado para acesso externo');
  } catch (error) {
    console.log('   ❌ Erro ao configurar backend:', error.message);
  }

  // 2. Configurar frontend
  console.log('');
  console.log('⚙️ Configurando frontend...');
  
  try {
    const frontendConfigPath = path.join('frontend', 'src', 'lib', 'api-config.ts');
    let frontendContent = fs.readFileSync(frontendConfigPath, 'utf8');
    
    // Atualizar URL base para usar IP local
    const novaConfiguracao = `// Configuração base da API
export const API_CONFIG = {
  BASE_URL: "http://${ipLocal}:3008", // IP local para acesso externo
  ENDPOINTS: {`;

    frontendContent = frontendContent.replace(
      /\/\/ Configuração base da API\s*export const API_CONFIG = \{\s*BASE_URL: "[^"]*"/,
      `// Configuração base da API
export const API_CONFIG = {
  BASE_URL: "http://${ipLocal}:3008"` // IP local para acesso externo
    );

    fs.writeFileSync(frontendConfigPath, frontendContent);
    console.log('   ✅ Frontend configurado para usar IP externo');
  } catch (error) {
    console.log('   ❌ Erro ao configurar frontend:', error.message);
  }

  // 3. Configurar Vite para aceitar conexões externas
  console.log('');
  console.log('⚙️ Configurando Vite...');
  
  try {
    const viteConfigPath = path.join('frontend', 'vite.config.ts');
    
    if (fs.existsSync(viteConfigPath)) {
      let viteContent = fs.readFileSync(viteConfigPath, 'utf8');
      
      if (!viteContent.includes('host: true') && !viteContent.includes("host: '0.0.0.0'")) {
        // Adicionar configuração de server
        if (viteContent.includes('export default defineConfig({')) {
          viteContent = viteContent.replace(
            'export default defineConfig({',
            `export default defineConfig({
  server: {
    host: '0.0.0.0', // Permitir acesso externo
    port: 5173,
  },`
          );
        }
        fs.writeFileSync(viteConfigPath, viteContent);
        console.log('   ✅ Vite configurado para acesso externo');
      } else {
        console.log('   ✅ Vite já configurado para acesso externo');
      }
    } else {
      console.log('   ⚠️ Arquivo vite.config.ts não encontrado');
    }
  } catch (error) {
    console.log('   ❌ Erro ao configurar Vite:', error.message);
  }

  // 4. Criar script de teste externo
  console.log('');
  console.log('📝 Criando script de teste...');
  
  const testeExternoContent = `/**
 * Script para testar acesso externo ao SGH
 */

const axios = require('axios');

const API_BASE_URL = 'http://${ipLocal}:3008';

async function testarAcessoExterno() {
  console.log('🌍 ========== TESTE DE ACESSO EXTERNO ==========');
  console.log('');
  console.log(\`🔍 Testando API em: \${API_BASE_URL}\`);
  console.log('');

  try {
    // 1. Testar endpoint debug
    console.log('📡 Testando conectividade...');
    const debugResponse = await axios.get(\`\${API_BASE_URL}/auth/debug\`);
    console.log('   ✅ Conexão estabelecida');
    console.log('   📊 Usuários no sistema:', debugResponse.data.totalUsers);
    console.log('');

    // 2. Testar login
    console.log('🔐 Testando login...');
    const loginResponse = await axios.post(\`\${API_BASE_URL}/auth/login\`, {
      email: 'admin@sgh.com',
      password: '123456'
    });
    console.log('   ✅ Login funcionando');
    console.log('   🎫 Token gerado');
    console.log('');

    // 3. Informações de acesso
    console.log('📋 ========== INFORMAÇÕES DE ACESSO ==========');
    console.log('');
    console.log('🖥️ BACKEND API:');
    console.log(\`   🌐 URL: \${API_BASE_URL}\`);
    console.log('   📧 Admin: admin@sgh.com');
    console.log('   🔑 Senha: 123456');
    console.log('');
    console.log('🎨 FRONTEND WEB:');
    console.log(\`   🌐 URL: http://${ipLocal}:5173\`);
    console.log('   💡 Acesse pelo navegador de qualquer dispositivo na rede');
    console.log('');
    console.log('📱 PARA DISPOSITIVOS MÓVEIS:');
    console.log('   📲 Abra o navegador e digite a URL do frontend');
    console.log('   🔗 Certifique-se de estar na mesma rede Wi-Fi');
    console.log('');

  } catch (error) {
    console.log('❌ ERRO DE CONECTIVIDADE:');
    if (error.code === 'ECONNREFUSED') {
      console.log('   🚫 Não foi possível conectar ao servidor');
      console.log('   💡 Verifique se o backend está rodando');
      console.log('   🔧 Execute: npm run start:dev no backend');
    } else {
      console.log('   🚨 Erro:', error.message);
    }
  }
}

testarAcessoExterno();`;

  try {
    fs.writeFileSync('teste-acesso-externo.js', testeExternoContent);
    console.log('   ✅ Script de teste criado: teste-acesso-externo.js');
  } catch (error) {
    console.log('   ❌ Erro ao criar script de teste:', error.message);
  }

  // 5. Instruções finais
  console.log('');
  console.log('📋 ========== PRÓXIMOS PASSOS ==========');
  console.log('');
  console.log('1️⃣ REINICIAR SERVIÇOS:');
  console.log('   🔄 Backend: npm run start:dev (pasta backend)');
  console.log('   🔄 Frontend: npm run dev (pasta frontend)');
  console.log('');
  console.log('2️⃣ TESTAR CONECTIVIDADE:');
  console.log('   🧪 Execute: node teste-acesso-externo.js');
  console.log('');
  console.log('3️⃣ ACESSAR EXTERNAMENTE:');
  console.log(`   🌐 API: http://${ipLocal}:3008`);
  console.log(`   🎨 Web: http://${ipLocal}:5173`);
  console.log('');
  console.log('4️⃣ DISPOSITIVOS DA REDE:');
  console.log('   📱 Use o IP local em smartphones/tablets');
  console.log('   💻 Compartilhe as URLs com outros computadores');
  console.log('');
  console.log('🔥 FIREWALL:');
  console.log('   ⚠️ Pode ser necessário liberar portas 3008 e 5173');
  console.log('   🛡️ Windows: Painel de Controle > Firewall');
  console.log('');
}

configurarAcessoExterno();
