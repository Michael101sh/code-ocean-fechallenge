import type { EntityPage } from '../hooks/useEntityList';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  catchPhrase: string;
  comments: string;
};

export const PAGE_SIZE = 20;

const USERS_BASE = '/api/users';

/**
 * =============================================================================
 * JSON-SERVER v1.0.0-beta.3 LIMITATIONS:
 * - The _like operator is not supported in this version
 * - Filtering through the API (e.g. ?email=, ?firstName=, ?lastName=) IS
 *   CASE-SENSITIVE AND SUPPORTS EXACT MATCHES ONLY
 * - Case-insensitive or partial matching would require custom server logic
 *   or client-side filtering
 * =============================================================================
 */

/** If term looks like an email, one request by email; otherwise two parallel requests by firstName and lastName, then merge and dedupe by id. */
export async function smartSearch(term: string): Promise<User[]> {
  const trimmed = term.trim();
  if (!trimmed) return [];

  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(trimmed)) {
      const res = await fetch(
        `${USERS_BASE}?email=${encodeURIComponent(trimmed)}`,
      );
      if (!res.ok) throw new Error(`Failed to fetch users: ${res.statusText}`);
      return (await res.json()) as User[];
    }

    const [resFirst, resLast] = await Promise.all([
      fetch(`${USERS_BASE}?firstName=${encodeURIComponent(trimmed)}`),
      fetch(`${USERS_BASE}?lastName=${encodeURIComponent(trimmed)}`),
    ]);
    if (!resFirst.ok || !resLast.ok) {
      throw new Error('Failed to fetch users');
    }

    const firstNames = (await resFirst.json()) as User[];
    const lastNames = (await resLast.json()) as User[];
    const combined = [...firstNames, ...lastNames];
    return Array.from(new Map(combined.map((u) => [u.id, u])).values());
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error('Failed to load users');
  }
}

/** Fetches one page of users. Uses _page (1-based), _limit. */
export const fetchUsersPage = async ({
  pageParam = 0,
}: {
  pageParam?: number;
}): Promise<EntityPage<User>> => {
  try {
    const params = new URLSearchParams({
      _page: String(pageParam + 1),
      _limit: String(PAGE_SIZE),
    });
    const res = await fetch(`${USERS_BASE}?${params.toString()}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch users: ${res.statusText}`);
    }

    const items = (await res.json()) as User[];
    const totalHeader = res.headers.get('X-Total-Count');
    const total = totalHeader ? Number(totalHeader) : undefined;

    return { items, total };
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error('Failed to load users');
  }
};
