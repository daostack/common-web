import { db } from '../../util';
import { Collections } from '../../constants';
import { getDiscussionMessages, getDiscussionMessagsSnapshot } from './getDiscussionMessages';

export const discussionMessageCollection = db.collection(Collections.DiscussionMessage);

export const discussionMessageDb = {
	getDiscussionMessages,
	getDiscussionMessagsSnapshot,
};