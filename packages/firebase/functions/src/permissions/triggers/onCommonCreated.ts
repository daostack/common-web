import * as functions from 'firebase-functions';

import {Collections} from '../../constants';
import {IEventEntity} from '../../event/types';
import {addPermission} from '../../permissions/business';
import { EVENT_TYPES } from '../../event/event';

export const onCommonCreated = functions.firestore
  .document(`/${Collections.Events}/{id}`)
  .onCreate(async (eventSnap) => {
    const event = eventSnap.data() as IEventEntity;
    
    if (event.type === EVENT_TYPES.COMMON_CREATED) {
      
      await addPermission({
         commonId: event.objectId,
         userId: event.userId,
         role: 'founder',
         requestByUserId: event.userId
      });    
    }
  });
