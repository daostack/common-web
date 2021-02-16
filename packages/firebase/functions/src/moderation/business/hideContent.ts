import { firestore } from 'firebase-admin';
import { hasPermission } from '../../core/domain/users/business';
import { CommonError } from '../../util/errors';
import { updateEntity } from './updateEntity';

export const hideContent = async (payload) => {
	//check user has permission to hide content
  const { moderation, commonId, userId, type } = payload;
  if (!hasPermission(userId, commonId)) {
    throw new CommonError(`Permission denied`);
  }

  const moderationEntity = {
    flag: 'hidden',
    reasons: moderation.reasons.split(','), //IReasons
    note: moderation?.moderatorNote || '',
    updatedAt: firestore.Timestamp.now(),
    moderator: userId,
  }

  return await updateEntity(moderation.itemId, moderationEntity, type);
}