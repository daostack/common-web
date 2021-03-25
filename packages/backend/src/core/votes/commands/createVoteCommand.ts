import * as z from 'zod';
import { EventType, Vote, VoteOutcome } from '@prisma/client';
import { NotFoundError, CommonError } from '@errors';
import { commonService, eventsService } from '@services';
import { prisma } from '@toolkits';
import { VotingQueue } from '../queue';

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
  const [proposalDescription] = await prisma.proposalDescription.findMany({
    where: {
      OR: [{
        joinId: command.proposalId
      }, {
        fundingId: command.proposalId
      }]
    },
    include: {
      join: {
        select: {
          commonId: true
        }
      },
      funding: {
        select: {
          commonId: true
        }
      }
    }
  });

  if (!proposalDescription) {
    throw new NotFoundError('proposal.fundingId_or_joinId', command.proposalId);
  }

  // Find the ID of the common, owning the proposal
  const commonId = (proposalDescription.funding?.commonId || proposalDescription.join?.commonId) as string;

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
        proposalDescriptionId: proposalDescription.id
      }
    });
  } catch (e) {
    // We are here so the user has most likely already voted for this proposals. Check to be sure
    if (e.message?.includes('Unique constraint failed on the fields: (`commonMemberId`,`proposalDescriptionId`)')) {
      throw new CommonError('Only one vote is allowed from member per proposal');
    } else {
      // Some other error occurred, so just rethrow it
      throw e;
    }
  }

  // Create event for the creation of the vote
  await eventsService.create({
    type: EventType.VoteCreated,
    userId: command.userId,
    commonId
  });

  // Add the proposal vote count update to the queue
  VotingQueue.add('updateProposalVoteCounts', {
    vote
  });

  // Return the created vote
  return vote;
};