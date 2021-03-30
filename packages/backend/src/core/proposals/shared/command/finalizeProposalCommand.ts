import { ProposalState, ProposalType } from '@prisma/client';
import { prisma } from '@toolkits';

import { addFinalizeProposalJob } from '../../queue/jobs/finalizeJoinProposalJob';
import { finalizeJoinProposalCommand } from '../../join/command/finalizeJoinProposalCommand';


/**
 * Finalizes the proposal so no more votes would be able to
 * be casted on it and the proposal outcome will be decided
 *
 * @param proposalId - The ID of the proposal to be finalized
 */
export const finalizeProposalCommand = async (proposalId: string): Promise<void> => {
  // Find the proposal and mark it as finalizing
  const proposal = await prisma.proposal.update({
    where: {
      id: proposalId
    },
    data: {
      state: ProposalState.Finalizing
    },
    select: {
      type: true
    }
  });

  if (proposal.type === ProposalType.JoinRequest) {
    await finalizeJoinProposalCommand(proposalId);
  }

  // Schedule finalization job
  addFinalizeProposalJob(proposalId);
};