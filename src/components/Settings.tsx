import React, { useState } from 'react';
import { useMeditation, Targets } from '../hooks/useMeditation';
import { Save, RefreshCw } from 'lucide-react';

export function Settings() {
  const { targets, updateTargets } = useMeditation();
  const [localTargets, setLocalTargets] = useState<Targets>(targets);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (key: keyof Targets, value: string) => {
    const numValue = parseInt(value) || 0;
    setLocalTargets((prev) => ({
      ...prev,
      [key]: numValue,
    }));
  };

  const handleSave = () => {
    updateTargets(localTargets);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleReset = () => {
    setLocalTargets({
      daily: 20,
      weekly: 140,
      monthly: 600,
      yearly: 7200,
      lifetime: 100000,
    });
  };

  return (
    <div className="p-4 max-w-md mx-auto min-h-screen pb-24">
      <h2 className="text-2xl font-serif text-pink-900 text-center mb-8">Settings</h2>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-pink-500 rounded-full"></span>
          Meditation Targets
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Set your goals to track your progress.
        </p>

        <div className="space-y-5">
          <TargetInput 
            label="Daily Goal" 
            value={localTargets.daily} 
            onChange={(v) => handleChange('daily', v)} 
            unit="minutes"
          />
          <TargetInput 
            label="Weekly Goal" 
            value={localTargets.weekly} 
            onChange={(v) => handleChange('weekly', v)} 
            unit="minutes"
          />
          <TargetInput 
            label="Monthly Goal" 
            value={Math.floor(localTargets.monthly / 60)} 
            onChange={(v) => handleChange('monthly', (parseInt(v) * 60).toString())} 
            unit="hours"
          />
          <TargetInput 
            label="Yearly Goal" 
            value={Math.floor(localTargets.yearly / 60)} 
            onChange={(v) => handleChange('yearly', (parseInt(v) * 60).toString())} 
            unit="hours"
          />
          <TargetInput 
            label="Lifetime Goal" 
            value={Math.floor(localTargets.lifetime / 60)} 
            onChange={(v) => handleChange('lifetime', (parseInt(v) * 60).toString())} 
            unit="hours"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={handleReset}
          className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 flex items-center justify-center gap-2"
        >
          <RefreshCw size={18} /> Reset
        </button>
        <button 
          onClick={handleSave}
          className={`flex-1 py-3 rounded-xl font-medium text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
            isSaved ? 'bg-green-500 shadow-green-200' : 'bg-pink-500 hover:bg-pink-600 shadow-pink-200'
          }`}
        >
          {isSaved ? 'Saved!' : <><Save size={18} /> Save Changes</>}
        </button>
      </div>
      
      <div className="mt-12 text-center text-xs text-gray-400">
        <p>Dhyana v1.0.0</p>
        <p className="mt-1">Made with peace & code</p>
      </div>
    </div>
  );
}

function TargetInput({ label, value, onChange, unit }: { label: string, value: number, onChange: (val: string) => void, unit: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <div className="relative">
        <input 
          type="number" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
        />
        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs font-medium text-gray-400 uppercase tracking-wider">
          {unit}
        </span>
      </div>
    </div>
  );
}
