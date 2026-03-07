import React from 'react';
import { Play, Pause, Square, Timer as TimerIcon, Infinity as InfinityIcon, CheckCircle } from 'lucide-react';
import { useTimer } from '../context/TimerContext';
import Confetti from 'react-confetti';

export function Timer() {
  const {
    mode, setMode,
    duration, setDuration,
    timeLeft, elapsedTime,
    isActive, isCompleted,
    startSession, pauseSession, stopSession, resetTimer,
    formatTime
  } = useTimer();

  return (
    <div className="flex flex-col items-center justify-start min-h-full px-4 pt-8 pb-48 relative w-full">
      {isCompleted && <Confetti numberOfPieces={200} recycle={false} />}
      
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-serif text-pink-900 mb-2">Dhyana</h1>
        <p className="text-pink-600 italic">Path to grace and culmination</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex bg-pink-100 p-1 rounded-full mb-8 shadow-inner">
        <button
          onClick={() => {
            if (!isActive && mode !== 'timed') {
              setMode('timed');
              resetTimer();
            }
          }}
          disabled={isActive}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
            mode === 'timed' ? 'bg-white text-pink-600 shadow-sm' : 'text-pink-400 hover:text-pink-600'
          } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Timed
        </button>
        <button
          onClick={() => {
            if (!isActive && mode !== 'open') {
              setMode('open');
              resetTimer();
            }
          }}
          disabled={isActive}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
            mode === 'open' ? 'bg-white text-pink-600 shadow-sm' : 'text-pink-400 hover:text-pink-600'
          } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Open
        </button>
      </div>

      {/* Timer Display */}
      <div className="relative w-72 h-72 flex items-center justify-center mb-12">
        {/* Decorative Rings */}
        <div className={`absolute inset-0 rounded-full border-4 border-pink-100 ${isActive ? 'animate-pulse' : ''}`}></div>
        <div className="absolute inset-4 rounded-full border-2 border-pink-50"></div>
        
        {/* Main Circle */}
        <div className="w-64 h-64 rounded-full bg-gradient-to-br from-white to-pink-50 shadow-xl flex flex-col items-center justify-center border border-white">
          <span className="text-6xl font-light text-gray-700 font-mono tracking-wider">
            {mode === 'timed' ? formatTime(timeLeft) : formatTime(elapsedTime)}
          </span>
          <span className="text-pink-400 mt-2 text-sm uppercase tracking-widest">
            {isActive ? 'Meditating' : isCompleted ? 'Namaste' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        {!isActive ? (
          <button
            onClick={startSession}
            className="w-16 h-16 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-lg hover:bg-pink-600 transition-transform hover:scale-105 active:scale-95"
          >
            <Play size={32} fill="currentColor" className="ml-1" />
          </button>
        ) : (
          <button
            onClick={pauseSession}
            className="w-16 h-16 rounded-full bg-yellow-500 text-white flex items-center justify-center shadow-lg hover:bg-yellow-600 transition-transform hover:scale-105 active:scale-95"
          >
            <Pause size={32} fill="currentColor" />
          </button>
        )}

        {isActive || mode === 'open' && elapsedTime > 0 ? (
           <button
           onClick={stopSession}
           className="w-12 h-12 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 transition-colors"
         >
           <Square size={20} fill="currentColor" />
         </button>
        ) : null}
      </div>

      {/* Duration Slider (Only for Timed Mode) */}
      {!isActive && (
        <div className={`mt-12 w-full max-w-xs ${mode === 'timed' ? '' : 'invisible'}`}>
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Duration</span>
            <span>{duration} min</span>
          </div>
          <input
            type="range"
            min="1"
            max="120"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
            disabled={mode !== 'timed'}
          />
        </div>
      )}
    </div>
  );
}
