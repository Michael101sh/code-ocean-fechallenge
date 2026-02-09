/**
 * Tests for EntityList – the generic layout that routes to loading/error/empty/list views.
 * VirtualList is mocked to bypass DOM measurement; we test each early-return branch
 * by providing different EntityListResult overrides.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import EntityList from './EntityList';
import type { EntityListResult } from '../../hooks/useEntityList';

/* Render items inline instead of virtualised; avoids jsdom measurement issues. */
vi.mock('./VirtualList', () => ({
  default: ({
    items,
    renderRow,
  }: {
    items: unknown[];
    renderRow: (item: unknown, index: number) => React.ReactNode;
  }) => (
    <div data-testid="virtual-list">
      {items.map((item, i) => (
        <div key={i}>{renderRow(item, i)}</div>
      ))}
    </div>
  ),
}));

type TestItem = { id: string; name: string };

/** Baseline list result – override individual fields per test. */
const baseList: EntityListResult<TestItem> = {
  items: [],
  search: '',
  setSearch: vi.fn(),
  debouncedSearch: '',
  isSearching: false,
  isLoading: false,
  isError: false,
  error: null,
  isRefetching: false,
  refetch: vi.fn(),
  hasNextPage: false,
  isFetchingNextPage: false,
  loadMore: vi.fn(),
};

const renderRow = (item: TestItem) => <span>{item.name}</span>;

describe('EntityList', () => {
  it('shows a loading spinner when isLoading is true', () => {
    render(
      <EntityList
        title="Test"
        entityName="items"
        renderRow={renderRow}
        list={{ ...baseList, isLoading: true }}
      />,
    );

    expect(screen.getByText(/Loading/)).toBeInTheDocument();
  });

  it('shows the error state with the entity name', () => {
    render(
      <EntityList
        title="Test"
        entityName="things"
        renderRow={renderRow}
        list={{ ...baseList, isError: true, error: new Error('fail') }}
      />,
    );

    expect(screen.getByText('Oops!')).toBeInTheDocument();
    expect(screen.getByText(/error loading things/)).toBeInTheDocument();
  });

  it('shows a generic empty message when not searching', () => {
    render(
      <EntityList
        title="Test"
        entityName="widgets"
        renderRow={renderRow}
        list={baseList}
      />,
    );

    expect(screen.getByText('No widgets found')).toBeInTheDocument();
  });

  it('shows a search-specific empty message when searching', () => {
    render(
      <EntityList
        title="Test"
        entityName="widgets"
        renderRow={renderRow}
        list={{ ...baseList, isSearching: true, debouncedSearch: 'xyz' }}
      />,
    );

    expect(screen.getByText(/No widgets found matching/)).toBeInTheDocument();
    expect(screen.getByText(/xyz/)).toBeInTheDocument();
  });

  it('renders items through VirtualList when data is present', () => {
    const items = [
      { id: '1', name: 'Foo' },
      { id: '2', name: 'Bar' },
    ];

    render(
      <EntityList
        title="Test"
        entityName="items"
        renderRow={renderRow}
        list={{ ...baseList, items }}
      />,
    );

    expect(screen.getByTestId('virtual-list')).toBeInTheDocument();
    expect(screen.getByText('Foo')).toBeInTheDocument();
    expect(screen.getByText('Bar')).toBeInTheDocument();
  });

  it('always shows the header with title in every state', () => {
    render(
      <EntityList
        title="My List"
        entityName="items"
        renderRow={renderRow}
        list={{ ...baseList, isLoading: true }}
      />,
    );

    expect(screen.getByText('My List')).toBeInTheDocument();
  });

  it('shows the search input via the header', () => {
    render(
      <EntityList
        title="Test"
        entityName="items"
        renderRow={renderRow}
        list={baseList}
      />,
    );

    /* onSearchChange is always provided, so search box should be visible. */
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });
});
