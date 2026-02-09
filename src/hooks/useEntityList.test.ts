/**
 * Tests for useEntityList – the generic data hook powering every entity list.
 * Uses a lightweight TestItem type instead of real User/Reviewer to keep tests focused.
 * A fresh QueryClient is created per test via createQueryWrapper to prevent cache leaks.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useEntityList } from './useEntityList';
import type { EntityPage, EntityListConfig } from './useEntityList';
import { createQueryWrapper } from '../test/helpers';

type TestItem = { id: string; name: string };

const mockItems: TestItem[] = [
  { id: '1', name: 'Item 1' },
  { id: '2', name: 'Item 2' },
];

const mockPage: EntityPage<TestItem> = { items: mockItems, total: 2 };

/** Builds a config with vi.fn() mocks; overrides are merged in. */
const createConfig = (
  overrides?: Partial<EntityListConfig<TestItem>>,
): EntityListConfig<TestItem> => ({
  queryKey: 'test-entity',
  fetchPage: vi.fn().mockResolvedValue(mockPage),
  searchFn: vi.fn().mockResolvedValue(mockItems),
  pageSize: 20,
  ...overrides,
});

describe('useEntityList', () => {
  /* Clear persisted search so previous test values don't affect initial state. */
  beforeEach(() => localStorage.clear());

  it('starts in loading state with empty items', () => {
    const config = createConfig();
    const { result } = renderHook(() => useEntityList(config), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.items).toEqual([]);
  });

  it('populates items after fetchPage resolves', async () => {
    const config = createConfig();
    const { result } = renderHook(() => useEntityList(config), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.items).toEqual(mockItems);
    expect(config.fetchPage).toHaveBeenCalled();
  });

  it('exposes controlled search state', () => {
    const config = createConfig();
    const { result } = renderHook(() => useEntityList(config), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.search).toBe('');

    act(() => result.current.setSearch('test'));
    expect(result.current.search).toBe('test');
  });

  it('reports isError and error on fetch failure', async () => {
    const config = createConfig({
      fetchPage: vi.fn().mockRejectedValue(new Error('Network error')),
    });
    const { result } = renderHook(() => useEntityList(config), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe('Network error');
  });

  it('persists the search term to localStorage keyed by queryKey', () => {
    const config = createConfig();
    const { result } = renderHook(() => useEntityList(config), {
      wrapper: createQueryWrapper(),
    });

    act(() => result.current.setSearch('persisted'));

    expect(
      JSON.parse(localStorage.getItem('entityList:test-entity:search')!),
    ).toBe('persisted');
  });

  /* Debounce tests need fake timers; shouldAdvanceTime keeps waitFor working. */
  describe('debounce', () => {
    beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
    afterEach(() => vi.useRealTimers());

    it('activates isSearching only after debounce elapses', () => {
      const config = createConfig();
      const { result } = renderHook(() => useEntityList(config), {
        wrapper: createQueryWrapper(),
      });

      act(() => result.current.setSearch('query'));

      /* Before debounce – still in browse mode. */
      expect(result.current.isSearching).toBe(false);

      act(() => vi.advanceTimersByTime(300));
      expect(result.current.isSearching).toBe(true);
    });

    it('calls searchFn with the debounced term', async () => {
      const searchFn = vi.fn().mockResolvedValue([mockItems[0]]);
      const config = createConfig({ searchFn });
      const { result } = renderHook(() => useEntityList(config), {
        wrapper: createQueryWrapper(),
      });

      act(() => result.current.setSearch('query'));
      act(() => vi.advanceTimersByTime(300));

      await waitFor(() => expect(searchFn).toHaveBeenCalledWith('query'));
    });

    it('disables pagination while searching', () => {
      const config = createConfig();
      const { result } = renderHook(() => useEntityList(config), {
        wrapper: createQueryWrapper(),
      });

      act(() => result.current.setSearch('query'));
      act(() => vi.advanceTimersByTime(300));

      expect(result.current.hasNextPage).toBe(false);
      expect(result.current.isFetchingNextPage).toBe(false);
    });
  });
});
