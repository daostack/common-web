import { FundingType, ProposalState, ProposalType } from '@prisma/client';

import { prisma } from '../../../../domain/toolkits/index';
import { voteService } from '../../../index';
import { logger as $logger } from '../../../../domain/utils/logger';
import { NotFoundError, CommonError } from '../../../../domain/errors/index';

import { processRejectedJoinRequest } from './process/processRejectedJoinRequest';
import { processApprovedSubscriptionJoinRequest } from './process/processApprovedSubscriptionJoinRequest';
import { processApprovedOneTimeJoinRequestCommand } from './process/processApprovedOneTimeJoinRequest';

export const finalizeJoinProposalCommand = async (proposalId: string): Promise<void> => {
  // Create custom logger
  const logger = $logger.child({
    functionName: 'finalizeJoinProposalCommand',
    params: {
      proposalId
    }
  });

  // Find the proposal and the join
  const proposal = await prisma.proposal.findUnique({
    where: {
      id: proposalId
    },
    include: {
      join: true,
      common: {
        select: {
          fundingType: true
        }
      }
    }
  });

  // Check if the proposal exists. As this should not be user
  // accessible the proposal should be always found
  if (!proposal) {
    throw new NotFoundError('proposal', proposalId);
  }

  // Check the type of the proposal
  if (proposal.type !== ProposalType.JoinRequest || !proposal.join) {
    throw new CommonError('Cannot finalize non join proposal in `finalizeJoinProposalCommand`', {
      proposal
    });
  }

  // Check the state of the proposal
  if (proposal.state !== ProposalState.Finalizing) {
    throw new CommonError('Cannot finalize that is not in finalizing state', {
      proposal
    });
  }

  // Count the votes
  const votesCount = await voteService.getVotesCount(proposalId);

  // If the proposal has been approved
  if (votesCount.votesFor > votesCount.votesAgainst) {
    if (proposal.join.fundingType === FundingType.OneTime) {
      logger.info('Processing approved one-time join request');

      await processApprovedOneTimeJoinRequestCommand(proposalId);
    } else if (proposal.join.fundingType === FundingType.Monthly) {
      logger.info('Processing approved subscription join request');

      await processApprovedSubscriptionJoinRequest(proposalId);
    }
  }

  // If the proposal has been rejected
  else if (votesCount.votesAgainst >= votesCount.votesFor) {
    logger.info('Processing rejected join request');

    await processRejectedJoinRequest(proposalId);
  }
};