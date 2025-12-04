// Teste para verificar funcionalidade da videochamada na telemedicina
console.log('🧪 Iniciando teste de videochamada...');

(async () => {
  try {
    console.log('\n=== TESTE DE VIDEOCHAMADA ===');
    
    // Testar se o navegador suporta getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log('✅ navegador.mediaDevices.getUserMedia disponível');
      
      // Listar dispositivos de mídia
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        const audioDevices = devices.filter(device => device.kind === 'audioinput');
        
        console.log(`📹 Câmeras encontradas: ${videoDevices.length}`);
        console.log(`🎤 Microfones encontrados: ${audioDevices.length}`);
        
        videoDevices.forEach((device, index) => {
          console.log(`  Câmera ${index + 1}: ${device.label || 'Dispositivo sem nome'}`);
        });
        
        audioDevices.forEach((device, index) => {
          console.log(`  Microfone ${index + 1}: ${device.label || 'Dispositivo sem nome'}`);
        });
        
      } catch (deviceError) {
        console.log('⚠️  Não foi possível listar dispositivos:', deviceError.message);
      }
      
    } else {
      console.log('❌ navigator.mediaDevices.getUserMedia não disponível');
      console.log('   Navegador pode não suportar WebRTC');
    }
    
    // Testar Canvas para simulação do paciente
    console.log('\n=== TESTE DE CANVAS ===');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      console.log('✅ Canvas 2D context disponível');
      
      // Testar captureStream
      if (typeof canvas.captureStream === 'function') {
        console.log('✅ canvas.captureStream() disponível');
      } else {
        console.log('❌ canvas.captureStream() não disponível');
      }
    } else {
      console.log('❌ Canvas 2D context não disponível');
    }
    
    // Testar elementos de vídeo
    console.log('\n=== TESTE DE ELEMENTOS VIDEO ===');
    const video = document.createElement('video');
    
    if (video.play && video.pause) {
      console.log('✅ Elementos <video> suportam play/pause');
    }
    
    if ('srcObject' in video) {
      console.log('✅ video.srcObject disponível');
    } else {
      console.log('❌ video.srcObject não disponível');
    }
    
    console.log('\n=== RESUMO ===');
    console.log('📊 Compatibilidade do navegador:');
    console.log(`  WebRTC: ${navigator.mediaDevices ? '✅' : '❌'}`);
    console.log(`  Canvas: ${ctx ? '✅' : '❌'}`);
    console.log(`  Video: ${video ? '✅' : '❌'}`);
    
    console.log('\n🎉 Teste concluído!');
    console.log('💡 Se todos os ✅ estão presentes, a videochamada deve funcionar');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
})();