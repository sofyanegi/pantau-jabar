'use client';

import { CustomSessionProvider } from './session-provider';
import { ThemeProvider } from './theme-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <CustomSessionProvider>{children}</CustomSessionProvider>
    </ThemeProvider>
  );
}
