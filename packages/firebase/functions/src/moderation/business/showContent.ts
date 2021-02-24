import { firestore } from 'firebase-admin';
import { ItemType, IModerationEntity } from '@common/types';
import { hasPermission } from '../../core/domain/users/business';
import { CommonError } from '../../util/errors';
import { updateEntity } from './updateEntity';
import { db } from '../../util';

export const showContent = async (payload) => {
	//check user has permission to hide content
  const { itemId, commonId, userId, type } = payload;
  if (!hasPermission(userId, commonId)) {
    throw new CommonError(`Permission denied`);
  }

  const item = (await db.collection(type).doc(itemId).get()).data();

  const updatedItem = {
    ...item,
    moderation: {
      ...item.moderation,
      flag: 'visible',
      updatedAt: firestore.Timestamp.now(),
      moderator: userId,
    } as IModerationEntity,
  }

  return await updateEntity(itemId, updatedItem as ItemType, type);
}