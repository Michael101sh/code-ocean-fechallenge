/** Tests for useLocalStorageState – verifies persistence, hydration, and graceful error handling. */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorageState } from './useLocalStorageState';

describe('useLocalStorageState', () => {
  /* Clean slate for each test so stored values don't leak between tests. */
  beforeEach(() => localStorage.clear());

  it('returns the initial value when nothing is stored', () => {
    const { result } = renderHook(() => useLocalStorageState('key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('reads a previously stored value on mount', () => {
    localStorage.setItem('key', JSON.stringify('saved'));
    const { result } = renderHook(() => useLocalStorageState('key', 'default'));
    expect(result.current[0]).toBe('saved');
  });

  it('persists new values to localStorage', () => {
    const { result } = renderHook(() => useLocalStorageState('key', 'init'));

    act(() => result.current[1]('updated'));

    expect(result.current[0]).toBe('updated');
    expect(JSON.parse(localStorage.getItem('key')!)).toBe('updated');
  });

  it('supports updater-function form of setter', () => {
    const { result } = renderHook(() => useLocalStorageState('key', 10));

    act(() => result.current[1]((prev) => prev + 5));

    expect(result.current[0]).toBe(15);
  });

  it('falls back to initial value when stored JSON is invalid', () => {
    localStorage.setItem('key', '{broken');
    const { result } = renderHook(() => useLocalStorageState('key', 'fallback'));
    expect(result.current[0]).toBe('fallback');
  });

  it('handles storage write errors gracefully', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    /* Should not throw; state still updates in memory. */
    const { result } = renderHook(() => useLocalStorageState('key', 'val'));
    act(() => result.current[1]('new'));
    expect(result.current[0]).toBe('new');

    spy.mockRestore();
  });
});
