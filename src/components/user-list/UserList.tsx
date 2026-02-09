import { useInfiniteQuery } from '@tanstack/react-query';
import type { UsersPage } from '../../api/users';
import { fetchUsersPage, PAGE_SIZE } from '../../api/users';
import UserListHeader from './UserListHeader';
import UserListEmptyState from './virtual/UserListEmptyState';
import UserListErrorState from './virtual/UserListErrorState';
import VirtualUserList from './virtual/VirtualUserList';

/** Fetches users with infinite pagination and routes to loading/error/empty/list view. */
function UserList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
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
  });

  const allUsers = data?.pages?.flatMap((page: UsersPage) => page.users) ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-12 px-4 sm:px-6 lg:px-8 flex flex-col">
        <div className="max-w-6xl mx-auto w-full flex flex-col flex-1">
          <UserListHeader total={0} isRefetching={false} onRefetch={() => {}} />

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
    return <UserListEmptyState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <UserListHeader
          total={allUsers.length}
          isRefetching={isRefetching}
          onRefetch={refetch}
        />

        <VirtualUserList
          users={allUsers}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={fetchNextPage}
        />
      </div>
    </div>
  );
}

export default UserList;
