import { useUserList } from '../../hooks/useUserList';
import EntityList from '../shared/EntityList';
import UserRow from './UserRow';

/** User directory – thin wrapper connecting useUserList to the generic EntityList layout. */
function UserList() {
  const list = useUserList();

  return (
    <EntityList
      title="User Directory"
      entityName="people"
      searchPlaceholder="Search by name or email"
      renderRow={(user, index) => <UserRow user={user} index={index} />}
      list={list}
    />
  );
}

export default UserList;
