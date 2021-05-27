import { User } from '@prisma/client';
import { UsersCollection } from '../firestore';
import { seeder } from '../../seed';

export const importUsers = async () => {
  const firebaseUsers = (await UsersCollection.get()).docs.map(u => u.data());

  const failedUsers: {
    error: Error,
    from: any
  }[] = [];
  const createdUsers: {
    user: User,
    from: any
  }[] = [];

  for (const user of firebaseUsers) {
    console.log(`Importing ${user.firstName} ${user.lastName}`);

    try {
      createdUsers.push({
        user: await seeder.user.create({
          data: {
            id: user.uid,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email,
            photo: user.photoURL
          }
        }),
        from: user
      });

      console.info('Import finished!');
    } catch (e) {
      failedUsers.push({
        error: e,
        from: user
      });

      console.info('Import failed!');
    }
  }

  // Create default user
  await seeder.user.create({
    data: {
      id: 'default',
      firstName: 'Default User',
      lastName: '',
      email: 'default@common.com',
      photo: ''
    }
  });

  console.log('[LogTag: 1332]', failedUsers);
  // console.log(createdUsers);
};