import * as yup from 'yup';

import { validate } from '../../util/validate';

import { firestore } from 'firebase-admin';
import { ItemType, IModeration } from '@common/types';
import { hasPermission } from '../../core/domain/users/business';
import { UnauthorizedError } from '../../util/errors';
import { updateEntity } from './updateEntity';
import { getNewCountdown } from '../../proposals/business/getNewCountdown';
import { FLAGS, TYPES } from '../constants';
import { db } from '../../util';

const showContentDataValidationScheme = yup.object({
  itemId: yup.string().required(),
  commonId: yup.string().required(),
  userId: yup.string().required(),
  type: yup.string()
     .oneOf(Object.values(TYPES)),
});

type ShowContentPayload = yup.InferType<typeof showContentDataValidationScheme>;

/**
 * Handles making content visible again
 * @param  showContentPayload   - contains details of the item that needs to be visible again
 * @return The item that was updated
 */
export const showContent = async (showContentPayload: ShowContentPayload): Promise<ItemType> => {
	
  await validate<ShowContentPayload>(
    showContentPayload,
    showContentDataValidationScheme,
  );

  //Only users with permissions can make content visible
  const { itemId, commonId, userId, type } = showContentPayload;
  const isModerator = await hasPermission(userId, commonId);
  if (!isModerator) {
    throw new UnauthorizedError();
  }

  const item = (await db.collection(type).doc(itemId).get()).data();
  
  // if showing item when in quiet ending period, we need to reset countdown to quietEndingPeriod
  let quietEnding = null;
  if (type === TYPES.proposals) {
    quietEnding = getNewCountdown(
      item.moderation?.updatedAt.seconds + item?.countdownPeriod,
      item.quietEndingPeriod
    );
  }

  const updatedItem = {
    ...item,
    moderation: {
      ...item.moderation,
      flag: FLAGS.visible,
      updatedAt: firestore.Timestamp.now(),
      quietEnding,
      moderator: userId,
    } as IModeration,
  }

  return await updateEntity(itemId, updatedItem as ItemType, type);
}