import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { useMeditation, Session } from '../hooks/useMeditation';
import { cn } from '../utils/utils';

export function History() {
  const { sessions, addSession, deleteSession } = useMeditation();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [manualDuration, setManualDuration] = useState(20);

  const onNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const onPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const sessionsOnSelectedDate = sessions.filter((s) => 
    isSameDay(new Date(s.date), selectedDate)
  );

  const handleAddSession = () => {
    addSession({
      date: selectedDate.toISOString(),
      durationMinutes: manualDuration,
      type: 'open', // Manual entry
      notes: 'Manual entry',
    });
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto min-h-screen pb-24">
      <h2 className="text-2xl font-serif text-pink-900 mb-6 text-center">History</h2>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-2xl shadow-sm">
        <button onClick={onPrevMonth} className="p-2 hover:bg-pink-50 rounded-full text-pink-600">
          <ChevronLeft size={20} />
        </button>
        <span className="text-lg font-medium text-gray-700">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <button onClick={onNextMonth} className="p-2 hover:bg-pink-50 rounded-full text-pink-600">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-6">
        <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs text-gray-400 font-medium uppercase tracking-wide">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const hasSession = sessions.some((s) => isSameDay(new Date(s.date), day));

            return (
              <button
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center text-sm transition-all relative",
                  !isCurrentMonth && "text-gray-300",
                  isSelected ? "bg-pink-500 text-white shadow-md scale-105" : "hover:bg-pink-50",
                  hasSession && !isSelected && "font-bold text-pink-600"
                )}
              >
                {format(day, 'd')}
                {hasSession && !isSelected && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-400 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Sessions */}
      <div className="mb-20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-700">
            {format(selectedDate, 'EEEE, MMMM do')}
          </h3>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 text-sm text-pink-600 font-medium hover:text-pink-700"
          >
            <Plus size={16} /> Add Session
          </button>
        </div>

        {sessionsOnSelectedDate.length === 0 ? (
          <div className="text-center py-8 text-gray-400 italic bg-white/50 rounded-xl border border-dashed border-gray-200">
            No sessions recorded for this day.
          </div>
        ) : (
          <div className="space-y-3">
            {sessionsOnSelectedDate.map((session) => (
              <div key={session.id} className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between border-l-4 border-pink-400">
                <div>
                  <span className="text-2xl font-light text-gray-800">{session.durationMinutes}</span>
                  <span className="text-xs text-gray-500 ml-1">min</span>
                  <div className="text-xs text-gray-400 mt-1 capitalize">{session.type} Session</div>
                </div>
                <button 
                  onClick={() => deleteSession(session.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors p-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Session Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-serif text-pink-900 mb-4">Log Past Session</h3>
            <p className="text-sm text-gray-500 mb-6">
              How long did you meditate on {format(selectedDate, 'MMM do')}?
            </p>
            
            <div className="flex items-center justify-center mb-8">
              <button 
                onClick={() => setManualDuration(Math.max(5, manualDuration - 5))}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
              >
                -
              </button>
              <div className="mx-6 text-center">
                <span className="text-4xl font-light text-pink-600">{manualDuration}</span>
                <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Minutes</div>
              </div>
              <button 
                onClick={() => setManualDuration(manualDuration + 5)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
              >
                +
              </button>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 rounded-xl text-gray-500 hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddSession}
                className="flex-1 py-3 rounded-xl bg-pink-500 text-white font-medium hover:bg-pink-600 shadow-lg shadow-pink-200 transition-all hover:scale-105"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
