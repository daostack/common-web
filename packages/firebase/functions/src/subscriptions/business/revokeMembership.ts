import { ISubscriptionEntity } from '../types';
import { EVENT_TYPES } from '../../event/event';

import { updateSubscription } from '../database/updateSubscription';
import { createEvent } from '../../util/db/eventDbService';
import { commonDb } from '../../common/database';
import { removeCommonMember } from '../../common/business/removeCommonMember';

export const revokeMembership = async (subscription: ISubscriptionEntity): Promise<void> => {
  const common = await commonDb.get(subscription.metadata.common.id);


  await removeCommonMember(common, subscription.userId)

  subscription.revoked = true;

  await updateSubscription(subscription);

  await createEvent({
    userId: subscription.userId,
    objectId: subscription.id,
    type: EVENT_TYPES.MEMBERSHIP_REVOKED
  });
}