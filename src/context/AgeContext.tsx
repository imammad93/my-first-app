import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSelectedAge, setSelectedAge as persistAge } from '../data/progress';

type AgeContextValue = {
  age: number;
  setAge: (age: number) => void;
  ready: boolean;
};

const AgeContext = createContext<AgeContextValue | null>(null);

export function AgeProvider({ children }: { children: React.ReactNode }) {
  const [age, setAgeState] = useState(6);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getSelectedAge().then((stored) => {
      setAgeState(stored);
      setReady(true);
    });
  }, []);

  const setAge = (next: number) => {
    setAgeState(next);
    persistAge(next);
  };

  return <AgeContext.Provider value={{ age, setAge, ready }}>{children}</AgeContext.Provider>;
}

export function useAge(): AgeContextValue {
  const ctx = useContext(AgeContext);
  if (!ctx) throw new Error('useAge must be used within an AgeProvider');
  return ctx;
}
