// Script para testar navegação até prontuários e testagem dos botões
const puppeteer = require('puppeteer');

async function testarBotoesExportacao() {
  console.log('🤖 Iniciando teste automatizado dos botões de exportação...\n');
  
  const browser = await puppeteer.launch({ 
    headless: false, // Para ver o que está acontecendo
    slowMo: 100 // Movimento mais lento para visualizar
  });
  
  const page = await browser.newPage();
  
  try {
    // 1. Acessar a aplicação
    console.log('1️⃣ Acessando aplicação...');
    await page.goto('http://localhost:8081');
    await page.waitForTimeout(2000);
    
    // 2. Verificar se a página carregou
    console.log('2️⃣ Verificando carregamento da página...');
    const title = await page.title();
    console.log('📄 Título da página:', title);
    
    // 3. Fazer login
    console.log('3️⃣ Realizando login...');
    
    // Esperar pelos campos de login
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    await page.waitForSelector('input[type="password"]');
    
    // Preencher credenciais
    await page.type('input[type="email"]', 'dr.teste.agendamento@teste.com');
    await page.type('input[type="password"]', '123456');
    
    // Clicar no botão de login
    await page.click('button[type="submit"]');
    console.log('✅ Credenciais inseridas, aguardando redirecionamento...');
    
    // Aguardar redirecionamento após login
    await page.waitForTimeout(3000);
    
    // 4. Navegar para prontuários
    console.log('4️⃣ Navegando para lista de prontuários...');
    
    // Procurar link ou botão para prontuários
    const prontuariosLink = await page.$('a[href="/prontuarios"]') || 
                           await page.$('a[href*="prontuarios"]') ||
                           await page.$x('//a[contains(text(), "Prontuários")]');
    
    if (prontuariosLink) {
      if (Array.isArray(prontuariosLink)) {
        await prontuariosLink[0].click();
      } else {
        await prontuariosLink.click();
      }
      console.log('✅ Clicou no link de prontuários');
    } else {
      console.log('🔄 Tentando navegar diretamente...');
      await page.goto('http://localhost:8081/prontuarios');
    }
    
    await page.waitForTimeout(3000);
    
    // 5. Verificar se chegou na página de prontuários
    console.log('5️⃣ Verificando página de prontuários...');
    const currentUrl = page.url();
    console.log('🌐 URL atual:', currentUrl);
    
    // 6. Procurar botões de exportação
    console.log('6️⃣ Procurando botões de exportação...');
    
    // Aguardar carregamento dos prontuários
    await page.waitForTimeout(2000);
    
    // Procurar botões PDF
    const botoesPDF = await page.$$('button:has-text("PDF")') || 
                     await page.$$('button[title*="PDF"]') ||
                     await page.$$('*[title*="PDF"]');
                     
    // Procurar botões LGPD
    const botoesLGPD = await page.$$('button:has-text("LGPD")') || 
                      await page.$$('button[title*="LGPD"]') ||
                      await page.$$('*[title*="LGPD"]');
    
    console.log(`📋 Encontrados ${botoesPDF.length} botões PDF`);
    console.log(`🔒 Encontrados ${botoesLGPD.length} botões LGPD`);
    
    // 7. Fazer screenshot para verificação visual
    console.log('7️⃣ Capturando screenshot...');
    await page.screenshot({ 
      path: 'teste-exportacao-screenshot.png', 
      fullPage: true 
    });
    console.log('📸 Screenshot salvo como teste-exportacao-screenshot.png');
    
    // 8. Tentar clicar em um botão se encontrado
    if (botoesPDF.length > 0) {
      console.log('8️⃣ Testando botão PDF...');
      try {
        await botoesPDF[0].click();
        console.log('✅ Clicou no botão PDF');
        await page.waitForTimeout(2000);
      } catch (error) {
        console.log('⚠️ Erro ao clicar no botão PDF:', error.message);
      }
    }
    
    if (botoesLGPD.length > 0) {
      console.log('9️⃣ Testando botão LGPD...');
      try {
        await botoesLGPD[0].click();
        console.log('✅ Clicou no botão LGPD');
        await page.waitForTimeout(2000);
      } catch (error) {
        console.log('⚠️ Erro ao clicar no botão LGPD:', error.message);
      }
    }
    
    console.log('\n🎉 Teste automatizado concluído!');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
    await page.screenshot({ path: 'erro-teste-screenshot.png' });
    console.log('📸 Screenshot do erro salvo como erro-teste-screenshot.png');
  } finally {
    await browser.close();
  }
}

// Verificar se puppeteer está disponível
if (require.resolve('puppeteer')) {
  testarBotoesExportacao();
} else {
  console.log('📝 Teste manual recomendado:');
  console.log('1. Acesse http://localhost:8081');
  console.log('2. Faça login com: dr.teste.agendamento@teste.com / 123456');
  console.log('3. Navegue para "Prontuários"');
  console.log('4. Teste os botões "PDF" e "LGPD" em qualquer prontuário');
  console.log('5. Verifique se os PDFs são gerados com diferentes conteúdos');
}
