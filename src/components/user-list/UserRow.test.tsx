/** Tests for UserRow – verifies all displayed fields, mailto link, and conditional comments. */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserRow from './UserRow';
import type { User } from '../../api/users';

/* Representative user fixture with all fields populated. */
const mockUser: User = {
  id: '1',
  firstName: 'Alice',
  lastName: 'Smith',
  email: 'alice@example.com',
  catchPhrase: 'innovate synergies',
  comments: 'A great user',
};

describe('UserRow', () => {
  it('renders the full name', () => {
    render(<UserRow user={mockUser} index={0} />);
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
  });

  it('renders email as a mailto link', () => {
    render(<UserRow user={mockUser} index={0} />);
    const link = screen.getByRole('link', { name: 'alice@example.com' });
    expect(link).toHaveAttribute('href', 'mailto:alice@example.com');
  });

  it('renders the catch phrase', () => {
    render(<UserRow user={mockUser} index={0} />);
    expect(screen.getByText(/innovate synergies/)).toBeInTheDocument();
  });

  it('renders comments when present', () => {
    render(<UserRow user={mockUser} index={0} />);
    expect(screen.getByText('A great user')).toBeInTheDocument();
  });

  it('hides the comments section when comments is empty', () => {
    render(<UserRow user={{ ...mockUser, comments: '' }} index={0} />);
    expect(screen.queryByText('A great user')).not.toBeInTheDocument();
  });

  it('shows initials in the avatar', () => {
    render(<UserRow user={mockUser} index={0} />);
    expect(screen.getByText('AS')).toBeInTheDocument();
  });
});
