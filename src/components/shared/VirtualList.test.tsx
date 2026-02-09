/**
 * Tests for VirtualList – the generic virtualized scroll container.
 * The real virtualizer depends on DOM measurements unavailable in jsdom,
 * so we mock useInfiniteVirtualList to return items 1:1 as virtual items.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import VirtualList from './VirtualList';

vi.mock('../../hooks/useInfiniteVirtualList', () => ({
  useInfiniteVirtualList: ({
    items,
    hasNextPage,
  }: {
    items: unknown[];
    hasNextPage: boolean | undefined;
  }) => {
    const count = hasNextPage ? items.length + 1 : items.length;
    return {
      parentRef: { current: null },
      virtualizer: {
        getTotalSize: () => count * 220,
        measureElement: vi.fn(),
      },
      virtualItems: Array.from({ length: count }, (_, i) => ({
        key: String(i),
        index: i,
        start: i * 220,
      })),
    };
  },
}));

type Item = { id: string; name: string };

const items: Item[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
];

const renderRow = (item: Item) => <span>{item.name}</span>;

describe('VirtualList', () => {
  it('renders all items via the renderRow callback', () => {
    render(
      <VirtualList
        items={items}
        hasNextPage={false}
        isFetchingNextPage={false}
        onLoadMore={vi.fn()}
        renderRow={renderRow}
      />,
    );

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('shows "Loading more" indicator when hasNextPage is true', () => {
    render(
      <VirtualList
        items={items}
        hasNextPage={true}
        isFetchingNextPage={false}
        onLoadMore={vi.fn()}
        renderRow={renderRow}
      />,
    );

    expect(screen.getByText(/Loading more/)).toBeInTheDocument();
  });

  it('does not show loader row when hasNextPage is false', () => {
    render(
      <VirtualList
        items={items}
        hasNextPage={false}
        isFetchingNextPage={false}
        onLoadMore={vi.fn()}
        renderRow={renderRow}
      />,
    );

    expect(screen.queryByText(/Loading more/)).not.toBeInTheDocument();
  });

  it('has the list role on the scroll container', () => {
    render(
      <VirtualList
        items={items}
        hasNextPage={false}
        isFetchingNextPage={false}
        onLoadMore={vi.fn()}
        renderRow={renderRow}
      />,
    );

    expect(screen.getByRole('list')).toBeInTheDocument();
  });
});
