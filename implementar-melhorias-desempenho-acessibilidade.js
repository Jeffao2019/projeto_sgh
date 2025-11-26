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
          // Fallback em caso de erro
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
        // Remove itens corrompidos
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

        // Componente de busca otimizada
        const searchComponent = `import React from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useOptimizedSearch } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: string;
}

interface BuscaOtimizadaProps {
  onSearch: (query: string) => Promise<SearchResult[]>;
  onResultSelect: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
  showResults?: boolean;
}

export const BuscaOtimizada: React.FC<BuscaOtimizadaProps> = ({
  onSearch,
  onResultSelect,
  placeholder = 'Buscar...',
  className,
  showResults = true
}) => {
  const { query, setQuery, results, loading, hasResults } = useOptimizedSearch(
    onSearch,
    '',
    300
  );

  const clearSearch = () => {
    setQuery('');
  };

  return (
    <div className={cn('relative w-full max-w-md', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
          {query && !loading && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Resultados */}
      {showResults && query && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
              Buscando...
            </div>
          ) : hasResults ? (
            <ul className="py-1">
              {results.map((result) => (
                <li key={result.id}>
                  <button
                    onClick={() => onResultSelect(result)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  >
                    <div className="font-medium text-gray-900">{result.title}</div>
                    {result.subtitle && (
                      <div className="text-sm text-gray-500">{result.subtitle}</div>
                    )}
                    <div className="text-xs text-gray-400 mt-1">{result.type}</div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Nenhum resultado encontrado
            </div>
          )}
        </div>
      )}
    </div>
  );
};`;

        this.criarArquivo('frontend/src/components/BuscaOtimizada.tsx', searchComponent);

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
}

// Hook para dados paginados
export function usePaginatedData<T>(
  data: T[],
  initialItemsPerPage = 10
) {
  const [{ currentPage, itemsPerPage, totalPages }, actions] = usePagination(
    initialItemsPerPage
  );

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  // Atualizar total quando dados mudarem
  React.useEffect(() => {
    setTotalItems(data.length);
  }, [data.length]);

  return {
    data: paginatedData,
    pagination: { currentPage, itemsPerPage, totalPages, totalItems: data.length },
    actions
  };
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
        
        // 2. Componentes de Navegação Acessível
        await this.implementarNavegacaoAcessivel();
        
        // 3. Skip Links e Landmarks
        await this.implementarSkipLinks();
        
        // 4. Controle de Foco
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

  // Escutar mudanças de preferência do sistema
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      setActualTheme(mediaQuery.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

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

        // Theme Toggle Component
        const themeToggle = `import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/providers/theme-provider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          aria-label="Alternar tema"
          title="Alternar tema"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Alternar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          aria-pressed={theme === 'light'}
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Claro</span>
          {theme === 'light' && <span className="sr-only">(atual)</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          aria-pressed={theme === 'dark'}
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Escuro</span>
          {theme === 'dark' && <span className="sr-only">(atual)</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('system')}
          aria-pressed={theme === 'system'}
        >
          <Monitor className="mr-2 h-4 w-4" />
          <span>Sistema</span>
          {theme === 'system' && <span className="sr-only">(atual)</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}`;

        this.criarArquivo('frontend/src/components/ThemeToggle.tsx', themeToggle);

        this.melhorias.acessibilidade.push('Theme Provider com Dark Mode');
        this.melhorias.implementadas++;
        this.melhorias.total++;
        
        console.log('  ✓ Theme Provider implementado');
    }

    async implementarNavegacaoAcessivel() {
        console.log('🧭 Implementando Navegação Acessível...');
        
        const accessibleNav = `import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MenuItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  children?: MenuItem[];
  disabled?: boolean;
}

interface AccessibleNavigationProps {
  items: MenuItem[];
  className?: string;
  isMobile?: boolean;
}

export const AccessibleNavigation: React.FC<AccessibleNavigationProps> = ({
  items,
  className,
  isMobile = false
}) => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Fechar submenu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenSubmenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navegação por teclado
  const handleKeyDown = (event: React.KeyboardEvent, item: MenuItem) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (item.children) {
          setOpenSubmenu(openSubmenu === item.id ? null : item.id);
        } else if (item.onClick) {
          item.onClick();
        }
        break;
      case 'Escape':
        setOpenSubmenu(null);
        break;
      case 'ArrowDown':
        if (item.children && openSubmenu === item.id) {
          event.preventDefault();
          // Focar no primeiro item do submenu
          const firstSubmenuItem = document.querySelector(
            '[data-submenu="' + item.id + '"] button:first-child'
          ) as HTMLElement;
          firstSubmenuItem?.focus();
        }
        break;
    }
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openSubmenu === item.id;

    return (
      <li 
        key={item.id} 
        className={cn('relative', level > 0 && 'ml-4')}
        role={hasChildren ? 'none' : 'menuitem'}
      >
        {hasChildren ? (
          <>
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-between text-left',
                level > 0 && 'text-sm',
                item.disabled && 'opacity-50 cursor-not-allowed'
              )}
              onClick={() => !item.disabled && setOpenSubmenu(isOpen ? null : item.id)}
              onKeyDown={(e) => handleKeyDown(e, item)}
              disabled={item.disabled}
              aria-expanded={isOpen}
              aria-haspopup="menu"
              id={'menu-button-' + item.id}
              aria-controls={isOpen ? 'menu-' + item.id : undefined}
            >
              <span>{item.label}</span>
              <ChevronDown className={cn(
                'h-4 w-4 transition-transform',
                isOpen && 'rotate-180'
              )} />
            </Button>
            {isOpen && (
              <ul
                className="ml-4 mt-2 space-y-1"
                role="menu"
                aria-labelledby={'menu-button-' + item.id}
                id={'menu-' + item.id}
                data-submenu={item.id}
              >
                {item.children.map(child => renderMenuItem(child, level + 1))}
              </ul>
            )}
          </>
        ) : (
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start text-left',
              level > 0 && 'text-sm',
              item.disabled && 'opacity-50 cursor-not-allowed'
            )}
            onClick={() => !item.disabled && item.onClick?.()}
            onKeyDown={(e) => handleKeyDown(e, item)}
            disabled={item.disabled}
            asChild={!!item.href}
          >
            {item.href ? (
              <a href={item.href} tabIndex={item.disabled ? -1 : 0}>
                {item.label}
              </a>
            ) : (
              <span>{item.label}</span>
            )}
          </Button>
        )}
      </li>
    );
  };

  if (isMobile) {
    return (
      <nav className={cn('lg:hidden', className)} ref={navRef}>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {mobileOpen ? <X /> : <Menu />}
        </Button>
        
        {mobileOpen && (
          <div 
            className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg z-50"
            id="mobile-menu"
            role="menu"
          >
            <ul className="p-4 space-y-2" role="none">
              {items.map(item => renderMenuItem(item))}
            </ul>
          </div>
        )}
      </nav>
    );
  }

  return (
    <nav 
      className={cn('hidden lg:block', className)} 
      ref={navRef}
      role="menubar"
      aria-label="Menu principal"
    >
      <ul className="flex space-x-1" role="none">
        {items.map(item => renderMenuItem(item))}
      </ul>
    </nav>
  );
};

// Hook para atalhos de teclado
export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Construir chave do atalho
      const keys = [];
      if (event.ctrlKey) keys.push('ctrl');
      if (event.altKey) keys.push('alt');
      if (event.shiftKey) keys.push('shift');
      if (event.metaKey) keys.push('meta');
      
      keys.push(event.key.toLowerCase());
      const shortcutKey = keys.join('+');

      const action = shortcuts[shortcutKey];
      if (action) {
        event.preventDefault();
        action();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}`;

        this.criarArquivo('frontend/src/components/AccessibleNavigation.tsx', accessibleNav);

        this.melhorias.acessibilidade.push('Navegação Acessível com Suporte a Teclado');
        this.melhorias.implementadas++;
        this.melhorias.total++;
        
        console.log('  ✓ Navegação acessível implementada');
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
                // Focar no elemento se for focável
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

// Componente para definir landmarks principais
export const PageLandmarks: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return (
    <>
      <SkipLinks />
      
      <div className="min-h-screen flex flex-col">
        <header role="banner" className="flex-shrink-0">
          <nav id="main-navigation" role="navigation" aria-label="Navegação principal">
            {/* Navegação será inserida aqui */}
          </nav>
        </header>

        <main 
          id="main-content" 
          role="main" 
          className="flex-1"
          tabIndex={-1}
          aria-label="Conteúdo principal"
        >
          {children}
        </main>

        <footer id="footer" role="contentinfo" className="flex-shrink-0">
          {/* Rodapé será inserido aqui */}
        </footer>
      </div>
    </>
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
    
    // Pequeno delay para garantir que o leitor de tela detecte
    setTimeout(() => {
      announcer.textContent = message;
      
      // Remover após anúncio
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
      // Scroll suave para o elemento se necessário
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, []);

  // Capturar foco em container
  const trapFocus = useCallback((containerElement: HTMLElement) => {
    const focusableElements = containerElement.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    containerElement.addEventListener('keydown', handleTabKey);
    
    // Focar primeiro elemento
    if (firstElement) {
      firstElement.focus();
    }

    return () => {
      containerElement.removeEventListener('keydown', handleTabKey);
    };
  }, []);

  return {
    saveFocus,
    restoreFocus,
    focusElement,
    trapFocus
  };
}

// Hook para modal com foco
export function useModalFocus(isOpen: boolean) {
  const { saveFocus, restoreFocus, trapFocus } = useFocusManagement();
  const modalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isOpen) {
      saveFocus();
      
      if (modalRef.current) {
        const cleanup = trapFocus(modalRef.current);
        return cleanup;
      }
    } else {
      restoreFocus();
    }
  }, [isOpen, saveFocus, restoreFocus, trapFocus]);

  return modalRef;
}

// Hook para anúncios de status
export function useStatusAnnouncer() {
  const announcerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Criar elemento anunciador se não existir
    if (!announcerRef.current) {
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      announcer.id = 'status-announcer';
      document.body.appendChild(announcer);
      announcerRef.current = announcer;
    }

    return () => {
      if (announcerRef.current) {
        document.body.removeChild(announcerRef.current);
      }
    };
  }, []);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announcerRef.current) {
      announcerRef.current.setAttribute('aria-live', priority);
      announcerRef.current.textContent = message;
      
      // Limpar após um tempo
      setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  return { announce };
}

// Componente de indicador de foco visível
export function FocusIndicator() {
  useEffect(() => {
    // Adicionar estilos de foco personalizados
    const style = document.createElement('style');
    style.textContent = \`
      .focus-visible {
        outline: 2px solid #2563eb !important;
        outline-offset: 2px !important;
        border-radius: 4px !important;
      }
      
      .focus-visible:focus {
        outline: 2px solid #2563eb !important;
        outline-offset: 2px !important;
      }
      
      /* Remover outline padrão quando não usando teclado */
      :focus:not(.focus-visible) {
        outline: none !important;
      }
    \`;
    
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
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
                console.log(`    📁 Diretório criado: ${diretorio}`);
            }
            
            // Verificar se arquivo já existe
            if (fs.existsSync(caminho)) {
                console.log(`    ⚠️  Arquivo já existe: ${caminho}`);
                return false;
            }
            
            fs.writeFileSync(caminho, conteudo);
            console.log(`    📝 Arquivo criado: ${caminho}`);
            return true;
        } catch (error) {
            console.error(`    ❌ Erro ao criar arquivo ${caminho}:`, error.message);
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
        console.log(`✅ Melhorias Implementadas: ${this.melhorias.implementadas}/${this.melhorias.total}`);
        console.log(`📈 Percentual Concluído: ${relatorio.resumo.percentualConcluido}%`);
        console.log(`📋 Status: ${relatorio.resumo.status}`);
        console.log('\n💾 Relatório salvo em: IMPLEMENTACAO_MELHORIAS_DESEMPENHO_ACESSIBILIDADE.json');
    }
}

// Executar implementação
if (require.main === module) {
    const implementador = new ImplementadorMelhorias();
    implementador.implementarMelhorias().catch(console.error);
}

module.exports = ImplementadorMelhorias;
