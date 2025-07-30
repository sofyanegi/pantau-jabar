'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navItems } from './desktop-nav';

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm border-t z-50">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          // Logika untuk menentukan item aktif
          const isActive = item.href === '/' ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn('flex flex-col items-center justify-center gap-1 w-full h-full transition-colors duration-200 ease-in-out', isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary/80')}
            >
              <Icon className={'w-6 h-6'} />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}
