'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Home, Map, Users, Video, Settings, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '../custom/theme-toggle';

const navLinks = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/cities', icon: Map, label: 'Kota' },
  { href: '/cctvs', icon: Video, label: 'CCTV' },
  { href: '/users', icon: Users, label: 'Pengguna' },
];

export function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname.startsWith(`/admin${href}`);

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          {navLinks.map((link) => (
            <Tooltip key={link.href}>
              <TooltipTrigger asChild>
                <Link
                  href={`/admin${link.href}`}
                  className={cn('flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8', isActive(link.href) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground')}
                >
                  <link.icon className="h-5 w-5" />
                  <span className="sr-only">{link.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{link.label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>

        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <ThemeToggle />
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/" className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
                <Home className="h-5 w-5" />
                <span className="sr-only">Home</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Home</TooltipContent>
          </Tooltip>
        </nav>
      </TooltipProvider>
    </aside>
  );
}
