import { useReviewerList } from '../../hooks/useReviewerList';
import EntityList from '../shared/EntityList';
import ReviewerRow from './ReviewerRow';

/** Reviewer directory – thin wrapper connecting useReviewerList to the generic EntityList layout. */
function ReviewerList() {
  const list = useReviewerList();

  return (
    <EntityList
      title="Reviewer Directory"
      entityName="reviewers"
      searchPlaceholder="Search by name or email"
      renderRow={(reviewer, index) => (
        <ReviewerRow reviewer={reviewer} index={index} />
      )}
      list={list}
    />
  );
}

export default ReviewerList;
