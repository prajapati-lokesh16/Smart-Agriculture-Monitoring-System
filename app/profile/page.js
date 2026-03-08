'use client';
import { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const {
    user,
    loading,
    logout,
    changeEmail,
    changePassword,
    resetPassword,
  } = useAuth();
  const router = useRouter();
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="p-4">Loading...</div>;
  }

  const handleEmailUpdate = async () => {
    try {
      await changeEmail(newEmail);
      setMessage('Email updated');
    } catch (e) {
      setMessage(e.message);
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      await changePassword(newPassword);
      setMessage('Password updated');
    } catch (e) {
      setMessage(e.message);
    }
  };

  const handleReset = async () => {
    try {
      await resetPassword(user.email);
      setMessage('Reset email sent');
    } catch (e) {
      setMessage(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-8">
          <div className="flex items-center mb-6 pb-6 border-b border-green-100">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mr-4">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Your Profile</h2>
              <p className="text-gray-500 text-sm">Manage your account settings</p>
            </div>
          </div>
          
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-6">
            <p className="text-gray-700">
              <span className="font-semibold text-green-700">Email:</span> {user.email}
            </p>
          </div>
          
          {message && <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-6 border border-green-200">✓ {message}</div>}
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Change Email Address</label>
              <input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full border-2 border-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:border-green-500 transition mb-3"
                placeholder="New email address"
              />
              <button
                onClick={handleEmailUpdate}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
              >
                Update Email
              </button>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Change Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border-2 border-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:border-green-500 transition mb-3"
                placeholder="New password"
              />
              <button
                onClick={handlePasswordUpdate}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
              >
                Update Password
              </button>
            </div>
            
            <div className="flex gap-4">
              <button onClick={handleReset} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm">
                Send Reset Email
              </button>
              <button
                onClick={logout}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
