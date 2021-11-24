import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React from 'react';

type Props = {
  open: boolean;
  handleClose: () => void;
  tweetContent: string;
  handleChangeTweetContent: React.ChangeEventHandler<HTMLInputElement>;
  handleClickTweetButton: () => void;
};

const TweetDialog: React.FC<Props> = (props: Props) => (
  <Dialog open={props.open} onClose={props.handleClose}>
    <DialogTitle>今どうしてる？</DialogTitle>
    <DialogContent>
      <TextField multiline rows={4} value={props.tweetContent} onChange={props.handleChangeTweetContent} />
    </DialogContent>
    <DialogActions>
      <Button variant="text" disabled={props.tweetContent === ''} onClick={props.handleClickTweetButton}>
        ツイートする
      </Button>
    </DialogActions>
  </Dialog>
);

export default TweetDialog;
