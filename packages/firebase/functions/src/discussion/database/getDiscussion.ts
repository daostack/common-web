import { ArgumentError } from '../../util/errors';
import { Nullable } from '../../util/types';
import { IDiscussionEntity } from '../types';
import { NotFoundError } from '../../util/errors';
import { discussionCollection } from './index';

interface IGetDiscussionOptions {
  /**
   * Whether error will be thrown if the discussion is not found
   */
  throwOnFailure: boolean;
}

const defaultDiscussionOptions: IGetDiscussionOptions = {
   throwOnFailure: true
}

// discussion can be an Discussion doc or a discussion from a Proposal doc
export const getDiscussion = async (discussionId: string, customOptions?: Partial<IGetDiscussionOptions>) : Promise<any> => {
  if(!discussionId) {
    throw new ArgumentError('discussionId', discussionId);
  }

  const options = {
    ...defaultDiscussionOptions,
    ...customOptions
  };

  const discussion = (await discussionCollection
    .doc(discussionId)
    .get()).data() as Nullable<IDiscussionEntity> // | IProposalEntity> @question(for: Moore) Why this can be proposal entity? Does not make any sense to me whatsoever

  if (!discussion && options.throwOnFailure) {
    throw new NotFoundError(discussionId, 'discussion');
  }

  return discussion;

}
