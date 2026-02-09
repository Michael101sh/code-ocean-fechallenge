/** Tests for reviewers API layer – mirrors the users.test.ts structure for consistency. */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { smartSearchReviewers, fetchReviewersPage } from './reviewers';

/* Global fetch mock – lets us control responses without a real server. */
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

const mockReviewer = {
  id: '1',
  firstName: 'Bob',
  lastName: 'Chen',
  email: 'bob@company.io',
  catchPhrase: 'synergize platforms',
  comments: 'Great reviewer',
};

describe('fetchReviewersPage', () => {
  beforeEach(() => mockFetch.mockReset());

  it('sends correct _page and _limit params', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockReviewer],
      headers: new Headers({ 'X-Total-Count': '30' }),
    });

    await fetchReviewersPage({ pageParam: 1 });

    expect(mockFetch).toHaveBeenCalledWith('/api/reviewers?_page=2&_limit=20');
  });

  it('returns items and total', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockReviewer],
      headers: new Headers({ 'X-Total-Count': '30' }),
    });

    const result = await fetchReviewersPage({ pageParam: 0 });

    expect(result.items).toEqual([mockReviewer]);
    expect(result.total).toBe(30);
  });

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, statusText: 'Error' });

    await expect(fetchReviewersPage({ pageParam: 0 })).rejects.toThrow(
      'Failed to fetch reviewers',
    );
  });
});

describe('smartSearchReviewers', () => {
  beforeEach(() => mockFetch.mockReset());

  it('returns empty array for blank input', async () => {
    expect(await smartSearchReviewers('')).toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('searches by email when input is an email', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockReviewer],
    });

    const result = await smartSearchReviewers('bob@company.io');

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/reviewers?email=bob%40company.io',
    );
    expect(result).toEqual([mockReviewer]);
  });

  it('searches firstName and lastName for non-email terms', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => [mockReviewer] })
      .mockResolvedValueOnce({ ok: true, json: async () => [] });

    await smartSearchReviewers('Bob');

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch).toHaveBeenCalledWith('/api/reviewers?firstName=Bob');
    expect(mockFetch).toHaveBeenCalledWith('/api/reviewers?lastName=Bob');
  });

  it('deduplicates results from both name searches', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => [mockReviewer] })
      .mockResolvedValueOnce({ ok: true, json: async () => [mockReviewer] });

    const result = await smartSearchReviewers('Bob');
    expect(result).toHaveLength(1);
  });
});
