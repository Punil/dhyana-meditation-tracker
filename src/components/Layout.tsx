import React, { useState } from 'react';
import { Timer, Calendar, BarChart, Settings, Flower, Bird } from 'lucide-react';
import { cn } from '../utils/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'timer' | 'history' | 'progress' | 'settings';
  setActiveTab: (tab: 'timer' | 'history' | 'progress' | 'settings') => void;
}

export function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50 relative overflow-hidden flex flex-col">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 -right-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-20 left-20 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-2000"></div>
        
        {/* SVG Lotus/Flower Decorations */}
        <Flower className="absolute top-10 right-10 text-pink-300 w-12 h-12 opacity-20 rotate-12" />
        <Flower className="absolute bottom-32 left-5 text-yellow-400 w-8 h-8 opacity-20 -rotate-12" />
        <Flower className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-magenta-200 w-96 h-96 opacity-5 pointer-events-none" />
        
        {/* Yellowish Flowers */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-30 flex items-end gap-6 pointer-events-none z-0">
           <Flower className="w-16 h-16 text-yellow-500 rotate-12" />
           <Flower className="w-24 h-24 text-yellow-400 -rotate-12 mb-2" />
           <Flower className="w-16 h-16 text-yellow-500 rotate-45" />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 overflow-y-auto pt-safe pb-32">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-pink-100 shadow-lg z-50 pb-safe">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          <NavButton 
            active={activeTab === 'timer'} 
            onClick={() => setActiveTab('timer')} 
            icon={<Timer size={24} />} 
            label="Meditate" 
          />
          <NavButton 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
            icon={<Calendar size={24} />} 
            label="History" 
          />
          <NavButton 
            active={activeTab === 'progress'} 
            onClick={() => setActiveTab('progress')} 
            icon={<BarChart size={24} />} 
            label="Progress" 
          />
          <NavButton 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
            icon={<Settings size={24} />} 
            label="Settings" 
          />
        </div>
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center w-full h-full transition-colors duration-200",
        active ? "text-pink-600" : "text-gray-400 hover:text-pink-400"
      )}
    >
      <div className={cn("transform transition-transform duration-200", active ? "scale-110" : "scale-100")}>
        {icon}
      </div>
      <span className="text-[10px] mt-1 font-medium">{label}</span>
    </button>
  );
}
