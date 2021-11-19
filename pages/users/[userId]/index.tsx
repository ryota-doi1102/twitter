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
import { useCallback, useEffect, useState } from 'react';
import useUser, { User } from 'hooks/useUser';
import { useRouter } from 'next/router';
import useAuth from 'hooks/useAuth';

const UserPage: NextPage = () => {
  const router = useRouter();
  const { getUser } = useUser();
  const { logout } = useAuth();
  const [user, setUser] = useState<User | undefined>();
  const [open, setOpen] = useState(false);

  const requestGetUser = useCallback(async () => {
    const userId = router.query.userId;
    if (typeof userId === 'string') {
      const user = await getUser(userId);
      if (!user) {
        router.push('/');
        return;
      }
      setUser(user);
    }
  }, [getUser, router]);

  useEffect(() => {
    requestGetUser();
  }, [requestGetUser]);

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
            <Button variant="contained">フォローする</Button>
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
