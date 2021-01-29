import { IProposalEntity } from '../../../../../proposals/proposalTypes';

jest.mock('../../../../../proposals/database/updateProposal', () => ({
  updateProposal: jest.fn()
    .mockImplementation((payment: IProposalEntity): Promise<IProposalEntity> => Promise.resolve(payment))
}));