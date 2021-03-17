import * as yup from 'yup';

import { validate } from '../../util/validate';

import { firestore } from 'firebase-admin';
import { ItemType, IModeration } from '@common/types';
import { UnauthorizedError } from '../../util/errors';
import { updateEntity } from './updateEntity';
import { commonDb } from '../../common/database';
import { FLAGS, TYPES } from '../constants';
import { db } from '../../util';

const reportContentDataValidationScheme = yup.object({
  moderationData: yup.object({
    reasons: yup.string().required(),
    moderatorNote: yup.string(),
    itemId: yup.string().required(),
  }).required(),
  commonId: yup.string().required(),
  userId: yup.string().required(),
  type: yup.string()
     .oneOf(Object.values(TYPES)),
});

type ReportContentPayload = yup.InferType<typeof reportContentDataValidationScheme>;

/**
 * Handles reporting proposals/membership requests/discussions/comments
 * @param  reportContentPayload   - contains details of the items that needs to be reported
 * @return The item that was updated
 */
export const reportContent = async (reportContentPayload: ReportContentPayload): Promise<ItemType> => {
  
  await validate<ReportContentPayload>(
    reportContentPayload,
    reportContentDataValidationScheme,
  );

  const { moderationData, commonId, userId, type } = reportContentPayload;
  const common = await commonDb.get(commonId);
  const memberIds = common.members.map((member) => member.userId);

  // all members, and only members can report content
  if (!memberIds.includes(userId)) {
    throw new UnauthorizedError();
  }

  const item = (await db.collection(type).doc(moderationData.itemId).get()).data();

  const updatedItem = {
    ...item,
    moderation: {
      flag: FLAGS.reported,
      reasons: moderationData.reasons.split(',') || [],
      moderatorNote: moderationData.moderatorNote || '',
      updatedAt: firestore.Timestamp.now(),
      moderator: '',
      reporter: userId
    } as IModeration,
  }

  return await updateEntity(moderationData.itemId, updatedItem as ItemType, type);
}