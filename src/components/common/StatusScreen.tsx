import type { FC, ReactNode } from 'react';

/** Reusable full-screen state for empty/error (icon + title + optional message). */
type StatusScreenProps = {
  icon: ReactNode;
  title: string;
  message?: string;
  gradientClassName: string;
};

const StatusScreen: FC<StatusScreenProps> = ({
  icon,
  title,
  message,
  gradientClassName,
}) => {
  return (
    <div
      className={`min-h-screen ${gradientClassName} flex items-center justify-center p-4`}
    >
      <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md">
        <div className="text-6xl mb-6">{icon}</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">{title}</h2>
        {message ? <p className="text-gray-600">{message}</p> : null}
      </div>
    </div>
  );
};

export default StatusScreen;

