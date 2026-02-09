/** Tests for StatusScreen – the reusable full-screen state card (empty/error). */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusScreen from './StatusScreen';

describe('StatusScreen', () => {
  it('renders the icon and title', () => {
    render(
      <StatusScreen icon="🔍" title="Not Found" gradientClassName="bg-red-500" />,
    );

    expect(screen.getByText('🔍')).toBeInTheDocument();
    expect(screen.getByText('Not Found')).toBeInTheDocument();
  });

  it('renders the optional message when provided', () => {
    render(
      <StatusScreen
        icon="⚠️"
        title="Error"
        message="Something went wrong"
        gradientClassName=""
      />,
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('omits the message paragraph when not provided', () => {
    const { container } = render(
      <StatusScreen icon="🔍" title="Empty" gradientClassName="" />,
    );

    expect(container.querySelectorAll('p')).toHaveLength(0);
  });
});
