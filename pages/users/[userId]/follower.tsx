import UserList from 'components/userList';
import useFollowerListPage from 'hooks/pages/useFollowerListPage';
import { NextPage } from 'next';

const FollowerListPage: NextPage = () => {
  const { followerUsers } = useFollowerListPage();
  return <UserList listHeader="フォロワーリスト" users={followerUsers} />;
};

export default FollowerListPage;
