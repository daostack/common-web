import { IModerationEntity } from '@common/types'; 
import { firestore } from 'firebase-admin';
import { hasPermission } from '../../core/domain/users/business';
import { CommonError } from '../../util/errors';
import { updateEntity } from './updateEntity';
import { db } from '../../util';

export const hideContent = async (payload) => {
	//check user has permission to hide content
  const { itemId, commonId, userId, type } = payload;
  if (!hasPermission(userId, commonId)) {
    throw new CommonError(`Permission denied`);
  }

  const item = (await db.collection(type).doc(itemId).get()).data();

  const moderationEntity: IModerationEntity = {
    flag: 'hidden',
    reasons: item.moderation?.reasons || [],
    note: item.moderation?.note || '',
    updatedAt: firestore.Timestamp.now(),
    reporter: userId,
    moderator: userId,
  }

  return await updateEntity(itemId, moderationEntity, type);
}