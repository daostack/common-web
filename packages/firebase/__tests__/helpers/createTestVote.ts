import { IVoteEntity } from '@common/functions/dist/proposals/voteTypes';
import { createTestCommon } from './createTestCommon';
import { createTestFundingRequest, createTestJoinRequest } from './createTestProposal';
import { IProposalEntity } from '@common/functions/dist/proposals/proposalTypes';
import { proposalsApp } from './supertests';
import { getTestAuthToken } from './auth';
import { ICommonEntity } from '@common/types';

export const createTestVote = async ({
 common = null,
 proposal = null,
 voterId = 'test-creator',
 commonCreatorId = 'test-creator',
 proposalCreatorId = 'test-proposer',
 proposalType = 'join',
 outcome = 'approved'
}: {
  common: ICommonEntity,
  proposal: IProposalEntity,
  voterId: string,
  commonCreatorId: string,
  proposalCreatorId: string,
  proposalType: 'join' | 'fundingRequest',
  outcome: 'approved' | 'rejected'
}): Promise<IVoteEntity> => {
  const authToken = await getTestAuthToken(voterId);

  if (!common) {
    common = await createTestCommon(commonCreatorId);
  }

  if (proposal) {
    proposal = proposalType === 'join'
      ? await createTestJoinRequest({
        proposerId: proposalCreatorId,
        common
      })
      : await createTestFundingRequest({
        proposerId: proposalCreatorId,
        common
      });
  }

  const response = await proposalsApp
    .post('/create/vote')
    .send({
      proposalId: proposal.id,
      outcome
    })
    .set({
      Authorization: authToken
    });

  return response.body as IVoteEntity
};