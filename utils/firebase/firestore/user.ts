import { getUnixTime } from 'date-fns';
import { setDoc, doc, FirestoreDataConverter, getDoc, collection } from 'firebase/firestore';
import { db } from 'utils/firebase';

export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  createdAt: number;
};

const userConverter: FirestoreDataConverter<User> = {
  toFirestore: (data) => ({
    name: data.name,
    avatarUrl: data.avatarUrl,
    createdAt: data.createdAt ? data.createdAt : getUnixTime(new Date()),
  }),
  fromFirestore: (snapshot) => ({
    id: snapshot.id,
    name: snapshot.data().name,
    avatarUrl: snapshot.data().avatarUrl,
    createdAt: snapshot.data().createdAt,
  }),
};

export const getUser = async (userId: string) => {
  const usersCollection = collection(db, 'users').withConverter(userConverter);
  const docRef = doc(usersCollection, userId);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
};

export const addUser = async (userId: string, userData: Partial<User>) => {
  const usersCollection = collection(db, 'users').withConverter(userConverter);
  const docRef = doc(usersCollection, userId);
  await setDoc(docRef, userData);
};
