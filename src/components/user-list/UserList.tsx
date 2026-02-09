import { useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { UsersPage } from '../../api/users';
import { fetchUsersPage, smartSearch, PAGE_SIZE } from '../../api/users';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import UserListHeader from './UserListHeader';
import UserListEmptyState from './virtual/UserListEmptyState';
import UserListErrorState from './virtual/UserListErrorState';
import VirtualUserList from './virtual/VirtualUserList';

/** Fetches users with infinite pagination and routes to loading/error/empty/list view. */
function UserList() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const isSearching = debouncedSearch.trim().length > 0;

  /** Infinite query for the default (non-search) view. */
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingAll,
    isError: isErrorAll,
    error: errorAll,
    refetch: refetchAll,
    isRefetching: isRefetchingAll,
  } = useInfiniteQuery({
    queryKey: ['users'],
    queryFn: fetchUsersPage,
    initialPageParam: 0,
    /** Next page index, or undefined when no more pages. Uses X-Total-Count when present, else stops when last page has fewer than PAGE_SIZE items. */
    getNextPageParam: (lastPage, allPages) => {
      const typedLastPage = lastPage as UsersPage;
      const typedPages = allPages as UsersPage[];

      if (typeof typedLastPage.total === 'number') {
        const loadedCount = typedPages.reduce(
          (sum, page) => sum + page.users.length,
          0,
        );

        if (loadedCount >= typedLastPage.total) {
          return undefined;
        }

        return typedPages.length;
      }

      if (typedLastPage.users.length < PAGE_SIZE) {
        return undefined;
      }

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
  const allUsers = isSearching
    ? searchResults ?? []
    : data?.pages?.flatMap((page: UsersPage) => page.users) ?? [];

  const isLoading = isSearching ? isLoadingSearch : isLoadingAll;
  const isError = isSearching ? isErrorSearch : isErrorAll;
  const error = isSearching ? errorSearch : errorAll;
  const isRefetching = isSearching ? isRefetchingSearch : isRefetchingAll;
  const refetch = isSearching ? refetchSearch : refetchAll;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-12 px-4 sm:px-6 lg:px-8 flex flex-col">
        <div className="max-w-6xl mx-auto w-full flex flex-col flex-1">
          <UserListHeader
            total={0}
            searchValue={search}
            onSearchChange={setSearch}
            isRefetching={false}
            onRefetch={() => {}}
          />

          <div className="flex-1 flex items-center justify-center">
            <div className="text-white text-2xl font-semibold flex items-center gap-4">
              <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              Loading users...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    console.error('Error fetching users:', error);
    return <UserListErrorState />;
  }

  if (!allUsers || allUsers.length === 0) {
    if (isSearching) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <UserListHeader
              total={0}
              searchValue={search}
              onSearchChange={setSearch}
              isRefetching={isRefetching}
              onRefetch={refetch}
            />
            <div className="text-center text-white/80 text-xl font-medium mt-16">
              No users found matching "{debouncedSearch}"
            </div>
          </div>
        </div>
      );
    }
    return <UserListEmptyState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <UserListHeader
          total={allUsers.length}
          searchValue={search}
          onSearchChange={setSearch}
          isRefetching={isRefetching}
          onRefetch={refetch}
        />

        <VirtualUserList
          users={allUsers}
          hasNextPage={isSearching ? false : hasNextPage}
          isFetchingNextPage={isSearching ? false : isFetchingNextPage}
          onLoadMore={isSearching ? () => {} : fetchNextPage}
        />
      </div>
    </div>
  );
}

export default UserList;
