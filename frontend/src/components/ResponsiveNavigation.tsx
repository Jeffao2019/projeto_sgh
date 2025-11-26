import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MenuItem {
  id: string;
  label: string;
  href?: string;
  children?: MenuItem[];
}

interface ResponsiveNavigationProps {
  items: MenuItem[];
  className?: string;
}

export const ResponsiveNavigation: React.FC<ResponsiveNavigationProps> = ({
  items,
  className
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);

  const toggleSubmenu = (id: string) => {
    setOpenSubmenus(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const renderMenuItem = (item: MenuItem, level = 0) => (
    <li key={item.id} role="none">
      {item.children ? (
        <>
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-between text-left',
              level > 0 && 'ml-4 text-sm'
            )}
            onClick={() => toggleSubmenu(item.id)}
            aria-expanded={openSubmenus.includes(item.id)}
            aria-haspopup="menu"
          >
            <span>{item.label}</span>
            <ChevronDown 
              className={cn(
                'h-4 w-4 transition-transform',
                openSubmenus.includes(item.id) && 'rotate-180'
              )} 
            />
          </Button>
          {openSubmenus.includes(item.id) && (
            <ul role="menu" className="mt-2 space-y-1">
              {item.children.map(child => renderMenuItem(child, level + 1))}
            </ul>
          )}
        </>
      ) : (
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start text-left',
            level > 0 && 'ml-4 text-sm'
          )}
          asChild
        >
          <a href={item.href} role="menuitem">
            {item.label}
          </a>
        </Button>
      )}
    </li>
  );

  return (
    <nav className={cn('relative', className)} role="navigation" aria-label="Menu principal">
      {/* Botão mobile */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>

        {mobileOpen && (
          <div 
            id="mobile-navigation"
            className="absolute top-full left-0 right-0 bg-background border rounded-md shadow-lg z-50 p-4"
            role="menu"
          >
            <ul role="none" className="space-y-2">
              {items.map(item => renderMenuItem(item))}
            </ul>
          </div>
        )}
      </div>

      {/* Menu desktop */}
      <div className="hidden lg:block">
        <ul role="menubar" className="flex space-x-1">
          {items.map(item => (
            <li key={item.id} role="none">
              <Button variant="ghost" asChild>
                <a href={item.href} role="menuitem">
                  {item.label}
                </a>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};