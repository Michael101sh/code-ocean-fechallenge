import { useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useDebouncedValue } from './useDebouncedValue';

/** Generic page shape returned by any paginated entity endpoint. */
export type EntityPage<T> = {
  items: T[];
  total?: number;
};

/** Configuration for a single entity list (pagination + search). */
export type EntityListConfig<T> = {
  /** React-Query cache key (e.g. "users", "reviewers"). */
  queryKey: string;
  /** Fetches one page; receives { pageParam } from useInfiniteQuery. */
  fetchPage: (params: { pageParam?: number }) => Promise<EntityPage<T>>;
  /** Full-text / smart search returning a flat array. */
  searchFn: (term: string) => Promise<T[]>;
  /** Items per page – used to detect the last page when X-Total-Count is absent. */
  pageSize: number;
  /** Debounce delay for the search input (default 300 ms). */
  debounceMs?: number;
};

/** Value returned by useEntityList – consumed by EntityList layout component. */
export type EntityListResult<T> = {
  items: T[];
  search: string;
  setSearch: (value: string) => void;
  debouncedSearch: string;
  isSearching: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isRefetching: boolean;
  refetch: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  loadMore: () => void;
};

/**
 * Generic data hook: infinite pagination + debounced search for any entity.
 * Entity-specific hooks (useUserList, useReviewerList) are thin wrappers.
 */
export function useEntityList<T>(
  config: EntityListConfig<T>,
): EntityListResult<T> {
  const { queryKey, fetchPage, searchFn, pageSize, debounceMs = 300 } = config;

  /* Raw input is kept instant for a responsive UI; debounced value drives the API call. */
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, debounceMs);
  const isSearching = debouncedSearch.trim().length > 0;

  /* ---- paginated browse ---- */
  const {
    data,
    fetchNextPage,
    hasNextPage: hasNextPageAll,
    isFetchingNextPage: isFetchingNextPageAll,
    isLoading: isLoadingAll,
    isError: isErrorAll,
    error: errorAll,
    refetch: refetchAll,
    isRefetching: isRefetchingAll,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchPage,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const typedLast = lastPage as EntityPage<T>;
      const typedAll = allPages as EntityPage<T>[];

      /* Prefer X-Total-Count when available; fall back to under-full page detection. */
      if (typeof typedLast.total === 'number') {
        const loaded = typedAll.reduce((s, p) => s + p.items.length, 0);
        if (loaded >= typedLast.total) return undefined;
        return typedAll.length;
      }

      if (typedLast.items.length < pageSize) return undefined;
      return typedAll.length;
    },
    /* Pause pagination while a search is active – the two queries are mutually exclusive. */
    enabled: !isSearching,
  });

  /* ---- search ---- */
  const {
    data: searchResults,
    isLoading: isLoadingSearch,
    isError: isErrorSearch,
    error: errorSearch,
    refetch: refetchSearch,
    isRefetching: isRefetchingSearch,
  } = useQuery({
    queryKey: [queryKey, 'search', debouncedSearch],
    queryFn: () => searchFn(debouncedSearch),
    enabled: isSearching,
  });

  /* Merge paginated pages into a flat array, or use the search result directly. */
  const items = isSearching
    ? (searchResults ?? [])
    : (data?.pages?.flatMap((p: EntityPage<T>) => p.items) ?? []);

  /* Expose a single, mode-aware interface so consumers don't need to know which query is active. */
  return {
    items,
    search,
    setSearch,
    debouncedSearch,
    isSearching,
    isLoading: isSearching ? isLoadingSearch : isLoadingAll,
    isError: isSearching ? isErrorSearch : isErrorAll,
    error: (isSearching ? errorSearch : errorAll) as Error | null,
    isRefetching: isSearching ? isRefetchingSearch : isRefetchingAll,
    refetch: isSearching ? refetchSearch : refetchAll,
    /* Search returns all matches at once, so pagination is disabled. */
    hasNextPage: isSearching ? false : hasNextPageAll,
    isFetchingNextPage: isSearching ? false : isFetchingNextPageAll,
    loadMore: isSearching ? () => {} : fetchNextPage,
  };
}
