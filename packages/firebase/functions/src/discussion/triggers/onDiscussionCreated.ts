import * as functions from 'firebase-functions';

import { Collections } from '../../constants';
import { IDiscussionEntity } from '../types';
import { EVENT_TYPES } from '../../event/event';
import { createEvent } from '../../util/db/eventDbService';

export const onDiscussionCreated = functions.firestore
  .document(`/${Collections.Discussion}/{id}`)
  .onCreate(async (discussionSnap) => {
    const discussion = discussionSnap.data() as IDiscussionEntity;

    createEvent({
      userId: discussion.ownerId,
      objectId: discussionSnap.id,
      type: EVENT_TYPES.DISCUSSION_CREATED
    })
  });