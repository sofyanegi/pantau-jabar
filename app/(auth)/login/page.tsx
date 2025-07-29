'use client';

import { useState, useEffect } from 'react';
import { validateEmail } from '@/libs/validateEmail'; // ensure this is correct
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailInPutError, setEmailInputError] = useState(false);
  const [passwordInPutError, setPasswordInputError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const emailIsValid = validateEmail(email);
    setEmailInputError(!emailIsValid);
    setPasswordInputError(password.length < 6);
    return emailIsValid && password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) {
      setError('Please enter valid credentials.');
      return;
    }

    setIsLoading(true);
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push(res.url || '/');
    } else {
      setError('Login failed. Please check your email or password.');
    }
    setIsLoading(false);
  };

  return (
    <div className="text-black flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-100">
      <form onSubmit={handleSubmit} className="bg-white p-10 shadow-xl rounded-2xl w-full max-w-sm flex flex-col gap-6 border border-gray-100">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-2 text-center">Masuk dengan akun anda</h2>
        <p className="text-gray-500 text-sm mb-4 text-center">Selamat datang kembali! silakan masukan detail akun anda</p>

        <div className="flex flex-col gap-1">
          <label className="text-gray-700 font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className={` w-full p-3 border rounded-lg outline-none transition focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-gray-50 ${emailInPutError ? 'border-red-400' : 'border-gray-300'}`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-gray-700 font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className={` w-full p-3 border rounded-lg outline-none transition focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-gray-50 ${passwordInPutError ? 'border-red-400' : 'border-gray-300'}`}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-2 text-sm text-center animate-fade-in mb-2">{error}</div>}

        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed mt-2" disabled={isLoading}>
          {isLoading ? 'Logging in…' : 'Login'}
        </button>

        <p className="mt-2 text-sm text-center text-gray-600">
          Belum punya akun?{' '}
          <Link href="/register" className="text-blue-600 hover:underline font-medium">
            Daftar
          </Link>
        </p>
      </form>
    </div>
  );
}
