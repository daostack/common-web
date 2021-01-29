import { db } from '../../util';
import { Collections } from '../../constants';
import { getDiscussion } from './getDiscussion';

export const discussionCollection = db.collection(Collections.Discussion);

export const discussionDb = {
	getDiscussion
}