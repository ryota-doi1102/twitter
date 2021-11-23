import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { NextPage } from 'next';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AuthContext from 'contexts/authContext';
import { signOut } from 'firebase/auth';
import { auth } from 'utils/firebase';
import { getUser, User } from 'utils/firebase/firestore/user';
import { getIsFollow, addFollow, deleteFollow } from 'utils/firebase/firestore/follow';

const UserPage: NextPage = () => {
  const router = useRouter();
  const { loginUser } = useContext(AuthContext);
  const [user, setUser] = useState<User | undefined>();
  const [open, setOpen] = useState(false);
  const [isFollow, setIsFollow] = useState(false);
  const [newUserName, setNewUserName] = useState('');

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

  useEffect(() => {
    requestGetUser();
    requestGetIsFollow();
  }, [requestGetIsFollow, requestGetUser]);

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

  const handleClickDecisionButton = useCallback(() => {
    setOpen(false);
  }, []);

  const handleClickLogoutButton = useCallback(async () => {
    await signOut(auth);
    router.push('/');
  }, [router]);

  const handleClickFollowButton = useCallback(async () => {
    if (loginUser && typeof displayUserId === 'string' && !isFollow) {
      await addFollow({
        followUserId: loginUser.id,
        followerUserId: displayUserId,
      });
      setIsFollow(true);
    }
  }, [loginUser, displayUserId, isFollow]);

  const handleClickFollowingButton = useCallback(async () => {
    if (loginUser && typeof displayUserId === 'string' && isFollow) {
      await deleteFollow(loginUser.id, displayUserId);
      setIsFollow(false);
    }
  }, [displayUserId, isFollow, loginUser]);

  return (
    <main>
      {user && (
        <>
          <Stack direction="row">
            <Avatar alt={user.name} src={user.avatarUrl} />
            <Typography variant="h4" component="h1">
              {user.name}
            </Typography>
          </Stack>
          <Box>
            <Button variant="text" onClick={handleClickChangeUserNameButton}>
              変更
            </Button>
            {loginUser && isFollow ? (
              <Button variant="outlined" onClick={handleClickFollowingButton}>
                フォロー中
              </Button>
            ) : (
              <Button variant="contained" onClick={handleClickFollowButton}>
                フォローする
              </Button>
            )}
          </Box>
          <Stack
            direction="row"
            justifyContent="center"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={2}
          >
            <Button variant="text">フォロー</Button>
            <Button variant="text">フォロワー</Button>
          </Stack>
          <Button variant="outlined" onClick={handleClickLogoutButton}>
            ログアウト
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>新しい名前</DialogTitle>
            <DialogContent>
              <TextField value={newUserName} onChange={handleChangeUserName} />
            </DialogContent>
            <DialogActions>
              <Button variant="text" onClick={handleClickDecisionButton}>
                決定する
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </main>
  );
};

export default UserPage;
