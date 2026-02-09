import type { EntityPage } from '../hooks/useEntityList';

export type Reviewer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  catchPhrase: string;
  comments: string;
};

export const PAGE_SIZE = 20;

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
    const totalHeader = res.headers.get('X-Total-Count');
    const total = totalHeader ? Number(totalHeader) : undefined;

    return { items, total };
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error('Failed to load reviewers');
  }
};
