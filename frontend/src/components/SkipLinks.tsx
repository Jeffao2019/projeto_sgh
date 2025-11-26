import React from 'react';
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
}