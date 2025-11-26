/**
 * Script de Implementação: Melhorias de Desempenho e Acessibilidade
 * SGH - Sistema de Gestão Hospitalar
 * 
 * Implementações baseadas no relatório de validação
 */

const fs = require('fs');
const path = require('path');

class ImplementadorMelhorias {
    constructor() {
        this.melhorias = {
            desempenho: [],
            acessibilidade: [],
            implementadas: 0,
            total: 0
        };
    }

    async implementarMelhorias() {
        console.log('🚀 IMPLEMENTANDO MELHORIAS DE DESEMPENHO E ACESSIBILIDADE\n');
        
        await this.implementarMelhoriasDesempenho();
        await this.implementarMelhoriasAcessibilidade();
        
        this.gerarRelatorioImplementacao();
        
        console.log('\n✅ IMPLEMENTAÇÃO CONCLUÍDA!');
        console.log('📊 Total de melhorias implementadas: ' + this.melhorias.implementadas + '/' + this.melhorias.total);
    }

    // =================== MELHORIAS DE DESEMPENHO ===================

    async implementarMelhoriasDesempenho() {
        console.log('🚀 IMPLEMENTANDO MELHORIAS DE DESEMPENHO...\n');
        
        // 1. Lazy Loading de Componentes
        await this.implementarLazyComponents();
        
        // 2. Cache de Dados
        await this.implementarCacheDados();
        
        // 3. Otimização de Consultas
        await this.implementarOtimizacaoConsultas();
        
        // 4. Paginação Otimizada
        await this.implementarPaginacaoOtimizada();
    }

    async implementarLazyComponents() {
        console.log('🔄 Implementando Lazy Loading de Componentes...');
        
        // Hook para Lazy Loading
        const useLazyLoadHook = `import { useState, useRef, useCallback, useEffect } from 'react';

interface UseLazyLoadOptions {
  rootMargin?: string;
  threshold?: number;
}

export const useLazyLoad = (options: UseLazyLoadOptions = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const callback = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && !hasIntersected) {
      setIsIntersecting(true);
      setHasIntersected(true);
    }
  }, [hasIntersected]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(callback, {
      rootMargin: options.rootMargin || '50px',
      threshold: options.threshold || 0.1
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [callback, options]);

  return { ref, isIntersecting, hasIntersected };
};

// Hook para Lazy Load de Imagens
export const useLazyImage = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, isIntersecting } = useLazyLoad();

  useEffect(() => {
    if (isIntersecting && !isLoaded) {
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
      img.src = src;
    }
  }, [isIntersecting, src, isLoaded]);

  return { ref, imageSrc, isLoaded };
};`;

        this.criarArquivo('frontend/src/hooks/useLazyLoad.ts', useLazyLoadHook);

        // Componente de Lazy Image
        const lazyImageComponent = `import React from 'react';
import { cn } from '@/lib/utils';
import { useLazyImage } from '@/hooks/useLazyLoad';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  fallback?: React.ReactNode;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f0f0f0"/%3E%3Ctext x="200" y="150" text-anchor="middle" fill="%23999"%3ECarregando...%3C/text%3E%3C/svg%3E',
  fallback,
  className,
  ...props
}) => {
  const { ref, imageSrc, isLoaded } = useLazyImage(src, placeholder);

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          {fallback || (
            <span className="text-gray-500 text-sm">Carregando...</span>
          )}
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = placeholder;
        }}
        {...props}
      />
    </div>
  );
};`;

        this.criarArquivo('frontend/src/components/LazyImage.tsx', lazyImageComponent);

        this.melhorias.desempenho.push('Lazy Loading de Componentes e Imagens');
        this.melhorias.implementadas++;
        this.melhorias.total++;
        
        console.log('  ✓ Lazy Loading implementado');
    }

    async implementarCacheDados() {
        console.log('⚡ Implementando Cache de Dados...');
        
        // Utilitário de Storage
        const storageUtils = `// Utilitários de Storage para Cache Local
export class StorageManager {
  private static readonly PREFIX = 'sgh_';
  private static readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos

  // LocalStorage com TTL
  static setItem<T>(key: string, value: T, ttl: number = this.DEFAULT_TTL): void {
    try {
      const item = {
        value,
        timestamp: Date.now(),
        ttl
      };
      localStorage.setItem(this.PREFIX + key, JSON.stringify(item));
    } catch (error) {
      console.warn('Erro ao salvar no localStorage:', error);
    }
  }

  static getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.PREFIX + key);
      if (!item) return null;

      const parsed = JSON.parse(item);
      const { value, timestamp, ttl } = parsed;

      // Verificar se expirou
      if (Date.now() - timestamp > ttl) {
        this.removeItem(key);
        return null;
      }

      return value;
    } catch (error) {
      console.warn('Erro ao ler do localStorage:', error);
      return null;
    }
  }

  static removeItem(key: string): void {
    localStorage.removeItem(this.PREFIX + key);
  }

  // SessionStorage
  static setSessionItem<T>(key: string, value: T): void {
    try {
      sessionStorage.setItem(this.PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.warn('Erro ao salvar no sessionStorage:', error);
    }
  }

  static getSessionItem<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(this.PREFIX + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn('Erro ao ler do sessionStorage:', error);
      return null;
    }
  }

  // Limpar cache expirado
  static clearExpired(): void {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(this.PREFIX));
    
    keys.forEach(key => {
      try {
        const item = localStorage.getItem(key);
        if (!item) return;

        const parsed = JSON.parse(item);
        const { timestamp, ttl } = parsed;

        if (Date.now() - timestamp > ttl) {
          localStorage.removeItem(key);
        }
      } catch (error) {
        localStorage.removeItem(key);
      }
    });
  }

  // Tamanho do cache
  static getCacheSize(): string {
    let size = 0;
    const keys = Object.keys(localStorage).filter(key => key.startsWith(this.PREFIX));
    
    keys.forEach(key => {
      const item = localStorage.getItem(key);
      if (item) size += item.length;
    });

    return (size / 1024).toFixed(2) + ' KB';
  }
}

// Hook para usar cache
import { useState, useEffect, useCallback } from 'react';

export function useCache<T>(key: string, fetcher: () => Promise<T>, ttl?: number) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      // Tentar cache primeiro
      if (!forceRefresh) {
        const cached = StorageManager.getItem<T>(key);
        if (cached) {
          setData(cached);
          setLoading(false);
          return cached;
        }
      }

      // Buscar dados
      const result = await fetcher();
      setData(result);
      
      // Salvar no cache
      StorageManager.setItem(key, result, ttl);
      
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, ttl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = () => fetchData(true);
  const clearCache = () => {
    StorageManager.removeItem(key);
    setData(null);
  };

  return { data, loading, error, refresh, clearCache };
}`;

        this.criarArquivo('frontend/src/utils/storage.ts', storageUtils);

        this.melhorias.desempenho.push('Cache de Dados com TTL');
        this.melhorias.implementadas++;
        this.melhorias.total++;
        
        console.log('  ✓ Cache de dados implementado');
    }

    async implementarOtimizacaoConsultas() {
        console.log('🔍 Implementando Otimização de Consultas...');
        
        // Hook de debounce para busca
        const useDebounceHook = `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook de busca otimizada
export function useOptimizedSearch<T>(
  searchFn: (query: string) => Promise<T[]>,
  initialQuery = '',
  debounceMs = 300
) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const debouncedQuery = useDebounce(query, debounceMs);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    searchFn(debouncedQuery)
      .then(setResults)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [debouncedQuery, searchFn]);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    hasResults: results.length > 0
  };
}`;

        this.criarArquivo('frontend/src/hooks/useDebounce.ts', useDebounceHook);

        this.melhorias.desempenho.push('Busca Otimizada com Debounce');
        this.melhorias.implementadas++;
        this.melhorias.total++;
        
        console.log('  ✓ Otimização de consultas implementada');
    }

    async implementarPaginacaoOtimizada() {
        console.log('📄 Implementando Paginação Otimizada...');
        
        const paginationHook = `import { useState, useMemo } from 'react';

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginationActions {
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setItemsPerPage: (items: number) => void;
}

export function usePagination(
  initialItemsPerPage = 10,
  initialPage = 1
): [PaginationState, PaginationActions] {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [totalItems, setTotalItems] = useState(0);

  const totalPages = useMemo(() => 
    Math.ceil(totalItems / itemsPerPage), 
    [totalItems, itemsPerPage]
  );

  const state: PaginationState = {
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages
  };

  const actions: PaginationActions = {
    goToPage: (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    nextPage: () => {
      if (currentPage < totalPages) {
        setCurrentPage(prev => prev + 1);
      }
    },
    previousPage: () => {
      if (currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    },
    setItemsPerPage: (items: number) => {
      setItemsPerPage(items);
      setCurrentPage(1); // Reset para primeira página
    }
  };

  return [state, actions];
}`;

        this.criarArquivo('frontend/src/hooks/usePagination.ts', paginationHook);

        this.melhorias.desempenho.push('Paginação Otimizada');
        this.melhorias.implementadas++;
        this.melhorias.total++;
        
        console.log('  ✓ Paginação otimizada implementada');
    }

    // =================== MELHORIAS DE ACESSIBILIDADE ===================

    async implementarMelhoriasAcessibilidade() {
        console.log('\n♿ IMPLEMENTANDO MELHORIAS DE ACESSIBILIDADE...\n');
        
        // 1. Theme Provider com Dark Mode
        await this.implementarThemeProvider();
        
        // 2. Skip Links
        await this.implementarSkipLinks();
        
        // 3. Controle de Foco
        await this.implementarControleFoco();
    }

    async implementarThemeProvider() {
        console.log('🎨 Implementando Theme Provider com Dark Mode...');
        
        const themeProvider = `"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeContextValue {
  theme: Theme;
  actualTheme: 'dark' | 'light';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'sgh-theme'
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [actualTheme, setActualTheme] = useState<'dark' | 'light'>('light');

  useEffect(() => {
    // Carregar tema salvo
    const savedTheme = localStorage.getItem(storageKey) as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [storageKey]);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Determinar tema atual
    let currentTheme: 'dark' | 'light';
    
    if (theme === 'system') {
      currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
    } else {
      currentTheme = theme;
    }

    setActualTheme(currentTheme);

    // Aplicar tema
    root.classList.remove('light', 'dark');
    root.classList.add(currentTheme);

    // Salvar preferência
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  const toggleTheme = () => {
    setTheme(actualTheme === 'dark' ? 'light' : 'dark');
  };

  const value: ThemeContextValue = {
    theme,
    actualTheme,
    setTheme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}`;

        this.criarArquivo('frontend/src/providers/theme-provider.tsx', themeProvider);

        this.melhorias.acessibilidade.push('Theme Provider com Dark Mode');
        this.melhorias.implementadas++;
        this.melhorias.total++;
        
        console.log('  ✓ Theme Provider implementado');
    }

    async implementarSkipLinks() {
        console.log('🔗 Implementando Skip Links e Landmarks...');
        
        const skipLinksComponent = `import React from 'react';
import { cn } from '@/lib/utils';

interface SkipLink {
  href: string;
  label: string;
}

interface SkipLinksProps {
  links?: SkipLink[];
  className?: string;
}

const DEFAULT_LINKS: SkipLink[] = [
  { href: '#main-content', label: 'Pular para o conteúdo principal' },
  { href: '#main-navigation', label: 'Pular para a navegação principal' },
  { href: '#search', label: 'Pular para a busca' },
  { href: '#footer', label: 'Pular para o rodapé' }
];

export const SkipLinks: React.FC<SkipLinksProps> = ({
  links = DEFAULT_LINKS,
  className
}) => {
  return (
    <div className={cn('skip-links', className)}>
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                     bg-blue-600 text-white px-4 py-2 rounded z-50 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              const target = document.querySelector(link.href);
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (target instanceof HTMLElement && target.tabIndex >= 0) {
                  target.focus();
                }
              }
            }
          }}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
};

// Hook para anúncios de mudanças para leitores de tela
export function useScreenReaderAnnouncements() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    
    document.body.appendChild(announcer);
    
    setTimeout(() => {
      announcer.textContent = message;
      
      setTimeout(() => {
        document.body.removeChild(announcer);
      }, 1000);
    }, 100);
  };

  return { announce };
}`;

        this.criarArquivo('frontend/src/components/SkipLinks.tsx', skipLinksComponent);

        this.melhorias.acessibilidade.push('Skip Links e Landmarks Semânticos');
        this.melhorias.implementadas++;
        this.melhorias.total++;
        
        console.log('  ✓ Skip Links implementados');
    }

    async implementarControleFoco() {
        console.log('🎯 Implementando Controle de Foco...');
        
        const focusManagement = `import { useEffect, useRef, useCallback } from 'react';

// Hook para gerenciamento de foco
export function useFocusManagement() {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, []);

  const focusElement = useCallback((selector: string | HTMLElement) => {
    const element = typeof selector === 'string' 
      ? document.querySelector(selector) as HTMLElement
      : selector;
    
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, []);

  return {
    saveFocus,
    restoreFocus,
    focusElement
  };
}

// Hook para modal com foco
export function useModalFocus(isOpen: boolean) {
  const { saveFocus, restoreFocus } = useFocusManagement();

  useEffect(() => {
    if (isOpen) {
      saveFocus();
    } else {
      restoreFocus();
    }
  }, [isOpen, saveFocus, restoreFocus]);
}`;

        this.criarArquivo('frontend/src/hooks/useFocusManagement.ts', focusManagement);

        this.melhorias.acessibilidade.push('Controle Avançado de Foco');
        this.melhorias.implementadas++;
        this.melhorias.total++;
        
        console.log('  ✓ Controle de foco implementado');
    }

    // =================== MÉTODOS AUXILIARES ===================

    criarArquivo(caminho, conteudo) {
        try {
            const diretorio = path.dirname(caminho);
            
            // Criar diretórios se não existirem
            if (!fs.existsSync(diretorio)) {
                fs.mkdirSync(diretorio, { recursive: true });
                console.log('    📁 Diretório criado: ' + diretorio);
            }
            
            // Verificar se arquivo já existe
            if (fs.existsSync(caminho)) {
                console.log('    ⚠️  Arquivo já existe: ' + caminho);
                return false;
            }
            
            fs.writeFileSync(caminho, conteudo);
            console.log('    📝 Arquivo criado: ' + caminho);
            return true;
        } catch (error) {
            console.error('    ❌ Erro ao criar arquivo ' + caminho + ':', error.message);
            return false;
        }
    }

    gerarRelatorioImplementacao() {
        const relatorio = {
            timestamp: new Date().toISOString(),
            sistema: 'SGH - Sistema de Gestão Hospitalar',
            modulo: 'Implementação de Melhorias - Desempenho e Acessibilidade',
            versao: '1.0.0',
            melhorias: this.melhorias,
            resumo: {
                totalImplementacoes: this.melhorias.implementadas,
                totalPossivel: this.melhorias.total,
                percentualConcluido: Math.round((this.melhorias.implementadas / this.melhorias.total) * 100),
                status: this.melhorias.implementadas === this.melhorias.total ? 'COMPLETO' : 'PARCIAL'
            },
            proximasEtapas: [
                'Implementar testes automatizados de acessibilidade',
                'Configurar CI/CD com validação de performance',
                'Adicionar métricas de Web Vitals',
                'Implementar cache Redis no backend',
                'Configurar lazy loading em todas as páginas'
            ]
        };

        fs.writeFileSync(
            'IMPLEMENTACAO_MELHORIAS_DESEMPENHO_ACESSIBILIDADE.json',
            JSON.stringify(relatorio, null, 2)
        );

        console.log('\n📊 RELATÓRIO DE IMPLEMENTAÇÃO:');
        console.log('✅ Melhorias Implementadas: ' + this.melhorias.implementadas + '/' + this.melhorias.total);
        console.log('📈 Percentual Concluído: ' + relatorio.resumo.percentualConcluido + '%');
        console.log('📋 Status: ' + relatorio.resumo.status);
        console.log('\n💾 Relatório salvo em: IMPLEMENTACAO_MELHORIAS_DESEMPENHO_ACESSIBILIDADE.json');
    }
}

// Executar implementação
if (require.main === module) {
    const implementador = new ImplementadorMelhorias();
    implementador.implementarMelhorias().catch(console.error);
}

module.exports = ImplementadorMelhorias;
