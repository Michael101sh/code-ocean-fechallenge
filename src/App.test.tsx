/**
 * Tests for App – verifies the top-level layout renders both entity lists.
 * List components are mocked to isolate the layout from data fetching and API calls.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

vi.mock('./components/user-list/UserList', () => ({
  default: () => <div data-testid="user-list">UserList</div>,
}));
vi.mock('./components/reviewer-list/ReviewerList', () => ({
  default: () => <div data-testid="reviewer-list">ReviewerList</div>,
}));

describe('App', () => {
  /* Both panels should always be present in the side-by-side grid. */
  it('renders both the UserList and ReviewerList', () => {
    render(<App />);

    expect(screen.getByTestId('user-list')).toBeInTheDocument();
    expect(screen.getByTestId('reviewer-list')).toBeInTheDocument();
  });
});
