'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';
import { Sprout, ArrowRight, User, UserPlus } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        <div className="mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6">
            <Sprout className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Smart Agriculture Monitoring</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Revolutionize your farming with real-time sensor data, AI-powered insights, and intelligent automation for optimal crop management.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Real-Time Monitoring</h3>
            <p className="text-gray-600 text-sm">Track temperature, moisture, and humidity levels instantly with IoT sensors.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">🤖</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Insights</h3>
            <p className="text-gray-600 text-sm">Get intelligent recommendations and automated alerts for better decision making.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">📈</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Data Analytics</h3>
            <p className="text-gray-600 text-sm">Visualize trends and export data for comprehensive farm analysis.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/login')}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
          >
            <User className="w-5 h-5" />
            <span>Sign In</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => router.push('/register')}
            className="flex items-center justify-center space-x-2 bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
          >
            <UserPlus className="w-5 h-5" />
            <span>Create Account</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-12 text-gray-500 text-sm">
          <p>Join thousands of farmers optimizing their yields with smart technology.</p>
        </div>
      </div>
    </div>
  );
}
