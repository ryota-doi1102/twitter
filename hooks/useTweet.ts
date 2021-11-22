import getUnixTime from 'date-fns/getUnixTime';
import { addDoc, collection, FirestoreDataConverter } from 'firebase/firestore';
import { useCallback } from 'react';
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

const useTweet = () => {
  const addTweet = useCallback(async (tweetData: Partial<Tweet>) => {
    const tweetCollection = collection(db, 'tweets').withConverter(tweetConverter);
    await addDoc(tweetCollection, tweetData);
  }, []);
  return {
    addTweet,
  };
};
export default useTweet;
