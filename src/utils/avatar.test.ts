/** Tests for avatar utility functions used in UserRow and ReviewerRow cards. */
import { describe, it, expect } from 'vitest';
import { getInitials, getAvatarColor } from './avatar';

describe('getInitials', () => {
  /* Ensures casing is normalised regardless of input. */
  it('returns uppercase initials from first and last name', () => {
    expect(getInitials('alice', 'smith')).toBe('AS');
  });

  it('handles already-uppercase names', () => {
    expect(getInitials('Bob', 'Jones')).toBe('BJ');
  });

  it('handles single-character names', () => {
    expect(getInitials('A', 'B')).toBe('AB');
  });
});

describe('getAvatarColor', () => {
  it('returns a Tailwind gradient class string', () => {
    expect(getAvatarColor(0)).toContain('bg-gradient-to-br');
  });

  /* Adjacent rows should get visually distinct avatars. */
  it('returns different colors for consecutive indices', () => {
    expect(getAvatarColor(0)).not.toBe(getAvatarColor(1));
  });

  /* The palette has 8 entries; index 8 should wrap to index 0. */
  it('cycles back after exhausting the palette (8 colors)', () => {
    expect(getAvatarColor(0)).toBe(getAvatarColor(8));
    expect(getAvatarColor(3)).toBe(getAvatarColor(11));
  });
});
