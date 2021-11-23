import UserList from 'components/userList';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { getFollowList } from 'utils/firebase/firestore/follow';
import { getUser, User } from 'utils/firebase/firestore/user';

const FollowListPage: NextPage = () => {
  const router = useRouter();
  const [followList, setFollowList] = useState<User[]>([]);

  const requestGetFollowList = useCallback(async () => {
    const displayUserId = router.query.userId;
    if (typeof displayUserId === 'string') {
      const followList = await getFollowList(displayUserId);
      const newFollowUsers: User[] = [];
      const promise = followList.map(async (follow) => {
        const user = await getUser(follow.followerUserId);
        if (user) {
          const followUser: User = {
            id: follow.id,
            name: user.name,
            avatarUrl: user.avatarUrl,
            createdAt: follow.createdAt,
          };
          newFollowUsers.push(followUser);
        }
      });
      await Promise.all(promise);
      setFollowList(newFollowUsers);
    }
  }, [router.query.userId]);

  useEffect(() => {
    requestGetFollowList();
  }, [requestGetFollowList]);

  return <UserList listHeader="フォローリスト" users={followList} />;
};

export default FollowListPage;
