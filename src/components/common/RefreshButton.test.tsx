/** Tests for RefreshButton – verifies click handling, disabled state, and accessibility labels. */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RefreshButton from './RefreshButton';

describe('RefreshButton', () => {
  it('renders the "Refresh" label', () => {
    render(<RefreshButton isRefetching={false} onRefetch={vi.fn()} />);
    expect(screen.getByText('Refresh')).toBeInTheDocument();
  });

  it('calls onRefetch when clicked', async () => {
    const handleRefetch = vi.fn();
    render(<RefreshButton isRefetching={false} onRefetch={handleRefetch} />);

    await userEvent.click(screen.getByRole('button'));
    expect(handleRefetch).toHaveBeenCalledOnce();
  });

  it('is disabled while refetching', () => {
    render(<RefreshButton isRefetching={true} onRefetch={vi.fn()} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('has aria-label "Refreshing" while refetching', () => {
    render(<RefreshButton isRefetching={true} onRefetch={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: 'Refreshing' }),
    ).toBeInTheDocument();
  });

  it('has aria-label "Refresh list" when idle', () => {
    render(<RefreshButton isRefetching={false} onRefetch={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: 'Refresh list' }),
    ).toBeInTheDocument();
  });
});
