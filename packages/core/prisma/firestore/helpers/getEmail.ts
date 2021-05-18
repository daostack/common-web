import { UsersCollection } from '../firestore';

export const getEmail = async (uid: string): Promise<string> => {
  return (await UsersCollection
    .doc(uid)
    .get()).data()?.email;
};