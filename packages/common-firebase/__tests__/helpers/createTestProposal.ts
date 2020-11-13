import { v4 } from 'uuid';
import { IJoinRequestProposal } from '../../functions/src/proposals/proposalTypes';
import { getAuthToken } from './auth';
import { createTestCommon } from './createTestCommon';
import { proposalsApp } from './supertests';

const validJoinData = (commonId: string) => ({
  commonId,
  description: 'I wanna be a part',
  funding: 50000
});

const validFundingData = (commonId: string) => ({
  commonId,
  description: 'I wanna be a part',
  amount: 50000
});

export const createTestJoinRequest = async ({
  proposerId = 'test-user-proposer',
  commonCreatorId = 'test-user',
  common = null
} = {}): Promise<IJoinRequestProposal> => {
  const authToken = await getAuthToken(proposerId);

  if (common) {
    common = createTestCommon(commonCreatorId);
  }

  const response = await proposalsApp
    .post('/create/join')
    .send(validJoinData(common.id))
    .set({
      Authorization: authToken
    });

  return response.body as IJoinRequestProposal;
};

export const createTestFundingRequest = async ({
  proposerId = v4(),
  commonCreatorId = v4(),
  common = null
} = {}): Promise<IJoinRequestProposal> => {
  const authToken = await getAuthToken(proposerId);

  if (common) {
    common = createTestCommon(commonCreatorId);
  }

  const response = await proposalsApp
    .post('/create/funding')
    .send(validFundingData(common.id))
    .set({
      Authorization: authToken
    });

  return response.body as IJoinRequestProposal;
};