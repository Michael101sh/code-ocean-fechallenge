/** Tests for ReviewerRow – mirrors UserRow tests for the reviewer-specific card layout. */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReviewerRow from './ReviewerRow';
import type { Reviewer } from '../../api/reviewers';

/* Representative reviewer fixture with all fields populated. */
const mockReviewer: Reviewer = {
  id: '1',
  firstName: 'Bob',
  lastName: 'Chen',
  email: 'bob@company.io',
  catchPhrase: 'synergize platforms',
  comments: 'Thorough reviewer',
};

describe('ReviewerRow', () => {
  it('renders the full name', () => {
    render(<ReviewerRow reviewer={mockReviewer} index={0} />);
    expect(screen.getByText('Bob Chen')).toBeInTheDocument();
  });

  it('renders email as a mailto link', () => {
    render(<ReviewerRow reviewer={mockReviewer} index={0} />);
    const link = screen.getByRole('link', { name: 'bob@company.io' });
    expect(link).toHaveAttribute('href', 'mailto:bob@company.io');
  });

  it('renders the catch phrase', () => {
    render(<ReviewerRow reviewer={mockReviewer} index={0} />);
    expect(screen.getByText(/synergize platforms/)).toBeInTheDocument();
  });

  it('renders comments when present', () => {
    render(<ReviewerRow reviewer={mockReviewer} index={0} />);
    expect(screen.getByText('Thorough reviewer')).toBeInTheDocument();
  });

  it('hides comments section when comments is empty', () => {
    render(
      <ReviewerRow reviewer={{ ...mockReviewer, comments: '' }} index={0} />,
    );
    expect(screen.queryByText('Thorough reviewer')).not.toBeInTheDocument();
  });

  it('shows initials in the avatar', () => {
    render(<ReviewerRow reviewer={mockReviewer} index={0} />);
    expect(screen.getByText('BC')).toBeInTheDocument();
  });
});
