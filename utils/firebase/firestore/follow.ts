import { getUnixTime } from 'date-fns';
import { addDoc, collection, FirestoreDataConverter, getDocs, query, where, writeBatch } from 'firebase/firestore';
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

export const getIsFollow = async (followUserId: string, followerUserId: string) => {
  const followCollection = collection(db, 'follows').withConverter(followConverter);
  const q = query(
    followCollection,
    where('followUserId', '==', followUserId),
    where('followerUserId', '==', followerUserId),
  );
  const querySnap = await getDocs(q);
  return querySnap.size > 0;
};

export const addFollow = async (followData: Partial<Follow>) => {
  const followCollection = collection(db, 'follows').withConverter(followConverter);
  await addDoc(followCollection, followData);
};

export const deleteFollow = async (followUserId: string, followerUserId: string) => {
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
};

export const getFollowList = async (followUserId: string) => {
  const followCollection = collection(db, 'follows').withConverter(followConverter);
  const q = query(followCollection, where('followUserId', '==', followUserId));
  const querySnap = await getDocs(q);
  const followList: Follow[] = querySnap.docs.map((doc) => {
    return doc.data();
  });
  return followList;
};

export const getFollowerList = async (followerUserId: string) => {
  const followCollection = collection(db, 'follows').withConverter(followConverter);
  const q = query(followCollection, where('followerUserId', '==', followerUserId));
  const querySnap = await getDocs(q);
  const followerList: Follow[] = querySnap.docs.map((doc) => {
    return doc.data();
  });
  return followerList;
};
