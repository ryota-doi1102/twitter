import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { NextPage } from 'next';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import AuthContext from 'contexts/authContext';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { getFollowList } from 'utils/firebase/firestore/follow';
import { getUsersTweetList, addTweet } from 'utils/firebase/firestore/tweet';
import { getUser } from 'utils/firebase/firestore/user';

const TimelinePage: NextPage = () => {
  const router = useRouter();
  const { loginUser } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [tweetContent, setTweetContent] = useState('');
  const [tweetList, setTweetList] = useState<Twitter.Tweet[]>([]);

  const requestGetTimelineTweet = useCallback(async () => {
    if (!loginUser) return;
    const followList = await getFollowList(loginUser.id);
    const userIdList = followList.map((follow) => follow.followerUserId);
    userIdList.push(loginUser.id);
    const usersTweetList = await getUsersTweetList(userIdList);
    const newTweetList: Twitter.Tweet[] = [];
    const promise = usersTweetList.map(async (usersTweet) => {
      const user = await getUser(usersTweet.userId);
      if (!user) return;
      const tweet: Twitter.Tweet = {
        id: usersTweet.id,
        userId: usersTweet.userId,
        userName: user?.name,
        avatarUrl: user?.avatarUrl,
        content: usersTweet.content,
        createdAt: usersTweet.createdAt,
      };
      newTweetList.push(tweet);
    });
    await Promise.all(promise);
    setTweetList(newTweetList);
  }, [loginUser]);

  useEffect(() => {
    requestGetTimelineTweet();
  }, [requestGetTimelineTweet]);

  const handleClickFab = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setTweetContent('');
  }, []);

  const handleChangeTweetContent: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const value = event.target.value;
    setTweetContent(value);
  }, []);

  const handleClickTweetButton = useCallback(async () => {
    if (!loginUser || tweetContent === '') return;
    await addTweet({
      userId: loginUser.id,
      content: tweetContent,
    });
    setOpen(false);
    setTweetContent('');
    router.reload();
  }, [loginUser, router, tweetContent]);

  return (
    <main>
      <List>
        {tweetList.map((tweet) => (
          <React.Fragment key={tweet.id}>
            <ListItem>
              <ListItemAvatar>
                <Avatar alt={tweet.userName} src={tweet.avatarUrl} />
              </ListItemAvatar>
              <ListItemText
                primary={tweet.content}
                secondary={
                  <NextLink href={`/users/${tweet.userId}`} passHref>
                    <Link underline="none" color="inherit">
                      {tweet.userName}
                    </Link>
                  </NextLink>
                }
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      <Fab color="primary" onClick={handleClickFab} sx={{ position: 'fixed', right: 16, bottom: 16 }}>
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>今どうしてる？</DialogTitle>
        <DialogContent>
          <TextField multiline rows={4} value={tweetContent} onChange={handleChangeTweetContent} />
        </DialogContent>
        <DialogActions>
          <Button variant="text" disabled={tweetContent === ''} onClick={handleClickTweetButton}>
            ツイートする
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
};

export default TimelinePage;
