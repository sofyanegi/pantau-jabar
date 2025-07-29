'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPassError(password !== confirmPassword && confirmPassword.length > 0);
  }, [password, confirmPassword]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError('');
    setIsLoading(true);

    if (passError) {
      setSubmitError('Password tidak cocok');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        router.push('/login');
      } else {
        const data = await res.json();
        setSubmitError(data.message || 'Gagal mendaftar');
      }
    } catch (err) {
      setSubmitError('Terjadi kesalahan saat mendaftar');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="text-black flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-100">
      <form onSubmit={handleSubmit} className="bg-white p-10 shadow-xl rounded-2xl w-full max-w-sm flex flex-col gap-6 border border-gray-100">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-2 text-center">Buat Akun Baru</h2>
        <p className="text-gray-500 text-sm mb-4 text-center">Silakan isi data di bawah untuk mendaftar.</p>

        <div className="flex flex-col gap-1">
          <label className="text-gray-700 font-medium" htmlFor="name">
            Nama
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-lg outline-none transition focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-gray-50 border-gray-300"
            placeholder="Nama lengkap"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-gray-700 font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg outline-none transition focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-gray-50 border-gray-300"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-gray-700 font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg outline-none transition focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-gray-50 border-gray-300"
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-gray-700 font-medium" htmlFor="confirmPassword">
            Konfirmasi Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full p-3 border rounded-lg outline-none transition focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-gray-50 ${passError ? 'border-red-400' : 'border-gray-300'}`}
            placeholder="••••••••"
            autoComplete="new-password"
          />
          {passError && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-2 text-xs text-center animate-fade-in mt-1">Password tidak cocok</div>}
        </div>

        {submitError && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-2 text-sm text-center animate-fade-in mb-2">{submitError}</div>}

        <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed mt-2">
          {isLoading ? 'Mendaftar…' : 'Daftar'}
        </button>

        <p className="mt-2 text-sm text-center text-gray-600">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Masuk di sini
          </Link>
        </p>
      </form>
    </div>
  );
}
