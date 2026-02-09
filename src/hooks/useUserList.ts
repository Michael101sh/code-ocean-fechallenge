import { useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { User, UsersPage } from '../api/users';
import { fetchUsersPage, smartSearch, PAGE_SIZE } from '../api/users';
import { useDebouncedValue } from './useDebouncedValue';

export type UseUserListResult = {
  /** Flat array of users to display (paginated or search results). */
  users: User[];
  /** Raw search input value (controlled). */
  search: string;
  /** Setter for the raw search input. */
  setSearch: (value: string) => void;
  /** Debounced search term actually sent to the API. */
  debouncedSearch: string;
  /** True when a non-empty debounced search term is active. */
  isSearching: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isRefetching: boolean;
  refetch: () => void;
  /** Whether more pages are available (always false while searching). */
  hasNextPage: boolean | undefined;
  /** Whether the next page is currently being fetched. */
  isFetchingNextPage: boolean;
  /** Trigger loading the next page of results. No-op while searching. */
  loadMore: () => void;
};

/** All data-fetching, search & pagination logic for the user directory. */
export function useUserList(): UseUserListResult {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const isSearching = debouncedSearch.trim().length > 0;

  /** Infinite query for the default (non-search) view. */
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
    queryKey: ['users'],
    queryFn: fetchUsersPage,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const typedLastPage = lastPage as UsersPage;
      const typedPages = allPages as UsersPage[];

      if (typeof typedLastPage.total === 'number') {
        const loadedCount = typedPages.reduce(
          (sum, page) => sum + page.users.length,
          0,
        );
        if (loadedCount >= typedLastPage.total) return undefined;
        return typedPages.length;
      }

      if (typedLastPage.users.length < PAGE_SIZE) return undefined;
      return typedPages.length;
    },
    enabled: !isSearching,
  });

  /** Search query – fires only when the debounced term is non-empty. */
  const {
    data: searchResults,
    isLoading: isLoadingSearch,
    isError: isErrorSearch,
    error: errorSearch,
    refetch: refetchSearch,
    isRefetching: isRefetchingSearch,
  } = useQuery({
    queryKey: ['users', 'search', debouncedSearch],
    queryFn: () => smartSearch(debouncedSearch),
    enabled: isSearching,
  });

  /** Resolve the active dataset based on whether we're searching. */
  const users = isSearching
    ? (searchResults ?? [])
    : (data?.pages?.flatMap((page: UsersPage) => page.users) ?? []);

  return {
    users,
    search,
    setSearch,
    debouncedSearch,
    isSearching,
    isLoading: isSearching ? isLoadingSearch : isLoadingAll,
    isError: isSearching ? isErrorSearch : isErrorAll,
    error: (isSearching ? errorSearch : errorAll) as Error | null,
    isRefetching: isSearching ? isRefetchingSearch : isRefetchingAll,
    refetch: isSearching ? refetchSearch : refetchAll,
    hasNextPage: isSearching ? false : hasNextPageAll,
    isFetchingNextPage: isSearching ? false : isFetchingNextPageAll,
    loadMore: isSearching ? () => {} : fetchNextPage,
  };
}
