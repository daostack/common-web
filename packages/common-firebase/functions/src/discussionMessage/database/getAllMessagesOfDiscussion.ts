import { discussionMessageCollection } from './index';
import { IDiscussionMessage } from '../../discussionMessage/types';

export const getAllMessagesOfDiscussion = async (discussionId: string) : Promise<IDiscussionMessage[]> => {
	const discussionMessages = await discussionMessageCollection
			.where('discussionId', '==', discussionId)
			.orderBy('createTime', 'desc').get();
    
    return (await discussionMessages
      .docs.map(message =>
        message.data() as IDiscussionMessage
      )
    )
};