'use client';
import { useSession, signOut } from 'next-auth/react';

export default function ProtectedPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-100">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-100">
      <div className="bg-white p-10 shadow-xl rounded-2xl w-full max-w-sm flex flex-col gap-6 border border-gray-100">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-2 text-center">Protected Page</h2>
        <p className="text-gray-500 text-sm mb-4 text-center">You are logged in!</p>
        <div className="flex flex-col gap-2 text-center">
          <span className="text-gray-700 font-medium">Name:</span>
          <span className="text-lg text-blue-700">{session?.user?.name || '-'}</span>
          <span className="text-gray-700 font-medium mt-2">Email:</span>
          <span className="text-lg text-blue-700">{session?.user?.email || '-'}</span>
        </div>
        <button onClick={() => signOut({ callbackUrl: '/login' })} className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold shadow hover:bg-red-600 transition mt-4">
          Sign Out
        </button>
      </div>
    </div>
  );
}
