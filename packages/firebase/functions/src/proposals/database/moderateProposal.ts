import { ProposalsCollection } from './index';

export const moderateProposal = async (proposalId: string, moderationEntity) => {
  const proposal = await ProposalsCollection
      .doc(proposalId)
      .update({
        moderation: moderationEntity,
      });
    return proposal;
}