const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando backend para teste...');

// Muda para o diretório backend e executa o comando
const backendPath = path.join(__dirname, 'backend');
process.chdir(backendPath);

console.log('📂 Diretório atual:', process.cwd());

// Executa o comando de desenvolvimento
const child = exec('npm run start:dev', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Erro:', error);
    return;
  }
  if (stderr) {
    console.error('⚠️  Stderr:', stderr);
  }
  console.log('📜 Stdout:', stdout);
});

// Escuta saída em tempo real
child.stdout.on('data', (data) => {
  console.log(data.toString());
});

child.stderr.on('data', (data) => {
  console.error(data.toString());
});

// Manterá rodando
console.log('⏳ Backend iniciando... Pressione Ctrl+C para parar');
