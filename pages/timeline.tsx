import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { NextPage } from 'next';
import React, { useState } from 'react';
const tweets: Twitter.Tweet[] = [
  {
    userName: 'hogehoge',
    avatarUrl: '/vercel.svg',
    userId: 'gehogeho',
    content: 'こんにちは',
    createdAt: 1687645,
  },
];

const Timeline: NextPage = () => {
  const [open, setOpen] = useState(false);
  const [tweetContent, setTweetContent] = useState('');

  const handleClickFab = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setTweetContent('');
  };
  const handleChangeTweetContent: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value;
    setTweetContent(value);
  };
  const handleClickTweetButton = () => {
    setOpen(false);
    setTweetContent('');
  };

  return (
    <main>
      <List>
        {tweets.map((tweet, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemAvatar>
                <Avatar alt={tweet.userName} src={tweet.avatarUrl} />
              </ListItemAvatar>
              <ListItemText primary={tweet.content} secondary={tweet.userName} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      <Fab color="primary" onClick={handleClickFab} sx={{ position: 'absolute', right: 16, bottom: 16 }}>
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>今どうしてる？</DialogTitle>
        <DialogContent>
          <TextField multiline rows={4} value={tweetContent} onChange={handleChangeTweetContent} />
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleClickTweetButton}>
            ツイートする
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
};

export default Timeline;
