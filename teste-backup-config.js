// Teste da funcionalidade de backup configurações
const teste = async () => {
    try {
        console.log('🔧 Testando endpoint de configurações de backup...');
        
        // Primeiro, obter configurações
        const responseGet = await fetch('http://localhost:3000/backup/configuracoes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('📥 GET Status:', responseGet.status);
        
        if (responseGet.ok) {
            const dataGet = await responseGet.json();
            console.log('📥 GET Response:', JSON.stringify(dataGet, null, 2));
        } else {
            console.log('❌ GET Error:', responseGet.statusText);
        }
        
        // Segundo, salvar configurações
        const configTeste = {
            automatico: true,
            frequencia: 'semanal',
            horario: '03:00',
            retencao: 60,
            local: 'local',
            compressao: true,
            criptografia: true
        };
        
        const responsePut = await fetch('http://localhost:3000/backup/configuracoes', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(configTeste)
        });
        
        console.log('📤 PUT Status:', responsePut.status);
        
        if (responsePut.ok) {
            const dataPut = await responsePut.json();
            console.log('📤 PUT Response:', JSON.stringify(dataPut, null, 2));
        } else {
            console.log('❌ PUT Error:', responsePut.statusText);
        }
        
    } catch (error) {
        console.error('💥 Erro no teste:', error);
    }
};

teste();

