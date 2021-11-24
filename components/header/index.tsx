import { AppBar, Toolbar, Typography, Avatar, IconButton, Link } from '@mui/material';
import React, { useCallback, useContext } from 'react';
import AuthContext from 'contexts/authContext';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { Box } from '@mui/system';

const Header: React.FC = () => {
  const router = useRouter();
  const { loginUser } = useContext(AuthContext);

  const handleClickAvatarButton = useCallback(() => {
    if (!loginUser) return;
    router.push(`/users/${loginUser.id}`);
  }, [loginUser, router]);

  return (
    <>
      <AppBar>
        <Toolbar>
          <NextLink href="/timeline" passHref>
            <Link underline="none" color="inherit">
              <Typography variant="h6" component="div">
                Twitter
              </Typography>
            </Link>
          </NextLink>
          <Box sx={{ flexGrow: 1 }} />

          {loginUser && (
            <IconButton onClick={handleClickAvatarButton}>
              <Avatar alt={loginUser.name} src={loginUser.avatarUrl} />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};

export default Header;
