import type { FC } from 'react';
import UserList from './components/user-list/UserList';
import ReviewerList from './components/reviewer-list/ReviewerList';

/** Root layout: side-by-side lists on desktop, stacked on mobile. */
const App: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 sm:p-6">
      {/* Fixed-height grid ensures each list gets its own scroll container. */}
      <div className="mx-auto max-w-[1600px] h-[calc(100vh-32px)] sm:h-[calc(100vh-48px)] grid grid-cols-1 grid-rows-2 lg:grid-cols-2 lg:grid-rows-1 gap-6">
        <UserList />
        <ReviewerList />
      </div>
    </div>
  );
};

export default App;
