import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';

type Props = {
  handleClickFab: () => void;
};

const TweetFab: React.FC<Props> = (props: Props) => (
  <Fab color="primary" onClick={props.handleClickFab} sx={{ position: 'fixed', right: 16, bottom: 16 }}>
    <AddIcon />
  </Fab>
);

export default TweetFab;
