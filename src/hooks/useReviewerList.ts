import type { Reviewer } from '../api/reviewers';
import {
  fetchReviewersPage,
  smartSearchReviewers,
  PAGE_SIZE,
} from '../api/reviewers';
import { useEntityList, type EntityListResult } from './useEntityList';

/** Reviewer-specific wrapper around the generic useEntityList hook. */
export function useReviewerList(): EntityListResult<Reviewer> {
  return useEntityList<Reviewer>({
    queryKey: 'reviewers',
    fetchPage: fetchReviewersPage,
    searchFn: smartSearchReviewers,
    pageSize: PAGE_SIZE,
  });
}
