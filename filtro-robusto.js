/**
 * 🔧 CORREÇÃO ROBUSTA - Filtro de Paciente
 * 
 * Esta versão implementa uma correção mais robusta para garantir
 * que o filtro de paciente seja sempre preservado na navegação.
 */

// 1. Melhorar a detecção do pacienteId com fallbacks
const getPacienteIdRobust = (searchParams) => {
  // Método 1: searchParams.get
  let pacienteId = searchParams.get('paciente');
  
  // Método 2: Fallback - parsing manual da URL
  if (!pacienteId) {
    const urlString = window.location.search;
    const match = urlString.match(/[?&]paciente=([^&]*)/);
    if (match) {
      pacienteId = decodeURIComponent(match[1]);
    }
  }
  
  // Método 3: Fallback - sessionStorage
  if (!pacienteId) {
    pacienteId = sessionStorage.getItem('currentPacienteFilter');
  }
  
  // Salvar no sessionStorage para backup
  if (pacienteId) {
    sessionStorage.setItem('currentPacienteFilter', pacienteId);
  } else {
    sessionStorage.removeItem('currentPacienteFilter');
  }
  
  return pacienteId;
};

// 2. Função para construir returnUrl de forma robusta
const buildReturnUrlRobust = (pacienteId) => {
  if (!pacienteId) {
    return '/prontuarios';
  }
  
  // Garantir que o pacienteId é válido (apenas números)
  const cleanPacienteId = pacienteId.toString().replace(/[^0-9]/g, '');
  if (!cleanPacienteId) {
    return '/prontuarios';
  }
  
  return `/prontuarios?paciente=${cleanPacienteId}`;
};

// 3. Função para navegação robusta
const navigateWithFilter = (navigate, path, pacienteId) => {
  const returnUrl = buildReturnUrlRobust(pacienteId);
  const encodedReturnUrl = encodeURIComponent(returnUrl);
  const finalUrl = `${path}?return=${encodedReturnUrl}`;
  
  console.log('🔧 [NAVEGAÇÃO ROBUSTA]', {
    pacienteId,
    returnUrl,
    encodedReturnUrl,
    finalUrl
  });
  
  // Salvar no sessionStorage antes da navegação
  if (pacienteId) {
    sessionStorage.setItem('preNavigationFilter', pacienteId);
  }
  
  navigate(finalUrl);
};

// 4. Função para recuperar returnUrl de forma robusta
const getReturnUrlRobust = (location) => {
  const searchParams = new URLSearchParams(location.search);
  let returnUrl = searchParams.get('return');
  
  if (returnUrl) {
    try {
      returnUrl = decodeURIComponent(returnUrl);
    } catch (e) {
      console.warn('Erro ao decodificar returnUrl:', e);
    }
  }
  
  // Fallback: usar sessionStorage
  if (!returnUrl) {
    const savedFilter = sessionStorage.getItem('preNavigationFilter');
    if (savedFilter) {
      returnUrl = `/prontuarios?paciente=${savedFilter}`;
    }
  }
  
  return returnUrl || '/prontuarios';
};

console.log("🔧 [CORREÇÃO ROBUSTA] Funções auxiliares criadas para preservação do filtro");

export {
  getPacienteIdRobust,
  buildReturnUrlRobust,
  navigateWithFilter,
  getReturnUrlRobust
};
