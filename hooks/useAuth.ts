import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { auth } from 'utils/firebase';

const useAuth = () => {
  const router = useRouter();

  const login = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    await router.push('/timeline');
  }, [router]);

  const logout = useCallback(async () => {
    await signOut(auth);
    router.push('/');
  }, [router]);

  return {
    login,
    logout,
  };
};

export default useAuth;
