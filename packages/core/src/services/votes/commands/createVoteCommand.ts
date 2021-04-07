import * as z from 'zod';
import { EventType, Vote, VoteOutcome } from '@prisma/client';

import { worker } from '@common/queues';

import { commonService, eventService } from '../../index';
import { NotFoundError, CommonError } from '../../../domain/errors/index';
import { prisma } from '../../../domain/toolkits/index';

const schema = z.object({
  userId: z.string()
    .nonempty(),

  proposalId: z.string()
    .nonempty()
    .uuid(),

  outcome: z.enum(
    Object.keys(VoteOutcome) as [(keyof typeof VoteOutcome)]
  )
});

export const createVoteCommand = async (command: z.infer<typeof schema>): Promise<Vote> => {
  // Find the proposal description of the proposal
  const [proposal] = await prisma.proposal.findMany({
    where: {
      id: command.proposalId
    },
    select: {
      id: true,
      commonId: true
    }
  });

  if (!proposal) {
    throw new NotFoundError('proposal', command.proposalId);
  }

  // Find the ID of the common, owning the proposal
  const { commonId } = proposal;

  // Find the member ID of the user in that common. If the user
  // is not a member an error will be thrown and the vote will
  // not be created
  const memberId = await commonService.getMemberId(command.userId, commonId);

  // Create variable for the created vote here so it would be
  // available outside of the try... catch... scope
  let vote: Vote;

  // Try to create the vote. If the database constraint fails that means
  // that the user has already cast a vote for this proposal
  try {
    vote = await prisma.vote.create({
      data: {
        commonMemberId: memberId,
        outcome: command.outcome,
        proposalId: proposal.id
      }
    });
  } catch (e) {
    // We are here so the user has most likely already voted for this proposals. Check to be sure
    if (e.message?.includes('Unique constraint failed on the fields: (`commonMemberId`,`proposalId`)')) {
      throw new CommonError('Only one vote is allowed from member per proposal');
    } else {
      // Some other error occurred, so just rethrow it
      throw e;
    }
  }

  // Create event for the creation of the vote
  await eventService.create({
    type: EventType.VoteCreated,
    userId: command.userId,
    commonId
  });

  // Add the proposal vote count update to the queue
  worker.addVotesJob('processVote', vote.id);

  // Return the created vote
  return vote;
};