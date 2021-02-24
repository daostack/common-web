import { firestore } from 'firebase-admin';
import { ItemType, IModerationEntity } from '@common/types';
import { hasPermission } from '../../core/domain/users/business';
import { UnauthorizedError } from '../../util/errors';
import { updateEntity } from './updateEntity';
import { db } from '../../util';

export const hideContent = async (payload) => {
	//check user has permission to hide content
  const { itemId, commonId, userId, type } = payload;
  if (!hasPermission(userId, commonId)) {
    throw new UnauthorizedError();
  }

  const item = (await db.collection(type).doc(itemId).get()).data();

  const updatedItem = {
    ...item,
    moderation: {
      flag: 'hidden',
      reasons: item.moderation?.reasons || [],
      note: item.moderation?.note || '',
      updatedAt: firestore.Timestamp.now(),
      reporter: userId,
      moderator: userId,
    } as IModerationEntity,
  }

  return await updateEntity(itemId, updatedItem as ItemType, type);
}