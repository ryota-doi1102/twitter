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
import useUser, { User } from 'hooks/useUser';
import { useRouter } from 'next/router';
import useAuth from 'hooks/useAuth';
import AuthContext from 'contexts/authContext';
import useFollow from 'hooks/useFollow';

const UserPage: NextPage = () => {
  const router = useRouter();
  const { getUser } = useUser();
  const { getIsFollow, addFollow, deleteFollow } = useFollow();
  const { logout } = useAuth();
  const { loginUser } = useContext(AuthContext);
  const [user, setUser] = useState<User | undefined>();
  const [open, setOpen] = useState(false);
  const [isFollow, setIsFollow] = useState(false);
  const displayUserId = router.query.userId;

  const requestGetIsFollow = useCallback(async () => {
    if (loginUser && typeof displayUserId === 'string') {
      const result = await getIsFollow(loginUser.id, displayUserId);
      setIsFollow(result);
    }
  }, [displayUserId, getIsFollow, loginUser]);

  const requestGetUser = useCallback(async () => {
    if (typeof displayUserId === 'string') {
      const displayUser = await getUser(displayUserId);
      if (!displayUser) {
        router.push('/');
        return;
      }
      setUser(displayUser);
    }
  }, [displayUserId, getUser, router]);

  useEffect(() => {
    requestGetUser();
    requestGetIsFollow();
  }, [requestGetIsFollow, requestGetUser]);

  const handleClickChangeButton = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeUserName: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value;
  };

  const handleClickDecisionButton = () => {
    setOpen(false);
  };

  const handleClickLogoutButton = useCallback(async () => {
    await logout();
  }, [logout]);

  const handleClickFollowButton = useCallback(async () => {
    if (loginUser && typeof displayUserId === 'string' && !isFollow) {
      await addFollow({
        followUserId: loginUser.id,
        followerUserId: displayUserId,
      });
      setIsFollow(true);
    }
  }, [loginUser, displayUserId, isFollow, addFollow]);

  const handleClickFollowingButton = useCallback(async () => {
    if (loginUser && typeof displayUserId === 'string' && isFollow) {
      await deleteFollow(loginUser.id, displayUserId);
      setIsFollow(false);
    }
  }, [deleteFollow, displayUserId, isFollow, loginUser]);

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
            <Button variant="text" onClick={handleClickChangeButton}>
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
              <TextField value={user.name} onChange={handleChangeUserName} />
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
