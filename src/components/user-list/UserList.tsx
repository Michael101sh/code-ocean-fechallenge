import { useUserList } from '../../hooks/useUserList';
import UserListHeader from './UserListHeader';
import UserListEmptyState from './virtual/UserListEmptyState';
import UserListErrorState from './virtual/UserListErrorState';
import VirtualUserList from './virtual/VirtualUserList';

/** Pure layout: delegates all data logic to useUserList and routes to the correct view. */
function UserList() {
  const {
    users,
    search,
    setSearch,
    debouncedSearch,
    isSearching,
    isLoading,
    isError,
    error,
    isRefetching,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    loadMore,
  } = useUserList();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-6 px-4 sm:px-6 lg:px-8 flex flex-col">
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

  if (users.length === 0) {
    if (isSearching) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <UserListHeader
              total={0}
              searchValue={search}
              onSearchChange={setSearch}
              isRefetching={isRefetching}
              onRefetch={refetch}
            />
            <div className="text-center text-white/80 text-xl font-medium mt-16">
              No users found matching &ldquo;{debouncedSearch}&rdquo;
            </div>
          </div>
        </div>
      );
    }
    return <UserListEmptyState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <UserListHeader
          total={users.length}
          searchValue={search}
          onSearchChange={setSearch}
          isRefetching={isRefetching}
          onRefetch={refetch}
        />

        <VirtualUserList
          users={users}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={loadMore}
        />
      </div>
    </div>
  );
}

export default UserList;
