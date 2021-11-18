import {
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { NextPage } from 'next';
import React from 'react';

const tweets: Twitter.Tweet[] = [
  {
    userName: 'hogehoge',
    avatarUrl: '/vercel.svg',
    userId: 'gehogeho',
    content: 'こんにちは',
    createdAt: 1687645,
  },
];

const FollowerListPage: NextPage = () => {
  return (
    <main>
      <Typography variant="h5" component="h1">
        フォロワーリスト
      </Typography>
      <List>
        {tweets.map((tweet, index) => (
          <React.Fragment key={index}>
            <ListItem
              secondaryAction={
                index % 2 === 0 ? (
                  <Button variant="outlined">フォロー中</Button>
                ) : (
                  <Button variant="contained">フォローする</Button>
                )
              }
            >
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar alt={tweet.userName} src={tweet.avatarUrl} />
                </ListItemAvatar>
                <ListItemText primary={tweet.userName} />
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
