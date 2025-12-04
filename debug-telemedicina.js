const puppeteer = require('puppeteer');

async function debugTelemedicina() {
  console.log('🔧 DEBUG SALA DE TELEMEDICINA');
  console.log('='.repeat(50));

  let browser;
  let page;
  
  try {
    // Configurar o Puppeteer
    browser = await puppeteer.launch({ 
      headless: false,
      devtools: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    page = await browser.newPage();
    
    // Interceptar logs do console
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      console.log(`📄 Console [${type.toUpperCase()}]: ${text}`);
    });
    
    // Interceptar erros
    page.on('pageerror', error => {
      console.error('❌ Erro na página:', error.message);
    });
    
    // Interceptar erros de request
    page.on('requestfailed', request => {
      console.error(`❌ Request falhou: ${request.url()} - ${request.failure().errorText}`);
    });
    
    console.log('1. 🌐 Navegando para a página de login...');
    await page.goto('http://localhost:8080/login', { waitUntil: 'networkidle0' });
    
    console.log('2. 🔑 Fazendo login...');
    await page.type('input[type="email"]', 'admin@sgh.com');
    await page.type('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    
    // Aguardar redirecionamento
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    console.log('✅ Login realizado');
    
    console.log('3. 📅 Navegando para a sala de telemedicina...');
    const agendamentoId = '497f102f-d557-42a4-a723-a3cba277cb64';
    const url = `http://localhost:8080/telemedicina/${agendamentoId}`;
    
    console.log(`URL: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // Aguardar um pouco para ver se carrega
    await page.waitForTimeout(3000);
    
    console.log('4. 🔍 Verificando o conteúdo da página...');
    const pageContent = await page.evaluate(() => {
      return {
        title: document.title,
        bodyText: document.body.innerText.substring(0, 500),
        hasLoadingSpinner: document.querySelector('.animate-spin') !== null,
        hasError: document.body.innerText.includes('Erro'),
        url: window.location.href
      };
    });
    
    console.log('📋 Conteúdo da página:');
    console.log('- Título:', pageContent.title);
    console.log('- URL atual:', pageContent.url);
    console.log('- Tem spinner de loading:', pageContent.hasLoadingSpinner);
    console.log('- Tem erro:', pageContent.hasError);
    console.log('- Texto do body:', pageContent.bodyText);
    
    // Verificar requests de rede
    console.log('5. 🌐 Verificando requests de rede...');
    const requests = [];
    page.on('response', response => {
      if (response.url().includes('agendamentos') || response.url().includes('telemedicina')) {
        requests.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText()
        });
      }
    });
    
    // Recarregar para capturar requests
    await page.reload({ waitUntil: 'networkidle0' });
    
    console.log('📡 Requests capturadas:');
    requests.forEach(req => {
      console.log(`- ${req.status} ${req.statusText}: ${req.url}`);
    });
    
    // Aguardar mais um pouco
    await page.waitForTimeout(5000);
    
    // Verificar novamente
    const finalContent = await page.evaluate(() => {
      return {
        hasLoadingSpinner: document.querySelector('.animate-spin') !== null,
        hasVideoArea: document.querySelector('video') !== null,
        hasError: document.body.innerText.includes('Erro'),
        bodyTextLength: document.body.innerText.length
      };
    });
    
    console.log('📊 Estado final:');
    console.log('- Ainda tem loading:', finalContent.hasLoadingSpinner);
    console.log('- Tem área de vídeo:', finalContent.hasVideoArea);
    console.log('- Tem erro:', finalContent.hasError);
    console.log('- Tamanho do conteúdo:', finalContent.bodyTextLength);
    
    console.log('✅ Debug concluído - verifique a janela do navegador');
    
    // Manter o navegador aberto por 30 segundos para inspeção manual
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('❌ Erro no debug:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

debugTelemedicina().catch(console.error);