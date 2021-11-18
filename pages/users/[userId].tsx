import {
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
import React, { useState } from 'react';

const UserPage: NextPage = () => {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState('名無しさん');

  const handleClickChangeButton = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleChangeUserName: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value;
    setUserName(value);
  };
  const handleClickDecisionButton = () => {
    setOpen(false);
  };

  return (
    <main>
      <Stack direction="row">
        <Typography variant="h4" component="h1">
          {userName}
        </Typography>
        <Box>
          <Button variant="text" onClick={handleClickChangeButton}>
            変更
          </Button>
          <Button variant="contained">フォローする</Button>
        </Box>
      </Stack>
      <Stack direction="row" justifyContent="center" divider={<Divider orientation="vertical" flexItem />} spacing={2}>
        <Button variant="text">フォロー</Button>
        <Button variant="text">フォロワー</Button>
      </Stack>
      <Button variant="outlined">ログアウト</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>新しい名前</DialogTitle>
        <DialogContent>
          <TextField value={userName} onChange={handleChangeUserName} />
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
