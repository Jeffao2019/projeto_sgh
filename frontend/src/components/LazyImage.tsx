import React from 'react';
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
};