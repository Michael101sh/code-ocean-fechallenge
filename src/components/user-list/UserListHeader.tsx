import type { FC } from 'react';
import RefreshButton from '../common/RefreshButton';

/** User Directory title, total count, and refresh action. */
type UserListHeaderProps = {
  total: number;
  isRefetching: boolean;
  onRefetch: () => void;
};

const UserListHeader: FC<UserListHeaderProps> = ({
  total,
  isRefetching,
  onRefetch,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8">
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
  );
};

export default UserListHeader;
