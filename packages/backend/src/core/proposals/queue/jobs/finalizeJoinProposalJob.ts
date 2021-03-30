import { proposalsQueue } from '../index';
import { finalizeJoinProposalCommand } from '../../join/command/finalizeJoinProposalCommand';
import { CommonError } from '@errors';
import { prisma } from '@toolkits';
import { ProposalType } from '@prisma/client';

const FinalizeProposalJob = 'Common.Jobs.FinalizeProposal';

export const addFinalizeProposalJob = (proposalId: string): void => {
  proposalsQueue.add(FinalizeProposalJob, { proposalId });
};

proposalsQueue.process(FinalizeProposalJob, async (job, done) => {
  try {
    const proposal = (await prisma.proposal.findUnique({
      where: {
        id: job.data.proposalId
      }
    }))!;

    // If it is join move it to handle finalizable join proposal
    if (proposal.type === ProposalType.JoinRequest) {
      await finalizeJoinProposalCommand(proposal.id);
    }

    // If it is funding move it to handle finalizable funding proposal
    else if (proposal.type === ProposalType.FundingRequest) {
      // @todo Handle finalize funding request
    }

    // If it is not supported type throw
    else {
      throw new CommonError('Cannot finalize proposal that is neither of funding nor join type', {
        proposal
      });
    }
  } catch (e) {
    done(e);
  } finally {
    done();
  }
});