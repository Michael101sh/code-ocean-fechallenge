import type { EntityPage } from '../hooks/useEntityList';

export type Reviewer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  catchPhrase: string;
  comments: string;
};

/** Must match the _limit sent to json-server so getNextPageParam can detect the last page. */
export const PAGE_SIZE = 20;

/** Vite proxy rewrites /api/* to the json-server at localhost:3001. */
const REVIEWERS_BASE = '/api/reviewers';

/**
 * Smart search for reviewers.
 * If the term looks like an email → exact email match.
 * Otherwise → parallel firstName + lastName lookup, merged & deduped.
 */
export async function smartSearchReviewers(term: string): Promise<Reviewer[]> {
  const trimmed = term.trim();
  if (!trimmed) return [];

  try {
    /* Simple check – if it looks like an email, search the email field only. */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(trimmed)) {
      const res = await fetch(
        `${REVIEWERS_BASE}?email=${encodeURIComponent(trimmed)}`,
      );
      if (!res.ok)
        throw new Error(`Failed to fetch reviewers: ${res.statusText}`);
      return (await res.json()) as Reviewer[];
    }

    const [resFirst, resLast] = await Promise.all([
      fetch(`${REVIEWERS_BASE}?firstName=${encodeURIComponent(trimmed)}`),
      fetch(`${REVIEWERS_BASE}?lastName=${encodeURIComponent(trimmed)}`),
    ]);
    if (!resFirst.ok || !resLast.ok)
      throw new Error('Failed to fetch reviewers');

    const firstNames = (await resFirst.json()) as Reviewer[];
    const lastNames = (await resLast.json()) as Reviewer[];
    /* Merge both results and dedupe by id (a reviewer could match both first and last name). */
    const combined = [...firstNames, ...lastNames];
    return Array.from(new Map(combined.map((r) => [r.id, r])).values());
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error('Failed to load reviewers');
  }
}

/** Fetches one page of reviewers. Uses _page (1-based), _limit. */
export const fetchReviewersPage = async ({
  pageParam = 0,
}: {
  pageParam?: number;
}): Promise<EntityPage<Reviewer>> => {
  try {
    const params = new URLSearchParams({
      _page: String(pageParam + 1),
      _limit: String(PAGE_SIZE),
    });
    const res = await fetch(`${REVIEWERS_BASE}?${params.toString()}`);

    if (!res.ok)
      throw new Error(`Failed to fetch reviewers: ${res.statusText}`);

    const items = (await res.json()) as Reviewer[];
    /** json-server returns X-Total-Count when _limit is used; drives pagination end detection. */
    const totalHeader = res.headers.get('X-Total-Count');
    const total = totalHeader ? Number(totalHeader) : undefined;

    return { items, total };
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error('Failed to load reviewers');
  }
};
