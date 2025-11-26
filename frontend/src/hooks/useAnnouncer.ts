import { useCallback, useRef, useEffect } from 'react';

interface UseAnnouncerOptions {
  politeness?: 'polite' | 'assertive';
  clearAfter?: number;
}

export function useAnnouncer(options: UseAnnouncerOptions = {}) {
  const { politeness = 'polite', clearAfter = 1000 } = options;
  const announcerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Criar elemento anunciador
    if (!announcerRef.current) {
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', politeness);
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      announcer.id = 'announcer-' + Math.random().toString(36).substr(2, 9);
      document.body.appendChild(announcer);
      announcerRef.current = announcer;
    }

    return () => {
      if (announcerRef.current && document.body.contains(announcerRef.current)) {
        document.body.removeChild(announcerRef.current);
      }
    };
  }, [politeness]);

  const announce = useCallback((message: string, priority?: 'polite' | 'assertive') => {
    if (!announcerRef.current) return;

    const finalPriority = priority || politeness;
    announcerRef.current.setAttribute('aria-live', finalPriority);
    
    // Limpar primeiro para garantir que a mudança seja detectada
    announcerRef.current.textContent = '';
    
    // Pequeno delay para garantir detecção
    setTimeout(() => {
      if (announcerRef.current) {
        announcerRef.current.textContent = message;
        
        // Limpar após tempo especificado
        if (clearAfter > 0) {
          setTimeout(() => {
            if (announcerRef.current) {
              announcerRef.current.textContent = '';
            }
          }, clearAfter);
        }
      }
    }, 100);
  }, [politeness, clearAfter]);

  return { announce };
}

// Hook para status de carregamento acessível
export function useLoadingAnnouncement() {
  const { announce } = useAnnouncer({ politeness: 'polite' });

  const announceLoading = useCallback((message = 'Carregando...') => {
    announce(message);
  }, [announce]);

  const announceSuccess = useCallback((message = 'Carregamento concluído') => {
    announce(message);
  }, [announce]);

  const announceError = useCallback((message = 'Erro no carregamento') => {
    announce(message, 'assertive');
  }, [announce]);

  return {
    announceLoading,
    announceSuccess,
    announceError
  };
}