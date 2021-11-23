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
import { getFollowerList, getIsFollow } from 'utils/firebase/firestore/follow';
import { getUser } from 'utils/firebase/firestore/user';

const FollowerListPage: NextPage = () => {
  const [followerUsers, setFollowerUsers] = useState<Twitter.FollowListItem[]>([]);
  const router = useRouter();

  const requestGetFollowerList = useCallback(async () => {
    const displayUserId = router.query.userId;
    if (typeof displayUserId === 'string') {
      const followerList = await getFollowerList(displayUserId);
      const newFollowerUsers: Twitter.FollowListItem[] = [];
      const promise = followerList.map(async (follower) => {
        const user = await getUser(follower.followUserId);
        if (user) {
          const isFollow = await getIsFollow(user.id, displayUserId);
          const followerUser: Twitter.FollowListItem = {
            id: follower.id,
            userId: user.id,
            userName: user.name,
            avatarUrl: user.avatarUrl,
            createdAt: follower.createdAt,
            isFollow: isFollow,
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

  return (
    <main>
      <List subheader={<ListSubheader>フォローリスト</ListSubheader>}>
        {followerUsers.map((followerUser) => (
          <React.Fragment key={followerUser.id}>
            <ListItem
              secondaryAction={
                followerUser.isFollow ? (
                  <Button variant="outlined">フォロー中</Button>
                ) : (
                  <Button variant="contained">フォローする</Button>
                )
              }
            >
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar alt={followerUser.userName} src={followerUser.avatarUrl} />
                </ListItemAvatar>
                <ListItemText primary={followerUser.userName} />
              </ListItemButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </main>
  );
};

export default FollowerListPage;
