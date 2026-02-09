import type { ReactNode } from 'react';
import type { EntityListResult } from '../../hooks/useEntityList';
import ListHeader from './ListHeader';
import VirtualList from './VirtualList';

/** Props for the generic EntityList layout component. */
type EntityListProps<T> = {
  title: string;
  /** Plural noun shown next to the count and in status messages (e.g. "people"). */
  entityName: string;
  searchPlaceholder?: string;
  renderRow: (item: T, index: number) => ReactNode;
  /** The entire result object returned by useEntityList (or a thin wrapper). */
  list: EntityListResult<T>;
};

/**
 * Reusable list layout: header with search + virtual list + loading/error/empty states.
 * Entity-specific lists (UserList, ReviewerList) are thin wrappers around this.
 */
function EntityList<T>({
  title,
  entityName,
  searchPlaceholder,
  renderRow,
  list,
}: EntityListProps<T>) {
  const {
    items,
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
  } = list;

  /* Header is always visible so the user can interact with search in every state. */
  const headerEl = (
    <ListHeader
      title={title}
      total={items.length}
      entityName={entityName}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder={searchPlaceholder}
      isRefetching={isRefetching}
      onRefetch={refetch}
    />
  );

  if (isLoading) {
    return (
      <div className="flex flex-col h-full min-h-0">
        <ListHeader
          title={title}
          total={0}
          entityName={entityName}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={searchPlaceholder}
          isRefetching={false}
          onRefetch={() => {}}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-xl font-semibold flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            Loading&hellip;
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    console.error(`Error fetching ${entityName}:`, error);
    return (
      <div className="flex flex-col h-full min-h-0">
        {headerEl}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mt-4 text-center">
          <div className="text-4xl mb-3">&#9888;&#65039;</div>
          <h3 className="text-xl font-bold text-white mb-2">Oops!</h3>
          <p className="text-white/80">
            There was an error loading {entityName}.
          </p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col h-full min-h-0">
        {headerEl}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mt-4 text-center">
          <div className="text-4xl mb-3">&#128269;</div>
          <p className="text-white/80 text-lg font-medium">
            {isSearching ? (
              <>
                No {entityName} found matching &ldquo;{debouncedSearch}&rdquo;
              </>
            ) : (
              <>No {entityName} found</>
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {headerEl}
      <VirtualList
        items={items}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={loadMore}
        renderRow={renderRow}
      />
    </div>
  );
}

export default EntityList;
