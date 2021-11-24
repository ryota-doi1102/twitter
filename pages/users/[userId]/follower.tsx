import UserList from 'components/userList';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { getFollowerList } from 'utils/firebase/firestore/follow';
import { getUser, User } from 'utils/firebase/firestore/user';

const FollowerListPage: NextPage = () => {
  const [followerUsers, setFollowerUsers] = useState<User[]>([]);
  const router = useRouter();

  const requestGetFollowerList = useCallback(async () => {
    const displayUserId = router.query.userId;
    if (typeof displayUserId === 'string') {
      const followerList = await getFollowerList(displayUserId);
      const newFollowerUsers: User[] = [];
      const promise = followerList.map(async (follower) => {
        const user = await getUser(follower.followUserId);
        if (user) {
          const followerUser: User = {
            id: follower.id,
            name: user.name,
            avatarUrl: user.avatarUrl,
            createdAt: follower.createdAt,
          };
          newFollowerUsers.push(followerUser);
        }
      });
      await Promise.all(promise);
      setFollowerUsers(newFollowerUsers);
    }
  }, [router.query.userId]);

  useEffect(() => {
    requestGetFollowerList();
  }, [requestGetFollowerList]);

  return <UserList listHeader="フォロワーリスト" users={followerUsers} />;
};

export default FollowerListPage;
