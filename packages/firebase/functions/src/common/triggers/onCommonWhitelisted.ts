import { ICommonEntity } from '@common/types';
import * as functions from 'firebase-functions';

import { Collections } from '../../constants';
import { EVENT_TYPES } from '../../event/event';
import { createEvent } from '../../util/db/eventDbService';

export const onCommonWhitelisted = functions.firestore
  .document(`/${Collections.Commons}/{id}`)
  .onUpdate(async (update) => {
    const prevCommon = update.before.data() as ICommonEntity;
    const currCommon = update.after.data() as ICommonEntity;

    if (currCommon.register === 'registered' && 
        currCommon.register !== prevCommon.register) {

       await createEvent({
          userId: currCommon.metadata.founderId,
          objectId: currCommon.id,
          type: EVENT_TYPES.COMMON_WHITELISTED
        });
    }
  });