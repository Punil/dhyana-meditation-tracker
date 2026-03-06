import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useMeditation, Targets } from '../hooks/useMeditation';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, format, subDays } from 'date-fns';

export function Progress() {
  const { sessions, targets } = useMeditation();

  // Helper to calculate total minutes within a range
  const getMinutesInRange = (start: Date, end: Date) => {
    return sessions
      .filter((s) => isWithinInterval(new Date(s.date), { start, end }))
      .reduce((acc, curr) => acc + curr.durationMinutes, 0);
  };

  const now = new Date();
  
  const dailyMinutes = getMinutesInRange(startOfDay(now), endOfDay(now));
  const weeklyMinutes = getMinutesInRange(startOfWeek(now), endOfWeek(now));
  const monthlyMinutes = getMinutesInRange(startOfMonth(now), endOfMonth(now));
  const yearlyMinutes = getMinutesInRange(startOfYear(now), endOfYear(now));
  const lifetimeMinutes = sessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);

  // Data for Weekly Chart (Last 7 days)
  const weeklyData = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(now, 6 - i);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    const minutes = getMinutesInRange(dayStart, dayEnd);
    return {
      name: format(date, 'EEE'),
      minutes,
    };
  });

  return (
    <div className="p-4 max-w-md mx-auto min-h-screen pb-24 space-y-8">
      <h2 className="text-2xl font-serif text-pink-900 text-center mb-6">Your Journey</h2>

      {/* Lifetime Stats */}
      <div className="bg-gradient-to-r from-pink-500 to-orange-400 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-sm font-medium opacity-90 uppercase tracking-wider mb-1">Lifetime Meditation</div>
          <div className="text-5xl font-light mb-2">{Math.floor(lifetimeMinutes / 60)}<span className="text-2xl opacity-80">h</span> {lifetimeMinutes % 60}<span className="text-xl opacity-80">m</span></div>
          <div className="w-full bg-white/20 h-1.5 rounded-full mt-4">
            <div 
              className="bg-white h-1.5 rounded-full transition-all duration-1000" 
              style={{ width: `${Math.min(100, (lifetimeMinutes / targets.lifetime) * 100)}%` }}
            ></div>
          </div>
        </div>
        {/* Decorative Circle */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-medium text-gray-700 mb-4">This Week</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#9CA3AF' }} 
                dy={10}
              />
              <Tooltip 
                cursor={{ fill: '#FDF2F8' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
                {weeklyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.minutes >= (targets.daily) ? '#EC4899' : '#FBCFE8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Targets Progress */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700 px-2">Goals Progress</h3>
        
        <TargetCard 
          label="Daily Goal" 
          current={dailyMinutes} 
          target={targets.daily} 
          unit="min" 
          color="bg-pink-500" 
        />
        <TargetCard 
          label="Weekly Goal" 
          current={weeklyMinutes} 
          target={targets.weekly} 
          unit="min" 
          color="bg-purple-500" 
        />
        <TargetCard 
          label="Monthly Goal" 
          current={Math.floor(monthlyMinutes / 60)} 
          target={Math.floor(targets.monthly / 60)} 
          unit="hrs" 
          color="bg-indigo-500" 
        />
        <TargetCard 
          label="Yearly Goal" 
          current={Math.floor(yearlyMinutes / 60)} 
          target={Math.floor(targets.yearly / 60)} 
          unit="hrs" 
          color="bg-orange-500" 
        />
        <TargetCard 
          label="Lifetime Goal" 
          current={Math.floor(lifetimeMinutes / 60)} 
          target={Math.floor(targets.lifetime / 60)} 
          unit="hrs" 
          color="bg-yellow-500" 
        />
      </div>
    </div>
  );
}

function TargetCard({ label, current, target, unit, color }: { label: string, current: number, target: number, unit: string, color: string }) {
  const percentage = Math.min(100, (current / target) * 100);
  
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full ${color} bg-opacity-10 flex items-center justify-center shrink-0`}>
        <div className={`w-6 h-6 rounded-full ${color}`}></div>
      </div>
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-xs font-medium text-gray-500">{current} / {target} {unit}</span>
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
