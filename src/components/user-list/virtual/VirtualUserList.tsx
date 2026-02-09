import type { FC } from 'react';
import type { User } from '../../../api/users';
import UserRow from '../UserRow.tsx';
import { useInfiniteVirtualList } from '../../../hooks/useInfiniteVirtualList';

/** Renders users in a virtualized scroll list with a loader row at the end when hasNextPage. */
type VirtualUserListProps = {
  users: User[];
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
};

const VirtualUserList: FC<VirtualUserListProps> = ({
  users,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}) => {
  const { parentRef, virtualizer, virtualItems } = useInfiniteVirtualList<User>(
    {
      items: users,
      hasNextPage,
      isFetchingNextPage,
      onLoadMore,
      estimateSize: () => 220,
      overscan: 5,
    },
  );

  return (
    <div
      ref={parentRef}
      role="list"
      className="h-[calc(100vh-250px)] overflow-auto rounded-2xl bg-white/10 backdrop-blur-sm p-4"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(255,255,255,0.5) transparent',
      }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualItem) => {
          /** Last virtual row is the loader when we have more pages. */
          const isLoaderRow = virtualItem.index > users.length - 1;
          const user = users[virtualItem.index];

          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              role="listitem"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
              className="px-2"
            >
              {isLoaderRow ? (
                <div className="py-8 text-center">
                  {hasNextPage ? (
                    <div className="text-white font-semibold flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      Loading more users...
                    </div>
                  ) : (
                    <div className="text-white/70 font-medium">
                      🎉 That's everyone!
                    </div>
                  )}
                </div>
              ) : (
                <UserRow user={user} index={virtualItem.index} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VirtualUserList;

