'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Thermometer, Droplet, Activity, User, Wifi, Settings, Download, MessageCircle } from 'lucide-react';
import { db } from '../lib/firebase';
import { ref as dbRef, onValue, set } from 'firebase/database';
import { useAuth } from './context/AuthContext';

function round2(val) {
  return Number(val || 0).toFixed(2);
}

function StatCard({ icon, label, value, trend }) {
  const TrendIcon = trend === 'up' ? Activity : Activity;
  const trendColor = trend === 'up' ? 'text-green-600' : 'text-red-600';
  const bgGradient = label === 'Temperature' ? 'from-orange-500 to-red-500' : 
                     label === 'Moisture' ? 'from-blue-500 to-cyan-500' :
                     label === 'Humidity' ? 'from-indigo-500 to-blue-500' :
                     'from-green-600 to-emerald-600';
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 p-4 flex items-center">
      <div className={`w-14 h-14 bg-gradient-to-br ${bgGradient} rounded-full flex items-center justify-center`}>
        {icon ? React.cloneElement(icon, { className: 'w-7 h-7 text-white' }) : null}
      </div>
      <div className="ml-4">
        <div className="text-sm text-gray-500 font-medium">{label}</div>
        <div className="text-3xl font-bold text-gray-800">{value}</div>
        {trend && (
          <div className={`flex items-center text-xs font-semibold ${trendColor}`}> 
            <TrendIcon className="w-4 h-4" /> {trend === 'up' ? '↑ Increasing' : '↓ Decreasing'}
          </div>
        )}
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 p-6">
      <div className="font-semibold text-lg text-gray-800 mb-4 border-b border-gray-200 pb-3">{title}</div>
      {children}
    </div>
  );
}

function Navbar({ connected }) {
  const { user, logout } = useAuth();
  return (
    <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-green-600 shadow-lg z-10 flex justify-between items-center px-6 py-4">
      <div className="text-2xl font-bold text-white flex items-center space-x-2">
        🌾 <span>Smart Agriculture Dashboard</span>
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-1">
          <Wifi className={`w-5 h-5 ${connected ? 'text-green-200' : 'text-red-200'}`} />
          <span className={`text-xs font-semibold ${connected ? 'text-green-100' : 'text-red-100'}`}>
            {connected ? 'Connected' : 'Offline'}
          </span>
        </div>
        {user ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-emerald-600" />
            </div>
            <a href="/profile" className="text-sm text-white hover:text-green-100 font-medium transition">
              {user.email.split('@')[0]}
            </a>
            <button
              onClick={logout}
              className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full transition font-medium"
            >
              Sign out
            </button>
          </div>
        ) : (
          <a href="/login" className="text-sm text-white hover:text-green-100 font-medium transition">
            Sign in
          </a>
        )}
      </div>
    </div>
  );
}

function Chatbot({ chat, input, setInput, sendMessage }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex flex-col h-96">
      <div className="font-semibold text-lg text-gray-800 mb-4 flex items-center border-b border-gray-200 pb-3">
        <MessageCircle className="w-5 h-5 mr-2 text-emerald-600" /> AI Farm Assistant
      </div>
      <div className="flex-1 overflow-auto mb-4 bg-gradient-to-b from-green-50 to-white rounded-lg p-4 space-y-3">
        {chat.map((msg, idx) => (
          <div key={idx} className={msg.from === 'user' ? 'text-right' : 'text-left'}>
            <span className={`inline-block px-4 py-2 rounded-lg max-w-xs ${msg.from === 'user' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500 transition"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your farm..."
        />
        <button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 rounded-lg font-medium transition" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [threshold, setThreshold] = useState(30);
  const [thresholdInput, setThresholdInput] = useState(threshold);
  const router = useRouter();

  // load threshold from firebase when user available
  useEffect(() => {
    if (user) {
      const tRef = dbRef(db, `settings/${user.uid}/moistureThreshold`);
      onValue(tRef, (snap) => {
        const val = snap.val();
        if (val !== null) {
          setThreshold(val);
          setThresholdInput(val);
        }
      });
    }
  }, [user]);

  const saveThreshold = () => {
    if (user) {
      const tRef = dbRef(db, `settings/${user.uid}/moistureThreshold`);
      set(tRef, thresholdInput);
      setThreshold(thresholdInput);
    }
  };

  const downloadCSV = () => {
    const header = 'time,temperature,moisture,humidity\n';
    const rows = sensorData
      .map((d) => `${d.time},${round2(d.temperature)},${round2(d.moisture)},${round2(d.humidity)}`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sensors.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const [sensorData, setSensorData] = useState([]);
  const [stats, setStats] = useState({ temp: 0, moisture: 0, humidity: 0 });
  const [connected, setConnected] = useState(true);
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState('');

  // redirect if not signed in
  useEffect(() => {
    if (user === null) {
      router.push('/login');
    }
  }, [user, router]);

  // subscribe realtime
  useEffect(() => {
    const sensorsRef = dbRef(db, 'sensors');
    return onValue(sensorsRef, (snapshot) => {
      const val = snapshot.val() || {};
      const entries = Object.entries(val).map(([time, obj]) => ({
        time,
        temperature: obj.temperature,
        moisture: obj.moisture,
        humidity: obj.humidity,
      }));
      setSensorData(entries);
      if (entries.length) {
        const last = entries[entries.length - 1];
        setStats({
          temp: last.temperature,
          moisture: last.moisture,
          humidity: last.humidity,
        });
        // connectivity check simple
        setConnected(true);
      }
    });
  }, []);
  
  // ask user for notification permission up front
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);


  // notifications threshold (uses user setting)
  useEffect(() => {
    if ('serviceWorker' in navigator && stats.moisture < threshold) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification('Low Moisture Alert', {
          body: `Soil moisture is ${round2(stats.moisture)}%, take action!`,
        });
      });
    }
  }, [stats.moisture, threshold]);

  // automated insight: push latest stats to AI for advice every time it changes
  useEffect(() => {
    if (stats.temp || stats.moisture || stats.humidity) {
      fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Provide insights for current readings.',
          context: { sensors: stats },
        }),
      })
        .then((res) => res.json())
        .then((resp) => {
          const text = resp?.choices?.[0]?.message?.content;
          if (text) {
            setChat((c) => [...c, { from: 'ai', text }]);
          }
        })
        .catch(console.error);
    }
  }, [stats]);

  const sendMessage = async (message) => {
    const userEntry = { from: 'user', text: message };
    setChat((c) => [...c, userEntry]);
    const payload = { message };
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      const assistantText =
        data?.choices?.[0]?.message?.content || 'Sorry, no response';
      setChat((c) => [...c, { from: 'ai', text: assistantText }]);
    } catch (e) {
      setChat((c) => [...c, { from: 'ai', text: 'Error contacting AI' }]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50">
      <Navbar connected={connected} />
      <main className="p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Farm Monitoring Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time sensor data and AI-powered insights</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Thermometer className="w-6 h-6" />}
            label="Temperature"
            value={round2(stats.temp)}
            trend="up"
          />
          <StatCard
            icon={<Droplet className="w-6 h-6" />}
            label="Moisture"
            value={round2(stats.moisture)}
            trend={stats.moisture < threshold ? 'down' : 'up'}
          />
          <StatCard
            icon={<Activity className="w-6 h-6" />}
            label="Humidity"
            value={round2(stats.humidity)}
            trend="up"
          />
          <StatCard
            icon={<Settings className="w-6 h-6" />}
            label="Threshold"
            value={round2(threshold)}
          />
        </div>
        {/* settings row */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-green-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-emerald-600" /> Settings & Controls
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-semibold text-gray-700">Moisture Threshold (%):</label>
              <input
                type="number"
                className="w-20 border-2 border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500 transition"
                value={thresholdInput}
                onChange={(e) => setThresholdInput(Number(e.target.value))}
              />
              <button
                onClick={saveThreshold}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
              >
                Save
              </button>
            </div>
            <button
              onClick={downloadCSV}
              className="flex items-center space-x-2 text-sm text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-4 py-2 rounded-lg font-medium transition"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <ChartCard title="Temperature Over Time">
            <ResponsiveContainer width="100%" aspect={2 / 1}>
              <LineChart data={sensorData}>
                <defs>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip formatter={(value) => round2(value)} />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Moisture Over Time">
            <ResponsiveContainer width="100%" aspect={2 / 1}>
              <BarChart data={sensorData}>
                <XAxis dataKey="time" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip formatter={(value) => round2(value)} />
                <Bar
                  dataKey="moisture"
                  fill="url(#moistureGrad)"
                  barSize={20}
                />
                <defs>
                  <linearGradient id="moistureGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="mt-8">
          <Chatbot
            chat={chat}
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
          />
        </div>
      </main>
    </div>
  );
}
