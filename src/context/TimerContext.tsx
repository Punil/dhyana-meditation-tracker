import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useMeditation } from '../hooks/useMeditation';
import { playSound, formatTime } from '../utils/utils';

interface TimerContextType {
  mode: 'open' | 'timed';
  setMode: (mode: 'open' | 'timed') => void;
  duration: number;
  setDuration: (duration: number) => void;
  timeLeft: number;
  elapsedTime: number;
  isActive: boolean;
  isCompleted: boolean;
  startSession: () => void;
  pauseSession: () => void;
  stopSession: () => void;
  resetTimer: () => void;
  formatTime: (seconds: number) => string;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: ReactNode }) {
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
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Update Media Session metadata
  const updateMediaSession = (time: number) => {
    if ('mediaSession' in navigator) {
      const formatted = formatTime(time);
      
      // Throttle metadata updates to avoid flickering or performance issues
      // But we need it every second for the title.
      // Some devices might prefer setPositionState for the progress bar.
      
      navigator.mediaSession.metadata = new MediaMetadata({
        title: mode === 'timed' ? `Remaining: ${formatted}` : `Elapsed: ${formatted}`,
        artist: 'Dhyana Meditation',
        album: 'Sanctum Sanctorum',
        artwork: [
          { src: 'https://cdn-icons-png.flaticon.com/512/2913/2913520.png', sizes: '512x512', type: 'image/png' }
        ]
      });

      // Update playback state
      navigator.mediaSession.playbackState = isActive ? 'playing' : 'paused';

      // Update position state if supported (for progress bar on lock screen)
      if ('setPositionState' in navigator.mediaSession) {
        try {
          const totalDuration = mode === 'timed' ? duration * 60 : 86400; // 24h for open mode
          const currentPosition = mode === 'timed' 
            ? Math.max(0, Math.min(totalDuration, totalDuration - time)) // Elapsed time in timed mode
            : Math.min(totalDuration, time); // Elapsed time in open mode

          navigator.mediaSession.setPositionState({
            duration: totalDuration,
            playbackRate: isActive ? 1 : 0,
            position: currentPosition,
          });
        } catch (e) {
          console.error('Error setting position state:', e);
        }
      }
    }
  };

  const showNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('Dhyana Meditation', {
          body: 'Your meditation session is complete. Namaste.',
          icon: 'https://cdn-icons-png.flaticon.com/512/2913/2913520.png',
          silent: false,
          requireInteraction: true,
          tag: 'dhyana-completion',
          renotify: true,
        } as NotificationOptions);
      } catch (e) {
        console.error("Notification error:", e);
      }
    }
  };

  // Reset timer when duration changes, ONLY if not active
  useEffect(() => {
    if (!isActive && mode === 'timed') {
      setTimeLeft(duration * 60);
    }
  }, [duration, mode, isActive]);

  useEffect(() => {
    if (isActive) {
      // If we are resuming or starting, set the start time reference
      // We need to account for paused time if we are resuming
      if (!startTimeRef.current) {
          startTimeRef.current = Date.now();
      }

      if (silentAudioRef.current) {
        const playPromise = silentAudioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Silent audio play failed:", error);
          });
        }
      }

      intervalRef.current = setInterval(() => {
        const now = Date.now();
        // Calculate total time elapsed since start, minus any paused duration
        
        const delta = Math.floor((now - (startTimeRef.current || now)) / 1000);
        const currentTotal = delta + pausedTimeRef.current;

        if (mode === 'timed') {
          const remaining = Math.max(0, duration * 60 - currentTotal);
          setTimeLeft(remaining);
          updateMediaSession(remaining);
          if (remaining <= 0) {
            completeSession(currentTotal); // Pass total time spent
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
  }, [isActive, mode, duration]); // Added duration to deps to ensure calculation uses latest duration

  const startSession = () => {
    // Request notification permission if not already granted
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    setIsActive(true);
    setIsCompleted(false);
    startTimeRef.current = Date.now(); // Reset start time for this segment
    playSound('chorus-bell');
    
    if (silentAudioRef.current) {
      const playPromise = silentAudioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Silent audio play failed:", error);
        });
      }
    }
    
    // Ensure media session is updated immediately
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'playing';
      // Use current timeLeft or elapsedTime
      const currentTime = mode === 'timed' ? timeLeft : elapsedTime;
      updateMediaSession(currentTime);
    }
  };

  const pauseSession = () => {
    setIsActive(false);
    const now = Date.now();
    const delta = Math.floor((now - (startTimeRef.current || now)) / 1000);
    pausedTimeRef.current += delta;
    startTimeRef.current = null; // Clear start time so we know to reset it on resume
    
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'paused';
      // Use current timeLeft or elapsedTime
      const currentTime = mode === 'timed' ? timeLeft : elapsedTime;
      updateMediaSession(currentTime);
    }
  };

  const stopSession = () => {
    setIsActive(false);
    playSound('chorus-bell');
    const now = Date.now();
    // Only calculate delta if we were running
    let delta = 0;
    if (startTimeRef.current) {
        delta = Math.floor((now - startTimeRef.current) / 1000);
    }
    const totalMins = Math.floor((pausedTimeRef.current + delta) / 60);
    
    if (totalMins > 0) {
      saveSession(totalMins);
    }
    resetTimer();
  };

  const completeSession = (finalElapsedTime: number) => {
    setIsActive(false);
    setIsCompleted(true);
    playSound('chorus-bell');
    showNotification();
    
    // For timed mode, we use the duration. For open mode, we use the elapsed time.
    // However, if we are in timed mode, finalElapsedTime should be roughly equal to duration * 60
    const minutes = mode === 'timed' ? duration : Math.floor(finalElapsedTime / 60);
    
    if (minutes > 0) {
      saveSession(minutes);
    }
    pausedTimeRef.current = 0;
    startTimeRef.current = null;
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
    <TimerContext.Provider value={{
      mode, setMode,
      duration, setDuration,
      timeLeft, elapsedTime,
      isActive, isCompleted,
      startSession, pauseSession, stopSession, resetTimer,
      formatTime
    }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}
