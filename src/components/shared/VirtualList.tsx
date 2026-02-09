import type { ReactNode } from 'react';
import { useInfiniteVirtualList } from '../../hooks/useInfiniteVirtualList';

/** Generic virtualized + infinite-scroll list. Delegates row rendering via renderRow. */
type VirtualListProps<T> = {
  items: T[];
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  renderRow: (item: T, index: number) => ReactNode;
  estimateSize?: () => number;
  overscan?: number;
};

function VirtualList<T>({
  items,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  renderRow,
  estimateSize = () => 220,
  overscan = 5,
}: VirtualListProps<T>) {
  const { parentRef, virtualizer, virtualItems } = useInfiniteVirtualList<T>({
    items,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
    estimateSize,
    overscan,
  });

  return (
    <div
      ref={parentRef}
      role="list"
      className="flex-1 min-h-0 overflow-auto rounded-2xl bg-white/10 backdrop-blur-sm p-3"
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
          const isLoaderRow = virtualItem.index > items.length - 1;
          const item = items[virtualItem.index];

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
                      Loading more&hellip;
                    </div>
                  ) : (
                    <div className="text-white/70 font-medium">
                      That&rsquo;s everyone!
                    </div>
                  )}
                </div>
              ) : (
                renderRow(item, virtualItem.index)
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VirtualList;
