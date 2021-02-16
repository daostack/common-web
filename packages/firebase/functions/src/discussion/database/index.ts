import { db } from '../../util';
import { Collections } from '../../constants';
import { getDiscussion } from './getDiscussion';
import { updateLastMessage } from './updateLastMessage';
import { moderateDiscussion } from './moderateDiscussion';

export const discussionCollection = db.collection(Collections.Discussion);

export const discussionDb = {
	getDiscussion,
	updateLastMessage,
	moderateDiscussion,
}