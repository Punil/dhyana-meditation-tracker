import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Timer } from './components/Timer';
import { History } from './components/History';
import { Progress } from './components/Progress';
import { Settings } from './components/Settings';
import { playSound } from './utils/utils';
import { Flower } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'timer' | 'history' | 'progress' | 'settings'>('timer');
  const [hasStarted, setHasStarted] = useState(false);

  const handleStart = () => {
    setHasStarted(true);
    playSound('chorus-bell');
  };

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-orange-100 flex flex-col items-center justify-center p-4 pt-safe relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
          <Flower className="absolute top-10 left-10 text-pink-200 w-24 h-24 animate-pulse opacity-20" />
          <Flower className="absolute bottom-20 right-10 text-orange-200 w-32 h-32 animate-pulse delay-700 opacity-20" />
        </div>

        <div className="z-10 text-center space-y-8 animate-in fade-in zoom-in duration-1000">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-pink-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <img 
              src="https://cdn-icons-png.flaticon.com/512/2913/2913520.png" 
              alt="Lotus Icon" 
              className="w-24 h-24 relative z-10 drop-shadow-lg"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div>
            <h1 className="text-5xl font-serif text-pink-900 mb-2 tracking-tight">Dhyana</h1>
            <p className="text-lg text-pink-600 font-light italic">Path to grace and culmination</p>
          </div>

          <button 
            onClick={handleStart}
            className="px-12 py-4 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-full text-lg font-medium shadow-xl shadow-pink-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95"
          >
            Enter Sanctuary
          </button>
        </div>
        
        <div className="absolute bottom-8 text-xs text-gray-400 font-mono">
          Tap to begin your journey
        </div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'timer' && <Timer />}
      {activeTab === 'history' && <History />}
      {activeTab === 'progress' && <Progress />}
      {activeTab === 'settings' && <Settings />}
    </Layout>
  );
}
