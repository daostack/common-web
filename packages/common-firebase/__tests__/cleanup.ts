import { db } from '../functions/src/settings';
import { Collections } from '../functions/src/constants';

const cleanTestCreatedDocs = async (collections: string[]): Promise<void> => {
  const batch = db.batch();

  await Promise.all(collections.map(async (collection) => {
    const snapshot = await db.collection(collection)
      .where('testCreated', '==', true)
      .get();


    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
  }));

  await batch.commit();
};

afterAll(async () => {
  await cleanTestCreatedDocs([
    Collections.Proposals,
    Collections.Commons
  ]);
});