import { GoogleAuthProvider, signInWithPopup } from '@firebase/auth';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { auth } from 'utils/firebase';

const useHomePage = () => {
  const router = useRouter();

  const handleClickLoginButton = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    await router.push('/timeline');
  }, [router]);

  return { handleClickLoginButton };
};

export default useHomePage;
