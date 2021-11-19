import { AppBar, Toolbar, Typography, Avatar } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import { useContext } from 'react';
import AuthContext from 'contexts/authContext';

const Header: React.FC = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <TwitterIcon />
            Twitter
          </Typography>
          {currentUser && <Avatar alt={currentUser.name} src={currentUser.avatarUrl} />}
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};

export default Header;
