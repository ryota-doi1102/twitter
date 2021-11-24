import UserList from 'components/userList';
import useFollowListPage from 'hooks/pages/useFollowListPage';
import { NextPage } from 'next';

const FollowListPage: NextPage = () => {
  const { followList } = useFollowListPage();
  return <UserList listHeader="フォローリスト" users={followList} />;
};

export default FollowListPage;
