import { useState, useCallback } from 'react';

/**
 * useSessionState:
 * Drop-in replacement for useState that persists tool inputs in sessionStorage.
 * Survives component unmounting when users navigate between tools or click Back.
 * Automatically clears when the value is reset to '' or null, or when the session ends.
 */
export function useSessionState<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const stored = sessionStorage.getItem(`calc_v2_${key}`);
        if (stored !== null) {
          return JSON.parse(stored);
        }
      }
    } catch {
      // Fallback to initialValue if sessionStorage is restricted
    }
    return initialValue;
  });

  const updateState = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState((prev) => {
        const next = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
        try {
          if (typeof window !== 'undefined' && window.sessionStorage) {
            if (next === '' || next === null || next === undefined) {
              sessionStorage.removeItem(`calc_v2_${key}`);
            } else {
              sessionStorage.setItem(`calc_v2_${key}`, JSON.stringify(next));
            }
          }
        } catch {
          // ignore storage quota / sandbox restrictions
        }
        return next;
      });
    },
    [key]
  );

  return [state, updateState];
}
