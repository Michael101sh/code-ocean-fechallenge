import type { FC, ChangeEvent } from 'react';
import RefreshButton from '../common/RefreshButton';

/** User Directory title, total count, optional search by name/email, and refresh action. */
type UserListHeaderProps = {
  total: number;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  isRefetching: boolean;
  onRefetch: () => void;
};

const UserListHeader: FC<UserListHeaderProps> = ({
  total,
  searchValue = '',
  onSearchChange,
  isRefetching,
  onRefetch,
}) => {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) =>
    onSearchChange?.(e.target.value);

  const showSearch = onSearchChange != null;

  return (
    <div className="flex flex-col gap-6 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="text-center sm:text-left">
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-2 drop-shadow-lg">
            User Directory
          </h1>
          <p className="text-white/90 text-lg font-medium">
            {total} amazing {total === 1 ? 'person' : 'people'}
          </p>
        </div>

        <RefreshButton isRefetching={isRefetching} onRefetch={onRefetch} />
      </div>

      {showSearch && (
        <input
          type="search"
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Search by name or email"
          aria-label="Search users by name or email"
          className="w-full max-w-md px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40"
        />
      )}
    </div>
  );
};

export default UserListHeader;
