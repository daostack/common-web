import { db } from '../../util';
import { Collections } from '../../constants';
import { getAllMessagesOfDiscussion } from './getAllMessagesOfDiscussion';

export const discussionMessageCollection = db.collection(Collections.DiscussionMessage);

export const discussionMessageDb = {
	getAllMessagesOfDiscussion,
};