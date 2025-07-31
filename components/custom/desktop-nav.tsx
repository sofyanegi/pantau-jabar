'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Home, Map, Heart, FileText, Video, LayoutDashboard, User, LogOut } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Map', href: '/map', icon: Map },
  { name: 'Favorites', href: '/favorites', icon: Heart },
  { name: 'My Report', href: '/report', icon: FileText },
];

function UserNav() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="h-9 w-24 rounded-md bg-muted animate-pulse" />;
  }

  if (!session?.user) {
    return (
      <Button asChild size="sm">
        <Link href="/login">Login</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9 border-2 border-transparent hover:border-primary/50 transition-colors">
            <AvatarImage src={session.user.image ?? ''} alt={session.user.name ?? 'User Avatar'} />
            <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">{session.user.name?.[0].toUpperCase() ?? '?'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session.user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {session.user.role === 'ADMIN' && (
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/admin/cctvs" className="w-full cursor-pointer">
                <LayoutDashboard className="mr-2 h-4 w-4 text-yellow-500" />
                <span>Admin Panel</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
        <DropdownMenuItem onClick={() => signOut()} className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function DesktopNav() {
  const pathname = usePathname();

  return (
    <header className="hidden md:flex bg-background/90 backdrop-blur-sm border-b sticky top-0 z-50 transition-colors duration-300">
      <nav className="container mx-auto px-6 py-2.5 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group" aria-label="PANTAU JABAR Home">
          <Video className="h-7 w-7 text-primary transition-transform duration-300 group-hover:scale-110" />
          <span className="text-xl font-bold text-foreground tracking-tight">PANTAU JABAR</span>
        </Link>

        <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-lg">
          {navItems.map(({ name, href, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn('transition-all duration-200 px-3 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary', isActive && 'text-primary font-semibold bg-background shadow-sm')}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{name}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserNav />
        </div>
      </nav>
    </header>
  );
}
