import { getUnixTime } from 'date-fns';
import { collection, FirestoreDataConverter, getDocs, query, where } from 'firebase/firestore';
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
  return {
    getIsFollow,
  };
};
export default useFollow;
