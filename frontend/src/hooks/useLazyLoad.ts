import { useState, useRef, useCallback, useEffect } from 'react';

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
};