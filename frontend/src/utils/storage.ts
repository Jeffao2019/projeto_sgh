// Utilitários de Storage para Cache Local
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
}