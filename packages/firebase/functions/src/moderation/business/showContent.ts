import { firestore } from 'firebase-admin';
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

  const moderationEntity = {
    ...item.moderation,
    flag: 'visible',
    updatedAt: firestore.Timestamp.now(),
    moderator: userId,
  }

  return await updateEntity(itemId, moderationEntity, type);
}