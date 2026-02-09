/** Tests for users API layer – pagination (fetchUsersPage) and smart search (smartSearch). */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { smartSearch, fetchUsersPage } from './users';

/* Global fetch mock – lets us control responses without a real server. */
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

const mockUser = {
  id: '1',
  firstName: 'Alice',
  lastName: 'Smith',
  email: 'alice@example.com',
  catchPhrase: 'test phrase',
  comments: 'test comments',
};

describe('fetchUsersPage', () => {
  beforeEach(() => mockFetch.mockReset());

  it('sends correct _page and _limit query params', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockUser],
      headers: new Headers({ 'X-Total-Count': '50' }),
    });

    await fetchUsersPage({ pageParam: 2 });

    /* pageParam is 0-based; API _page is 1-based. */
    expect(mockFetch).toHaveBeenCalledWith('/api/users?_page=3&_limit=20');
  });

  it('returns items and total from response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockUser],
      headers: new Headers({ 'X-Total-Count': '100' }),
    });

    const result = await fetchUsersPage({ pageParam: 0 });

    expect(result.items).toEqual([mockUser]);
    expect(result.total).toBe(100);
  });

  it('returns undefined total when X-Total-Count header is missing', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
      headers: new Headers(),
    });

    const result = await fetchUsersPage({ pageParam: 0 });
    expect(result.total).toBeUndefined();
  });

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, statusText: 'Server Error' });

    await expect(fetchUsersPage({ pageParam: 0 })).rejects.toThrow(
      'Failed to fetch users',
    );
  });
});

describe('smartSearch', () => {
  beforeEach(() => mockFetch.mockReset());

  it('returns empty array and skips fetch for blank input', async () => {
    expect(await smartSearch('   ')).toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('searches by email when term is an email address', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockUser],
    });

    const result = await smartSearch('alice@example.com');

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/users?email=alice%40example.com',
    );
    expect(result).toEqual([mockUser]);
  });

  it('searches firstName and lastName in parallel for non-email terms', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => [mockUser] })
      .mockResolvedValueOnce({ ok: true, json: async () => [] });

    await smartSearch('Alice');

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch).toHaveBeenCalledWith('/api/users?firstName=Alice');
    expect(mockFetch).toHaveBeenCalledWith('/api/users?lastName=Alice');
  });

  it('deduplicates results that appear in both name searches', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => [mockUser] })
      .mockResolvedValueOnce({ ok: true, json: async () => [mockUser] });

    const result = await smartSearch('Alice');
    expect(result).toHaveLength(1);
  });

  it('throws on failed email search', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, statusText: 'Error' });
    await expect(smartSearch('alice@test.com')).rejects.toThrow();
  });

  it('throws on failed name search', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: false })
      .mockResolvedValueOnce({ ok: true, json: async () => [] });

    await expect(smartSearch('Alice')).rejects.toThrow();
  });
});
