import * as functions from 'firebase-functions';
import { createEvent }  from '../util/db/eventDbService';
import { EVENT_TYPES } from '../event/event';

exports.watchForNewMessages = functions.firestore
	.document('/discussionMessage/{id}')
	.onCreate(async (snap) => {
    const discussionMessage = snap.data();

    await createEvent({
      userId: discussionMessage.ownerId,
      objectId: snap.id,
      type: EVENT_TYPES.MESSAGE_CREATED
    })
	})