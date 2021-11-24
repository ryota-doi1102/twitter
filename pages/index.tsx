import { Button } from '@mui/material';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { auth } from 'utils/firebase';

const Home: NextPage = () => {
  const router = useRouter();

  const handleClickLoginButton = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    await router.push('/timeline');
  }, [router]);

  return (
    <Button variant="contained" onClick={handleClickLoginButton}>
      Login
    </Button>
  );
};

export default Home;
