import { db } from '../../settings';
const COLLECTION_NAME = 'discussionMessage';

export const getDiscussionMessageById = async (discussionMessageId: string): Promise<any> => {
    return await db.collection(COLLECTION_NAME)
        .doc(discussionMessageId)
        .get();
}

export default {
    getDiscussionMessageById
};