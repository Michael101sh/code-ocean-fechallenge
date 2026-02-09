import type { FC } from 'react';
import StatusScreen from '../../common/StatusScreen';
import UserListHeader from '../UserListHeader';

const UserListErrorState: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <UserListHeader total={0} isRefetching={false} onRefetch={() => {}} />

        <div className="mt-8 flex justify-center">
          <StatusScreen
            icon="⚠️"
            title="Oops!"
            message="There was an error loading users."
            gradientClassName=""
          />
        </div>
      </div>
    </div>
  );
};

export default UserListErrorState;

