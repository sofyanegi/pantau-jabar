'use client';
import { LayoutDashboard, Video } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { ThemeToggle } from './theme-toggle';
import Link from 'next/link';

export default function MobileNav() {
  const { data: session } = useSession();

  return (
    <header className="md:hidden bg-background/90 backdrop-blur-sm border-b p-4 flex justify-between items-center sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2">
        <Video className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold">PANTAU JABAR</span>
      </Link>
      <div className="flex items-center gap-2">
        {session?.user?.role === 'ADMIN' && (
          <Link href="/admin/cctv" className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300">
            <LayoutDashboard className="w-5 h-5" />
          </Link>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
