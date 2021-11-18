import { AppBar, Toolbar, Typography, Avatar } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';

const Header: React.FC = () => {
  return (
    <>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <TwitterIcon />
            Twitter
          </Typography>
          <Avatar alt="ログインしているユーザー" src="/vercel.svg" />
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};

export default Header;
