import { useRouter } from 'next/router';
import { useState, useCallback, useEffect } from 'react';
import { getFollowList } from 'utils/firebase/firestore/follow';
import { getUser, User } from 'utils/firebase/firestore/user';

const useFollowListPage = () => {
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
            id: user.id,
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

  return { followList };
};

export default useFollowListPage;
