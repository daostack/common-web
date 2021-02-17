import { db } from '../../util';
import { Collections } from '../../constants';
import { getDiscussionMessages, getDiscussionMessagsSnapshot } from './getDiscussionMessages';
import { moderateDiscussionMessage } from './moderateDiscussionMessage';

export const discussionMessageCollection = db.collection(Collections.DiscussionMessage);

export const discussionMessageDb = {
	getDiscussionMessages,
	getDiscussionMessagsSnapshot,
	moderateDiscussionMessage,
};