import { useState, useEffect, useCallback } from 'react';

/**
 * Drop-in replacement for useState that persists the value in localStorage.
 * Reads the saved value on mount; writes back on every change.
 * Falls back to initialValue when the key is missing or storage is unavailable.
 */
export const useLocalStorageState = <T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] => {
  /* Read from storage once on mount; fall back to initialValue on any error. */
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  /* Sync to storage whenever the value changes. */
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* Storage full or unavailable – silently ignore. */
    }
  }, [key, state]);

  /* Stable setter that mirrors the useState API (value or updater function). */
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState(value);
    },
    [],
  );

  return [state, setValue];
};
