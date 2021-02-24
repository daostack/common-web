import * as yup from 'yup';

import {validate} from '../../util/validate';

import { firestore } from 'firebase-admin';
import { ItemType, IModerationEntity } from '@common/types';
import { hasPermission } from '../../core/domain/users/business';
import { UnauthorizedError } from '../../util/errors';
import { updateEntity } from './updateEntity';
import { db } from '../../util';

const showContentDataValidationScheme = yup.object({
  itemId: yup.string().required(),
  commonId: yup.string().required(),
  userId: yup.string().required(),
  type: yup.string()
     .oneOf(['discussion', 'discussionMessage', 'proposals']),
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
  if (!hasPermission(userId, commonId)) {
    throw new UnauthorizedError();
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