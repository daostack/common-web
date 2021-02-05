import { IProposalEntity } from '@common/types';
import firebase from 'firebase';
import { NotFoundError } from '../../../../errors';
import Timestamp = firebase.firestore.Timestamp;

jest.mock('../../../../../proposals/database/getProposal', () => ({
  getProposal: jest.fn()
    .mockImplementation(async (proposalId: string): Promise<IProposalEntity> => {
      if (proposalId === '404' || proposalId === '00000000-0000-0000-0000-000000000000') {
        throw new NotFoundError(proposalId, 'proposal');
      }

      const contributionType = proposalId === '00000000-0000-0000-0000-000000000001'
        ? 'monthly'
        : 'one-time';

      return {
        id: proposalId,
        createdAt: Timestamp.fromDate(new Date('December 17, 2020 03:24:03')),
        updatedAt: Timestamp.fromDate(new Date('December 17, 2020 05:34:43')),
        votes: [],
        votesFor: 0,
        votesAgainst: 0,
        state: 'passed',
        proposerId: proposalId,
        commonId: proposalId,
        type: 'join',
        description: {
          description: 'Let me in baby :D',
          links: []
        },
        join: {
          cardId: proposalId,
          funding: 500000,
          fundingType: contributionType,
          payments: []
        },
        countdownPeriod: 57600,
        quietEndingPeriod: 3600,
        paymentState: 'notAttempted'
      };
    })
}));