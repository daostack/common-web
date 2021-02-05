import { ISubscriptionEntity } from '@common/types';

import { removeCommonMember } from '../../common/business/removeCommonMember';
import { commonDb } from '../../common/database';
import { EVENT_TYPES } from '../../event/event';
import { createEvent } from '../../util/db/eventDbService';
import { updateSubscription } from '../database/updateSubscription';

export const revokeMembership = async (subscription: ISubscriptionEntity): Promise<void> => {
  const common = await commonDb.get(subscription.metadata.common.id);


  await removeCommonMember(common, subscription.userId);

  subscription.revoked = true;

  await updateSubscription(subscription);

  await createEvent({
    userId: subscription.userId,
    objectId: subscription.id,
    type: EVENT_TYPES.MEMBERSHIP_REVOKED
  });
};