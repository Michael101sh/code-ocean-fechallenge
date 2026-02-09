import type { FC } from 'react';
import type { Reviewer } from '../../api/reviewers';
import { getAvatarColor, getInitials } from '../../utils/avatar';

type ReviewerRowProps = {
  reviewer: Reviewer;
  index: number;
};

const ReviewerRow: FC<ReviewerRowProps> = ({ reviewer, index }) => {
  return (
    <div className="mb-4 group">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
        <div className="p-5">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div
              className={`
                w-14 h-14 rounded-full flex items-center justify-center
                text-white font-bold text-lg flex-shrink-0
                shadow-lg
                ${getAvatarColor(index)}
              `}
            >
              {getInitials(reviewer.firstName, reviewer.lastName)}
            </div>

            {/* Reviewer info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-800 mb-1 truncate">
                {reviewer.firstName} {reviewer.lastName}
              </h3>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-gray-500">&#128231;</span>
                <a
                  href={`mailto:${reviewer.email}`}
                  className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors text-sm truncate"
                >
                  {reviewer.email}
                </a>
              </div>

              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-3 mb-2">
                <div className="flex items-start gap-2">
                  <span className="text-base">&#128172;</span>
                  <p className="text-gray-700 italic font-medium text-sm flex-1">
                    &ldquo;{reviewer.catchPhrase}&rdquo;
                  </p>
                </div>
              </div>

              {reviewer.comments && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <span className="text-base">&#128221;</span>
                    <p className="text-gray-600 text-sm flex-1">
                      {reviewer.comments}
                    </p>
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

export default ReviewerRow;
