import { Button } from '@mui/material';
import useAuth from 'hooks/useAuth';
import { NextPage } from 'next';
import { useCallback } from 'react';

const Home: NextPage = () => {
  const { login } = useAuth();

  const handleClickLoginButton = useCallback(async () => {
    await login();
  }, [login]);

  return (
    <main>
      <Button variant="contained" onClick={handleClickLoginButton}>
        Login
      </Button>
    </main>
  );
};

export default Home;
