import { IModerationEntity } from '@common/types'; 
import { firestore } from 'firebase-admin';
import { CommonError } from '../../util/errors';
import { updateEntity } from './updateEntity';
import { commonDb } from '../../common/database';

export const reportContent = async (payload) => {

  const { moderation, commonId, userId, type } = payload;
  const common = await commonDb.get(commonId);
  const memberIds = common.members.map((member) => member.userId);
  if (!memberIds.includes(userId)) {
    throw new CommonError('Only members can report');
  }

  const moderationEntity: IModerationEntity = {
    flag: 'reported',
    reasons: moderation.reasons?.split(',') || [],
    note: moderation.moderatorNote || '',
    updatedAt: firestore.Timestamp.now(),
    moderator: '',
    reporter: userId
  }

  return await updateEntity(moderation.itemId, moderationEntity, type);
}