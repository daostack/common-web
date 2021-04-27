import * as yup from 'yup';

import { validate } from '../../util/validate';

import { firestore } from 'firebase-admin';
import { ItemType, IModeration } from '@common/types';
import { hasPermission } from '../../core/domain/users/business';
import { UnauthorizedError } from '../../util/errors';
import { updateEntity } from './updateEntity';
import { FLAGS, TYPES } from '../constants';
import { db } from '../../util';

const hideContentDataValidationScheme = yup.object({
  itemId: yup.string().required(),
  commonId: yup.string().required(),
  userId: yup.string().required(),
  type: yup.string()
     .oneOf(Object.values(TYPES)),
});

type HideContentPayload = yup.InferType<typeof hideContentDataValidationScheme>;

/**
 * Handles hiding contents
 * @param hideContentPayload  - contains details of the content that needs to be hidden
 *                              itemId, commonId, userIf from the request, and type of the content
 *                              'discussion', 'discussionMessage' or 'proposals'
 * @return The item that was updated
 */
export const hideContent = async (hideContentPayload: HideContentPayload): Promise<ItemType> => {

  await validate<HideContentPayload>(
    hideContentPayload,
    hideContentDataValidationScheme,
  );

	//Only users with permissions can hide content
  const { itemId, commonId, userId, type } = hideContentPayload;
  if (!hasPermission(userId, commonId)) {
    throw new UnauthorizedError();
  }

  const item = (await db.collection(type).doc(itemId).get()).data();
  const updatedAt = firestore.Timestamp.now();
  let countdownPeriod = null;
  if (type === TYPES.proposals) {
    countdownPeriod = item?.countdownPeriod - (updatedAt.seconds - item.createdAt.seconds);
  }
  
  const updatedItem = {
    ...item,
    moderation: {
      flag: FLAGS.hidden,
      reasons: item.moderation?.reasons || [],
      moderatorNote: item.moderation?.moderatorNote || '',
      quietEnding: item.moderation?.countdownStart || null,
      updatedAt,
      countdownPeriod,
      reporter: userId,
      moderator: userId,
    } as IModeration,
  }

  return await updateEntity(itemId, updatedItem as ItemType, type);
}