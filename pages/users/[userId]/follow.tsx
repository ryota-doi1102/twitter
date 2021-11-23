import {
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { getFollowList, getIsFollow } from 'utils/firebase/firestore/follow';
import { getUser } from 'utils/firebase/firestore/user';

const FollowListPage: NextPage = () => {
  const [followUsers, setFollowUsers] = useState<Twitter.FollowListItem[]>([]);
  const router = useRouter();

  const requestGetFollowList = useCallback(async () => {
    const displayUserId = router.query.userId;
    if (typeof displayUserId === 'string') {
      const followList = await getFollowList(displayUserId);
      const newFollowUsers: Twitter.FollowListItem[] = [];
      const promise = followList.map(async (follow) => {
        const user = await getUser(follow.followerUserId);
        if (user) {
          const isFollow = await getIsFollow(displayUserId, user.id);
          const followUser: Twitter.FollowListItem = {
            id: follow.id,
            userId: user.id,
            userName: user.name,
            avatarUrl: user.avatarUrl,
            createdAt: follow.createdAt,
            isFollow: isFollow,
          };
          newFollowUsers.push(followUser);
        }
      });
      await Promise.all(promise);
      setFollowUsers(newFollowUsers);
    }
  }, [router.query.userId]);

  useEffect(() => {
    requestGetFollowList();
  }, [requestGetFollowList]);

  return (
    <main>
      <List subheader={<ListSubheader>フォローリスト</ListSubheader>}>
        {followUsers.map((followUser) => (
          <React.Fragment key={followUser.id}>
            <ListItem
              secondaryAction={
                followUser.isFollow ? (
                  <Button variant="outlined">フォロー中</Button>
                ) : (
                  <Button variant="contained">フォローする</Button>
                )
              }
            >
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar alt={followUser.userName} src={followUser.avatarUrl} />
                </ListItemAvatar>
                <ListItemText primary={followUser.userName} />
              </ListItemButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </main>
  );
};

export default FollowListPage;
