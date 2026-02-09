/** Tests for ListHeader – verifies title, count, search input visibility, and prop defaults. */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ListHeader from './ListHeader';

describe('ListHeader', () => {
  it('renders the title and entity count', () => {
    render(
      <ListHeader
        title="Users"
        total={42}
        entityName="people"
        isRefetching={false}
        onRefetch={vi.fn()}
      />,
    );

    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('42 people')).toBeInTheDocument();
  });

  it('hides the search input when onSearchChange is not provided', () => {
    render(
      <ListHeader
        title="X"
        total={0}
        isRefetching={false}
        onRefetch={vi.fn()}
      />,
    );

    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
  });

  it('shows the search input when onSearchChange is provided', () => {
    render(
      <ListHeader
        title="X"
        total={0}
        searchValue=""
        onSearchChange={vi.fn()}
        isRefetching={false}
        onRefetch={vi.fn()}
      />,
    );

    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('fires onSearchChange with the typed value', async () => {
    const handleChange = vi.fn();
    render(
      <ListHeader
        title="X"
        total={0}
        searchValue=""
        onSearchChange={handleChange}
        isRefetching={false}
        onRefetch={vi.fn()}
      />,
    );

    await userEvent.type(screen.getByRole('searchbox'), 'a');
    expect(handleChange).toHaveBeenCalledWith('a');
  });

  it('uses the custom search placeholder', () => {
    render(
      <ListHeader
        title="X"
        total={0}
        searchValue=""
        onSearchChange={vi.fn()}
        searchPlaceholder="Find users..."
        isRefetching={false}
        onRefetch={vi.fn()}
      />,
    );

    expect(screen.getByPlaceholderText('Find users...')).toBeInTheDocument();
  });

  it('defaults entityName to "items"', () => {
    render(
      <ListHeader title="X" total={5} isRefetching={false} onRefetch={vi.fn()} />,
    );

    expect(screen.getByText('5 items')).toBeInTheDocument();
  });
});
