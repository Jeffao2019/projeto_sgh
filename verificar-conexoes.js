console.log('🔧 Verificando conexões...\n');

// Teste simples de conexão
const { exec } = require('child_process');

console.log('1️⃣ Verificando PostgreSQL na porta 5433...');
exec('netstat -an | findstr "5433"', (error, stdout, stderr) => {
    if (stdout) {
        console.log('✅ PostgreSQL está ativo na porta 5433');
        console.log(stdout.trim());
    } else {
        console.log('❌ PostgreSQL não encontrado na porta 5433');
    }
    
    console.log('\n2️⃣ Verificando processo backend na porta 3000...');
    exec('netstat -an | findstr "3000"', (error2, stdout2, stderr2) => {
        if (stdout2) {
            console.log('✅ Serviço ativo na porta 3000');
            console.log(stdout2.trim());
        } else {
            console.log('❌ Nenhum serviço na porta 3000');
        }
        
        console.log('\n3️⃣ Verificando processos Node.js...');
        exec('tasklist | findstr "node.exe"', (error3, stdout3, stderr3) => {
            if (stdout3) {
                console.log('✅ Processos Node.js encontrados:');
                console.log(stdout3.trim());
            } else {
                console.log('❌ Nenhum processo Node.js encontrado');
            }
        });
    });
});

setTimeout(() => {
    console.log('\n🔧 Para solucionar, tente:');
    console.log('1. cd backend');
    console.log('2. npm run start:dev');
    console.log('3. Aguarde a mensagem "SGH Backend está rodando na porta 3000"');
    console.log('4. Em seguida, execute o teste novamente');
}, 2000);

