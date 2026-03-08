'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();
  const { register, user } = useAuth();

  if (user) {
    router.push('/dashboard');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-amber-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-green-100">
        <div className="mb-6 text-center">
          <div className="inline-block p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full mb-4">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 text-sm mt-1">Join Smart Agriculture today</p>
        </div>
        {error && <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg mb-4 border border-red-200">⚠️ {error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              className="w-full border-2 border-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:border-green-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full border-2 border-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:border-green-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-2.5 rounded-lg mt-2 transition-all transform hover:scale-105"
          >
            Create Account
          </button>
        </form>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-600 text-sm">
            Already have an account?{' '}
            <a href="/login" className="text-green-600 hover:text-green-700 font-semibold transition">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
