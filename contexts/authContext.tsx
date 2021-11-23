import { useRouter } from 'next/router';
import { createContext, useEffect, useState } from 'react';
import { auth } from 'utils/firebase';
import { addUser, getUser, User } from 'utils/firebase/firestore/user';

type AuthContextType = {
  loginUser?: User;
};

const AuthContext = createContext<AuthContextType>({});

export const AuthContextProvider = (): AuthContextType => {
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userId = user.uid;
        const loginUserData = await getUser(userId);
        if (loginUserData) {
          setCurrentUser(loginUserData);
        } else {
          await addUser(userId, {
            name: user.displayName || '名無しさん',
            avatarUrl: user.photoURL || 'https://pbs.twimg.com/profile_images/826569821412208641/3E2CeQST_400x400.jpg',
          });
          const createdUserData = await getUser(userId);
          setCurrentUser(createdUserData);
        }
      } else {
        setCurrentUser(undefined);
      }
    });
    return unsubscribe;
  }, [router]);

  return {
    loginUser: currentUser,
  };
};

export default AuthContext;
