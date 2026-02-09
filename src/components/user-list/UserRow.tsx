import type { FC } from 'react';
import type { User } from '../../api/users';
import { getAvatarColor, getInitials } from '../../utils/avatar';

/** Single user card: all fields except id (firstName, lastName, email, catchPhrase, comments). */
type UserRowProps = {
  user: User;
  index: number;
};

const UserRow: FC<UserRowProps> = ({ user, index }) => {
  return (
    <div className="mb-4 group">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div
              className={`
                w-16 h-16 rounded-full flex items-center justify-center
                text-white font-bold text-xl flex-shrink-0
                shadow-lg
                ${getAvatarColor(index)}
              `}
            >
              {getInitials(user.firstName, user.lastName)}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {user.firstName} {user.lastName}
              </h3>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-gray-500">📧</span>
                <a
                  href={`mailto:${user.email}`}
                  className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                  {user.email}
                </a>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-3">
                <div className="flex items-start gap-2">
                  <span className="text-lg">💭</span>
                  <p className="text-gray-700 italic font-medium flex-1">
                    "{user.catchPhrase}"
                  </p>
                </div>
              </div>

              {user.comments && (
                <div className="bg-gray-50 rounded-3xl p-4">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">💬</span>
                    <p className="text-gray-600 flex-1">{user.comments}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRow;

