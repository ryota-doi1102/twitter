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
import { useEffect, useState } from 'react';
import useUser from 'hooks/useUser';

const UserPage: NextPage = () => {
  const { name, avatarUrl, getUser } = useUser();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getUser();
  }, [getUser]);

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

  return (
    <main>
      <Stack direction="row">
        <Avatar alt={name} src={avatarUrl} />
        <Typography variant="h4" component="h1">
          {name}
        </Typography>
      </Stack>
      <Box>
        <Button variant="text" onClick={handleClickChangeButton}>
          変更
        </Button>
        <Button variant="contained">フォローする</Button>
      </Box>
      <Stack direction="row" justifyContent="center" divider={<Divider orientation="vertical" flexItem />} spacing={2}>
        <Button variant="text">フォロー</Button>
        <Button variant="text">フォロワー</Button>
      </Stack>
      <Button variant="outlined">ログアウト</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>新しい名前</DialogTitle>
        <DialogContent>
          <TextField value={name} onChange={handleChangeUserName} />
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleClickDecisionButton}>
            決定する
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
};

export default UserPage;
