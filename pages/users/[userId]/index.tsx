import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { NextPage } from 'next';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AuthContext from 'contexts/authContext';
import { signOut } from 'firebase/auth';
import { auth } from 'utils/firebase';
import { getUser, updateUser, User } from 'utils/firebase/firestore/user';
import { getIsFollow } from 'utils/firebase/firestore/follow';
import { getUsersTweetList } from 'utils/firebase/firestore/tweet';
import TweetList from 'components/tweetList';
import UserCard from 'components/userCard';

const UserPage: NextPage = () => {
  const router = useRouter();
  const { loginUser } = useContext(AuthContext);
  const [user, setUser] = useState<User | undefined>();
  const [open, setOpen] = useState(false);
  const [isFollow, setIsFollow] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [tweets, setTweets] = useState<Twitter.Tweet[]>([]);

  const displayUserId = router.query.userId;

  const requestGetIsFollow = useCallback(async () => {
    if (!loginUser || typeof displayUserId !== 'string') return;
    const result = await getIsFollow(loginUser.id, displayUserId);
    setIsFollow(result);
  }, [displayUserId, loginUser]);

  const requestGetUser = useCallback(async () => {
    if (typeof displayUserId !== 'string') return;
    const displayUser = await getUser(displayUserId);
    if (displayUser) {
      setUser(displayUser);
    } else {
      router.push('/');
    }
  }, [displayUserId, router]);

  const requestGetTweetList = useCallback(async () => {
    if (typeof displayUserId !== 'string') return;
    const tweets = await getUsersTweetList([displayUserId]);
    const newTweetList: Twitter.Tweet[] = [];

    tweets.map((tweets) => {
      if (!user) return;
      const tweet: Twitter.Tweet = {
        id: tweets.id,
        userId: tweets.userId,
        userName: user?.name,
        avatarUrl: user?.avatarUrl,
        content: tweets.content,
        createdAt: tweets.createdAt,
      };
      newTweetList.push(tweet);
    });

    setTweets(newTweetList);
  }, [displayUserId, user]);

  useEffect(() => {
    requestGetUser();
    requestGetIsFollow();
    requestGetTweetList();
  }, [requestGetIsFollow, requestGetUser, requestGetTweetList]);

  const handleClickChangeUserNameButton = useCallback(() => {
    setNewUserName(user?.name || '');
    setOpen(true);
  }, [user?.name]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleChangeUserName: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const value = event.target.value;
    setNewUserName(value);
  }, []);

  const handleClickSubmitButton = useCallback(async () => {
    if (loginUser && newUserName !== '') {
      await updateUser(loginUser.id, {
        name: newUserName,
      });
      router.reload();
    }
  }, [loginUser, newUserName, router]);

  const handleClickLogoutButton = useCallback(async () => {
    await signOut(auth);
    router.push('/');
  }, [router]);

  return (
    <>
      {user && (
        <>
          <UserCard
            user={user}
            isFollow={isFollow}
            setIsFollow={setIsFollow}
            loginUserId={loginUser?.id}
            onClickChangeUserNameButton={handleClickChangeUserNameButton}
          />

          <TweetList subheader="ツイート" tweets={tweets} />
          {loginUser?.id === displayUserId && (
            <Button variant="outlined" onClick={handleClickLogoutButton}>
              ログアウト
            </Button>
          )}
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>新しい名前</DialogTitle>
            <DialogContent>
              <TextField value={newUserName} onChange={handleChangeUserName} />
            </DialogContent>
            <DialogActions>
              <Button variant="text" onClick={handleClickSubmitButton}>
                決定する
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};

export default UserPage;
