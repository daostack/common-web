import { IUserEntity } from '../../../../core/users/types';
import { NotFoundError } from '../../../errors';
import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

jest.mock('../../../../core/users/database/getUser', () => ({
  getUser: jest.fn()
    .mockImplementation(async (userId: string): Promise<IUserEntity> => {
      if (userId === '404') {
        throw new NotFoundError('user.userId', userId);
      }

      return {
        createdAt: Timestamp.now(),
        displayName: 'Test User',
        email: `${userId}@testuser.co`,
        firstName: 'Test',
        id: userId,
        lastName: 'User',
        photoURL: 'https://picsum.photos/200',
        uid: userId,
        updatedAt: Timestamp.now()
      };
    })
}));