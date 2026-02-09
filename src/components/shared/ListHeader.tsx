import type { FC, ChangeEvent } from 'react';
import RefreshButton from '../common/RefreshButton';

/** Reusable list header: title, count, optional search input, and refresh button. */
type ListHeaderProps = {
  title: string;
  total: number;
  /** Plural noun shown after the count (e.g. "people", "reviewers"). */
  entityName?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  isRefetching: boolean;
  onRefetch: () => void;
};

const ListHeader: FC<ListHeaderProps> = ({
  title,
  total,
  entityName = 'items',
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search by name or email',
  isRefetching,
  onRefetch,
}) => {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) =>
    onSearchChange?.(e.target.value);

  /* Search input is opt-in: only rendered when a change handler is provided. */
  const showSearch = onSearchChange != null;

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left min-w-0">
          <h2 className="text-2xl lg:text-3xl font-black text-white mb-1 drop-shadow-lg truncate">
            {title}
          </h2>
          <p className="text-white/90 text-sm font-medium">
            {total} {entityName}
          </p>
        </div>

        <RefreshButton isRefetching={isRefetching} onRefetch={onRefetch} />
      </div>

      {showSearch && (
        <input
          type="search"
          value={searchValue}
          onChange={handleSearchChange}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 text-sm"
        />
      )}
    </div>
  );
};

export default ListHeader;
