import { firestore } from 'firebase-admin';
import { ItemType, IModerationEntity } from '@common/types';
import { CommonError } from '../../util/errors';
import { updateEntity } from './updateEntity';
import { commonDb } from '../../common/database';
import { db } from '../../util';

export const reportContent = async (payload) => {

  const { moderation, commonId, userId, type } = payload;
  const common = await commonDb.get(commonId);
  const memberIds = common.members.map((member) => member.userId);
  if (!memberIds.includes(userId)) {
    throw new CommonError('Only members can report');
  }

  const item = (await db.collection(type).doc(moderation.itemId).get()).data();

  const updatedItem = {
    ...item,
    moderation: {
      flag: 'reported',
      reasons: moderation.reasons?.split(',') || [],
      note: moderation.moderatorNote || '',
      updatedAt: firestore.Timestamp.now(),
      moderator: '',
      reporter: userId
    } as IModerationEntity,
  }

  return await updateEntity(moderation.itemId, updatedItem as ItemType, type);
}