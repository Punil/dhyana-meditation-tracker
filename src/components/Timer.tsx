import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Timer as TimerIcon, Infinity as InfinityIcon, CheckCircle } from 'lucide-react';
import { useMeditation } from '../hooks/useMeditation';
import { playSound, formatTime } from '../utils/utils';
import Confetti from 'react-confetti';

export function Timer() {
  const { addSession } = useMeditation();
  const [mode, setMode] = useState<'open' | 'timed'>('timed');
  const [duration, setDuration] = useState(10); // Default 10 minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // For open mode
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const silentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize silent audio and request notification permission
  useEffect(() => {
    const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==');
    audio.loop = true;
    silentAudioRef.current = audio;

    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => startSession());
      navigator.mediaSession.setActionHandler('pause', () => pauseSession());
      navigator.mediaSession.setActionHandler('stop', () => stopSession());
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      if (silentAudioRef.current) {
        silentAudioRef.current.pause();
      }
    };
  }, []);

  const showNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Dhyana Meditation', {
        body: 'Your meditation session is complete. Namaste.',
        icon: 'https://cdn-icons-png.flaticon.com/512/2913/2913520.png',
        silent: false,
      });
    }
  };

  // Update Media Session metadata
  const updateMediaSession = (time: number) => {
    if ('mediaSession' in navigator) {
      const formatted = formatTime(time);
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `Dhyana - ${formatted}`,
        artist: mode === 'timed' ? 'Timed Meditation' : 'Open Meditation',
        album: 'Sanctum Sanctorum',
        artwork: [
          { src: 'https://cdn-icons-png.flaticon.com/512/2913/2913520.png', sizes: '512x512', type: 'image/png' }
        ]
      });
    }
  };

  // Reset timer when duration changes
  useEffect(() => {
    if (!isActive && mode === 'timed') {
      setTimeLeft(duration * 60);
    }
  }, [duration, mode, isActive]);

  useEffect(() => {
    if (isActive) {
      startTimeRef.current = Date.now();
      if (silentAudioRef.current) {
        silentAudioRef.current.play().catch(() => {
          // User interaction might be needed first, handled by start button
        });
      }
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const delta = Math.floor((now - (startTimeRef.current || now)) / 1000);
        const currentTotal = delta + pausedTimeRef.current;

        if (mode === 'timed') {
          const remaining = Math.max(0, duration * 60 - currentTotal);
          setTimeLeft(remaining);
          updateMediaSession(remaining);
          if (remaining <= 0) {
            completeSession();
          }
        } else {
          setElapsedTime(currentTotal);
          updateMediaSession(currentTotal);
        }
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (silentAudioRef.current) silentAudioRef.current.pause();
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'paused';
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, mode]);

  const startSession = () => {
    // Request notification permission if not already granted
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    setIsActive(true);
    setIsCompleted(false);
    startTimeRef.current = Date.now();
    playSound('chorus-bell');
    if (silentAudioRef.current) silentAudioRef.current.play();
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'playing';
      updateMediaSession(mode === 'timed' ? timeLeft : elapsedTime);
    }
  };

  const pauseSession = () => {
    setIsActive(false);
    const now = Date.now();
    const delta = Math.floor((now - (startTimeRef.current || now)) / 1000);
    pausedTimeRef.current += delta;
  };

  const stopSession = () => {
    setIsActive(false);
    playSound('chorus-bell');
    const now = Date.now();
    const delta = Math.floor((now - (startTimeRef.current || now)) / 1000);
    const totalMins = Math.floor((pausedTimeRef.current + delta) / 60);
    
    if (totalMins > 0) {
      saveSession(totalMins);
    }
    resetTimer();
  };

  const completeSession = () => {
    setIsActive(false);
    setIsCompleted(true);
    playSound('chorus-bell');
    showNotification();
    
    const minutes = mode === 'timed' ? duration : Math.floor(elapsedTime / 60);
    if (minutes > 0) {
      saveSession(minutes);
    }
    pausedTimeRef.current = 0;
  };

  const saveSession = (mins: number) => {
    addSession({
      date: new Date().toISOString(),
      durationMinutes: mins,
      type: mode,
    });
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsCompleted(false);
    setTimeLeft(duration * 60);
    setElapsedTime(0);
    pausedTimeRef.current = 0;
    startTimeRef.current = null;
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'none';
    }
  };

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
          onClick={() => { setMode('timed'); resetTimer(); }}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
            mode === 'timed' ? 'bg-white text-pink-600 shadow-sm' : 'text-pink-400 hover:text-pink-600'
          }`}
        >
          Timed
        </button>
        <button
          onClick={() => { setMode('open'); resetTimer(); }}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
            mode === 'open' ? 'bg-white text-pink-600 shadow-sm' : 'text-pink-400 hover:text-pink-600'
          }`}
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
      {mode === 'timed' && !isActive && (
        <div className="mt-12 w-full max-w-xs">
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
          />
        </div>
      )}
    </div>
  );
}
