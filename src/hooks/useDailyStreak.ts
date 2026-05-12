import { useEffect, useMemo, useState } from 'react';

interface StreakState {
  streak: number;
  lastActiveDate: string | null;
}

const getStorageKey = (userKey: string) => `zintsomi_streak_${userKey}`;

const toUtcDate = (value: Date = new Date()) => value.toISOString().slice(0, 10);

const dayDiff = (from: string, to: string) => {
  const fromDate = new Date(`${from}T00:00:00Z`);
  const toDate = new Date(`${to}T00:00:00Z`);
  return Math.floor((toDate.getTime() - fromDate.getTime()) / 86400000);
};

export const useDailyStreak = (userKey: string | null) => {
  const [state, setState] = useState<StreakState>({ streak: 0, lastActiveDate: null });

  useEffect(() => {
    if (!userKey) return;

    const storageKey = getStorageKey(userKey);
    const raw = window.localStorage.getItem(storageKey);
    const parsed: StreakState = raw ? JSON.parse(raw) : { streak: 0, lastActiveDate: null };

    const today = toUtcDate();
    let nextState = parsed;

    if (!parsed.lastActiveDate) {
      nextState = { streak: 1, lastActiveDate: today };
    } else {
      const diff = dayDiff(parsed.lastActiveDate, today);
      if (diff === 0) {
        nextState = parsed;
      } else if (diff === 1) {
        nextState = { streak: parsed.streak + 1, lastActiveDate: today };
      } else {
        nextState = { streak: 1, lastActiveDate: today };
      }
    }

    window.localStorage.setItem(storageKey, JSON.stringify(nextState));
    setState(nextState);
  }, [userKey]);

  return useMemo(() => state, [state]);
};
