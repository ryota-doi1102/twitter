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
import React, { useCallback, useContext, useEffect, useState } from 'react';
import useTweet from 'hooks/useTweet';
import AuthContext from 'contexts/authContext';
import useFollow from 'hooks/useFollow';
import useUser from 'hooks/useUser';
import { useRouter } from 'next/router';

const TimelinePage: NextPage = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { addTweet, getUsersTweetList } = useTweet();
  const { getFollowList } = useFollow();
  const { getUser } = useUser();
  const { loginUser } = useContext(AuthContext);
  const [tweetContent, setTweetContent] = useState('');
  const [tweetList, setTweetList] = useState<Twitter.Tweet[]>([]);

  const requestGetTimelineTweet = useCallback(async () => {
    if (loginUser) {
      const followList = await getFollowList(loginUser.id);
      const followUserIdList = followList.map((follow) => {
        return follow.followerUserId;
      });
      followUserIdList.push(loginUser.id);
      const usersTweetList = await getUsersTweetList(followUserIdList);
      const filteredTweetList: Twitter.Tweet[] = [];
      await Promise.all(
        usersTweetList.map(async (usersTweet) => {
          const user = await getUser(usersTweet.userId);
          if (user) {
            const tweet: Twitter.Tweet = {
              id: usersTweet.id,
              userId: usersTweet.userId,
              userName: user?.name,
              avatarUrl: user?.avatarUrl,
              content: usersTweet.content,
              createdAt: usersTweet.createdAt,
            };
            filteredTweetList.push(tweet);
          }
        }),
      );
      setTweetList(filteredTweetList);
    }
  }, [getFollowList, getUser, getUsersTweetList, loginUser]);

  useEffect(() => {
    requestGetTimelineTweet();
  }, [requestGetTimelineTweet]);

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

  const handleClickTweetButton = useCallback(async () => {
    if (loginUser && tweetContent !== '') {
      await addTweet({
        userId: loginUser.id,
        content: tweetContent,
      });
      setOpen(false);
      setTweetContent('');
      router.reload();
    }
  }, [addTweet, loginUser, router, tweetContent]);

  return (
    <main>
      <List>
        {tweetList.map((tweet, index) => (
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
