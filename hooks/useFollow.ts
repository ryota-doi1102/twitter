import { getUnixTime } from 'date-fns';
import { addDoc, collection, FirestoreDataConverter, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { useCallback } from 'react';
import { db } from 'utils/firebase';

type Follow = {
  id: string;
  followUserId: string;
  followerUserId: string;
  createdAt: number;
};

const followConverter: FirestoreDataConverter<Follow> = {
  toFirestore: (data) => ({
    followUserId: data.followUserId,
    followerUserId: data.followerUserId,
    createdAt: data.createdAt ? data.createdAt : getUnixTime(new Date()),
  }),
  fromFirestore: (snapshot) => ({
    id: snapshot.id,
    followUserId: snapshot.data().followUserId,
    followerUserId: snapshot.data().followerUserId,
    createdAt: snapshot.data().createdAt,
  }),
};

const useFollow = () => {
  const getIsFollow = useCallback(async (followUserId: string, followerUserId: string) => {
    const followCollection = collection(db, 'follows').withConverter(followConverter);
    const q = query(
      followCollection,
      where('followUserId', '==', followUserId),
      where('followerUserId', '==', followerUserId),
    );
    const querySnap = await getDocs(q);
    return querySnap.size > 0;
  }, []);
  const addFollow = useCallback(async (followData: Partial<Follow>) => {
    const followCollection = collection(db, 'follows').withConverter(followConverter);
    await addDoc(followCollection, followData);
  }, []);
  const deleteFollow = useCallback(async (followUserId: string, followerUserId: string) => {
    const followCollection = collection(db, 'follows').withConverter(followConverter);
    const q = query(
      followCollection,
      where('followUserId', '==', followUserId),
      where('followerUserId', '==', followerUserId),
    );
    const querySnap = await getDocs(q);
    const batch = writeBatch(db);
    querySnap.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }, []);
  return {
    getIsFollow,
    addFollow,
    deleteFollow,
  };
};
export default useFollow;
