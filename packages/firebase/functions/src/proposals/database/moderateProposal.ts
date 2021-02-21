import { IModerationEntity } from '@common/types'; 
import { ProposalsCollection } from './index';

export const moderateProposal = async (proposalId: string, moderationEntity: IModerationEntity): Promise<void> => {
  await ProposalsCollection
    .doc(proposalId)
    .update({
      moderation: moderationEntity,
    });
}