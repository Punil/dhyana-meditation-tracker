import { useState, useEffect } from 'react';

export interface Session {
  id: string;
  date: string; // ISO string
  durationMinutes: number;
  type: 'timed' | 'open';
  notes?: string;
}

export interface Targets {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  lifetime: number;
}

const DEFAULT_TARGETS: Targets = {
  daily: 20,
  weekly: 140,
  monthly: 600,
  yearly: 7200,
  lifetime: 100000,
};

export function useMeditation() {
  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem('meditation_sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [targets, setTargets] = useState<Targets>(() => {
    const saved = localStorage.getItem('meditation_targets');
    return saved ? JSON.parse(saved) : DEFAULT_TARGETS;
  });

  useEffect(() => {
    localStorage.setItem('meditation_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('meditation_targets', JSON.stringify(targets));
  }, [targets]);

  const addSession = (session: Omit<Session, 'id'>) => {
    const newSession = { ...session, id: crypto.randomUUID() };
    setSessions((prev) => [newSession, ...prev]);
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const updateTargets = (newTargets: Partial<Targets>) => {
    setTargets((prev) => ({ ...prev, ...newTargets }));
  };

  return {
    sessions,
    targets,
    addSession,
    deleteSession,
    updateTargets,
  };
}
