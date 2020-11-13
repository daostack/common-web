import * as functions from 'firebase-functions';

import { IEventEntity } from '../../event/type';
import { Collections } from '../../constants';
import { EVENT_TYPES } from '../../event/event';

import { processVote } from '../business/votes/processVotes';
import { voteDb } from '../database';

exports.watchForVoteCreated = functions.firestore
  .document(`/${Collections.Event}/{id}`)
  .onCreate(async (eventSnap) => {
    const event = eventSnap.data() as IEventEntity;

    if(event.type === EVENT_TYPES.VOTE_CREATED) {
      await processVote(await voteDb.getVote(event.objectId));
    }
  });