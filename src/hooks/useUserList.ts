import type { User } from '../api/users';
import { fetchUsersPage, smartSearch, PAGE_SIZE } from '../api/users';
import { useEntityList, type EntityListResult } from './useEntityList';

/** User-specific wrapper around the generic useEntityList hook. */
export function useUserList(): EntityListResult<User> {
  return useEntityList<User>({
    queryKey: 'users',
    fetchPage: fetchUsersPage,
    searchFn: smartSearch,
    pageSize: PAGE_SIZE,
  });
}
