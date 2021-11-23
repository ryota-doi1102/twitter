import getUnixTime from 'date-fns/getUnixTime';
import { addDoc, collection, FirestoreDataConverter, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from 'utils/firebase';

export type Tweet = {
  id: string;
  userId: string;
  content: string;
  createdAt: number;
};

export const tweetConverter: FirestoreDataConverter<Tweet> = {
  toFirestore: (data) => ({
    userId: data.userId,
    content: data.content,
    createdAt: data.createdAt ? data.createdAt : getUnixTime(new Date()),
  }),
  fromFirestore: (snapshot) => ({
    id: snapshot.id,
    userId: snapshot.data().userId,
    content: snapshot.data().content,
    createdAt: snapshot.data().createdAt,
  }),
};

export const addTweet = async (tweetData: Partial<Tweet>) => {
  const tweetCollection = collection(db, 'tweets').withConverter(tweetConverter);
  await addDoc(tweetCollection, tweetData);
};

export const getUsersTweetList = async (userIdList: string[]): Promise<Tweet[]> => {
  const tweetCollection = collection(db, 'tweets').withConverter(tweetConverter);
  const q = query(tweetCollection, where('userId', 'in', userIdList), orderBy('createdAt', 'desc'));
  const querySnap = await getDocs(q);
  const usersTweetList: Tweet[] = querySnap.docs.map((doc) => {
    return doc.data();
  });
  return usersTweetList;
};
