'use client';
import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function LoginGoogle({ children }: { children: React.ReactNode }) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      console.error('Google sign-in error:', error);
      setIsGoogleLoading(false);
    }
  }
  return (
    <Button variant="outline" type="button" className="w-full" disabled={isGoogleLoading} onClick={handleGoogleSignIn}>
      {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Image src="/google.svg" alt="google" width={16} height={16} className="mr-2" />}
      {children} with Google
    </Button>
  );
}
