import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';
import { useVirtualizer, type VirtualItem, type Virtualizer } from '@tanstack/react-virtual';

/**
 * Virtualized list + infinite scroll: only visible rows are rendered,
 * and onLoadMore is called when the user scrolls near the end.
 */
type UseInfiniteVirtualListParams<TItem> = {
  items: TItem[];
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  estimateSize?: () => number;
  overscan?: number;
};

type UseInfiniteVirtualListResult = {
  parentRef: RefObject<HTMLDivElement | null>;
  virtualizer: Virtualizer<HTMLDivElement, Element>;
  virtualItems: VirtualItem[];
};

export function useInfiniteVirtualList<TItem>(
  params: UseInfiniteVirtualListParams<TItem>,
): UseInfiniteVirtualListResult {
  const {
    items,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
    estimateSize = () => 220,
    overscan = 5,
  } = params;

  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    /** +1 when there is a next page so we can show a loader row at the end. */
    count: hasNextPage ? items.length + 1 : items.length,
    getScrollElement: () => parentRef.current,
    estimateSize,
    overscan,
  });

  const virtualItems = virtualizer.getVirtualItems();

  /** Trigger load more when the last visible item is within 5 rows of the end. */
  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];

    if (!lastItem) return;

    if (
      lastItem.index >= items.length - 5 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      onLoadMore();
    }
  }, [virtualItems, hasNextPage, isFetchingNextPage, items.length, onLoadMore]);

  return {
    parentRef,
    virtualizer,
    virtualItems,
  };
}

