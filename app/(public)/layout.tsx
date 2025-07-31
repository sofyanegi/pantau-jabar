import DesktopNav from '@/components/custom/desktop-nav';
import MobileHeader from '@/components/custom/mobile-header';
import MobileNav from '@/components/custom/mobile-nav';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <DesktopNav />
      <MobileHeader />
      <main className="container mx-auto p-4 sm:p-6 pb-24 md:pb-6">{children}</main>
      <MobileNav />
    </div>
  );
}
