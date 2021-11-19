import { doc, FirestoreDataConverter, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useState, useCallback } from 'react';
import { db } from 'utils/firebase';

type User = {
  id: string;
  name: string;
  avatarUrl: string;
  createdAt: number;
};

export const userConverter: FirestoreDataConverter<User> = {
  toFirestore: (data) => ({
    name: data.name,
    avatarUrl: data.avatarUrl,
    createdAt: data.createdAt,
  }),
  fromFirestore: (snapshot) => ({
    id: snapshot.id,
    name: snapshot.data().name,
    avatarUrl: snapshot.data().avatarUrl,
    createdAt: snapshot.data().createdAt,
  }),
};

const useUser = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const getUser = useCallback(async () => {
    const userId = router.query.userId;
    if (typeof userId === 'string') {
      const docRef = doc(db, 'users', userId).withConverter(userConverter);
      const docSnap = await getDoc(docRef);
      const docData = docSnap.data();
      if (docData) {
        setName(docData.name);
        setAvatarUrl(docData.avatarUrl);
      } else {
        router.push('/404');
      }
    }
  }, [router]);

  return {
    name,
    avatarUrl,
    getUser,
  };
};

export default useUser;
