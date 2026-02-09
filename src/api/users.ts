export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  catchPhrase: string;
  comments: string;
};

export type UsersPage = {
  users: User[];
  /**
   * Optional total count of users, when provided by the API
   * via the `X-Total-Count` header.
   */
  total?: number;
};

export const PAGE_SIZE = 20;

/** Fetches one page of users. Uses json-server params: _page (1-based), _limit. */
export const fetchUsersPage = async ({
  pageParam = 0,
}: {
  pageParam?: number;
}): Promise<UsersPage> => {
  const res = await fetch(`/api/users?_page=${pageParam + 1}&_limit=${PAGE_SIZE}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch users: ${res.statusText}`);
  }

  const users = (await res.json()) as User[];
  /** json-server sends total count with _limit; used to know when to stop pagination. */
  const totalHeader = res.headers.get('X-Total-Count');
  const total = totalHeader ? Number(totalHeader) : undefined;

  return { users, total };
};

