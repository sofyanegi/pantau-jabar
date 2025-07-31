import DesktopNav from '@/components/custom/desktop-nav';
import MobileHeader from '@/components/custom/mobile-header';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <DesktopNav />
      <MobileHeader />
      <main className="container mx-auto ">{children}</main>
    </div>
  );
}
