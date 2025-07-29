'use client';

import { CustomSessionProvider } from './session-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return <CustomSessionProvider>{children}</CustomSessionProvider>;
}
