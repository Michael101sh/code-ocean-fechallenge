import type { FC } from 'react';

/** Reusable refetch trigger; shows spinner and "Refreshing…" while loading. Use with any list or data view. */
type RefreshButtonProps = {
  isRefetching: boolean;
  onRefetch: () => void;
};

const RefreshButton: FC<RefreshButtonProps> = ({ isRefetching, onRefetch }) => {
  return (
    <button
      type="button"
      onClick={onRefetch}
      disabled={isRefetching}
      aria-busy={isRefetching}
      aria-label={isRefetching ? 'Refreshing' : 'Refresh list'}
      className={`
        min-w-[11rem] px-6 py-3 rounded-xl font-bold text-lg
        transition-[background-color,transform,box-shadow] duration-200 ease-out
        shadow-lg hover:shadow-xl
        ${
          isRefetching
            ? 'bg-white/90 text-purple-600 cursor-wait'
            : 'bg-white text-purple-600 hover:scale-105 hover:bg-gray-50'
        }
      `}
    >
      <span className="flex items-center justify-center gap-2">
        <span className="inline-flex w-6 h-6 items-center justify-center">
          {isRefetching ? (
            <span
              className="w-5 h-5 rounded-full border-2 border-purple-200 border-t-purple-600 animate-spin"
              aria-hidden
            />
          ) : (
            '🔄'
          )}
        </span>
        <span>{'Refresh'}</span>
      </span>
    </button>
  );
};

export default RefreshButton;
